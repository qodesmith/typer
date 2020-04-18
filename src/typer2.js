// https://bit.ly/2Xmuwqf - micro UUID!
const uuid = a=>a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid)
const CLASS_NAMES = ['qs-typer', 'qs-cursor-block', 'qs-cursor-soft', 'qs-cursor-hard', 'qs-no-cursor']
const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@$^*()'
const VOIDS = ['AREA','BASE','BR','COL','COMMAND','EMBED','HR','IMG','INPUT','KEYGEN','LINK','META','PARAM','SOURCE','TRACK','WBR']


function typer(el, speed) {
  // Our queue which will contain all the instructions (method calls) for Typer to type.
  const q = []

  // Assign this instance of Typer a unique id.
  q.uuid = uuid()

  // Cursor stylesheet added to the head. Used in .cursor method and removeCursorStylesheet.
  let cursorStylesheet


  ////////////////
  // PUBLIC API //
  ////////////////

  const typerObj = {
    line(msg, options) {
      addToQueue(lineOrContinue('line', msg, options))
      return this
    },
    continue(msg, options) {
      addToQueue(lineOrContinue('line', msg, options))
      return this
    },


    //////////////////////////////////////////
    // Methods that don't add to the queue. //
    //////////////////////////////////////////

    cursor(options = {}) {
      // The .line & .continue methods will always use the current q.cursor value.

      // Reset any previous cursor styles set.
      removeCursorStylesheet()

      // The user specified they don't want a cursor.
      if (options === false) {
        q.cursor = 'qs-no-cursor' // Used as a class name.
        return this
      }

      const { color, blink, block } = options
      const cursor = []

      // Optional cursor color - https://bit.ly/2K4tIRT
      if (color) {
        cursorStylesheet = addStyle(`[data-typer="${q.uuid}"] .qs-typer::after`, `background-color:${color}`)
      }

      // Cursor's blinking style - default to soft.
      cursor.push(`qs-cursor-${blink === 'hard' ? 'hard' : 'soft'}`)

      // Cursor: block or line.
      if (block === true) cursor.push('qs-cursor-block')

      q.cursor = cursor.join(' ') // Used as a class.

      return this
    }
  }


  //////////////////////
  // HELPER FUNCTIONS //
  //////////////////////

  /*
    Removes any stylehseets appended to the <head>.
    Used in the .cursor method.
  */
  function removeCursorStylesheet() {
    if (cursorStylesheet) cursorStylesheet.remove()
  }

  function addToQueue(item) {
    // Add item to the queue.
    if (item != null) q.push(item)

    // Trigger the iterator.
  }

  // Called by `.line` and `.continue`.
  function lineOrContinue(type, msg, options) {
    const isLine = type === 'line'
    const isContinue = type === 'continue'

    /*
      No arguments passed:
        * line - process as a blank line.
        * continue - catch it here but ignore it completely.
    */
    if (!msg && !options)  return isLine ? { line: 1 } : null

    // A single options argument has been passed.
    if (getType(msg) === 'Object') {
      return (isLine || (isCont && msg.container)) ? setOptions(msg) : null
    }

    /*
      Content and a number for speed have been passed.
        * .line('some content', 100)
        * .continue('some content', 100)
    */
    if (!isNaN(options)) {
      return {
        [choice]: msg,
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
        [choice]: message || content,
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

    if (spd === undefined) return q.speedSet ? speed : 70 // Default `speed` (in top scope).
    if (type === 'Number' && !isNaN(spd)) return spd
    if (type === 'Object') {
      const hasMin = spd.hasOwnProperty('min')
      const hasMax = spd.hasOwnProperty('max')
      const hasSpeed = spd.hasOwnProperty('speed')

      if (hasSpeed && !isNaN(spd.speed)) return spd.speed
      if (hasMin && hasMax && spd.min < spd.max) return spd
      if (!Object.keys(spd).length && q.speedSet) return speed // `speed` in top scope.
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
}

module.exports = typer
