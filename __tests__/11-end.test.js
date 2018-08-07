const typer = require('../typer.min')
const promise = (time = 100) => new Promise(resolve => setTimeout(resolve, time))

describe('Testing the `.end` API', () => {
  beforeEach(() => document.body.innerHTML = '<div id="test"></div>')

  // https://goo.gl/3c1a8h
  global.console = {
    warn: jest.fn()
  }

  test('Should remove the <style> tag if a color was provided by `.cursor`', () => {
    typer('#test', 1)
      .cursor({ color: 'cornflowerblue' })
      .line('Yo!')
      .end()

    return promise()
      .then(() => {
        const num = document.querySelectorAll('style').length
        expect(num).toBe(0)
      })
  })

  test('Should remove the `data-typer` attribute from the parent element', () => {
    typer('#test').line().end()
    return promise().then(() => expect(document.querySelector('[data-typer]')).toBeNull())
  })

  test('Should remove the `.typer` class', () => {
    typer('#test').line().end()
    return promise().then(() => expect(document.querySelector('.typer')).toBeNull())
  })

  test('Should remove the `.cursor-block` class from the element it\'s typing in', () => {
    typer('#test').cursor({ block: true }).line().end()
    return promise().then(() => expect(document.querySelector('.cursor-block')).toBeNull())
  })

  test('Should remove the `.cursor-soft` class from the element it\'s typing in', () => {
    typer('#test').cursor({ blink: 'soft' }).line().end()
    return promise().then(() => expect(document.querySelector('.cursor-soft')).toBeNull())
  })

  test('Should remove the `.cursor-hard` class from the element it\'s typing in', () => {
    typer('#test').cursor({ blink: 'hard' }).line().end()
    return promise().then(() => expect(document.querySelector('.cursor-hard')).toBeNull())
  })

  test('Should remove the `.no-cursor` class from the element it\'s typing in', () => {
    typer('#test').cursor(false).line().end()
    return promise().then(() => expect(document.querySelector('.no-cursor')).toBeNull())
  })

  test('Should add the `.white-space` class to the element it\'s typing in', () => {
    typer('#test').line().end()
    return promise().then(() => expect(document.querySelector('.white-space')).toBeTruthy())
  })

  test(`Should run a function if it's the 1st argument`, () => {
    const func = jest.fn()

    typer('#test').line().end(func)
    return promise().then(() => expect(func).toHaveBeenCalled())
  })

  test(`Should run a function if it's the 2nd argument`, () => {
    const func = jest.fn()

    typer('#test').line().end(null, func)
    return promise().then(() => expect(func).toHaveBeenCalled())
  })

  test('Should dispatch `typerFinished` from the body if the 1st argument is `true`', () => {
    const func = jest.fn()
    document.body.addEventListener('typerFinished', func)

    typer('#test').line().end(true)
    return promise()
      .then(() => {
        document.body.removeEventListener('typerFinished', func)
        expect(func).toHaveBeenCalled()
      })
  })

  test('Should dispatch `typerFinished` from the body if the 2nd argument is `true`', () => {
    const func = jest.fn()
    document.body.addEventListener('typerFinished', func)

    typer('#test').line().end(null, true)
    return promise()
      .then(() => {
        document.body.removeEventListener('typerFinished', func)
        expect(func).toHaveBeenCalled()
      })
  })

  test('Calling any API method (except `.kill`) after `.end` should result in a console warning', () => {
    const t1 = typer('#test', 1).line().end()

    return promise().then(() => {
      t1.line()     // 1
      t1.cursor()   // 2
      t1.back()     // 3
      t1.continue() // 4
      t1.pause()    // 5
      t1.emit()     // 6
      t1.run()      // 7
      t1.end()      // 8
      t1.kill()     // 9 - the only one that should not cause a warning.
      expect(global.console.warn).toHaveBeenCalledTimes(8)
    })
  })
})
