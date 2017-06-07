const typer = require('../typer');

describe(`Testing Typer itself (not the api)`, () => {
  beforeEach(() => document.body.innerHTML = '<div id="test"></div>');

  function testTyper(selector, options) {
    return function() {
      return typer(selector, options);
    }
  }

  test('Typer should throw when given a bad selector', () => {
    expect(testTyper()).toThrow();
    expect(testTyper(5)).toThrow();
    expect(testTyper('#not-on-page')).toThrow();
  });

  test("Typer should throw when the options don't have `min` and `max` together", () => {
    expect(testTyper('#test', {min: 5})).toThrow();
    expect(testTyper('#test', {max: 5})).toThrow();
  });

  test('Typer should return an API object when given proper arguments', () => {
    const obj = typer('#test');
    expect(obj).toHaveProperty('cursor');
    expect(obj).toHaveProperty('line');
    expect(obj).toHaveProperty('back');
    expect(obj).toHaveProperty('continue');
    expect(obj).toHaveProperty('pause');
    expect(obj).toHaveProperty('emit');
    expect(obj).toHaveProperty('listen');
    expect(obj).toHaveProperty('run');
    expect(obj).toHaveProperty('end');
  });
});
