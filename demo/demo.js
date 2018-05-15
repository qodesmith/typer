let demoReady = false;

const typerDemo = {
  init: function() {
    this.explanation = document.querySelector('.explanation .container');
    this.example = document.querySelector('.example .container');
    this.killTyper = new Event('killTyper');
  },
  killTyper: function() {
    document.body.dispatchEvent(this.killTyper);
  },
  randomNum: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  next: function(method) {
    this.killTyper();
    document.querySelector('.progress-item.active').classList.remove('active');
    document.querySelector(`[data-item=${method}]`).classList.add('active');
    this[method]();
  },
  intro: function() {
    const _this = this;

    // 1. TYPE OUT THE MATRIX SCENE.
    typer('.matrix')
      .cursor({block: true, blink: 'hard'})
      .line('Follow the white rabbit.')
      .pause(1400)
      .empty()
      .continue(['Knock', ' knock,'], 300)
      .continue([' Neo.'], 300)
      .run(function(el) {
        _this.killTyper()

        setTimeout(function() {
          matrixToSpans(el);
        }, 1000);
      });

    // 2. CONVERT EACH LETTER TO A SPAN.
    function matrixToSpans(el) {
      const currentTyper = el.querySelector('.typer');
      const text = currentTyper.textContent;

      currentTyper.innerHTML = '';

      text.split('').map(function(letter) {
        const span = `<span class="white-space">${text}</span>`;
        currentTyper.appendChild(span);
      });

      customTransitions(currentTyper);
    }

    // 3. APPLY A CUSTOM TRANSITION TO EACH SPAN.
    function customTransitions(typer) {
      const _this = this;
      const spans = Array.from(typer.querySelectorAll('span'));
      let largestNum = 0;

      spans.map(function(span) {
        const xfmTime = _this.randomNum(250, 350) / 100;
        const topTime = _this.randomNum(100, 150) / 100;
        const leftTime = _this.randomNum(150, 250) / 100;

        // This value will be needed later for
        // the setTimeout time to begin the demo.
        if (topTime > largestNum) largestNum = topTime;

        // Easings copied from `blowUpMenu.js`.
        const xfm = `transform ${xfmTime}'s cubic-bezier(.25,.46,0,1)`;
        const top = `top ${topTime}'s cubic-bezier(.9,-.99,1,.96)'`;
        const left = `left ${leftTime}'s cubic-bezier(0,0,.5,1)'`;
        const transition = `${xfm}, ${top}, ${left}`;

        span.style.transition = transition;
      });

      setTimeout(function() {
        leftAndTransform(spans, largestNum);
      }, 50);
    }

    // 4. EXPLOSION: APPLY CUSTOM LEFT & TRANSFORM STYLES TO EACH SPAN.
    function leftAndTransform(spans, largestNum) {
      const _this = this;
      const degrees = this.randomNum(140, 360);
      degrees = degrees % 2 ? degrees * -1 : degrees;

      // Get rid of the cursor.
      $('.typer')
        .attr('style', 'position: relative')
        .removeClass('typer');

      spans.maps(function(span) {
        span.style.left = `${_this.randomNum(-20, 20)}vw`;
        span.style.transform = `rotate('${degrees}deg)`;
        span.style.top = '60vh';
      });

      setTimeout(function() {
        removeMatrixShowDemo();
      }, largestNum * 1000 + 500);
    }

    // 5. START DEMO: REMOVE THE MATRIX ELEMENT, SHOW THE DEMO ELEMENTS.
    function removeMatrixShowDemo() {
      document.querySelector('.matrix').remove();
      document.querySelector('.typer-panes, .progress').classList.add('show');

      setTimeout(function() {
        _this.typerJs();
      }, 1000);
    }
  },
  resetPanes: function(html) {
    this.explanation.innerHTML = '';
    this.example.innerHTML = html || '';
  },
  typerJs: function() {
    this.resetPanes();

    typer('.explanation .container')
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
      .continue('<span class="lime">Typer</span> has <strong class="underline"><em>no dependencies</em></strong>.')
      .pause()
      .line('Slap it on your page and go.')
      .pause(1000)
      .empty()
      .continue("<span class='lime'>Typer</span> itself takes two arguments.")
      .pause()
      .line('The 1st argument is any valid CSS selector:')
      .emit('typer-1')
      .listen('typer-2')
      .empty()
      .continue('The 2nd argument is a speed - milliseconds / character typed:')
      .emit('typer-3')
      .listen('typer-4')
      .pause(1500)
      .empty()
      .continue('The speed is optional.')
      .pause()
      .line('If no speed is given, <span class="lime">Typer</span> will default to a speed of 70.')
      .pause(1500)
      .run(function() {
        typerDemo.next('cursor');
      });

    typer('.example .container')
      .cursor({block: true, blink: 'hard'})
      .line()
      .listen('typer-1')
      .continue('typer(<span class="yellow">\'.someClass\'</span>,')
      .pause(1500)
      .back(-6, 10)
      .continue('<span class="yellow">\'#some-id\'</span>')
      .pause(1500)
      .back(-6, 10)
      .continue('<span class="yellow">\'.class1 .class2\'</span>')
      .pause(1500)
      .back(-6, 10)
      .continue('<span class="yellow">\'#so-on.andSoForth\'</span>')
      .pause(1500)
      .back(-6, 10)
      .continue('<span class="yellow">\'.someClass\'</span>')
      .emit('typer-2')
      .listen('typer-3')
      .continue(', <span class="purple">100</span>)')
      .emit('typer-4');
  },
  cursor: function() {
    this.resetPanes(demoHTML.cursor);

    typer('.explanation .container')
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
      .continue(' pass in <span class="purple mono">false</span>.')
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
      .continue('By using <span class="mono">block: <span class="purple mono">true</span></span> below, we get the old-school style block:')
      .emit('cursor-7')
      .listen('cursor-8')
      .empty()
      .continue('<strong>blink</strong>')
      .line('This cursor has a soft blinking motion')
      .pause()
      .continue([' &#8594;'])
      .pause(1500)
      .back('all', 10)
      .continue('The cursor below has a binary (on/off) blinking motion:')
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
      .continue('If you omit the cursor object <em>or</em> method altogether,')
      .line('the following default values will be used:')
      .pause()
      .line('<span class="mono">{block: <span class="purple mono">false</span>, blink: <span class="yellow">\'soft\'</span>}</span>')
      .line('and the color will be set to the parent elements\' text color.')
      .pause(1500)
      .emit('cursor-13')
      .listen('line-1')
      .run(function() {
        typerDemo.next('line');
      });

    typer('.example .container')
      .cursor({block: true, blink: 'hard'})
      .line()
      .listen('cursor-1')
      .continue('  .cursor()')
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
        const arrow = document.querySelector('.arrow-blink');
        const hl = document.querySelector('.highlight.block');
        hl.classList.add('show-border');

        const times = 0;
        const blink = setInterval(function() {
          if (times % 2) {
            arrow.style.color = '';
          } else {
            arrow.style.color = 'transparent';
          }

          times++;
          if (times === 6) {
            clearInterval(blink);
            const e = new CustomEvent('done-blinking-block');
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
        const arrow = document.querySelector('.arrow-blink');
        const hl = document.querySelector('.highlight.blink');
        hl.classList.add('show-border');

        const times = 0;
        const blink = setInterval(function() {
          if (times % 2) {
            arrow.style.color = '';
          } else {
            arrow.style.color = 'transparent';
          }

          times++;
          if (times === 8) {
            clearInterval(blink);
            const e = new CustomEvent('done-blinking-blink');
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
      .continue('})');
  },
  line: function() {
    const html = [
      demoHTML.cursor,
      demoHTML.line
    ].join('');

    this.resetPanes(html);

    typer('.explanation .container')
      .line("Now let's <em>really</em> dig in to <span class='lime'>Typer</span>!")
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
      .continue('The 3rd argument for <span class="lime">line</span> is a boolean:')
      .emit('line-14')
      .listen('line-15')
      .pause(2000)
      .empty()
      .continue('Passing in <span class="purple mono">false</span> will tell <span class="lime">line</span> to <em>not</em> process HTML.')
      .pause()
      .line('The code below will result in a line looking like this:')
      .pause(1000)
      .line(['Typer.js <strong>rules</strong>!'], false)
      .pause(3000)
      .empty()
      .continue('By default, <span class="lime">line</span> <em>will</em> process the content as HTML.')
      .pause()
      .line('No need to pass in <span class="purple mono">true</span>.')
      .pause()
      .line('Also, note the 2nd & 3rd arguments are order agnostic:')
      .emit('line-16')
      .listen('line-17')
      .pause(1500)
      .empty()
      .continue('Want another twist?')
      .pause(1000)
      .back('all', 10)
      .continue('If you give <span class="lime">line</span> an object with a selector')
      .line('as the first argument (instead of a string or an array)...')
      .emit('line-18')
      .listen('line-19')
      .pause()
      .back(3)
      .continue(',')
      .line("you're now using the contents of that element to supply <span class='lime'>line</span>")
      .line('with something to type.')
      .pause()
      .continue(' <strong>SEO</strong> anyone?')
      .pause(1000)
      .continue([' ;)'])
      .pause()
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
      .continue('Passing <em>no argument</em> to <span class="lime">line</span> will just create a blank line.')
      .pause()
      .line()
      .line('&#11014; &#11014; &#11014; &#11014; &#11014; &#11014; &#11014; &#11014;')
      .pause(1000)
      .line('Yea, <span class="lime">line</span> can type unicode characters too :)')
      .pause(1500)
      .line('Moving right along...')
      .pause()
      .run(function() {
        typerDemo.next('back');
      });

    typer('.example .container')
      .cursor({block: true, blink: 'hard'})
      .line()
      .emit('line-1')
      .listen('line-2')
      .continue('  .line(<span class="yellow">\'Typer.js rules!\'</span>)')
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
      .continue('<span class="yellow">\'Typer.js &lt;strong&gt;rules&lt;/strong&gt;!\'</span>, <span class="purple">400</span>, <span class="purple">false</span>)')
      .emit('line-15')
      .listen('line-16')
      .back(11, 10)
      .continue('<span class="purple">false</span>, <span class="purple">400</span>)')
      .emit('line-17')
      .listen('line-18')
      .back(-8, 10)
      .continue('{el: <span class="yellow">\'.anotherClass\'</span>})')
      .emit('line-19')
      .listen('line-20')
      .back(-8, 10)
      .continue(')')
      .emit('line-21');
  },
  back: function() {
    const html = [
      demoHTML.cursor,
      demoHTML.line
    ].join('');

    this.resetPanes(html);

    typer('.explanation .container')
      .line('Now on to our friend the <span class="lime">back</span> method.')
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
      .continue('Passing in a negative number, in this case <span class="mono"><span class="pink">-</span><span class="purple mono">5</span></span>,')
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
      .line('No character-by-character backspacing will occur.')
      .pause()
      .empty()
      .pause()
      .line(['Poof.'])
      .pause(1000)
      .empty()
      .pause()
      .line([' Gone.'])
      .pause(1000)
      .run(function() {
        typerDemo.next('continue');
      });

    typer('.example .container')
      .cursor({block: true, blink: 'hard'})
      .line(['  .line()'])
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
      .emit('back-12');
  },
  continue: function() {
    const html = [
      demoHTML.cursor,
      demoHTML.line,
      demoHTML.continue
    ].join('');

    this.resetPanes(html);

    typer('.explanation .container')
      .line('The next method to discuss is <span class="lime">continue</span>.')
      .pause(1500)
      .back('all', 10)
      .continue('<span class="lime">continue</span> has all the same options & arguments as <span class="lime">line</span>.')
      .pause()
      .line('The major difference is that <span class="lime">continue</span> <em>continues</em> typing <em>on the same line</em>.')
      .pause(1000)
      .line(['<span style="font-size: 0.7em">(mind blown)</span>'])
      .pause()
      .run(function() {
        typerDemo.next('pause');
      });

    typer('.example .container')
      .cursor({block: true, blink: 'hard'})
      .line();
  },
  pause: function() {
    const html = [
      demoHTML.cursor,
      demoHTML.line,
      demoHTML.continue
    ].join('');

    this.resetPanes(html);

    typer('.explanation .container')
      .line('The best way to show continue is to use it in combination with our next method:')
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
      .line('then <em>pause</em> for 2 seconds,')
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
      .line("If you don't supply any argument to <span class='lime'>pause</span>, the default is <span class='purple mono'>500</span>.")
      .pause(2000)
      .emit('pause-3')
      .listen('pause-4')
      .pause(1000)
      .run(function() {
        typerDemo.next('emit');
      });

    typer('.example .container')
      .cursor({block: true, blink: 'hard'})
      .line()
      .listen('pause-1')
      .empty()
      .continue('typer(<span class="yellow">\'.someClass\'</span>, <span class="purple">100</span>)')
      .line('  .cursor({block: <span class="purple">true</span>, blink: <span class="yellow">\'hard\'</span>})')
      .line('  .line(<span class="yellow">\'Typer.js\'</span>)')
      .continue('<br>  .pause(<span class="purple">2000</span>)')
      .continue('<br>  .continue(<span class="yellow">\' rules!\'</span>)')
      .emit('pause-2')
      .listen('pause-3')
      .back(-8, 10)
      .continue('<span class="yellow">\'Typer.js rulez!\'</span>)')
      .emit('pause-4');
  },
  emit: function() {
    this.resetPanes(demoHTML.emit);

    typer('.explanation .container')
      .line("We've covered all the <em>typing</em> methods of <span class='lime'>Typer</span>,")
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
      .line('Just pass in a CSS selector as the 2nd argument:')
      .emit('emit-3')
      .listen('emit-4')
      .pause(2000)
      .run(function() {
        typerDemo.next('listen');
      });

    typer('.example .container')
      .cursor({block: true, blink: 'hard'})
      .line()
      .listen('emit-1')
      .continue('  .emit(<span class="yellow">\'boom\'</span>)')
      .emit('emit-2')
      .listen('emit-3')
      .back(1, 10)
      .continue(', <span class="yellow">\'.anotherClass\'</span>)')
      .emit('emit-4');
  },
  listen: function() {
    const html = [
      demoHTML.emit,
      demoHTML.listen
    ].join('');

    this.resetPanes(html);

    typer('.explanation .container')
      .pause()
      .emit('listen-1')
      .listen('listen-2')
      .line('Now we move on to the <span class="lime">listen</span> method.')
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
      .line('waiting for that event to fire from the <span class="mono">&lt;<span class="pink">body</span>&gt;</span>.')
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
        typerDemo.next('empty');
      });

    typer('.example .container')
      .cursor({block: true, blink: 'hard'})
      .line(['  .emit(<span class="yellow">\'boom\'</span>, <span class="yellow">\'.anotherClass\'</span>)'])
      .listen('listen-1')
      .back(-3, 10)
      .continue('listen(<span class="yellow">\'boom\'</span>)')
      .emit('listen-2')
      .listen('listen-3')
      .back(1, 10)
      .continue(', <span class="yellow">\'.anotherClass\'</span>)')
      .emit('listen-4');
  },
  empty: function() {

    this.resetPanes(demoHTML.empty);

    typer('.explanation .container')
      .line('Now we come to the <span class="lime">empty</span> method.')
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
        typerDemo.next('run');
      });

    typer('.example .container')
      .cursor({block: true, blink: 'hard'})
      .line()
      .listen('empty-1')
      .continue('  .empty()')
      .emit('empty-2');
  },
  run: function() {
    const html = [
      demoHTML.empty,
      demoHTML.run
    ].join('');

    this.resetPanes(html);

    typer('.explanation .container')
      .line('Our last two methods have somewhat similar functionality.')
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
      .line('to change the background color of the parent element below.')
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
      .run(function() {
        typerDemo.next('end');
      });

    typer('.example .container')
      .cursor({block: true, blink: 'hard'})
      .line()
      .listen('run-1')
      .continue('  .run(<span class="aqua italic">function</span>() {')
      .continue('<br>    <span class="gray italic">// run some code</span>')
      .continue('<br>  })')
      .emit('run-2')
      .listen('run-3')
      .back(-16, 10)
      .continue('<span class="orange italic">el</span>) ' + '{')
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
        el.style.backgroundColor = 'transparent';
      })
      .emit('run-6');
  },
  end: function() {
    const html = [
      demoHTML.empty,
      demoHTML.run,
      demoHTML.end
    ].join('');

    this.resetPanes(html);

    typer('.explanation .container')
      .line('And now folks,')
      .pause(1000)
      .continue(' we conclude with our last and final method,')
      .pause(1000)
      .line('appropriately named for the conclusion of this saga...')
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
        const $fin = $('<div class="fin full-size absolute left top flex centered">');

        document.body.dispatchEvent(typerDemo.killTyper);

        $('.typer-panes, .progress').removeClass('show');
        views.currentView.ready = false;
        views.currentView.$el.append($fin);

        setTimeout(function() {
          typer('.fin', 150)
            .cursor({block: true, blink: 'hard'})
            .line()
            .run(function(el) {
              $(el).addClass('show');
            })
            .pause(2000)
            .continue('the .end()');
        }, 10);

      });

    typer('.example .container')
      .cursor({block: true, blink: 'hard'})
      .line()
      .listen('end-1')
      .continue('  .end();')
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
      .emit('end-8');
  }
};
