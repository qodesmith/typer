/* The MIT License (MIT)

Copyright (c) 2017 Aaron Cordova

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

(function(root, returnTyper) {
  if (typeof exports === 'object') return module.exports = returnTyper();
  if (typeof define === 'function' && define.amd) return define(function() { return returnTyper() });
  return root.typer = returnTyper();
})(this, function() {
  // https://goo.gl/MrXVRS - micro UUID!
  const uuid = a=>a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,uuid);

  function typer(el, speed) {
    const q = []; // The main array to contain all the methods called on typer.
    const body = document.body; // Cache the body.
    let currentListener = {}; // Listeners provided by the `.listen` method.

    // Throws an error if el isn't a string selector or HTML element.
    if (checkSelector(el) === 'String') el = document.querySelector(el);

    // Prevent calling Typer on the same element twice.
    if (el.getAttribute('data-typer')) throw `You've already called Typer on this element.`;

    // Speed check.
    speed = checkSpeed(speed);
    q.speedSet = true;

    // List of HTML void elements (https://goo.gl/h1WX8R),
    // used in 'processMsg' & 'processBack'.
    q.voids = ['AREA','BASE','BR','COL','COMMAND','EMBED','HR','IMG','INPUT','KEYGEN','LINK','META','PARAM','SOURCE','TRACK','WBR'];

    // List of class names for cleanup later on.
    q.classNames = ['typer', 'cursor-block', 'cursor-soft', 'cursor-hard', 'no-cursor'];

    // Assign a unique id to the parent el's data attribute.
    q.uuid = uuid();
    el.setAttribute('data-typer', q.uuid);

    // Public API methods.
    const typerObj = {
      cursor: function(cursorObj) {
        // Prevent cursor from being run multiple times.
        if (q.cursorRan) {
          console.warn('You can only call ".cursor" once.');
          return this;
        }

        q.cursorRan = true;

        // Prevent errors from no arguments.
        if (cursorObj === undefined) cursorObj = true;

        // No cursor.
        if (cursorObj === false) {
          q.cursor = 'no-cursor'; // Used as a class name.
          return this;
        }

        const {color, blink, block} = cursorObj;
        const cursor = [];
        const data = `[data-typer="${q.uuid}"]`;

        // Optional cursor color - https://goo.gl/b4Ckz9
        if (color) addStyle(`${data} .typer::after`, `background-color:${color}`);

        // Cursor's blinking style - default to soft.
        cursor.push(`cursor-${blink === 'hard' ? 'hard' : 'soft'}`);

        // Cursor: block or line.
        if (block === true) cursor.push('cursor-block');

        q.cursor = cursor.join(' '); // Used as a class.

        return this;
      },
      line: function(msg, options) {
        lineOrContinue('line', msg, options);

        // Push the first dominoe on the typing iteration,
        // ensuring public methods will only call 'processq()' once.
        if (!q.typing) {
          q.typing = true;
          processq();
        }

        return this;
      },
      continue: function(msg, options) {
        lineOrContinue('continue', msg, options);
        return this;
      },
      pause: function(num) {
        // Default to 500ms.
        q.push({pause: +num || 500});
        return this;
      },
      emit: function(event, el) {
        if (!el) {
          el = body;
        } else if (checkSelector(el) === 'String') {
          el = document.querySelector(el);
        }

        q.push({emit: event, el: el});
        return this;
      },
      listen: function(event, el) {
        if (!el) {
          el = body;
        } else if (checkSelector(el) === 'String') {
          el = document.querySelector(el);
        }

        q.push({listen: event, el: el});
        return this;
      },
      back: function(chars, spd) {
        q.push({back: chars, speed: spd});
        return this;
      },
      empty: function() {
        q.push({empty: true});
        return this;
      },
      run: function(fxn) {
        q.push({run: fxn});
        return this;
      },
      end: function(fxn, e) {
        q.push({end: true});
        q.cb = () => typerCleanup(fxn, e);

        return nullApi('end');
      },
      kill: kill
    };

    // Private functions.
    function getType(thing) {
      return ({}).toString.call(thing).slice(8, -1);
    }
    function checkSelector(thing) {
      const type = getType(thing);
      if (type.slice(0, 4).toLowerCase() !== 'html' && type !== 'String') {
        throw "You need to provide a string selector, such as '.some-class', or an html element."
      }
      return type;
    }
    function checkSpeed(spd) {
      const type = getType(spd);

      if (spd === undefined) return q.speedSet ? speed : 70; // Default `speed` (in top scope).
      if (type === 'Number' && !isNaN(spd)) return spd;
      if (type === 'Object') {
        const hasMin = spd.hasOwnProperty('min');
        const hasMax = spd.hasOwnProperty('max');
        const hasSpeed = spd.hasOwnProperty('speed');

        if (hasSpeed && !isNaN(spd.speed)) return spd.speed;
        if (hasMin && hasMax && spd.min < spd.max) return spd;
        if (!Object.keys(spd).length && q.speedSet) return speed; // `speed` in top scope.
        if (!hasMin && !hasMax && !hasSpeed) return speed; // `speed` in top scope.
      }

      throw Error('You have provided an invalid value for speed.');
    }
    function typerCleanup(fxn, e) {
      q.style && q.style.remove();
      q.newDiv && classNameCleanup(); // Finalize the div class names before ending.
      el.removeAttribute('data-typer'); // Remove the `data-typer` attribute.
      body.removeEventListener('killTyper', kill);

      q.newDiv && q.newDiv.classList.add('white-space');
      q.newDiv = '';

      if (typeof fxn === 'function') {
        fxn(el);
      } else if (typeof e === 'function') {
        e(el);
      }

      if (fxn === true || e === true) {
        body.dispatchEvent(new Event('typerFinished'));
      }
    }
    function classNameCleanup() {
      ['typer', 'cursor-block', 'cursor-soft', 'cursor-hard', 'no-cursor'].forEach(name => {
        q.newDiv.classList.remove(name);
      });
    }
    function randomNum(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    function addStyle(selector, rules) { // https://goo.gl/b4Ckz9
      q.style = document.createElement('style'); // Create the style element.
      q.style.appendChild(document.createTextNode('')); // Webkit hack - https://goo.gl/b4Ckz9
      document.head.appendChild(q.style); // Append the style element to the head.
      const sheet = document.styleSheets[document.styleSheets.length - 1];

      if ('insertRule' in sheet) {
        sheet.insertRule(`${selector}{${rules}}`, 0);
      } else {
        sheet.addRule(selector, rules);
      }
    }
    function lineOrContinue(choice, msg, options) {
      const isLine = choice === 'line';
      const isCont = choice === 'continue';

      // No arguments passed
      // Line: user requesting a blank line.
      // Continue: ignore.
      if (!msg && !options) {
        if (isLine) q.push({line: 1});

      // A single options argument has been passed.
      } else if (getType(msg) === 'Object') {
        if (isLine || (isCont && msg.container)) q.push(setOptions(msg));

      // Content and a number for speed have been passed.
      // .line('some content', 100)
      // .continue('some content', 100)
      } else if (!isNaN(options)) {
        q.push({[choice]: msg, speed: checkSpeed(options), html: true});

      // Message with options passed.
      } else {
        q.push(setOptions(options, msg));
      }

      function setOptions(opts = {}, message) {
        const container = opts.container;

        // `content` is only used when the user has provided
        // a single options argument to `.line`.
        const content = !message && (getType(container) === 'String'
          ? document.querySelector(container).textContent // A selector was provided.
          : container.textContent); // A DOM element was provided.

        return {
          [choice]: message || content,
          speed: checkSpeed(opts),
          html: opts.html === false ? false : true, // Default true.
          element: isLine ? opts.element : null
        };
      }
    }
    function processq() { // Begin our main iterator.
      if (!(q.item >= 0)) q.item = 0;
      if (q.item === q.length) return body.removeEventListener('killTyper', kill);
      if (!q.ks) {
        q.ks = true;
        body.addEventListener('killTyper', kill);
      }

      // If no cursor is declared, resort to default styling.
      // The cursor will be pinged later by each line.
      if (!q.cursor) q.cursor = 'cursor-soft';

      // Main iterator.
      q.type = setInterval(() => {
        // This happens if `.kill` is in the initial chain of API methods.
        // The length is set to 0 in `kill`.
        if (!q.length) return clearInterval(q.type);

        const item = q[q.item];

        // Various processing functions.
        item.line ? processLine(item) :
        item.continue ? processContinue(item) :
        item.pause ? processPause(item) :
        item.emit ? processEmit(item) :
        item.listen ? processListen(item) :
        item.back ? processBack(item) :
        item.empty ? processEmpty() :
        item.run ? processRun(item) :
        item.end && processEnd(item);
      }, 0);
    }
    function processLine(item) {
      // Stop the main iterator.
      clearInterval(q.type);

      // Process the previous line if there was one.
      if (q.newDiv) {
        classNameCleanup();
        q.newDiv.classList.add('white-space');
        if (!q.newDiv.innerHTML) q.newDiv.innerHTML = ' '; // Retains the height of a single line.
      }

      // Create new div (or specified element).
      const div = document.createElement(item.element || 'div');
      div.setAttribute('data-typer-child', q.uuid);
      div.className = q.cursor;
      div.classList.add('typer');
      div.classList.add('white-space');

      el.appendChild(div);
      q.newDiv = div;

      // The user requested an empty line.
      if (item.line === 1) {
        q.item++;
        return processq();
      }

      // Message iterator.
      processMsg(item);
    }
    function processContinue(item) {
      clearInterval(q.type); // Stop the main iterator.
      processMsg(item); // Message iterator.
    }
    function qIterator(spd, func, data) {
      const isObject = getType(spd) === 'Object';
      const time = isObject ? randomNum(spd.min, spd.max) : spd;

      q.iterator = setTimeout(() => func(data), time);
    }
    function processMsg(item) { // Used by 'processLine' & 'processContinue'.
      const msg = item.line || item.continue;
      const div = document.createElement('div');

      if (Array.isArray(msg)) return typeArrays(item.html);

      div.innerHTML = msg;
      item.html ? html() : plain();

      // Executed if arrays of strings are provided.
      function typeArrays(html) {
        let counter = 0

        function doStuff() {
          const content = msg[counter++];

          div.textContent = content;
          q.newDiv.innerHTML += html ? content : div.innerHTML;

          if (counter === msg.length) {
            moveOn();
          } else {
            qIterator(item.speed, doStuff);
          }
        }

        qIterator(item.speed, doStuff);
      }

      // Executed if HTML content is provided.
      function html() {
        let list = createTypingArray(div.childNodes, q.newDiv);
        let objCounter = 0;
        let textCounter = 0;
        let obj = list[objCounter++];

        function doStuff() {
          // Finished processing everything.
          if (!obj) return moveOn();

          // Text node.
          if (obj.content) {
            obj.parent.innerHTML += obj.content[textCounter++];

            // Finished typing.
            if (textCounter === obj.content.length) {
              textCounter = 0;
              obj = list[objCounter++]
            }

          // Void & non-void element nodes.
          } else {
            obj.parent.appendChild(obj.voidNode || obj.newNode);
            obj = list[objCounter++];
          }

          qIterator(item.speed, doStuff);
        }

        qIterator(item.speed, doStuff);
      }

      // Called by the `html` function above.
      function createTypingArray(childNodes, parent) {
        let arr = [];
        childNodes = Array.from(childNodes);

        for (let i = 0; i < childNodes.length; i++) {
          const node = childNodes[i];
          const name = node.nodeName;

          // Text nodes.
          if (name === '#text') {
            // Only text nodes will get the content property.
            arr.push({
              parent,
              content: node.textContent
            });

          // Non-void elements.
          } else if (node.childNodes.length) {
            // 1. Clone to an empty node.
            let newNode = document.createElement(name);

            // 2. Copy the attributes.
            Array.from(node.attributes).forEach(attr => {
              newNode.setAttribute(attr.name, attr.value);
            });

            arr.push({parent, newNode});
            arr = arr.concat(createTypingArray(node.childNodes, newNode));

          // Void elements.
          } else if (q.voids.includes(name)) {
            arr.push({
              parent,
              voidNode: node
            });
          }
        }

        return arr;
      }

      // Executed if non-HTML content is provided.
      function plain() {
        let counter = 0;

        function doStuff() {
          // End of message processing logic.
          if (counter === msg.length) return moveOn();

          let piece = msg[counter];

          // Avoid HTML parsing on supplied arrays.
          if (getType(msg) !== 'String') {
            div.textContent = piece;
            piece = div.innerHTML;
          }

          q.newDiv.innerHTML += piece;
          counter++;
          qIterator(item.speed, doStuff);
        }

        qIterator(item.speed, doStuff);
      }

      // Stop the typing iteration & move on to our main iteration.
      function moveOn() {
        clearInterval(q.iterator);
        q.item++; // Increment our main item counter.
        return processq(); // Restart the main iterator.
      }
    }
    function processPause(item) {
      clearInterval(q.type); // Stop the main iterator.

      q.pause = setTimeout(() => {
        q.item++; // Increment our main item counter.
        processq(); // Restart the main iterator.
      }, item.pause);
    }
    function processEmit(item) {
      clearInterval(q.type); // Stop the main iterator.
      item.el.dispatchEvent(new Event(item.emit));

      q.item++;
      processq();
    }
    function processListen(item) {
      clearInterval(q.type); // Stop the main iterator.

      // One-time event listener.
      item.el.addEventListener(item.listen, handler);
      function handler(e) {
        item.el.removeEventListener(e.type, handler);
        if (q.killed) return; // Prevent error if kill switch is engaged.
        q.item++;
        processq();
      };

      // Keep a reference to the listener so we can esure its removal
      // if we kill this instance or all typers.
      currentListener = { el: item.el, type: item.listen, fxn: handler };
    }
    function processBack({ back, speed: spd }) {
      // Stop the main iterator.
      clearInterval(q.type);

      // Check for being called on an empty line.
      if (!q.newDiv || !q.newDiv.textContent) {
        q.item++;
        return processq();
      }

      const totalVoids = countVoids(q.newDiv);
      const totalLength = q.newDiv.textContent.length;

      // Empty the line all at once or a portion of it at once.
      if (back === 'empty') {

        // `spd` here is a quantity -
        // how many characters we want to erase *at once*.

        if (!spd || spd >= totalLength) {
          q.newDiv.innerHTML = '';
        } else {
          const tempDiv = q.newDiv.cloneNode(true); // Avoid hitting the DOM x-times.
          const loop = looper(tempDiv);

          if (spd < 0) spd += totalLength; // All-but x-characters all at once.
          for(let i = 0; i < spd; i++) loop();

          removeEmpties(tempDiv);
          q.newDiv.innerHTML = tempDiv.innerHTML;
        }

        q.item++;
        return processq();
      }

      // Prevent larger 'back' quantities from needlessly interrupting the flow.
      if (back > totalLength + totalVoids) back = 'all';

      // A simple way to erase the whole line without knowing the contents:
      // set the # of 'backspaces' to the content's length + any void elements to be removed.
      if (back === 'all') back = totalLength + totalVoids;

      // Negative #'s are an easy way to say "erase all BUT X-amount of characters."
      if (back < 0) back = totalLength + totalVoids - (back * -1);

      q.goBack = setInterval(looper(), spd || speed);

      function looper(tempDiv) {
        let counter = 0;
        let contents = flattenContents(tempDiv || q.newDiv).reverse();

        return function() {
          const node = contents[0];
          const isVoid = q.voids.includes(node.nodeName);

          if (isVoid) {
            node.remove();
            contents.shift();
          } else {
            node.textContent = node.textContent.slice(0, -1);
            if (!node.length) contents.shift();
          }

          // `tempDiv` is used as a cloned `q.newDiv`, NOT attached to the DOM.
          // When the user is using `.back('empty', <number>)`, this function will run
          // in a for-loop to immediately process the contents.
          if (tempDiv) return;

          counter++;

          // Exit.
          if (counter === back) {
            clearInterval(q.goBack);
            removeEmpties(q.newDiv);
            q.item++;
            processq();
          }
        }
      }

      function flattenContents(parent) {
        let arr = [];
        let childNodes = Array.from(parent.childNodes);

        if (!childNodes.length) return arr;

        childNodes.forEach(child => {
          if (child.childNodes.length) {
            arr = arr.concat(flattenContents(child));
          } else {
            arr.push(child);
          }
        });

        return arr;
      }

      function removeEmpties(el) {
        Array.from(el.childNodes).forEach(child => {
          if (q.voids.includes(child.nodeName)) return; // Do not remove void tags.
          if (child.childNodes.length) removeEmpties(child);
          if (child.nodeName !== '#text' && !child.innerHTML.length) child.remove();
          if (child.nodeName === '#text' && !child.length) child.remove();
        });
      }

      function countVoids(el) {
        let num = 0;

        Array.from(el.childNodes).forEach(child => {
          if (q.voids.includes(child.nodeName)) num++;
          if (child.childNodes.length) num += countVoids(child);
        });

        return num;
      }
    }
    function processEmpty() {
      el.innerHTML = '';
      processLine({line: 1}); // This will stop the main iterator & run 'processq'.
    }
    function processRun({ run }) {
      clearInterval(q.type); // Stop the main iterator.

      run(el);
      q.item++;
      processq();
    }
    function processEnd() {
      clearInterval(q.type); // Final stop to our main iterator.
      q.cb(); // Run the callback provided.
    }


    // The kill switch.
    // Used for both killing all Typers with the `killTyper` event
    // as well as killing Typer instances with the `.kill` method.
    function kill() {
      // Remove listener added in `processListen` if Typer is in a listener state.
      currentListener.el &&
      currentListener.el.removeEventListener(currentListener.type, currentListener.fxn);

      // Stop all iterations & pauses.
      clearInterval(q.iterator); // From processMsg.
      clearInterval(q.goBack); // From processBack.
      clearTimeout(q.pause); // From processPause.

      // This is necessary in case `.kill` is used in the initial chain of API methods.
      // It would be pointless to do so since this achieves nothing:
      // typer('#some-id').line('yo').kill();
      q.length = 0;

      typerCleanup();

      return nullApi('kill');
    }
    function nullApi(method) { // Used after `.end` or `.kill` have been called.
      const warning = `WARNING: you tried to call ".%s" after ".${method}" has already been called.\nThe public API has been nullified.`;

      // Replace our public API - `typerObj` - with the nullified version.
      Object.keys(typerObj).forEach(key => {
        // If `.end` is called, we still want `.kill` to be callable as well.
        if (key === 'kill' && method === 'end') return;
        typerObj[key] = message.bind(null, key);
      });

      if (method === 'kill') {
        if (q.killed) message();
        q.killed = true; // For `processListen`.
      }

      // Message used by the 'nullApiObj' object.
      function message(key) {
        console.warn(warning, key);
        return typerObj;
      }

      return typerObj;
    }

    // Return `typerObj` to be able to expose our public API.
    return typerObj;
  }

  return typer;
});
