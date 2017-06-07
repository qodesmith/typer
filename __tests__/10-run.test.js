const typer = require('../typer');

describe('Testing the `.run` API', () => {
  test('Passing `.run` a fxn should run that function', () => {
    const func = jest.fn();

    typer('body').line().run(func);

    return new Promise(resolve => {
      setTimeout(resolve, 100);
    }).then(() => expect(func).toHaveBeenCalled());
  });

  test('The 1st argument to `.run` should be the parent element', () => {
    document.body.innerHTML = '';

    return new Promise(resolve => {
      typer('body').line().run(function(el) {
        resolve({el, num: arguments.length});
      });
    }).then((obj) => {
      expect(obj.el === document.body).toBe(true);
      expect(obj.num).toBe(1);
    });
  });
});
