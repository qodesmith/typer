const typer = require('../typer');

describe('Testing the `killTyper` feature', () => {
  function killTyper() {
    var kill = new Event('killTyper');
    document.body.dispatchEvent(kill);
  }

  test('`killTyper` should stop typer dead in its tracks', () => {
    const content = 'Here is a sentence that should take some time to type.';

    typer('body', 30).line(content);

    return new Promise(resolve => {
      setTimeout(resolve, 200);
    }).then(() => {
      killTyper();
      const text = document.body.textContent;

      expect(text).not.toBe(content);
      expect(text.length < content.length).toBe(true);
      expect(text.length > 1).toBe(true);
    });
  });
});
