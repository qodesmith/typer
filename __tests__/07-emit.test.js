const typer = require('../typer');

describe('Testing the `.emit` API', () => {
  const event = 'event';
  let eventFired;

  function callback() {
    eventFired = true;
  }

  beforeEach(() => {
    document.body.addEventListener(event, callback);
    eventFired = false;
  });
  afterEach(() => {
    document.body.removeEventListener(event, callback)
    eventFired = false;
  });

  test('1st arg to `.emit` should fire that event off the body', () => {
    typer('body').line().emit(event);

    return new Promise(resolve => {
      setTimeout(() => resolve(), 250);
    }).then(() => expect(eventFired).toBe(true));
  });
});