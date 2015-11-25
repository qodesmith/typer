function typer(el, speed) {
  if(!speed) speed = 70; // Default speed.

  var queue = [];
  parentDataNum(); // Assign a random # to the parent el's data attribute.

  // List of HTML void elements (http://goo.gl/SWmyS5).
  // used in 'processMsg' & 'processBack'.
  queue.voids = ['area','base','br','col','command','embed','hr','img','input','keygen','link','meta','param','source','track','wbr'];


  // Public methods.
  var typerObj = {
    cursor: function(cursorObj) {
      // Prevent cursor from being run multiple times.
      if(queue.cursorRan) {
        console.log('You can only call .cursor once.');
        return this;
      }

      queue.cursorRan = true;
      var cursor = [];
      var data = '[data-typer="' + queue.dataNum + '"]';

      // Optional cursor color - https://goo.gl/8k2mqL
      if(cursorObj.color) {
        document.styleSheets[0].addRule(data + ' .typer:after', 'background-color:' + cursorObj.color + ';');
      } else {
        // Cursor defaults to the color of the specified 'el' in 'typer'.
        var color = window.getComputedStyle(el).color;
        document.styleSheets[0].addRule(data + ' .typer:after', 'background-color:' + color + ';');
      }

      // Cursor's blinking style - default to soft.
      cursorObj.blink === 'hard' ? cursor.push('cursor-hard') : cursor.push('cursor-soft');

      // Cursor: block or line.
      if(cursorObj.block === true) {
        cursor.push('cursor-block');
      }

      queue.cursor = cursor.join(' ');
      queue.push({cursor: true});

      return this;
    },
    line: function(msg, spd, html) {
      if(!msg) {
        queue.push({line: 1});
      } else {
        queue.push(lineOrContinue('line', msg, spd, html));
      }

      // Push the first dominoe on the typing iteration,
      // ensuring 'processQueue()' can only be run once.
      if(!queue.typing) {
        queue.typing = true;
        processQueue();
      }

      return this;
    },
    continue: function(msg, spd, html) {
      if(!msg) return this; // Skip empty continues.
      queue.push(lineOrContinue('continue', msg, spd, html));
      return this;
    },
    pause: function(num) {
      // Default to 500 milliseconds.
      if(num === undefined) num = 500;

      queue.push({pause: num});
      return this;
    },
    emit: function(el, event) {
      if(typeof el === 'string') {
        // If no el is given, default to the body.
        queue.push({emit: el, el: document.body});
      } else {
        queue.push({emit: event, el: el});
      }

      return this;
    },
    listen: function(el, event) {
      if(typeof el === 'string') {
        // If no el is given, default to the body.
        queue.push({listen: el, el: document.body});
      } else {
        queue.push({listen: event, el: el});
      }

      return this;
    },
    back: function(chars, spd) {
      queue.push({back: chars, speed: spd});
      return this;
    },
    empty: function() {
      queue.push({empty: true});
      return this;
    },
    run: function(fxn) {
      queue.push({run: fxn});
      return this;
    },
    end: function(fxn, e) {
      queue.push({end: true});

      queue.cb = function() {
        // Finalize the the div class names before ending.
        queue.newDiv.className = 'white-space';
        var classes = queue.newDiv.dataset.class;
        if(classes) queue.newDiv.className = classes;
        queue.newDiv = '';

        if(typeof fxn === 'function') fxn();
        if((typeof fxn === 'boolean' && fxn) || e) {
          if(typeof e === 'function') e();
          var fin = new Event('typerFinished');
          document.body.dispatchEvent(fin);
        }
      }

      // A convenient object to warn the user if they
      // try to call any methods after '.end'.
      var catchAll = {
        cursor: function() {
          return message();
        },
        line: function() {
          return message();
        },
        continue: function() {
          return message();
        },
        pause: function() {
          return message();
        },
        emit: function() {
          return message();
        },
        listen: function() {
          return message();
        },
        back: function() {
          return message();
        },
        empty: function() {
          return message();
        },
        run: function() {
          return message();
        },
        end: function() {
          return message();
        }
      };

      // Message used by the 'catchAll' object.
      function message() {
        console.log('WARNING: you tried to call a method after ".end" has already been called.');
        return catchAll;
      }

      return catchAll;
    }
  };

  // Private functions.
  function parentDataNum() {
    // Random # function with min & max values.
    // function randomNum(min, max) {
    //   return Math.floor(Math.random() * (max - min + 1) + min);
    // }

    queue.dataNum = Math.floor(Math.random() * (999999999) + 1);
    el.dataset.typer = queue.dataNum;
  }
  function lineOrContinue(choice, msg, spd, html) {
    var item = {};
    item.html = true; // Default status. Will be possibly overwritten below.

    function htmlObj(obj) {
      for(i in obj) item[i] = obj[i];
    }

    // POSSIBLE ARRANGEMENTS:
    //  1. msg = string/array
    //  2. msg = string/array, spd
    //  3. msg = string/array, html
    //  4. msg = string/array, spd, html
    //  5. msg = string/array, html, spd
    //  6. msg = div
    //  7. msg = div, spd
    //  8. msg = div, html
    //  9. msg = div, spd, html
    // 10. msg = div, html, spd

    if(typeof msg === 'string' || msg.constructor.name === 'Array') {
      item[choice] = msg; // 1
    } else {
      item[choice] = msg.innerHTML; // 6
    }

    if(spd && typeof spd === 'number') {
      item.speed = spd; // 2, 7
      if(html) htmlObj(html);
    } else if(spd) {
      htmlObj(spd);
      if(html && typeof html === 'number') item.speed = html; // 5, 10
    }

    return item;
  }
  function processQueue() { // Begin our main iterator.
    if(!(queue.item >= 0)) queue.item = 0;

    // If no cursor is declared, resort to default styling.
    // The cursor will be pinged later by each line.
    if(!queue.cursor) {
      // Default cursor-blink style.
      queue.cursor = 'cursor-soft';

      // Cursor defaults to the color of the specified 'el' in 'typer'.
      var data = '[data-typer="' + queue.dataNum + '"]';
      var color = window.getComputedStyle(el).color;
      document.styleSheets[0].addRule(data + ' .typer:after', 'background-color:' + color + ';');
    }

    // Main iterator.
    queue.type = setInterval(function() {
      var currentItem = queue[queue.item];

      // If we arrive here and we've exausted the queue...
      if(queue.item === queue.length) return clearInterval(queue.type); // Stop the main iterator.

      currentItem.cursor ? queue.item++ : findProperty();

      function findProperty() {
        if(currentItem.line) processLine(currentItem);
        if(currentItem.continue) processContinue(currentItem);
        if(currentItem.pause) processPause(currentItem);
        if(currentItem.emit) processEmit(currentItem);
        if(currentItem.listen) processListen(currentItem);
        if(currentItem.back) processBack(currentItem);
        if(currentItem.empty) processEmpty();
        if(currentItem.run) processRun(currentItem);
        if(currentItem.end) processEnd(currentItem);
      }
    }, 0);
  }
  function processMsg(item) {
    var msg;
    item.line ? msg = item.line : msg = item.continue;

    var targetList = [queue.newDiv];
    var counter = 0;
    var iterator = setInterval(function() {
      // End of message processing logic.
      if(counter === msg.length) {
        clearInterval(iterator);
        queue.item++; // Increment our main item counter.
        return processQueue(); // Restart the main iterator.
      }

      var piece = msg[counter];

      // NO HTML
      if(!item.html) {
        queue.newDiv.innerHTML += piece;

      // HTML
      } else {
        // Open tags.
        if(piece === '<' && msg[counter + 1] !== '/') {
          var tag = '';
          var voidTag = '';
          for(var i = counter; i < msg.length; i++) {
            tag += msg[i];
            if(msg[i] !== '>' && msg[i] !== '<') voidTag += msg[i];
            if(msg[i] === '>') break;
          }

          var isVoid = (function voidTest() {
            for(i in queue.voids) if(queue.voids[i] === voidTag) return true;
            return false;
          })();

          // Non-void elements get focused on as the typing target.
          if(!isVoid) {
            var div = document.createElement('div');
            div.innerHTML = tag;

            var length = tag.length;
            var parent = targetList[0];
            targetList.unshift(div.firstChild); // Add current tag to beginning of the 'targetList' array.
            parent.appendChild(div.firstChild);

          // Void elements get added to the contents but are not focused on for typing.
          } else {
            targetList[0].innerHTML += tag;
          }


          return counter += tag.length; // Move the counter passed the current tag.

        // Closing tags.
        } else if(piece === '<' && msg[counter + 1] === '/') {
          targetList.shift(); // Remove the tag from the 'targetList' array.
          return counter = msg.indexOf('>', counter) + 1; // Move the counter passed the closing tag.

        // Unicode characters.
        } else if(piece === '&') {
          // 1. Build the unicode character.
          var char = '';
          for(var i = counter; i < counter + 7; i++) {
            char += msg[i];
            if(msg[i] === ';') break;
          }

          // 2. Test the unicode character.
          var div = document.createElement('div');
          div.innerHTML = char;
          if(div.innerText.length === 1) {
            targetList[0].innerHTML += char;
            counter = i; // Move the counter to the end of the unicode text.
          } else {
            targetList[0].innerHTML += piece;
          }
        } else {
          targetList[0].innerHTML += piece;
        }
      }

      counter++;
    }, item.speed || speed); // Function for both line and continue.
  }
  function processLine(item) {
    // Stop the main iterator.
    clearInterval(queue.type);

    // Process the previous line if there was one.
    if(queue.newDiv) {
      queue.newDiv.className = '';
      var userClass = queue.newDiv.dataset.class;
      if(userClass) queue.newDiv.className = userClass;

      queue.newDiv.classList.add('white-space');
      if(queue.newDiv.innerHTML === '') queue.newDiv.innerHTML = ' '; // Retain the height of a single line.
    }

    // Create new div.
    queue.newDiv = document.createElement('div');
    queue.newDiv.dataset.typerChild = queue.dataNum;
    queue.newDiv.className = queue.cursor;
    queue.newDiv.classList.add('typer', 'white-space');

    if(item.class) { // User-provided additional classes.
      queue.newDiv.className += (' ' + item.class);
      queue.newDiv.dataset.class = item.class;
    }

    el.appendChild(queue.newDiv);

    // If our line has no contents...
    if(item.line === 1) {
      queue.item++;
      return processQueue();
    }

    // Message iterator.
    processMsg(item);
  }
  function processContinue(item) {
    clearInterval(queue.type); // Stop the main iterator.
    processMsg(item); // Message iterator.
  }
  function processPause(item) {
    clearInterval(queue.type); // Stop the main iterator.

    setTimeout(function() {
      queue.item++; // Increment our main item counter.
      processQueue(); // Restart the main iterator.
    }, item.pause);
  }
  function processEmit(item) {
    clearInterval(queue.type); // Stop the main iterator.

    // Check for a valid node.
    if(!item.el.nodeType || item.el.nodeType !== 1) {
      console.log('You need to provide a valid element. Skipping emitter.');
    } else {
      var e = new Event(item.emit);
      item.el.dispatchEvent(e);
    }

    queue.item++;
    processQueue();
  }
  function processListen(item) {
    clearInterval(queue.type); // Stop the main iterator.

    // One-time event listener.
    item.el.addEventListener(item.listen, handler);

    function handler(e) {
      item.el.removeEventListener(e.type, handler)
      queue.item++;
      processQueue();
    }
  }
  function processBack(item) {
    // Stop the main iterator.
    clearInterval(queue.type);

    // Check for being called on an empty line.
    if(!queue.newDiv.innerText) {
      queue.item++;
      return processQueue();
    }

    // A simple way to erase the whole line without knowing the contents.
    if(item.back === 'all') item.back = queue.newDiv.innerText.length;

    var counter = 0;
    var contents = queue.newDiv.innerHTML.split('');
    var index = contents.length - 1;

    // Back iterator.
    var goBack = setInterval(function() {
      counter++;

      // Detect HTML tags.
      if(contents[index] === '>') {
        var tag = []; // Holder for detecting void elements.

        for(var i = index; i >= 0; i--) {
          tag.unshift(contents[i]);

          if(contents[i] === '<') {
            // HTML void element detection & removal.
            tag.shift();
            tag.pop();
            tag = tag.join('');
            for(j in queue.voids) {
              if(queue.voids[j] === tag) contents.splice(index, tag.length + 2);
            }

            index = i - 1;

            // Detect consecutive tags.
            if(contents[i - 1] === '>') {
              i--;
            } else {
              break;
            }
          }
        }
      }

      if(counter <= item.back) {
        contents.splice(index, 1); // Remove a single character.
        queue.newDiv.innerHTML = contents.join(''); // Reset the div contents.
        index--; // Decrement our index tracker.
      } else {
        clearInterval(goBack);
        queue.item++; // Increment our main counter.
        processQueue();
      }
    }, item.speed || speed);
  }
  function processEmpty() {
    queue.newDiv = '';
    el.innerHTML = '';
    processLine({line: 1}); // This will stop the main iterator & run 'processQueue'.
  }
  function processRun(item) {
    clearInterval(queue.type); // Stop the main iterator.

    item.run();
    queue.item++;
    processQueue();
  }
  function processEnd() {
    clearInterval(queue.type); // Final stop to our main iterator.
    queue.cb(); // Run the callback provided.
  }

  // Return 'typerObj' to be able to run the various methods.
  return typerObj;
}