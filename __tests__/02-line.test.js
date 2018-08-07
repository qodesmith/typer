const typer = require('../typer.min')
const wait = require('../src/wait')

describe('Testing the `.line` API', () => {
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

  test('[String] `.line` should type provided contents on the screen', () => {
    typer('#test', 1).line('Hello world!')
    return contents('Hello world!')
  })

  test('[String] `.line` should type provided contents on the screen (with number speed)', () => {
    typer('#test').line('Hello world!', 1)
    return contents('Hello world!')
  })

  test('[String] `.line` should type provided contents on the screen (with obj speed)', () => {
    typer('#test').line('Hello world!', { speed: 1 })
    return contents('Hello world!')
  })

  test('[String] `.line` should type provided contents on the screen (with min/max speed)', () => {
    typer('#test').line('Hello world!', { min: 1, max: 5 })
    return contents('Hello world!', 200)
  })

  test('[String] `.line` should type provided contents on the screen in specified element', () => {
    typer('#test', 1).line('Hello world!', { element: 'p' })

    return wait(100).then(() => {
      const el = document.querySelector('#test p')
      expect(el.nodeName).toBe('P')
      expect(el.parentElement.children.length).toBe(1)
    })
  })


  ////////////
  // ARRAYS //
  ////////////

  test('[Array] `.line` should type provided contents on the screen', () => {
    typer('#test', 1).line(['Hello', ' world!'])
    return contents('Hello world!')
  })

  test('[Array] `.line` should type provided contents on the screen (with number speed)', () => {
    typer('#test').line(['Hello', ' world!'], 1)
    return contents('Hello world!')
  })

  test('[Array] `.line` should type provided contents on the screen (with obj speed)', () => {
    typer('#test').line(['Hello', ' world!'], { speed: 5 })
    return contents('Hello world!')
  })

  test('[Array] `.line` should type provided contents on the screen (with min/max speed)', () => {
    typer('#test').line(['Hello', ' world!'], { min: 1, max: 5 })
    return contents('Hello world!', 200)
  })

  test('[Array] `.line` should type provided contents on the screen in specified element', () => {
    typer('#test', 1).line(['Hello', ' world!'], { element: 'p' })

    return wait(100).then(() => {
      const el = document.querySelector('#test p')
      expect(el.nodeName).toBe('P')
      expect(el.parentElement.children.length).toBe(1)
    })
  })


  ///////////
  // OTHER //
  ///////////

  test('Giving `.line` no arguments should create an empty div', () => {
    typer('#test', 1).line()

    return wait(100).then(() => {
      const el = document.querySelector('#test')
      expect(el.children.length).toBe(1)
      expect(el.children[0].nodeName).toBe('DIV')
      expect(el.children[0].textContent).toBe('')
    })
  })

  test('Giving `.line` a single object with container should type those contents', () => {
    typer('#test', 1).line({ container: '#hidden' })

    return wait(100).then(() => {
      const el = document.querySelector('#test')
      const hiddenText = document.querySelector('#hidden').textContent
      expect(el.textContent).toBe(hiddenText)
    })
  })

  test('`.line` should add the `.typer` class to the element it\'s typing in', () => {
    typer('#test', 1).line()

    return wait(100).then(() => {
      const test = document.querySelector('#test .typer')
      expect(test).toBeTruthy()
    })
  })

  test('`.line` should add the `data-typer-child` attribute to the element it\'s typing in', () => {
    typer('#test', 1).line()

    return wait(100).then(() => {
      const test = document.querySelector('#test [data-typer-child]')
      expect(test).toBeTruthy()
    })
  })
})
