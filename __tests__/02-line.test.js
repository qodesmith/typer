const typer = require('../typer');

describe('Testing the `.line` API', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test"></div>
      <div id="hidden">Hidden content!</div>
    `;
  });

  function contents(value, wait) {
    return new Promise(resolve => {
      const element = document.querySelector('#test');
      setTimeout(() => resolve(element.textContent), wait);
    }).then(content => expect(content).toBe(value));
  }


  /////////////
  // STRINGS //
  /////////////

  test('[String] `.line` should type provided contents on the screen', () => {
    typer('#test', 1).line('Hello world!');
    return contents('Hello world!', 100);
  });

  test('[String] `.line` should type provided contents on the screen (with number speed)', () => {
    typer('#test').line('Hello world!', 1);
    return contents('Hello world!', 100);
  });

  test('[String] `.line` should type provided contents on the screen (with obj speed)', () => {
    typer('#test').line('Hello world!', {speed: 1});
    return contents('Hello world!', 100);
  });

  test('[String] `.line` should type provided contents on the screen (with min/max speed)', () => {
    typer('#test').line('Hello world!', {min: 1, max: 5});
    return contents('Hello world!', 100);
  });

  test('[String] `.line` should type provided contents on the screen in specified element', () => {
    typer('#test', 1).line('Hello world!', {element: 'p'});

    return new Promise(resolve => {
      setTimeout(() => resolve(document.querySelector('#test p')), 100);
    }).then(p => {
      expect(p.nodeName).toBe('P');
      expect(document.querySelector('#test').children.length).toBe(1);
    });
  });


  ////////////
  // ARRAYS //
  ////////////

  test('[Array] `.line` should type provided contents on the screen', () => {
    typer('#test', 1).line(['Hello', ' world!']);
    return contents('Hello world!', 100);
  });

  test('[Array] `.line` should type provided contents on the screen (with number speed)', () => {
    typer('#test').line(['Hello', ' world!'], 1);
    return contents('Hello world!', 100);
  });

  test('[Array] `.line` should type provided contents on the screen (with obj speed)', () => {
    typer('#test').line(['Hello', ' world!'], {speed: 5});
    return contents('Hello world!', 100);
  });

  test('[Array] `.line` should type provided contents on the screen (with min/max speed)', () => {
    typer('#test').line(['Hello', ' world!'], {min: 1, max: 5});
    return contents('Hello world!', 100);
  });

  test('[Array] `.line` should type provided contents on the screen in specified element', () => {
    typer('#test', 1).line(['Hello', ' world!'], {element: 'p'});

    return new Promise(resolve => {
      setTimeout(() => resolve(document.querySelector('#test p')), 100);
    }).then(p => {
      expect(p.nodeName).toBe('P');
      expect(document.querySelector('#test').children.length).toBe(1);
    });
  });


  ///////////
  // OTHER //
  ///////////

  test('Giving `.line` no arguments should create an empty div', () => {
    typer('#test', 1).line();

    return new Promise(resolve => {
      const element = document.querySelector('#test');
      setTimeout(() => resolve(element), 100);
    }).then(el => {
      expect(el.children.length).toBe(1);
      expect(el.children[0].nodeName).toBe('DIV');
    });
  });

  test('Giving `.line` a single object with container should type those contents', () => {
    typer('#test', 1).line({container: '#hidden'});

    return new Promise(resolve => {
      const element = document.querySelector('#test');
      setTimeout(() => resolve(element), 100);
    }).then(el => {
      const hidden = document.querySelector('#hidden').textContent;
      expect(el.textContent).toBe(hidden);
    });
  });
});
