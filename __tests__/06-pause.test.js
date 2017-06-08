const typer = require('../typer');

describe('Testing the `.pause` API', () => {
  test('Passing `.pause` no arguments to should wait 500ms', () => {
    const content = 'Hello world!';
    typer('body').line([content]).pause().empty();

    return new Promise(resolve => {
      setTimeout(resolve, 250);
    }).then(() => {
      expect(document.body.textContent).toBe(content);

      return new Promise(resolve => {
        setTimeout(resolve, 350);
      })
    }).then(() => {
      expect(document.body.textContent).toBe('');
    });
  });

  test('Passing `.pause` 1000 should wait 1 second', () => {
    const content = 'Hello world!';
    typer('body').line([content]).pause(1000).empty();

    return new Promise(resolve => {
      setTimeout(resolve, 250);
    }).then(() => {
      expect(document.body.textContent).toBe(content);

      return new Promise(resolve => {
        setTimeout(resolve, 850);
      })
    }).then(() => {
      expect(document.body.textContent).toBe('');
    });
  });
});
