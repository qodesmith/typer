const typer = require('../typer');

describe('Testing the `.continue` API', () => {
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

  test('[String] `.continue` should type provided contents on the screen', () => {
    typer('#test', 1).line().continue('Hello world!');
    return contents('Hello world!', 100);
  });

  test('[String] `.continue` should type provided contents on the screen (with number speed)', () => {
    typer('#test').line().continue('Hello world!', 1);
    return contents('Hello world!', 100);
  });

  test('[String] `.continue` should type provided contents on the screen (with obj speed)', () => {
    typer('#test').line().continue('Hello world!', {speed: 1});
    return contents('Hello world!', 100);
  });

  test('[String] `.continue` should type provided contents on the screen (with min/max speed)', () => {
    typer('#test').line().continue('Hello world!', {min: 1, max: 5});
    return contents('Hello world!', 100);
  });

  test('[String] `.continue` should not be able to create a specified element', () => {
    typer('#test', 1).line().continue('Hello world!', {element: 'p'});

    return new Promise(resolve => {
      setTimeout(() => resolve(document.querySelector('#test p')), 100);
    }).then(p => expect(p).toBeNull());
  });


  ////////////
  // ARRAYS //
  ////////////

  test('[Array] `.continue` should type provided contents on the screen', () => {
    typer('#test', 1).line().continue(['Hello', ' world!']);
    return contents('Hello world!', 100);
  });

  test('[Array] `.continue` should type provided contents on the screen (with number speed)', () => {
    typer('#test').line().continue(['Hello', ' world!'], 1);
    return contents('Hello world!', 100);
  });

  test('[Array] `.continue` should type provided contents on the screen (with obj speed)', () => {
    typer('#test').line().continue(['Hello', ' world!'], {speed: 5});
    return contents('Hello world!', 100);
  });

  test('[Array] `.continue` should type provided contents on the screen (with min/max speed)', () => {
    typer('#test').line().continue(['Hello', ' world!'], {min: 1, max: 5});
    return contents('Hello world!', 100);
  });

  test('[Array] `.continue` should not be able to create a specified element', () => {
    typer('#test', 1).line().continue(['Hello', ' world!'], {element: 'p'});

    return new Promise(resolve => {
      setTimeout(() => resolve(document.querySelector('#test p')), 100);
    }).then(p => expect(p).toBeNull());
  });


  ///////////
  // OTHER //
  ///////////

  test('Giving `.continue` a single object with container should type those contents', () => {
    typer('#test', 1).line().continue({container: '#hidden'});

    return new Promise(resolve => {
      const element = document.querySelector('#test');
      setTimeout(() => resolve(element), 100);
    }).then(el => {
      const hidden = document.querySelector('#hidden').textContent;
      expect(el.textContent).toBe(hidden);
    });
  });
});
