# [Typer.js](http://aaroncordova.xyz/typer) &middot; [![npm version](https://badge.fury.io/js/typer-js.svg)](https://badge.fury.io/js/typer-js)

Typer.js is an easy to use, choc-full-of-options, robust automated typing library. There are a number of [methods](https://github.com/qodesmith/typer#methods) with various options for you to impress your friends, have a parade thrown in your name, and officially obtain "that guy" status ("that gal" for the ladies).

Typer.js has **no library dependencies** so just slap it on your page and go. We still love you, [jQuery](https://cdnjs.com/libraries/jquery/).

In short... Typer.js can type regular characters, [unicode](http://dev.w3.org/html5/html-author/charref) [characters](http://unicode-table.com/en/), whole words, half words, HTML elements, erase stuff, go fast, go slow, make new lines, fire events, listen to events, run functions, and make julienne fries in minutes.

<!-- Refresh cached version: https://goo.gl/9g8mes -->
[Live Demo / Tutorial](http://aaroncordova.xyz/typer)


#### Quick Links - API Methods

* [Cursor](https://github.com/qodesmith/typer#cursor)
* [Line](https://github.com/qodesmith/typer#line)
* [Back](https://github.com/qodesmith/typer#back)
* [Continue](https://github.com/qodesmith/typer#continue)
* [Pause](https://github.com/qodesmith/typer#pause)
* [Emit](https://github.com/qodesmith/typer#emit)
* [Listen](https://github.com/qodesmith/typer#listen)
* [Empty](https://github.com/qodesmith/typer#empty)
* [Run](https://github.com/qodesmith/typer#run)
* [End](https://github.com/qodesmith/typer#end)
* [Kill Switch](https://github.com/qodesmith/typer#kill-switch) (non-api feature)


## Installation

#### Manually

Simply include `typer.css` in the `<head>`...
```html
<head>
  ...
  <link rel="stylesheet" href="typer.css">
  <!-- Via Unpkg CDN -->
  <!-- <link rel="stylesheet" href="https://unpkg.com/typer-js/typer.css"> -->
</head>
```

and include `typer.js` just above your closing `</body>` tag...
```html
<body>
  ...
  <script src="typer.js"></script>
  <!-- Via Unpkg CDN -->
  <!-- <script src="https://unpkg.com/typer-js"></script> -->
</body>
```

#### Via NPM
From the CLI run:
`npm install typer-js`

Files & locations:

|     File     |          Location          |           Description               |
| ------------ | -------------------------- | --------------------------------    |
| typer.js     | node_modules/typer-js/     | our main file                       |
| typer.min.js | node_modules/typer-js/     | minified main file                  |
| typer-npm.js | node_modules/typer-js/     | imported via `require` in node      |
| typer.css    | node_modules/typer-js/     | stylesheet necessary for the cursor |
| typer.less   | node_modules/typer-js/less | less: use it for your own builds    |


## Usage

```javascript
typer(thing, speed)
```

The Typer function itself takes two arguments:

1. `thing` - this can be one of two options:
    * `string` - a valid CSS selector, such as `'.some-class'`, `'#some-id'`, or `'.a-class .in-a-class'`, for Typer to grab (with `document.querySelector`) and type in.
    * `element` - a single HTML element, such as `document.body` or `document.querySelector('div')`.
2. `speed` - a number (milliseconds) representing how fast each character should be typed out. If no number is given, Typer will default to 70.

Now you can begin calling Typer's various [methods](https://github.com/qodesmith/typer#methods) via simple & sexy dot-notation...

## Simple Code Examples

#### Type a single line:

```javascript
// Type in the body element.
typer('body')
  .line('Typer.js is awesome!');

// Same example with an HTML element.
typer(document.body)
  .line('Typer.js is awesome!');
```

#### Type a single line, correct mispelling with back:

```javascript
typer('.some-class')
  .line('This function roolz.')
  .back(5)
  .continue('ules!');
```

#### Type a list of frameworks with the help of pause & back:

```javascript
typer('#some-id')
  .line('Backbone')
  .pause(1000)
  .back('all')
  .continue('Angular')
  .pause(1000)
  .back('all')
  .continue('React!!');
```

#### Multi-line typing:

```javascript
let element = document.querySelector('.my-element');
typer(element)
  .line('How cool is this?')
  .line('So very cool.')
  .line('Agreed!');
```

* * *

# Methods

## CURSOR

```javascript
// Examples.
.cursor(false);
.cursor({block: true, blink: 'hard', color: 'red'});
```

The `.cursor` method takes a single argument: `false` _or_ `{an: object}`. You can specify the 3 options below within the object. `.cursor` can be omitted altogether which will result in the default styles mentioned below. Default options need not be given as they will take effect unless otherwise specified.

### No cursor

```javascript
.cursor(false);
```

### Options

#### block

```javascript
.cursor({block: true});
```

*   `false` - (default) The cursor will be a standard vertical line.
*   `true` - The cursor will be a block, inspired from older style terminals.

#### blink

```javascript
.cursor({blink: 'hard'});
```

*   `'soft'` - (default) Smooth blinking animation.
*   `'hard'` - Binary (on / off) blinking animation.

#### color

```javascript
// Examples.
.cursor({color: 'red'});
.cursor({color: '#ff0000'});
.cursor({color: 'rgb(255,0,0)'});
.cursor({color: 'rgba(255,0,0,0.7)'});
```

*   You can specify any css color you want via any method (i.e. name, rgb, hsla, etc.).
*   As a default, Typer will grab the color attribute of the parent element and use that for the cursor color to match the text with the cursor.

#### _all options at once_

```javascript
.cursor({block: true, blink: 'hard', color: 'red'});
```

* * *

## LINE

```javascript
// Examples.
.line('Typer.js is visual awesomeness!');
.line('Typer.js is visual <em>awesomeness!</em>', 100);
.line('Typer.js is visual <em>awesomeness!</em>', 100, 'p'); // <p> element created to type in.
.line(['Type. ', 'Whole. ', '<span style="color: red;">Words.</span>'], 200);
.line({el: '.some-class'}, 200, false); // Order of 2nd & 3rd arguments is irrelevant.
.line({el: '.some-class'}, false, 200, 'p'); // Order of 2nd & 3rd arguments is irrelevant.
.line() // Creates a blank line.
```

The `.line` method is the heart of Typer. As the name suggests, it types out a single line.
You can feed it a `'single string'`, an `['array', 'of', 'strings']`, or an object with a CSS selector as it's only (necessary) argument. `.line` can take an additional two arguments in any particular order. `.line` defaults to parsing HTML, so you must explicitly tell it not to with the option below.

### Arguments

* Argument 1:
  * `string` - The message you want typed out, character by character (normal typing).
  * `array` - The message you want typed out, phrase by phrase / word by word.
  * `object` - **SEO** in the house! If you give `.line` an object with a single key-value pair where the value is a CSS selector (`.some-class`, `#some-id`) _or_ an HTML element (`document.body`, `document.querySelector('div')`), Typer will grab that element and use its contents to type with. For obvious reasons, the element should be hidden (css - `display: none;`). This will allow your content to be indexed by search engines while still maintaining *JavaScript typing awesomeness*. All of the following are valid:
    * `{el: '#awesome'}`
    * `{whySoLong: '#awesome'}`
    * `{1: '#awesome'}`
    * `{el: document.body}`
    * `{el: document.querySelector('.some-class')}`
    * `{el: $('.some-class')[0]}` (using jQuery)
* Arguments 2 or 3:
  * `speed` - A number (milliseconds); Each line can optionally have its own typing speed. If no speed is given, it defaults to the number given to the `typer` function itself or Typer's internal default of 70.
  * `html` - `false`; specifies that the provided content is to be treated as non-html code. Characters will be typed out exactly as you provide them. The default is `true`.
* _Last_ (optional) argument:
  * `string` - (`div` default) The type of element you would like Typer to generate to type in. The almighty `<div>` is used as default. Regardless of how many arguments you use for `.line`, the last one will always indicate the type of element you'd like Typer to use.

_* TIP: If you supply no arguments, you will create a blank line._

#### HTML / Unicode

_Go nuts_. You can include `<div>`'s, `<span>`'s, elements with styles (i.e. `<span style="color: red;">I'm red!</span>`), `<em>`'s, `<strong>`'s, etc. You can also include [HTML void elements](http://www.w3.org/TR/html-markup/syntax.html#syntax-elements) (self-closing tags) such as `<br>`, `<img>`, and `<hr>`. If you're really feeling brave, start including `<textarea>`'s and `<input>`'s!.

Valid [unicode](http://dev.w3.org/html5/html-author/charref) [characters](http://unicode-table.com/en/) begin with `&` and end with `;`. Some examples:

| Character  | Code        | Character  | Code      | Character  | Code      |
| :--------: | ----------- | :--------: | --------- | :--------: | --------- |
| &#x1f407;  | `&#x1f407;` | &#8594;    | `&#8594;` | &#9742;    | `&#9742;` |
| &reg;      | `&reg;`     | &#8600;    | `&#8600;` | &#9834;    | `&#9834;` |
| &#188;     | `&#188;`    | &#8595;    | `&#8595;` | &#9829;    | `&#9829;` |

##### HTML / Unicode examples:

The following code...
```javascript
typer('body')
  .line('<em>How will I look?</em>')
  .line('<em>How will I look?</em>', false)
  .line('Cookies & milk')
  .line('Cookies &amp; milk')
  .line('Cookies &amp; milk', false)
  .line('The &#9992; flies &#8593; in the sky.');
```

will result in this output on the screen:
> *How will I look?* <br>
> &lt;em&gt;How will I look?&lt;/em&gt; <br>
> Cookies & milk <br>
> Cookies & milk <br>
> Cookies &amp;amp; milk <br>
> The &#9992; flies &#8593; in the sky.

* * *

## BACK

```javascript
.back(5, 1); // Lightning fast erasing!
.back(-5, 30);
.back('all');
.back('empty');
```

:back: Erase stuff!

### Arguments

The 1st argument is mandatory and has three options. The 2nd argument is optional. These arguments are order sensative.

1. Argument 1:
    * Number - number of characters to be erased / how many times you want to "hit" the "backspace button".
      * Positive #'s erase that many characters.
      * Negative #'s *keep* that many characters. For example, a value of -2 will erase *all but two* characters.
    * `'all'` - this will "backspace" the entire line, character by character, without you having to give a number. Useful for longer lines.
    * `'empty'` - this will empty the entire line at once.
2. Argument 2 - Number (milliseconds); the speed at which the backspace will perform. If no number is specified, it will default to the user-supplied Typer speed or Typer's internal default of 70.

* * *

## CONTINUE

```javascript
// Examples.
.continue("I'm on the same line!");
.continue(' Same line, emphasis on <em>sloooow</em>.', 500, false);
.continue({el: '.hidden-div'}, false, 500);
.continue({el: document.querySelector('.hidden-div')}, false, 500);
```

The `.continue` method works just like `.line` in that it accepts the same arguments but it *continues* typing on the same line, whereas `.line` creates new lines. In conjunction with the `.pause` and `.line` methods, you can create eloborate schemes. You can feed `.continue` the same content (HTML, unicode, etc.) as `.line`.

### Arguments

Same as those for `.line` ([above](https://github.com/qodesmith/typer#line)).

_*NOTE: unlike_ `.line`_, calling_ `.continue` _with no arguments will produce no effect._

* * *

## PAUSE

```javascript
// Examples.
.pause();
.pause(1000);
```

The `.pause` method takes a single argument, a number in milliseconds. Typer will wait that long before proceeding to the next called method. If no argument is provided, the default is 500.

* * *

## EMIT

```javascript
// Examples.
let element = document.querySelector('#some-id');
.emit('boom'); // Fires off the body.
.emit('boom', '.some-class'); // Fires off a specific element (string selector).
.emit('boom', element); // Fires off a specific element (element provided).
```

Emits an event on a specified DOM element or defaults to the `body`. This is useful for setting up complex automation scenarios where multiple Typer functions (or other functions on your page) are time-dependant on eachother. DOM event explosions causing mass automated awesomeness. What could be better?

### Arguments

1. Argument 1: `string` - the event name; Omitting a 2nd argument will default to the event firing from the `body`.
2. Argument 2: `string` _or_ `element` - (optional) target a DOM element that the event will be fired from. Provide a string CSS selector or an HTML element.

* * *

## LISTEN

```javascript
// Examples.
let element = document.querySelector('#some-id');
.listen('boom'); // Listens on the body.
.listen('boom', '.some-class'); // Listens on a specific element (string selector).
.listen('boom', element); // Listens on a specific element (element provided).
```

Typer has the ability (read: super-power) to listen for events as well. The `.listen` method will stop Typer in its tracks until the specified event is fired. Once fired, Typer will proceed from where it last left off. More automation goodness.

### Arguments

1. Argument 1: `string` - the event name; Omitting a 2nd argument will default to the listener listening from the `body`.
2. Argument 2: `string` _or_ `element` - (optional) target a DOM element that the listener will be placed on. Provide a string CSS selector or an HTML element.

_* NOTE: Typer uses **one-time event** listeners. Once the event is fired the listener is triggered and then immediately removed._

* * *

## EMPTY

```javascript
.empty();
```

The `.empty` method empties the parent element (specified as an argument to `typer`) and *starts over with a fresh line*.

The parent element could contain multiple lines and HTML elements, the likes of which cannot be undone with a simple `.back('all')`. Also, `.empty` will instantaneously empty the parent element as opposed to backspacing it into oblivion.

* * *

## RUN

```javascript
.run(function() { /* do stuff */ });
.run(function(el) { /* do stuff with access to parent element */ });
```

To round out our automation tools, the `.run` method will do just that: run a function before proceeding with any additional methods. Feed it a function and let it fly.

#### Access to the parent element
The `.run` method exposes the parent element that Typer is currently typing in through an argument in the function you pass to `.run` (`el` in the example above).

* * *

## END

```javascript
.end();
.end(function() { /* do stuff */ });
.end(function() { /* do stuff */ }, true);
.end(function(el) { /* do stuff with access to parent element */ }, true);
```

### Arguments

The `.end` method always removes the cursor, can optionally execute a callback function, and optionally fire off the `typerFinished` event. The event can be used to trigger other things in your application. These arguments are completely optional. The order of the arguments is not strict but the callback will always be executed before firing the `typerFinished` event.

*   callback - A function you want executed when `typer` is finished.
*   `true` - Indicates you want the `typerFinished` event fired once Typer is finished. This event is fired from `document.body`. The default (if left unspecified) is false.

#### Access to the parent element
As with the `.run` method above, `.end` exposes the parent element that Typer is currently typing in through an argument in the function you pass to to `.end`.

* * *
END OF METHODS
* * *

## Kill Switch

Typer's kill switch feature let's you annihilate a Typer function no matter *what* it's currently doing. This is particularly useful for single-page applications to prevent Typer from continuing in the background even after a view has been removed from the DOM. The kill switch will also remove any current listener Typer has on a DOM element.

### How to use:

This is an example function you can use to flip the kill switch:
``` javascript
function killTyper() {
  var kill = new Event('killTyper');
  document.body.dispatchEvent(kill);
}
```

To activate Typer's kill switch, a `killTyper` event must be dispatched from the `<body>`. That's it.

* * *

## Showcase

Have you done something cool with Typer.js? Have an awesome site / use-case you'd like to share? [Contact me!](mailto:theqodesmith@gmail.com) I'd love to show off your awesomeness with a link here.

* * *

## Feature Requests

> I think I thought of everything, but I thought wrong once, even though I think I'm right.

O.o
If you think of a feature you feel would be an awesome addition to Typer, raise an [issue](https://github.com/qodesmith/typer/issues) or create a [pull request](https://github.com/qodesmith/typer/pulls). I'm all ears.