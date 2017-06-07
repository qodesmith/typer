const typer = require('../typer');

describe('Testing the `.empty` API', () => {
  test('`.empty` should empty the container starting fresh with a single div', () => {
    document.body.innerHTML = '<div id="test"></div>';

    //                  1      2      3      4      5
    typer('#test', 1).line().line().line().line().line();

    return new Promise(resolve => {
      setTimeout(resolve, 100);
    }).then(() => {
      let lines = document.querySelectorAll('[data-typer-child]');
      expect(lines.length).toBe(5);

      document.body.innerHTML = '<div id="test"></div>';

      //                  1      2      3      4      5
      typer('#test', 1).line().line().line().line().line().empty();

      return new Promise(resolve => setTimeout(resolve, 100));
    }).then(() => {
      let lines = document.querySelectorAll('[data-typer-child]');
      expect(lines.length).toBe(1);
    });
  });
});
