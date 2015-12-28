// Push the first dominoe...
(function() {
  var main = document.querySelector('.main-container'); // Main flex container.
  var bg = document.querySelector('.background');
  var num = 0;

  // Every time the scrolling transition ends, start it up again.
  bg.addEventListener('transitionend', function startBGscroll(e) {
    scrollBG();
  });

  function scrollBG() {
    num -= 2000;
    bg.style.backgroundPositionY = num + 'px';
  }

  // Create intro (matrix) div.
  var div = document.createElement('div');
  div.className = 'matrix';
  main.appendChild(div);

  // Fade in code-background.
  setTimeout(function() {
    document.styleSheets[0].addRule('.background::after', 'background: rgba(0,20,0,0.8);');
  }, 0)
})();


// MATRIX TYPING INTRO
typer(document.querySelector('.matrix'))
  .cursor({block: true})
  .line()
  .pause(2000)
  .continue('Follow the white rabbit.')
  .pause(2000)
  .empty()
  .pause()
  .continue(['Knock', ' knock,'], 300)
  .pause(100)
  .continue([' Neo.'])
  .pause(1500)
  .run(function(el) {

    // Grab the cursor and set initial styles.
    var num = el.dataset.typer;
    document.styleSheets[0].addRule('[data-typer="' + num + '"] .typer::after', 'transition: top 1.5s ease-in, left 2s ease-out;');
    document.styleSheets[0].addRule('[data-typer="' + num + '"] .typer::after', 'top: 0vh;');
    document.styleSheets[0].addRule('[data-typer="' + num + '"] .typer::after', 'left: 0vw;');

    // All letters to separate spans.
    contentsToSpans(el.children[0]);

    // Letter explosion.
    setTimeout(function() {
      letItRain();
      document.styleSheets[0].addRule('[data-typer="' + num + '"] .typer::after', 'top:55vh;');
      document.styleSheets[0].addRule('[data-typer="' + num + '"] .typer::after', 'left:30vh;');
    }, 50);

    // Detect when all letters are gone.
    var hits = 0;
    el.children[0].addEventListener('transitionend', function kickoff(e) {
      hits++;
      if(hits === 50) {

        // Slide in the progress bar.
        document.querySelector('.progress').style.right = '0px';
        document.querySelector('.progress').classList.add('right');

        setTimeout(function() {
          beforeDemo();
        }, 300);

        el.children[0].removeEventListener(e.type, kickoff);
        el.remove();
      }
    });
  });

function contentsToSpans(el) {
  var classes = 'single-letter';
  var div = document.createElement('div');
  var contents = el.innerText.split('');

  for(i in contents) {
    var span = document.createElement('span');
    span.className = classes;
    span.innerText = contents[i];
    div.appendChild(span);
  }

  el.innerHTML = div.innerHTML;
}

function letItRain() {
  function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function randomFalls() {
    var num = randomNum(1, 1000);
    var dir;
    var distance;

    num % 2 === 0 ? dir = 'left' : dir = 'right';

    if(num > 666) {
      distance = '30vw';
    } else if(num > 333) {
      distance = '20vw';
    } else {
      distance = '10vw';
    }

    var obj = {};
    obj[dir] = distance;
    return obj;
  }

  var letters = document.querySelectorAll('.single-letter');
  for(var i = 0; i < letters.length; i++) {
    var newStyle = randomFalls(),
        a = 'transform 2s linear,',
        b = 'top ' + (1 + Math.random()) + 's cubic-bezier(.8,.03,.86,.72),',
        c = 'left 2s linear,',
        d = 'right 2s linear';

    letters[i].style.transition = a + b + c + d;
    letters[i].style.top = '105vh';

    if(newStyle.left) {
      letters[i].style.left = newStyle.left;
      letters[i].style.transform = 'rotate(-360deg)';
    } else {
      letters[i].style.right = newStyle.right;
      letters[i].style.transform = 'rotate(360deg)';
    }
  }
}

// Setup of narration & code divs.
function beforeDemo() {
  var narration = document.createElement('div');
  var code = document.createElement('div');
  var cc = document.createElement('div');
  var main = document.querySelector('.main-container');
  var progress = document.querySelector('.progress');

  narration.className = 'narration';
  code.className = 'code';
  cc.className = 'code-container'

  progress.addEventListener('transitionend', function progressShown(e) {
    progress.removeEventListener(e.type, progressShown);

    main.style.flexDirection = 'column';
    main.appendChild(narration);
    main.appendChild(code);
    code.appendChild(cc);

    demoListen(code);

    setTimeout(function() {
      narration.style.opacity = '1';
      code.style.opacity = '1';

      setTimeout(function() {
        narration.classList.add('open');
        code.classList.add('open');
      }, 750)
    }, 1);
  });
}

// When narration & code divs expand, start the Typers.
function demoListen(code) {
  code.addEventListener('transitionend', function startTypers(e) {
    if(e.propertyName === 'width') {
      code.removeEventListener(e.type, startTypers);
      demo();
    }
  });
}

// Time-keeping object for demo().
var timeKeeping = {
  times: [],
  methodTimes: {
    typer: '0:59',
    cursor: '2:02',
    line: '2:42',
    back: '2:06',
    continue: '0:21',
    pause: '0:51',
    emit: '1:02',
    listen: '0:59',
    empty: '0:24',
    run: '1:11',
    end: '1:18'
  },
  startTime: function() {
    var _this = this;
    this.el = document.querySelector('.method.active .timer');
    var name = this.el.parentElement.id.split('-')[1];
    this.el.innerText = this.methodTimes[name];

    var min = Number(this.methodTimes[name].split(':')[0]);
    var sec = Number(this.methodTimes[name].split(':')[1]);
    var el = this.el;
    this.time = setInterval(function() {
      sec--;

      if(sec < 0 && min < 1) return _this.stopTime();
      if(sec < 0) {
        sec = 59;
        min--;
      }
      if(sec < 10) sec = '0' + sec;

      _this.el.innerText = min + ':' + sec;
    }, 1000);
  },
  stopTime: function() {
    clearInterval(this.time);
    this.el.classList.add('complete');
  }
};

// NARRATION & CODE TYPERS
function demo() {
  var nar = document.querySelector('.narration');
  var code = document.querySelector('.code-container');
  var methods = {
    count: 0,
    items: ['typer', 'cursor', 'line', 'back', 'continue', 'pause', 'emit', 'listen', 'empty', 'run', 'end']
  };

  // First method in the progress list.
  document.querySelector('#progress-typer').classList.add('active');

  function increaseProgress() {
    var curMethod = document.querySelector('#progress-' + methods.items[methods.count]);
    methods.count++;
    var newMethod = document.querySelector('#progress-' + methods.items[methods.count]);

    curMethod.classList.toggle('active');
    curMethod.classList.add('complete');
    newMethod.classList.toggle('active');
  }

  typer(nar)
    .run(function time() {
      timeKeeping.startTime();
    })
    // TYPER
    // TYPER
    // TYPER
    .line('Welcome to the <span class="lime" style="font-weight: 500">Typer.js</span> demonstration!')
    .pause(1200)
    .back(14, 40)
    .continue('tutorial.')
    .pause(1000)
    .back(9, 50)
    .continue('explanation-of-all-the-methods!')
    .pause(1200)
    .back('all', 10)
    .continue("<span class='lime'>Typer</span> is a JavaScript <em>typing</em> library")
    .line('that will wow all your friends and make you famous.')
    .pause(1000)
    .empty()
    .continue("Let's get started.")
    .pause(1000)
    .back('all', 10)
    .continue('<span class="lime">Typer</span> has <strong class="underline"><em>no dependencies<em></strong>.')
    .pause()
    .line('Slap it on your page and go.')
    .pause(1000)
    .empty()
    .continue("<span class='lime'>Typer</span> itself takes two arguments.")
    .pause()
    .line('The 1st argument is a DOM element:')
    .emit('typer-1')
    .listen('typer-2')
    .back(1)
    .continue(' - optionally you can use a jQuery selector:')
    .emit('typer-3')
    .listen('typer-4')
    .back(41, 10)
    .continue("(let's stick with vanilla JS)")
    .pause()
    .emit('typer-5')
    .listen('typer-6')
    .back('all', 10)
    .continue('The 2nd argument is a speed - milliseconds / character typed:')
    .emit('typer-7')
    .listen('typer-8')
    .empty()
    .continue('The speed is optional.')
    .pause()
    .line('If no speed is given, <span class="lime">Typer</span> will default to a speed of 70.')
    .pause(1500)
    .run(function() {
      timeKeeping.stopTime();
      increaseProgress();
      timeKeeping.startTime();
    })
    // METHOD: CURSOR
    // METHOD: CURSOR
    // METHOD: CURSOR
    .empty()
    .pause()
    .continue('Now for our first method:')
    .pause(1000)
    .continue([' <span class="lime">cursor</span>!'])
    .pause(1300)
    .back('all', 10)
    .continue('<span class="lime">Typer</span> shows a cursor by default just like real typing.')
    .pause(1000)
    .line(['How exciting!'])
    .pause()
    .empty()
    .continue("While the <span class='lime'>cursor</span> method is completely <em>optional</em>,")
    .line('(<span class="lime">Typer</span> will use the default settings if it\'s not called),')
    .line("it's suggested that if used it be called first:")
    .emit('cursor-1')
    .listen('cursor-2')
    .empty()
    .continue('The <span class="lime">cursor</span> method can take a few options.')
    .pause(1500)
    .back('all', 10)
    .continue('Option 1:')
    .pause()
    .continue(' no cursor at all!')
    .pause(1000)
    .line('This is a single argument passed to <span class="lime">cursor</span>: <span class="purple mono">false</span>.')
    .emit('cursor-3')
    .listen('cursor-4')
    .line("If you don't want a cursor at all,")
    .pause()
    .continue(' pass in false.')
    .pause(1500)
    .empty()
    .continue('Option 2: an object with some properties...')
    .emit('cursor-5')
    .listen('cursor-6')
    .back('all', 10)
    .continue('<strong>block</strong>')
    .pause()
    .line('By default, the cursor is the standard "line"')
    .pause(750)
    .continue([' &#8594;'])
    .pause(1500)
    .back('all', 10)
    .continue('By using <span class="mono">block: <span class="purple">true</span></span> below, we get the old-school style block.')
    .emit('cursor-7')
    .listen('cursor-8')
    .empty()
    .continue('<strong>blink</strong>')
    .line('This cursor has a soft blinking motion')
    .pause()
    .continue([' &#8594;'])
    .pause(1500)
    .back('all', 10)
    .continue('The cursor below has a binary (on/off) blinking motion.')
    .emit('cursor-9')
    .listen('cursor-10')
    .empty()
    .continue('<strong>color</strong>')
    .line('You can set the color of the cursor.')
    .run(function() {
      document.querySelector('.highlight.color').classList.add('show-border');
    })
    .pause(1000)
    .back('all', 10)
    .continue('If no color is specified, the cursor will default')
    .line('to the text color of the parent element.')
    .pause(1000)
    .empty()
    .continue(['<strong>color</strong'])
    .line('Feed it a named color, #hex, etc.')
    .run(function() {
      document.querySelector('.highlight.color').classList.remove('show-border');
    })
    .line('Any valid css color will do:')
    .emit('cursor-11')
    .listen('cursor-12')
    .empty()
    .continue('If you omit the cursor object altogether,')
    .line('the following default values will be used:')
    .pause()
    .line('<span class="mono">{block: <span class="purple">false</span>, blink: <span class="yellow">\'soft\'</span>}</span>')
    .line('and the color will be set to the parent elements text color.')
    .pause(1500)
    .emit('cursor-13')
    .listen('line-1')
    .empty()
    .run(function() {
      timeKeeping.stopTime();
      increaseProgress();
      timeKeeping.startTime();
    })
    // METHOD: LINE
    // METHOD: LINE
    // METHOD: LINE
    .continue("Now let's <em>really</em> dig in to <span class='lime'>Typer</span>!")
    .pause(1000)
    .back('all', 10)
    .continue('Introducing the <span class="lime">line</span> method:')
    .emit('line-2')
    .listen('line-3')
    .pause(1000)
    .back('all', 10)
    .continue('<span class="lime">line</span> takes 3 possible arguments.')
    .pause()
    .line("Let's look at the first argument.")
    .pause(1000)
    .empty()
    .continue('Giving <span class="lime">line</span> a string results in the string')
    .line('being typed out, character by character at the')
    .line('speed which you gave to <span class="lime">Typer</span> at the start.')
    .pause(1500)
    .empty()
    .continue('You can provide <span class="lime">line</span> a 2nd argument, a number,')
    .line('to specify how fast to type for <em>just that line<em>:')
    .pause()
    .emit('line-4')
    .listen('line-5')
    .pause(1000)
    .empty()
    .continue('The example below, using <span class="purple mono">400</span>, will type ')
    .continue('sloooowly.', 400)
    .pause(1500)
    .back('all', 10)
    .continue(['What', ' if', ' you', ' want', ' to', ' type', ' words', ' out', ' whole?'], 350)
    .pause(1000)
    .line('Simple!')
    .pause()
    .continue(' Give <span class="lime">line</span> an <em>array</em> instead of a string:')
    .emit('line-6')
    .listen('line-7')
    .pause(1500)
    .empty()
    .continue('What if you wanted to use styling?')
    .pause()
    .line('<span class="lime">line</span> will process HTML by default.')
    .line('Check out the code below:')
    .pause()
    .emit('line-8')
    .listen('line-9')
    .pause(1000)
    .empty()
    .continue('The code below will result in a line looking like this:')
    .pause(1000)
    .line(['Typer.js <em>rules!</em>'])
    .pause(3500)
    .back('all', 10)
    .emit('line-10')
    .listen('line-11')
    .pause(1000)
    .continue(['<span style="color: lime">Typer.js</span> <strong>rules</strong>!'])
    .pause(3500)
    .back('all', 10)
    .emit('line-12')
    .listen('line-13')
    .pause(1000)
    .line(['Typer.<br>Types.<br>Div\'s.'])
    .pause(3000)
    .empty()
    .continue('Any valid HTML is fair game for <span class="lime">line</span>.')
    .pause(1000)
    .line('Go nuts.')
    .pause(1500)
    .empty()
    .continue('The 3rd argument for <span class="lime">line</span> is')
    .line('an object stating <em>not</em> to use HTML:')
    .emit('line-14')
    .listen('line-15')
    .pause(2000)
    .empty()
    .continue('The code below will result in a line looking like this:')
    .pause(1000)
    .line(['Typer.js <strong>rules</strong>!'], {html: false})
    .pause(3000)
    .empty()
    .continue("Now here's the twist:")
    .pause()
    .line('The 2nd & 3rd arguments are order agnostic!')
    .pause(1000)
    .emit('line-16')
    .listen('line-17')
    .pause(1500)
    .empty()
    .continue('Want another twist?')
    .pause(1000)
    .back('all', 10)
    .continue('If you give <span class="lime">line</span> a DOM element')
    .line('as the first argument (instead of a string or an array),')
    .pause()
    .line("you're now using the contents of that element to supply <span class='lime'>line</span>")
    .line('with something to type.')
    .pause()
    .continue(' <strong>SEO</strong> anyone?')
    .pause(1000)
    .continue([' ;)'])
    .pause()
    .emit('line-18')
    .listen('line-19')
    .pause(1000)
    .empty()
    .continue(['Boom.'])
    .pause(1000)
    .back('all', 10)
    .continue('One last thing for <span class="lime">line</span>...')
    .pause(1200)
    .emit('line-20')
    .listen('line-21')
    .pause()
    .back('all', 10)
    .continue('Passing <em>no argument</em> to line will just create a blank line.')
    .pause()
    .line()
    .line('&#11014; &#11014; &#11014; &#11014; &#11014; &#11014; &#11014; &#11014;')
    .pause(1000)
    .line('Yea, line can type unicode characters too :)')
    .pause(1500)
    .line('Moving right along...')
    .run(function() {
      timeKeeping.stopTime();
      increaseProgress();
      timeKeeping.startTime();
    })
    // METHOD: BACK
    // METHOD: BACK
    // METHOD: BACK
    .pause()
    .empty()
    .continue('Now on to our friend the <span class="lime">back</span> method.')
    .pause(1000)
    .line("As you've been seeing in the demo so far,")
    .line('<span class="lime">back</span> let\'s you "erase" things.')
    .pause(1500)
    .emit('back-1')
    .listen('back-2')
    .pause(1500)
    .empty()
    .continue('So what if we want to "erase" back to "JS" in the line below?')
    .pause()
    .line("1st argument - supply <span class='lime'>back</span> with a number")
    .line('representing how many characters we want to "erase":')
    .emit('back-3')
    .listen('back-4')
    .pause(1500)
    .empty()
    .continue('As you can see, we\'re looking to "backspace" 13 times.')
    .line('The code below will execute on the screen like this:')
    .pause(750)
    .line('Typer.js is pure JS awesomeness!')
    .back(13)
    .pause(2000)
    .empty()
    .continue('Notice how <span class="lime">back</span>\'s <em>speed</em> was the same as the typing speed?')
    .pause()
    .line('Want to change that?')
    .pause()
    .line('2nd argument - another number representing <span class="lime">back</span>\'s <em>speed</em>:')
    .emit('back-5')
    .listen('back-6')
    .pause(2000)
    .empty('Watch how <span class="lime">back</span> excutes <em>much</em> faster now:')
    .pause(1000)
    .continue('Typer.js is pure JS awesomeness!')
    .back(13, 10)
    .pause(1000)
    .line('Super fast!')
    .pause(1000)
    .continue(' And super fly...')
    .pause()
    .empty()
    .continue('<span class="lime">back</span> has a few more tricks up its sleeve.')
    .pause(750)
    .line('What if you wanted to "erase" the whole line?')
    .pause(1000)
    .back('all', 10)
    .continue('It would be a pain, especially for longer lines, to manually count')
    .line('the characters in order to give <span class="lime">back</span> the correct number.')
    .pause(1000)
    .line('<span class="yellow mono">\'all\'</span> to the rescue!')
    .pause()
    .continue(' Observe:')
    .emit('back-7')
    .listen('back-8')
    .pause(1500)
    .empty()
    .continue('<span class="lime">back</span> has another convenient option:')
    .emit('back-9')
    .listen('back-10')
    .pause(1200)
    .empty()
    .continue('Passing in a negative number, in this case <span class="mono"><span class="pink">-</span><span class="purple">5</span></span>,')
    .line('is the equivalent to saying <em style="text-decoration: underline">erase all but</em> 5 characters.')
    .pause()
    .line('You can see how this would again be convenient for longer lines.')
    .pause(750)
    .line('In the example below we\'ve also provided the second argument, <span class="purple mono">10</span>, for a speed.')
    .pause(1200)
    .empty()
    .continue('<span class="lime">back</span> has one last option of convenience:')
    .emit('back-11')
    .listen('back-12')
    .pause(1200)
    .empty()
    .continue('This option for <span class="lime">back</span> will empty the line <em>all-at-once</em>.')
    .pause()
    .line('No character-by-character backspacing will happen.')
    .pause()
    .line(['Poof.', ' Gone.'], 750)
    .pause(1000)
    .run(function() {
      timeKeeping.stopTime();
      increaseProgress();
      timeKeeping.startTime();
    })
    // METHOD: CONTINUE
    // METHOD: CONTINUE
    // METHOD: CONTINUE
    .empty()
    .continue('The next method to discuss is <span class="lime">continue</span>.')
    .pause(1500)
    .back('all', 10)
    .continue('<span class="lime">continue</span> has all the same options & arguments as <span class="lime">line</span>.')
    .pause()
    .line('The major difference is that <span class="lime">continue</span> <em>continues</em> typing <em>one the same line</em>.')
    .pause(1500)
    .empty()
    .continue('The best way to show this is to use it in combination with our next method:')
    .run(function() {
      timeKeeping.stopTime();
      increaseProgress();
      timeKeeping.startTime();
    })
    // METHOD: PAUSE
    // METHOD: PAUSE
    // METHOD: PAUSE
    .pause()
    .line(['<span class="lime">pause</span>'])
    .pause(1200)
    .empty()
    .continue('Check out the code below...')
    .pause()
    .emit('pause-1')
    .listen('pause-2')
    .pause(2000)
    .back('all', 10)
    .continue("First we'll type a word,")
    .line('then pause for 2 seconds,')
    .line('and lastly type the final word.')
    .pause(2000)
    .line('Got it?')
    .pause(1200)
    .empty()
    .continue('So it would execute on the screen like this:')
    .pause(1000)
    .line('Typer.js')
    .pause(1000)
    .continue(' rules!')
    .pause(1500)
    .line('Cool, huh?')
    .pause(1500)
    .empty()
    .continue('As for <span class="lime">pause</span>, it takes a single argument, a number in milliseconds.')
    .pause(1000)
    .line('<span class="lime">Typer</span> will wait that long before continuing with any further operations.')
    .pause()
    .line("If you don't supply any arguments to <span class='lime'>pause</span>, the default is <span class='purple mono'>500</span>.")
    .pause(2000)
    .emit('pause-3')
    .listen('pause-4')
    .run(function() {
      timeKeeping.stopTime();
      increaseProgress();
      timeKeeping.startTime();
    })
    // METHOD: EMIT
    // METHOD: EMIT
    // METHOD: EMIT
    .empty()
    .continue("We've covered all the <em>typing</em> methods of <span class='lime'>Typer</span>,")
    .line('but there are a few handy methods left that increase awesomness.')
    .pause(1300)
    .empty()
    .continue("Let's talk about events.")
    .pause(1000)
    .back('all', 10)
    .continue('"Events" you say?')
    .pause()
    .line(' Yes. Those things that happen all over the DOM with JavaScript.')
    .pause(1000)
    .line('Turns out, with <span class="lime">Typer</span> we can both <em>emit</em> and <em>listen</em> to events.')
    .pause(1300)
    .empty()
    .continue("Let's start with the <span class='lime'>emit</span> method.")
    .emit('emit-1')
    .listen('emit-2')
    .pause(1500)
    .line('Feeding <span class="lime">emit</span> a string will create an event with that name')
    .line('and immediately fire it off the <span class="mono">&lt;<span class="pink">body</span>&gt;</span>.')
    .pause(1000)
    .empty()
    .continue(['<span class="yellow">\'boom\'</span>'])
    .pause()
    .empty()
    .pause()
    .continue('What if you want to fire an event off a specific element?')
    .pause()
    .line('<span class="lime">emit</span> has you covered.')
    .pause()
    .line('Just pass in a DOM element as the 1st argument')
    .line('and an event name as the 2nd:')
    .emit('emit-3')
    .listen('emit-4')
    .pause(1000)
    .empty()
    .continue("Don't forget that you can use jQuery selectors")
    .line('with all of <span class="lime">Typer</span>\'s methods:')
    .emit('emit-5')
    .listen('emit-6')
    .pause(1200)
    .empty()
    .run(function() {
      timeKeeping.stopTime();
      increaseProgress();
      timeKeeping.startTime();
    })
    // METHOD: LISTEN
    // METHOD: LISTEN
    // METHOD: LISTEN
    .emit('listen-1')
    .listen('listen-2')
    .continue('Now we move on to the <span class="lime">listen</span> method.')
    .pause()
    .line('As you may have noticed,')
    .pause()
    .continue(' this demonstration page has')
    .line('two <span class="lime">Typer</span> functions running at the same time.')
    .pause()
    .line('One for the narration up top and one for the code examples below.')
    .pause(1300)
    .empty()
    .continue("What you're seeing is the two <span class='lime'>Typer</span> functions")
    .line('"speak" to each other via the <span class="lime">emit</span> and <span class="lime">listen</span> methods.')
    .pause()
    .line('That\'s what makes the two go "back and forth" during this demo.')
    .pause(1500)
    .empty()
    .continue('Giving <span class="lime">listen</span> a string causes <span class="lime">Typer</span> to stop,')
    .line('waiting for that event to fire on the <span class="mono">&lt;<span class="pink">body</span>&gt;</span>.')
    .pause()
    .line('<span class="lime">Typer</span> won\'t do anything else until that specific event fires.')
    .pause(1500)
    .empty()
    .continue('As with the <span class="lime">emit</span> method,')
    .line('the arguments are the same for <span class="lime">listen:</span>')
    .emit('listen-3')
    .listen('listen-4')
    .pause(1000)
    .line('That\'s how you listen for an event on a specific DOM element.')
    .pause()
    .line('Nifty, huh?')
    .pause(1000)
    .run(function() {
      timeKeeping.stopTime();
      increaseProgress();
      timeKeeping.startTime();
    })
    // METHOD: EMPTY
    // METHOD: EMPTY
    // METHOD: EMPTY
    .empty()
    .continue('Now we come to the <span class="lime">empty</span> method.')
    .pause()
    .line('<span class="lime">empty</span> will <em>empty out</em> the DOM element you fed <span class="lime">Typer</span> in the beginning.')
    .pause()
    .line('The element is cleared of content immediately (no backspacing),')
    .line('and you\'re started again with a new line.')
    .emit('empty-1')
    .listen('empty-2')
    .pause(1300)
    .empty()
    .continue('There are no arguments for <span class="lime">empty</span>.')
    .pause()
    .line('It just does what it says.')
    .pause(1300)
    .run(function() {
      timeKeeping.stopTime();
      increaseProgress();
      timeKeeping.startTime();
    })
    // METHOD: RUN
    // METHOD: RUN
    // METHOD: RUN
    .empty()
    .continue('Our last two methods have somewhat similar functionality.')
    .pause(1000)
    .back('all', 10)
    .continue('The <span class="lime">run</span> method is a handy tool allowing you to run a function.')
    .emit('run-1')
    .listen('run-2')
    .pause(1500)
    .line('As you can see, the only argument to <span class="lime">run</span> is a user-provided function.')
    .pause(1000)
    .line('But there\'s one nifty trick up <span class="lime">run</span>\'s sleeve...')
    .pause()
    .emit('run-3')
    .listen('run-4')
    .pause(1000)
    .empty()
    .continue('Passing in a single argument to the function gives you')
    .line('access to the parent element that <span class="lime">Typer</span> is typing in')
    .line('(the one provided to <span class="lime">Typer</span> in the beginning).')
    .pause(1000)
    .line('Name that argument what you want, but it will represent that parent element.')
    .pause(1500)
    .empty()
    .continue('As you can see in the demo below, we\'ve used <span class="lime">run</span>')
    .line("to change the background color of the parent element below.")
    .pause(1500)
    .empty()
    .emit('run-5')
    .listen('run-6')
    .pause(1000)
    .continue('Of course, <span class="lime">run</span> is not limited to manipulating the parent element.')
    .pause()
    .line('This demo uses <span class="lime">run</span> for a number of things such as')
    .line('the timers in the progress section on this page.')
    .pause(1350)
    .continue([' Go nuts.'])
    .pause()
    .empty()
    .run(function() {
      timeKeeping.stopTime();
      increaseProgress();
      timeKeeping.startTime();
    })
    // METHOD: END
    // METHOD: END
    // METHOD: END
    .continue('And now folks,')
    .pause(1000)
    .continue(' we conclude with our last and final method,')
    .pause(1000)
    .line('appropriately named for the conslusion of this saga...')
    .pause(1000)
    .line('nerds & nerdettes,')
    .pause()
    .line(' I present to you the <span class="lime">end</span> method.')
    .emit('end-1')
    .listen('end-2')
    .pause(1500)
    .line(['<span style="font-size: 0.8em">(queue applause)</span>'])
    .pause(700)
    .empty()
    .continue('The <span class="lime">end</span> method always removes the cursor,')
    .line('can optionally execute a callback function,')
    .line('and optionally fire off an event named "<span class="mono">typerFinished</span>"')
    .line('from the <span class="mono">&lt;<span class="pink">body</span>&gt;</span>.')
    .pause(1500)
    .empty()
    .continue('The code below shows <span class="lime">end</span> in its simplest form,')
    .line('removing the cursor <em>only</em>.')
    .pause(1000)
    .empty()
    .continue('Just like the <span class="lime">run</span> method, <span class="lime">end</span> can run a function.')
    .emit('end-3')
    .listen('end-4')
    .pause(1500)
    .line('And you also have access to the parent element')
    .line('by passing an argument to the function:')
    .emit('end-5')
    .listen('end-6')
    .pause(1500)
    .empty()
    .continue('<span class="lime">end</span> can fire off the "<span class="mono">typerFinished</span>" event')
    .line('by passing <span class="purple mono">true</span> as the second argument:')
    .pause()
    .emit('end-7')
    .listen('end-8')
    .pause(2000)
    .empty()
    .continue('Just to be clear, you don\'t <em>have</em> to use the <span class="lime">end</span> method')
    .line('at the end of your <span class="lime">Typer</span> function.')
    .pause()
    .line('Just know that if you don\'t, the cursor will remain there forever.')
    .pause(1000)
    .empty()
    .continue(['And ever...'])
    .pause(1000)
    .run(function() {
      timeKeeping.stopTime();

      document.querySelector('.progress-container').style.opacity = '0';
      document.querySelector('.main-container').style.opacity = '0';

      var bg = document.querySelector('.background');
      var div = document.createElement('div');

      div.className = 'fin';
      bg.appendChild(div);

      typer(div, 150)
        .cursor({block: true, blink: 'hard'})
        .line()
        .run(function(el) {
          el.classList.add('show');
        })
        .pause(5000)
        .continue('the .end()');
    });

  typer(code, 30)
    .cursor({block: true, blink: 'hard'})
    // METHOD: TYPER
    // METHOD: TYPER
    // METHOD: TYPER
    .line()
    .listen('typer-1')
    .continue('typer(<span class="aqua italic">document</span>.querySelector(<span class="yellow">\'.someClass\'</span>),')
    .pause(1200)
    .emit('typer-2')
    .listen('typer-3')
    .back(37, 10)
    .continue('<span class="pink">$</span>(<span class="yellow">\'.someClass\'</span>),')
    .pause(1000)
    .emit('typer-4')
    .listen('typer-5')
    .back(16, 10)
    .continue('<span class="aqua italic">document</span>.querySelector(<span class="yellow">\'.someClass\'</span>),')
    .pause()
    .emit('typer-6')
    .listen('typer-7')
    .continue(' <span class="purple">100</span>)')
    .pause(1500)
    .emit('typer-8')
    // METHOD: CURSOR
    // METHOD: CURSOR
    // METHOD: CURSOR
    .listen('cursor-1')
    .line('  .cursor()')
    .pause(1000)
    .emit('cursor-2')
    .listen('cursor-3')
    .back(1)
    .continue('<span class="purple">false</span>)')
    .pause(1000)
    .emit('cursor-4')
    .listen('cursor-5')
    .back(6, 10)
    .continue('{<span class="highlight block">block: <span class="purple">true</span></span>, <span class="highlight blink">blink: <span class="yellow">\'hard\'</span></span>, <span class="highlight color">color: <span class="yellow">\'red\'</span></span>})')
    .pause(1500)
    .emit('cursor-6')
    .listen('cursor-7')
    .continue(['<span class="arrow-blink lime"> &#8594;</span>'])
    .run(function() {
      var arrow = document.querySelector('.arrow-blink');
      var hl = document.querySelector('.highlight.block');
      hl.classList.add('show-border');

      var times = 0;
      var blink = setInterval(function() {
        if(times % 2) {
          arrow.style.color = '';
        } else {
          arrow.style.color = 'transparent';
        }

        times++;
        if(times === 6) {
          clearInterval(blink);
          var e = new Event('done-blinking-block');
          document.body.dispatchEvent(e);
          hl.classList.remove('show-border');
        }
      }, 750);
    })
    .listen('done-blinking-block')
    .pause(1000)
    .back(2, 10)
    .emit('cursor-8')
    .listen('cursor-9')
    .continue(['<span class="arrow-blink lime"> &#8594;</span>'])
    .run(function() {
      var arrow = document.querySelector('.arrow-blink');
      var hl = document.querySelector('.highlight.blink');
      hl.classList.add('show-border');

      var times = 0;
      var blink = setInterval(function() {
        if(times % 2) {
          arrow.style.color = '';
        } else {
          arrow.style.color = 'transparent';
        }

        times++;
        if(times === 8) {
          clearInterval(blink);
          var e = new Event('done-blinking-blink');
          document.body.dispatchEvent(e);
          hl.classList.remove('show-border');
        }
      }, 750);
    })
    .listen('done-blinking-blink')
    .pause(1000)
    .back(2, 10)
    .emit('cursor-10')
    .listen('cursor-11')
    .back(6, 10)
    .continue('<span class="yellow">rgb(255, 0, 0)\'</span>})')
    .pause(1500)
    .back(17, 10)
    .continue('<span class="yellow">hsl(0, 100%, 50%)\'</span>})')
    .pause(1500)
    .back(20, 10)
    .continue('<span class="yellow">#ff0000\'</span>})')
    .pause(1500)
    .emit('cursor-12')
    .listen('cursor-13')
    .back(20, 10)
    .continue('})')
    // METHOD: LINE
    // METHOD: LINE
    // METHOD: LINE
    .emit('line-1')
    .listen('line-2')
    .line('  .line(<span class="yellow">\'Typer.js rules!\'</span>)')
    .emit('line-3')
    .listen('line-4')
    .back(1)
    .continue(', <span class="purple">400</span>)')
    .emit('line-5')
    .listen('line-6')
    .back(-8, 10)
    .continue('[<span class="yellow">\'Typer.js\'</span>, <span class="yellow">\' rules!\'</span>], <span class="purple">400</span>)')
    .emit('line-7')
    .listen('line-8')
    .back(-8, 10)
    .continue('<span class="yellow">\'Typer.js &lt;em&gt;rules!&lt;/em&gt;\'</span>, <span class="purple">400</span>)')
    .emit('line-9')
    .listen('line-10')
    .back(-8, 10)
    .continue('<span class="yellow">\'&lt;span style="color: lime"&gt;Typer.js&lt;/span&gt; &lt;strong&gt;rules&lt;/strong&gt;!\'</span>, <span class="purple">400</span>)')
    .emit('line-11')
    .listen('line-12')
    .back(-8, 10)
    .continue('<span class="yellow">\'&lt;div&gt;Typer.&lt;/div&gt;&lt;div&gt;Types.&lt;/div&gt;&lt;div&gt;Div\'s.&lt;/div&gt;\'</span>, <span class="purple">400</span>)')
    .emit('line-13')
    .listen('line-14')
    .back(-8, 10)
    .continue('<span class="yellow">\'Typer.js &lt;strong&gt;rules&lt;/strong&gt;!\'</span>, <span class="purple">400</span>, {html: <span class="purple">false</span>})')
    .emit('line-15')
    .listen('line-16')
    .back(19, 10)
    .continue('{html: <span class="purple">false</span>}, <span class="purple">400</span>)')
    .emit('line-17')
    .listen('line-18')
    .back(-8, 10)
    .continue('<span class="aqua italic">document</span>.querySelector(<span class="yellow">\'.someClass\'</span>), {html: <span class="purple">false</span>}, <span class="purple">400</span>)')
    .emit('line-19')
    .listen('line-20')
    .back(-8, 10)
    .continue(')')
    .emit('line-21')
    // METHOD: BACK
    // METHOD: BACK
    // METHOD: BACK
    .listen('back-1')
    .back(1)
    .continue('<span class="yellow">\'Typer.js is pure JS awesomeness!\'</span>)')
    .emit('back-2')
    .listen('back-3')
    .line('  .back(<span class="purple">13</span>)')
    .emit('back-4')
    .listen('back-5')
    .back(1)
    .continue(', <span class="purple">10</span>)')
    .emit('back-6')
    .listen('back-7')
    .back(7, 10)
    .continue('<span class="yellow">\'all\'</span>)')
    .emit('back-8')
    .listen('back-9')
    .back(6, 10)
    .continue('<span class="pink">-</span><span class="purple">5</span>, <span class="purple">10</span>)')
    .emit('back-10')
    .listen('back-11')
    .back(7, 10)
    .continue('<span class="yellow">\'empty\'</span>)')
    .emit('back-12')
    // METHOD: PAUSE
    // METHOD: PAUSE
    // METHOD: PAUSE
    .listen('pause-1')
    .empty()
    .continue('typer(<span class="aqua italic">document</span>.querySelector(<span class="yellow">\'.someClass\'</span>), <span class="purple">100</span>)')
    .line('  .cursor({block: <span class="purple">true</span>, blink: <span class="yellow">\'hard\'</span>})')
    .line('  .line(<span class="yellow">\'Typer.js\'</span>)')
    .continue('<br>  .pause(<span class="purple">2000</span>)')
    .continue('<br>  .continue(<span class="yellow">\' rules!\'</span>)')
    .emit('pause-2')
    .listen('pause-3')
    .back(-8, 10)
    .continue('<span class="yellow">\'Typer.js rulez!\'</span>)')
    .emit('pause-4')
    .listen('emit-1')
    .line('  .emit(<span class="yellow">\'boom\'</span>)')
    .emit('emit-2')
    .listen('emit-3')
    .back(-8, 10)
    .continue('<span class="aqua italic">document</span>.querySelector(<span class="yellow">\'.someClass\'</span>), <span class="yellow">\'boom\'</span>)')
    .emit('emit-4')
    .listen('emit-5')
    .back(-8, 10)
    .continue('<span class="pink">$</span>(<span class="yellow">\'.someClass\'</span>), <span class="yellow">\'boom\'</span>)')
    .emit('emit-6')
    .listen('listen-1')
    .back(-3, 10)
    // METHOD: LISTEN
    // METHOD: LISTEN
    // METHOD: LISTEN
    .continue('listen(<span class="yellow">\'boom\'</span>)')
    .emit('listen-2')
    .listen('listen-3')
    .back(-10, 10)
    .continue('<span class="aqua italic">document</span>.querySelector(<span class="yellow">\'.someClass\'</span>), <span class="yellow">\'boom\'</span>)')
    .emit('listen-4')
    // METHOD: EMPTY
    // METHOD: EMPTY
    // METHOD: EMPTY
    .listen('empty-1')
    .line('  .empty()')
    .emit('empty-2')
    // METHOD: RUN
    // METHOD: RUN
    // METHOD: RUN
    .listen('run-1')
    .run(function() {
      //
    })
    .line('  .run(<span class="aqua italic">function</span>() {')
    .continue('<br>    <span class="gray italic">// run some code</span>')
    .continue('<br>  })')
    .emit('run-2')
    .listen('run-3')
    .back(-16, 10)
    .continue('<span class="orange italic">el</span>) {')
    .continue('<br>    <span class="gray italic">// el = the parent element Typer is typing in.</span>')
    .continue('<br>    el.<span class="aqua">style</span>.<span class="aqua">backgroundColor</span> <span class="pink">=</span> <span class="yellow">\'#00C28C\'</span>;')
    .continue('<br>  })')
    .run(function(el) {
      el.style.transition = 'background-color 1s';
      el.style.backgroundColor = '#00C28C';
    })
    .emit('run-4')
    .listen('run-5')
    .run(function(el) {
      el.style.backgroundColor = 'initial';
    })
    .emit('run-6')
    // METHOD: END
    // METHOD: END
    // METHOD: END
    .listen('end-1')
    .line('  .end();')
    .emit('end-2')
    .listen('end-3')
    .back(2)
    .continue('<span class="aqua italic">function</span>() { <span class="gray italic">/* do some stuff */</span> });')
    .emit('end-4')
    .listen('end-5')
    .back(27, 10)
    .continue('<span class="orange italic">el</span>) { <span class="gray italic">/* access to parent element */</span> });')
    .emit('end-6')
    .listen('end-7')
    .back(34, 10)
    .continue('<span class="gray italic">/* fire \'typerFinished\' when done */</span> }, <span class="purple">true</span>});')
    .emit('end-8')
}