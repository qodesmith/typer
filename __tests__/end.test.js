const typer = require('../dist/typer.min')
const {wait, methodNames} = require('../src/testUtils')

describe('Testing the `.end` API', () => {
  beforeEach(() => (document.body.innerHTML = '<div id="test"></div>'))

  test('Should remove the <style> tag if a color was provided by `.cursor`', () => {
    typer('#test', 1).cursor({color: 'cornflowerblue'}).line('Yo!').end()

    return wait().then(() => {
      const num = document.querySelectorAll('style').length
      expect(num).toBe(0)
    })
  })

  test('Should remove the `data-typer` attribute from the parent element', () => {
    typer('#test').line().end()
    return wait().then(() =>
      expect(document.querySelector('[data-typer]')).toBeNull(),
    )
  })

  test('Should remove the `.typer` class', () => {
    typer('#test').line().end()
    return wait().then(() =>
      expect(document.querySelector('.typer')).toBeNull(),
    )
  })

  test("Should remove the `.cursor-block` class from the element it's typing in", () => {
    typer('#test').cursor({block: true}).line().end()
    return wait().then(() =>
      expect(document.querySelector('.cursor-block')).toBeNull(),
    )
  })

  test("Should remove the `.cursor-soft` class from the element it's typing in", () => {
    typer('#test').cursor({blink: 'soft'}).line().end()
    return wait().then(() =>
      expect(document.querySelector('.cursor-soft')).toBeNull(),
    )
  })

  test("Should remove the `.cursor-hard` class from the element it's typing in", () => {
    typer('#test').cursor({blink: 'hard'}).line().end()
    return wait().then(() =>
      expect(document.querySelector('.cursor-hard')).toBeNull(),
    )
  })

  test("Should remove the `.no-cursor` class from the element it's typing in", () => {
    typer('#test').cursor(false).line().end()
    return wait().then(() =>
      expect(document.querySelector('.no-cursor')).toBeNull(),
    )
  })

  test("Should add the `.white-space` class to the element it's typing in", () => {
    typer('#test').line().end()
    return wait().then(() =>
      expect(document.querySelector('.white-space')).toBeTruthy(),
    )
  })

  test(`Should run a function if it's the 1st argument`, () => {
    const func = jest.fn()

    typer('#test').line().end(func)
    return wait().then(() => expect(func).toHaveBeenCalled())
  })

  test(`Should run a function if it's the 2nd argument`, () => {
    const func = jest.fn()

    typer('#test').line().end(null, func)
    return wait().then(() => expect(func).toHaveBeenCalled())
  })

  test('Should dispatch `typerFinished` from the body if the 1st argument is `true`', () => {
    const func = jest.fn()
    document.body.addEventListener('typerFinished', func)

    typer('#test').line().end(true)
    return wait().then(() => {
      document.body.removeEventListener('typerFinished', func)
      expect(func).toHaveBeenCalled()
    })
  })

  test('Should dispatch `typerFinished` from the body if the 2nd argument is `true`', () => {
    const func = jest.fn()
    document.body.addEventListener('typerFinished', func)

    typer('#test').line().end(null, true)
    return wait().then(() => {
      document.body.removeEventListener('typerFinished', func)
      expect(func).toHaveBeenCalled()
    })
  })

  test('Should return a "nullified API" except for the `.kill` method', () => {
    const instance = typer('#test').line().end()

    return wait().then(() => {
      methodNames.forEach(method => {
        const methodResults = instance[method]()
        expect(methodResults).toBe(instance)
      })
    })
  })
})
