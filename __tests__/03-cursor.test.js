const typer = require('../typer.min')
const wait = require('../src/wait')
const promise = (time = 100) => wait(time).then(() => document.querySelector('.typer'))

describe('Testing the `.cursor` API', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="test"></div>'
    document.head.innerHTML = ''
  })

  // https://goo.gl/3c1a8h
  global.console = {
    warn: jest.fn()
  }

  test('Not calling `.cursor` should result in default settings', () => {
    typer('#test').line()

    return promise().then(el => {
      const classes = el.classList
      expect(classes.contains('cursor-soft')).toBe(true)
      expect(classes.contains('cursor-hard')).toBe(false)
      expect(classes.contains('cursor-block')).toBe(false)
    })
  })

  test('Passing `false` to `.cursor` should show no cursor', () => {
    typer('#test').line().cursor(false)

    return promise().then(el => {
      const classes = el.classList
      expect(classes.contains('no-cursor')).toBe(true)
      expect(classes.contains('cursor-soft')).toBe(false)
      expect(classes.contains('cursor-hard')).toBe(false)
      expect(classes.contains('cursor-block')).toBe(false)
    })
  })

  test('Passing a color to `.cursor` should color the cursor', () => {
    const color = 'blue'
    typer('#test').line().cursor({ color })

    return promise().then(el => {
      const num = el.getAttribute('data-typer-child')
      const sheets = document.styleSheets
      let found

      for (sheet of sheets) {
        if (sheet.cssRules) {
          for (rule of sheet.cssRules) {
            const selectorText = `[data-typer="${num}"] .typer::after`
            const selectorMatch = rule.selectorText === selectorText
            const colorMatch = rule.style['background-color'] === color

            if (selectorMatch && colorMatch) found = true
          }
        }
      }

      expect(found).toBe(true)
    })
  })

  test('Passing a color to `.cursor` should create a <style> tag', () => {
    typer('#test').line().cursor({ color: 'cornflowerblue' })

    return promise(50).then(() => {
      const styleTags = document.querySelectorAll('style')
      expect(styleTags.length).toBe(1)
    })
  })

  test('Declaring cursor block and hard blinking should have associated classes', () => {
    typer('#test').line().cursor({ block: true, blink: 'hard' })

    return promise().then(el => {
      const classes = el.classList
      expect(classes.contains('cursor-block')).toBe(true)
      expect(classes.contains('cursor-hard')).toBe(true)
      expect(classes.contains('cursor-soft')).toBe(false)
    })
  })

  test('Calling `.cursor` more than once should result in a console warning', () => {
    typer('#test').cursor().cursor()
    return promise().then(() => expect(global.console.warn).toHaveBeenCalled())
  })
})
