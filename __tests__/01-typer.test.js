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
    expect(typer('#test')).toHaveProperty('cursor');
    expect(typer('#test')).toHaveProperty('line');
    expect(typer('#test')).toHaveProperty('back');
    expect(typer('#test')).toHaveProperty('continue');
    expect(typer('#test')).toHaveProperty('pause');
    expect(typer('#test')).toHaveProperty('emit');
    expect(typer('#test')).toHaveProperty('listen');
    expect(typer('#test')).toHaveProperty('run');
    expect(typer('#test')).toHaveProperty('end');
  });
});
