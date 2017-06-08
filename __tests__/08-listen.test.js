const typer = require('../typer');

describe('Testing the `.listen` API', () => {
  const eventName = 'nonsense';
  const event = new Event(eventName);
  const content = 'Hello world!';

  test('1 arg to `.listen` should listen to that event on the body', () => {
    // The 2nd `.listen` will carry over to the next test.
    typer('body', 1)
      .listen(eventName)
      .line([content])
      .listen(eventName)
      .line('this content should never be reached');

    return new Promise(resolve => {
      setTimeout(resolve, 100);
    }).then(() => {
      expect(document.body.textContent).toBe('');

      document.body.dispatchEvent(event);
      return new Promise(resolve => {
        setTimeout(resolve, 100);
      });
    }).then(() => {
      expect(document.body.textContent).toBe(content);
    });
  });

  test('2nd arg to `.listen` should listen to that event on that selector', () => {
    document.body.innerHTML = '<div id="test"></div>';
    const div = document.querySelector('#test');
    const num = 3;
    div.dispatchEvent(event);

    expect(div).toBeTruthy();
    expect(div.textContent).toBe('');
    expect(document.body.textContent).toBe('');

    typer('#test', 1)
      .listen(eventName, '#test')
      .line(content.repeat(num));

    return new Promise(resolve => {
      setTimeout(() => {
        div.dispatchEvent(event);
        setTimeout(resolve, 200);
      }, 100);
    }).then(() => expect(div.textContent).toBe(content.repeat(num)));
  });
});
