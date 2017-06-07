const typer = require('../typer');

describe('Testing the `.end` API', () => {
  let funcRun = 0
  let func2Run = 0;
  let funcArgs = [];

  function func() {
    funcArgs.push(Array.from(arguments));
    funcRun++;
  }

  function func2() {
    func2Run++;
  }

  document.body.addEventListener('typerFinished', func2);
  document.body.innerHTML = `
    <div id="test1"></div>
    <div id="test2"></div>
    <div id="test3"></div>
    <div id="test4"></div>
    <div id="test5"></div>
  `;

  typer('#test1').line().end();
  typer('#test2').line().end(func);
  typer('#test3').line().end(false, func);
  typer('#test4').line().end(func, true);
  typer('#test5').line().end(true, func);

  test('Should run a function regardless if its the 1st or 2nd arg', () => {
    return new Promise(resolve => {
      setTimeout(resolve, 100);
    }).then(() => {
      const check = !!funcArgs.length && funcArgs.every((arr, i) => {
        return arr.length === 1
          && arr[0] === document.querySelector(`#test${i + 1}`);
      });
      expect(funcRun).toBe(4);
      expect(check).toBe(false);
      expect(func2Run).toBe(2);
      expect(document.querySelectorAll('.typer').length).toBe(0);
      expect(document.querySelectorAll('.cursor-soft').length).toBe(0);
    });
  });
});
