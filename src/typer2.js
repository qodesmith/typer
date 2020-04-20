require('./typer.css')

// https://bit.ly/2Xmuwqf - micro UUID!
const uuid = a=>a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid)
const CLASS_NAMES = ['qs-typer', 'qs-cursor-block', 'qs-cursor-soft', 'qs-cursor-hard', 'qs-no-cursor']
const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@$^*()'
const VOIDS = ['AREA','BASE','BR','COL','COMMAND','EMBED','HR','IMG','INPUT','KEYGEN','LINK','META','PARAM','SOURCE','TRACK','WBR']


function typer(el, speed) {
    // Our queue which will contain all the instructions (method calls) for Typer to type.
  const q = []

  // Assign this instance of Typer a unique id.
  const uid = uuid()

  // Create a style tag and append it to the head. We'll later use this to update cursor styles.
  const style = document.createElement('style')
  style.type = 'text/css'
  document.head.appendChild(style)


  ////////////////////////////////
  // VARIOUS FLAGS & CONTAINERS //
  ////////////////////////////////

  /*
    It's easier to reason about Typer's internals by getting a birds eye view
    of all the flags / containers that the library uses.
  */

  let speedSet = false // Indicates wether speed was already set for this Typer.
  let cursor = 'qs-cursor-soft' // The class name used for the cursor.
  let speedHasBeenSet = false // Indicates wether we've set the speed for Typer or not.
  let qIterating = false // Indicates wether Typer can process the next set of instructions or not.
  let qIndex = 0 // What position in the queue we're currently at.
  let newElem // The element that Typer will use to type contents in.
  let halted = false // Interupts any iteration.
  let resumeFromHalt // A fxn that resumes Typer from where it was last halted.
  let timeout // Used to store the current timeout function running from Typer's iteration.
  let processingQueue = false // Indicates wether Typer is processing the queue as a whole. This is `true` from beginning to end.
  let paused = false // Indicates Typer is in a paused state. Prevents `.halt` from being called.
  let listening = false // Indicates Typer is in a listening state. Prevents `.halt` from being called.
  let currentListener = {} // Used to store info about the event listener associated with a `.listen()` call. `.kill()` uses this for clean up.
  let killed = false // Indicates wether this Typer instance has been killed or not.
  let killListenerApplied = false // Indicates if we've set a listener for the `killTyper` event on the body or not.


  ////////////////////
  // INITIAL CHECKS //
  ////////////////////

  // Throws an error if el isn't a string selector or HTML element.
  if (checkSelector(el) === 'String') el = document.querySelector(el)

  // Prevent calling Typer on the same element twice.
  if (el.getAttribute('data-typer')) throw `You've already called Typer on this element.`

  // Assign a unique id to the parent el's data attribute.
  el.setAttribute('data-typer', uid)

  // Speed check.
  speed = checkSpeed(speed)
  speedSet = true


  ////////////////
  // PUBLIC API //
  ////////////////

  const typerObj = {
    line(msg, options) {
      addToQueue(lineOrContinue('line', msg, options))
      return this
    },
    continue(msg, options) {
      addToQueue(lineOrContinue('continue', msg, options))
      return this
    },
    pause(num) {
      addToQueue({ pause: +num || 500 }) // `.pause()` defaults to 500ms.
      return this
    },
    listen(eventName, element) {
      if (!element) {
        element = document.body
      } else if (checkSelector(element) === 'String') {
        element = document.querySelector(element)
      }

      addToQueue({ listen: eventName, el: element })
      return this
    },


    //////////////////////////////////////////
    // Methods that don't add to the queue. //
    //////////////////////////////////////////

    cursor(options = {}) {
      // The user specified they don't want a cursor.
      if (options === false) {
        cursor = 'qs-no-cursor' // Used as a class name.
        return this
      }

      const { color, blink, block } = options
      const newCursor = []

      // Optional cursor color - https://bit.ly/2K4tIRT
      if (color) {
        style.textContent = `[data-typer="${uid}"] .qs-typer::after{background:${color}}`
      }

      // Cursor's blinking style - default to soft.
      newCursor.push(`qs-cursor-${blink === 'hard' ? 'hard' : 'soft'}`)

      // Cursor: block or line.
      if (block === true) newCursor.push('qs-cursor-block')

      cursor = newCursor.join(' ') // Used as a class.

      return this
    },


    ////////////////////////////////////
    // Methods that aren't chainable. //
    ////////////////////////////////////

    halt() {
      // Ignore this method if it's being called prior to typing.
      if (!processingQueue) return

      const warning = `You can't call ".halt" while Typer is in %s mode.`
      if (paused) return console.warn(warning, 'pause')
      if (listening) return console.warn(warning, 'listen')
      halted = true
    },
    resume() {
      // Ignore this method if it's being called prior to typing or before `.halt`.
      if (!processingQueue || !resumeFromHalt) return

      halted = false

      // `resumeFromHalt` is set in `qIterator`.
      resumeFromHalt()
      resumeFromHalt = null
    },
    kill() {
      // Prevent this Typer instance from responding to any future calls.
      killed = true

      // Remove listener added in `processListen` if Typer is in a listener state.
      if (currentListener.el) {
        currentListener.el.removeEventListener(currentListener.type, currentListener.fxn)
      }

      // Stop any iteration currently happening.
      clearTimeout(timeout)

      // ???
      typerCleanup()
    }
  }


  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////

  // Checks for a valid selector.
  function checkSelector(value) {
    const type = getType(value)

    /*
      E.x.:
        const div = document.createElement('div')
        getType(div) => '[object HTMLDivElement]' => 'HTMLDivElement'
    */
    if (type.slice(0, 4).toLowerCase() !== 'html' && type !== 'String') {
      throw "You need to provide a string selector, such as '.some-class', or an html element."
    }
    return type
  }

  // Checks for a valid speed value - from number or object.
  function checkSpeed(spd) {
    const type = getType(spd)

    if (spd == null) return speedSet ? speed : 70 // Default `speed` (in top scope).
    if (type === 'Number' && !isNaN(spd)) return spd
    if (type === 'Object') {
      const hasMin = spd.hasOwnProperty('min')
      const hasMax = spd.hasOwnProperty('max')
      const hasSpeed = spd.hasOwnProperty('speed')

      if (hasSpeed && !isNaN(spd.speed)) return spd.speed
      if (hasMin && hasMax && spd.min < spd.max) return spd
      if (!Object.keys(spd).length && speedSet) return speed // `speed` in top scope.
      if (!hasMin && !hasMax && !hasSpeed) return speed // `speed` in top scope.
    }

    throw 'You have provided an invalid value for speed.'
  }

  // Adds items to the queue and starts the iterator.
  function addToQueue(item) {
    // Prevent any more instructions being added if the instance has been killed already.
    if (killed) return console.warn('This instance of Typer has already been killed:', uid)

    // If this is the first time adding to the queue, set the starting item to 0.
    if (qIndex == null) qIndex = 0

    // Add item to the queue.
    if (item != null) q.push(item)

    /*
      Trigger the iterator - it's smart enough to know when to start & stop.
      By always triggering it here, we allow users to make subsequent calls to Typer.
    */
    typerIterator()
  }

  // Called by `.line` and `.continue`.
  function lineOrContinue(type, msg, options) {
    const isLine = type === 'line'
    const isContinue = type === 'continue'

    /*
      No arguments passed:
        * line - process as a blank line (indicated by `1`).
        * continue - catch it here but ignore it completely.
    */
    if (!msg && !options)  return isLine ? { line: 1 } : null

    // A single options argument has been passed.
    if (getType(msg) === 'Object') {
      return (isLine || (isContinue && msg.container)) ? setOptions(msg) : null
    }

    /*
      Content and a number for speed have been passed.
        * .line('some content', 100)
        * .continue('some content', 100)
    */
    if (!isNaN(options)) {
      return {
        [type]: msg,
        speed: sanitizeSpeed(options),
        html: true
      }
    }

    // Message, with or without options.
    return setOptions(options, msg)


    function setOptions(opts = {}, message) {
      const { container, totalTime, military } = opts

      /*
        `content` is only used when the user has provided
        a single options argument to `.line`.
      */
      const content = !message && (
        getType(container) === 'String'
          ? document.querySelector(container).textContent // A selector was provided.
          : container.textContent // A DOM element was provided.
      )

      return {
        [type]: message || content,
        speed: sanitizeSpeed(opts),
        html: opts.html === false ? false : true, // Default true.
        element: isLine ? opts.element : null,
        military: sanitizeMilitary(military),
        totalTime
      }
    }
  }

  /*
    Returns the type of a value as a string.
    getType([]) => '[object Array]' => 'Array'
  */
  function getType(value) {
    return ({}).toString.call(value).slice(8, -1)
  }

  // Checks the possible values concerning speed & returns it.
  function sanitizeSpeed(spd) {
    const type = getType(spd)

    if (spd === undefined) return speedHasBeenSet ? speed : 70 // Default `speed` (in top scope).
    if (type === 'Number' && !isNaN(spd)) return spd
    if (type === 'Object') {
      const hasMin = spd.hasOwnProperty('min')
      const hasMax = spd.hasOwnProperty('max')
      const hasSpeed = spd.hasOwnProperty('speed')

      if (hasSpeed && !isNaN(spd.speed)) return spd.speed
      if (hasMin && hasMax && spd.min < spd.max) return spd
      if (!Object.keys(spd).length && speedHasBeenSet) return speed // `speed` in top scope.
      if (!hasMin && !hasMax && !hasSpeed) return speed // `speed` in top scope.
    }

    throw 'You have provided an invalid value for speed.'
  }

  /*
    Checks for valid military values and returns it.
    Military defaults set here as well.
  */
  function sanitizeMilitary(value) {
    if (!value) return null
    if (+value) return { speed: +value, chars: 3 }
    if (getType(value) === 'Object') {
      return {
        speed: +value.speed || 50,
        chars: +value.chars || 3
      }
    }

    throw 'You have provided an invalid value for military.'
  }

  // Removes all Typer-related class names from the last line Typer typed out.
  function classNameCleanup() {
    CLASS_NAMES.forEach(name => newElem && newElem.classList.remove(name))
  }

  /*
    Recursive iteration via `.line` and `.continue`.
    Handles the speed given as an object or number.
    This is a generic helper function that any part of the code can use to recusively "doStuff".
    The provided callback function (`func`) is responsible for recursively calling `qIterator`.
    `qIterator` is responsible for storing the setTimeout fxn in the `timeout` variable
    to allow Typer to `.halt` progress and `.resume` exactly where it left off.
    At any given point in time there should only be one iteration happening which
    allows us to confidently use the `timeout` variable as described.
  */
  function qIterator(func, spd) {
    const isObject = getType(spd) === 'Object'
    const randomNum = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
    const time = isObject ? randomNum(spd.min, spd.max) : spd
    const runTimeout = () => {
      timeout = setTimeout(func, time)
    }

    if (halted) {
      resumeFromHalt = runTimeout
    } else {
      runTimeout()
    }
  }

  /*
    Helper function to move the iteration process of processing instructions along.
    Increments the item index.
    Tells `typerIterator` we're done with the current set of instructions.
    Calls `typerIterator` again.
  */
  function moveOn() {
    qIndex++ // Increment our main item counter.
    qIterating = false // Tell `typerIterator` we're done processing this set of instructions.
    typerIterator() // Restart the main iterator.
  }

  function typerCleanup(fxn, e) {
    // Remove the <style> from the head.
    style.remove()

    // Finalize the div class names before ending.
    classNameCleanup()

    // Remove the `data-typer` attribute.
    el.removeAttribute('data-typer')

    // Remove event listener.
    document.body.removeEventListener('killTyper', typerObj.kill)

    // Leave the last line in proper shape.
    newElem && newElem.classList.add('white-space')
    newElem = null

    if (getType(fxn) === 'Function') {
      fxn(el)
    } else if (getType(e) === 'Function') {
      e(el)
    }

    if (fxn === true || e === true) {
      document.body.dispatchEvent(new Event('typerFinished'))
    }
  }


  ///////////////////
  // MAIN ITERATOR //
  ///////////////////

  /*
    This function doesn't explicitly use setTimeout or setInterval.
    Iteration is done by recursion within `qIterator`, called by all the process functions.
    The process functions are responsible for recursively calling `qIterator`.
  */
  function typerIterator() {
    // Add the killTyper listener only once we've started to process the queue.
    if (!killListenerApplied) {
      killListenerApplied = true
      document.body.addEventListener('killTyper', typerObj.kill)
    }

    // Don't do anything if Typer is in the middle of processing an item in the queue or it's been killed.
    if (qIterating || killed) return

    /*
      Set a flag indicating we're processing a set of instructions.
      We'll only set this to false once we've processed the entire queue.
    */
    if (!processingQueue) processingQueue = true

    // Set a flag indicating Typer is busy.
    qIterating = true

    // The item up for processing.
    const item = q[qIndex]

    // If there's no item to process, exit.
    if (!item) {
      qIterating = false // We're NOT processing a particular item in the queue.
      processingQueue = false // We're NOT processing the queue - i.e., we're done!
      return
    }

    // Decide which type of item we need to process and call the relevant function.
    item.line ? processLine(item) :
    item.continue ? processContinue(item) :
    item.pause ? processPause(item) :
    item.listen && processListen(item)
  }


  ///////////////////////
  // PROCESS FUNCTIONS //
  ///////////////////////

  /*
    This is where all the work is done!
    Each process function is responsible to perpetuate iteration.
    They do this by incrementing `qIndex` and calling `typerIterator`.
  */

  function processLine(item) {
    // Process the previous line if there was one.
    if (newElem) {
      classNameCleanup()
      newElem.classList.add('qs-white-space')
      if (!newElem.innerHTML) newElem.innerHTML = ' ' // Retains the height of a single line.
    }

    // Create new div (or specified element).
    newElem = document.createElement(item.element || 'div')
    newElem.setAttribute('data-typer-child', uid)
    newElem.className = `${cursor} qs-typer qs-white-space`

    // Append this new element to Typer's container.
    el.appendChild(newElem)

    // The user requested an empty line.
    if (item.line === 1) return moveOn()

    // Message iterator - used by `processContinue` as well.
    processMessage(item)
  }

  function processContinue(item) {
    processMessage(item)
  }

  function processMessage(item) { // Used by 'processLine' & 'processContinue'.
    const msg = item.line || item.continue
    const div = document.createElement('div') // Used as a temporary object to play with.

    if (Array.isArray(msg)) return typeArrays()

    div.innerHTML = msg
    item.html ? html() : plain()

    /*
      Executed if arrays of strings are provided.
      Military typing will not occur.
    */
    function typeArrays() {
      let counter = 0
      const itemSpeed = item.totalTime ? (item.totalTime / msg.length) : item.speed

      // Encapsulate functionality so `qIterator` can call it recusively.
      function doStuff() {
        const content = msg[counter++]

        div.textContent = content // Use the div to possibly escape any HTML into pure text.
        newElem.innerHTML += item.html ? content : div.innerHTML

        if (counter === msg.length) {
          moveOn()
        } else {
          qIterator(doStuff, itemSpeed)
        }
      }

      doStuff()
    }

    /*
      Executed if HTML content is provided.
      This is the default.
    */
    function html() {
      let list = createTypingArray(div.childNodes, newElem)
      let objCounter = 0
      let textCounter = 0
      let obj = list[objCounter++]
      const itemSpeed = item.totalTime ? (item.totalTime / obj.content.length) : item.speed

      // Encapsulate functionality so `qIterator` can call it recusively.
      function doStuff() {
        // Text node - finished typing.
        if (obj.content && textCounter === obj.content.length) {
          textCounter = 0
          obj = list[objCounter++]
        }

        // Finished processing everything.
        if (!obj) return moveOn()

        // Text node.
        if (obj.content) {
          // Military.
          if (item.military) {
            return military(obj.parent, obj.content[textCounter++], () => {
              qIterator(doStuff, itemSpeed)
            })
          }

          // Non-military.
          obj.parent.innerHTML += obj.content[textCounter++]

        // Void & non-void element nodes.
        } else {
          obj.parent.appendChild(obj.voidNode || obj.newNode)
          obj = list[objCounter++]
        }

        qIterator(doStuff, itemSpeed)
      }

      doStuff()
    }

    // Called by the `html` function above.
    function createTypingArray(childNodes, parent) {
      let arr = []
      childNodes = Array.from(childNodes)

      for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i]
        const name = node.nodeName

        // Text nodes.
        if (name === '#text') {
          // Only text nodes will get the content property.
          arr.push({ parent, content: node.textContent })

        // Non-void elements.
        } else if (node.childNodes.length) {
          // 1. Clone to an empty node.
          let newNode = document.createElement(name)

          // 2. Copy the attributes.
          Array.from(node.attributes).forEach(attr => {
            newNode.setAttribute(attr.name, attr.value)
          })

          arr.push({ parent, newNode })
          arr = arr.concat(createTypingArray(node.childNodes, newNode))

        // Void elements.
        } else if (VOIDS.includes(name)) {
          arr.push({ parent, voidNode: node })
        }
      }

      return arr
    }

    // Executed only if `html: false` has been provided, since html is the default.
    function plain() {
      let counter = 0
      const itemSpeed = item.totalTime ? (item.totalTime / msg.length) : item.speed

      // Encapsulate functionality so `qIterator` can call it recusively.
      function doStuff() {
        // End of message processing logic.
        if (counter === msg.length) return moveOn()

        let piece = msg[counter]

        if (item.military) {
          return military(newElem, piece, () => {
            counter++
            qIterator(doStuff, itemSpeed)
          })
        }

        // Avoid HTML parsing on supplied arrays.
        if (getType(msg) !== 'String') {
          div.textContent = piece
          piece = div.innerHTML
        }

        newElem.innerHTML += piece
        counter++
        qIterator(doStuff, itemSpeed)
      }

      doStuff()
    }

    function randomChar() {
      return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
    }

    function military(elem, content, cb) {
      let counter = 0
      const { speed, chars } = item.military

      // First run only.
      elem.innerHTML += randomChar()

      // Encapsulate functionality so `qIterator` can call it recusively.
      function doStuff() {
        // Last iteration only.
        if (counter === chars) {
          elem.innerHTML = elem.innerHTML.slice(0, -1) + content
          return cb()

        // In-between iterations.
        } else {
          elem.innerHTML = elem.innerHTML.slice(0, -1) + randomChar()
        }

        counter++
        qIterator(doStuff, speed)
      }

      doStuff()
    }

    // Stop the typing iteration & move on to our main iteration.
    function moveOn() {
      qIndex++ // Increment our main item counter.
      qIterating = false // Tell `typerIterator` we're done processing this set of instructions.
      typerIterator() // Restart the main iterator.
    }
  }

  function processPause(item) {
    paused = true

    qIterator(() => {
      paused = false // Allows `.halt` to know it's safe to do it's thing.
      moveOn() // Continue with processing Typer's queue.
    }, item.pause)
  }

  function processListen(item) {
    const { el, listen } = item
    listening = true // Allows `.halt` to know it's NOT safe to do it's thing.

    // One-time event listener.
    el.addEventListener(listen, handler)
    function handler(e) {
      // Reset flags.
      listening = false
      currentListener = {}

      // Remove the listener.
      el.removeEventListener(e.type, handler)

      // Continue processing the queue so long as the kill switch wasn't engaged.
      if (!killed) moveOn()
    }

    /*
      Keep a reference to the listener so we can esure its removal
      if we kill this instance or all typers.
    */
    currentListener = { el, type: listen, fxn: handler }
  }


  return typerObj
}

module.exports = typer
