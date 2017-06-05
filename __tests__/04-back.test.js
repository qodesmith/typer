const typer = require('../typer');

describe('Testing the `.back` API', () => {
  beforeEach(() => document.body.innerHTML = '<div id="test"></div>');

  test('Passing `.back` no arguments should do nothing', () => {
    typer('#test', 1).line('Hello world!').back();

    return new Promise(resolve => {
      setTimeout(() => resolve(document.querySelector('#test')), 100);
    }).then(el => expect(el.textContent).toBe('Hello world!'));
  });

  test('Passing `.back` a (+) number should remove that many characters', () => {
    const content = 'Hello world!';
    const num = 6;

    typer('#test', 1).line(content).back(num);

    return new Promise(resolve => {
      setTimeout(() => resolve(document.querySelector('#test')), 100);
    }).then(el => expect(el.textContent).toBe(content.slice(0, -num)));
  });

  test('Passing `.back` a (-) number should remove all but that many characters', () => {
    const content = 'Hello world!';
    const num = 3;

    typer('#test', 1).line(content).back(-num);

    return new Promise(resolve => {
      setTimeout(() => resolve(document.querySelector('#test')), 100);
    }).then(el => expect(el.textContent).toBe(content.slice(0, num)));
  });

  test('Passing `.back` two number arguments should remove characters at a speed', () => {
    const content = 'Hello World!'.repeat(20);
    const num = 10;
    const speed = 50;

    typer('#test', 1).line(content).back(num, speed);

    return new Promise(resolve => {
      setTimeout(() => resolve(document.querySelector('#test')), 100);
    }).then(el => {
      expect(el.textContent).not.toBe(content.slice(0, -num));
      return new Promise(resolve => {
        setTimeout(() => resolve(el), 1000);
      });
    }).then(el => {
      expect(el.textContent).toBe(content.slice(0, -num));
    });
  });

  test('Passing "empty" to `.back` should empty the line', () => {
    typer('#test', 1).line('Hello world!').back('empty');

    return new Promise(resolve => {
      setTimeout(() => resolve(document.querySelector('#test')), 100);
    }).then(el => expect(el.textContent).toBe(''));
  });

  test('Passing "empty" to `.back` with a 2nd (+) # arg will erase that many chars instantly', () => {
    const content = 'Hello world!';
    const num = 6;
    typer('#test', 1).line(content).back('empty', num);

    return new Promise(resolve => {
      setTimeout(() => resolve(document.querySelector('#test')), 100);
    }).then(el => expect(el.textContent).toBe(content.slice(0, -num)));
  });

  test('Passing "empty" to `.back` with a 2nd (-) # arg will erase that many chars instantly', () => {
    const content = 'Hello world!';
    const num = 3;
    typer('#test', 1).line(content).back('empty', -num);

    return new Promise(resolve => {
      setTimeout(() => resolve(document.querySelector('#test')), 100);
    }).then(el => expect(el.textContent).toBe(content.slice(0, num)));
  });

  test('Passing "all" to `.back` should remove all characters', () => {
    typer('#test', 1).line('Hello World!').back('all');

    return new Promise(resolve => {
      setTimeout(() => resolve(document.querySelector('#test')), 100);
    }).then(el => expect(el.textContent).toBe(''));
  });

  test('Passing "all" to `.back` with 2nd # arg should remove all characters at speed', () => {
    const content = 'Hello World!'.repeat(3);
    typer('#test', 1).line(content).back('all', 20);

    return new Promise(resolve => {
      setTimeout(() => resolve(document.querySelector('#test')), 100);
    }).then(el => {
      expect(el.textContent).not.toBe('');

      return new Promise(resolve => {
        setTimeout(() => resolve(el), 800);
      });
    }).then(el => expect(el.textContent).toBe(''));
  });
});
