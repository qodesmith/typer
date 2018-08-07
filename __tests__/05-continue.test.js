const typer = require('../typer.min')
const wait = require('../src/wait')

describe('Testing the `.continue` API', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="test"></div>
      <div id="hidden">Hidden content!</div>
    `
  })

  function contents(value, time = 100) {
    return wait(time).then(() => {
      const el = document.querySelector('#test')
      expect(el.textContent).toBe(value)
    })
  }


  /////////////
  // STRINGS //
  /////////////

  test('[String] `.continue` should type provided contents on the screen', () => {
    typer('#test', 1).line().continue('Hello world!')
    return contents('Hello world!')
  })

  test('[String] `.continue` should type provided contents on the screen (with number speed)', () => {
    typer('#test').line().continue('Hello world!', 1)
    return contents('Hello world!')
  })

  test('[String] `.continue` should type provided contents on the screen (with obj speed)', () => {
    typer('#test').line().continue('Hello world!', { speed: 1 })
    return contents('Hello world!')
  })

  test('[String] `.continue` should type provided contents on the screen (with min/max speed)', () => {
    typer('#test').line().continue('Hello world!', { min: 1, max: 5 })
    return contents('Hello world!', 200)
  })

  test('[String] `.continue` should not be able to create a specified element', () => {
    typer('#test', 1).line().continue('Hello world!', { element: 'p' })

    return wait(100).then(() => {
      const el = document.querySelector('#test p')
      expect(el).toBeNull()
    })
  })


  ////////////
  // ARRAYS //
  ////////////

  test('[Array] `.continue` should type provided contents on the screen', () => {
    typer('#test', 1).line().continue(['Hello', ' world!'])
    return contents('Hello world!')
  })

  test('[Array] `.continue` should type provided contents on the screen (with number speed)', () => {
    typer('#test').line().continue(['Hello', ' world!'], 1)
    return contents('Hello world!')
  })

  test('[Array] `.continue` should type provided contents on the screen (with obj speed)', () => {
    typer('#test').line().continue(['Hello', ' world!'], { speed: 5 })
    return contents('Hello world!')
  })

  test('[Array] `.continue` should type provided contents on the screen (with min/max speed)', () => {
    typer('#test').line().continue(['Hello', ' world!'], { min: 1, max: 5 })
    return contents('Hello world!', 200)
  })

  test('[Array] `.continue` should not be able to create a specified element', () => {
    typer('#test', 1).line().continue(['Hello', ' world!'], { element: 'p' })

    return wait(100).then(() => {
      const el = document.querySelector('#test p')
      expect(el).toBeNull()
    })
  })


  ///////////
  // OTHER //
  ///////////

  test('Giving `.continue` a single object with container should type those contents', () => {
    typer('#test', 1).line().continue({ container: '#hidden' })

    return wait(100).then(() => {
      const el = document.querySelector('#test')
      const hidden = document.querySelector('#hidden').textContent
      expect(el.textContent).toBe(hidden)
    })
  })
})
