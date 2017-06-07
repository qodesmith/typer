const typer = require('../typer');

describe('Testing the `.emit` API', () => {
  const event = 'event';
  let eventFired = false;

  function callback() {
    eventFired = !eventFired;
  }

  test('1 arg to `.emit` should fire that event off the body', () => {
    // This will carry over to the next test.
    document.body.addEventListener(event, callback);
    typer('body').line().emit(event);

    return new Promise(resolve => {
      setTimeout(resolve, 250);
    }).then(() => {
      expect(eventFired).toBe(true);
      eventFired = false;
    });
  });

  test('2nd arg to `.emit` should fire that event off that selector', () => {
    document.body.innerHTML = '<div id="test"></div>';
    document.querySelector('#test').addEventListener(event, callback);

    // At this point there are 2 listeners on the page:
    // on the body and on the div. In this test, the body should not fire.

    typer('body').line().emit(event, '#test');

    return new Promise(resolve => {
      setTimeout(resolve, 250);
    }).then(() => expect(eventFired).toBe(true));
  });
});
