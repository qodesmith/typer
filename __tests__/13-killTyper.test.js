const typer = require('../typer.min')
const wait = require('../src/wait')
const content = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint fuga ad dolorum numquam placeat corporis omnis temporibus ab eius iure molestiae, dolore dignissimos. Distinctio vero ducimus odio numquam esse assumenda?'

describe('Testing the `killTyper` feature', () => {
  beforeEach(() => document.body.innerHTML = `
    <div id="test1"></div>
    <div id="test2"></div>
    <div id="test3"></div>
    <div id="test4"></div>
  `)

  function killTyper() {
    var kill = new Event('killTyper')
    document.body.dispatchEvent(kill)
  }

  test('`killTyper` should stop a single Typer dead in its tracks', () => {
    typer('#test1', 1).line(content)

    return wait(100)
      .then(() => killTyper())
      .then(() => wait(100))
      .then(() => {
        const text = document.querySelector('#test1').textContent

        expect(text).not.toBe(content)
        expect(content.includes(text))
        expect(text.length < content.length).toBe(true)
        expect(text.length > 1).toBe(true)
      })
  })

  test('`killTyper` should stop multiple Typers dead in their tracks', () => {
    typer('#test1', 1).line(content)
    typer('#test2', 1).line(content)
    typer('#test3', 1).line(content)
    typer('#test4', 1).line(content)

    return wait(100)
      .then(() => killTyper())
      .then(() => wait(100))
      .then(() => {
        const text1 = document.querySelector('#test1').textContent
        const text2 = document.querySelector('#test2').textContent
        const text3 = document.querySelector('#test3').textContent
        const text4 = document.querySelector('#test4').textContent

        expect(text1).not.toBe(content)
        expect(content.includes(text1))
        expect(text1.length < content.length).toBe(true)
        expect(text1.length > 1).toBe(true)

        expect(text2).not.toBe(content)
        expect(content.includes(text2))
        expect(text2.length < content.length).toBe(true)
        expect(text2.length > 1).toBe(true)

        expect(text3).not.toBe(content)
        expect(content.includes(text3))
        expect(text3.length < content.length).toBe(true)
        expect(text3.length > 1).toBe(true)

        expect(text4).not.toBe(content)
        expect(content.includes(text4))
        expect(text4.length < content.length).toBe(true)
        expect(text4.length > 1).toBe(true)
      })
  })
})
