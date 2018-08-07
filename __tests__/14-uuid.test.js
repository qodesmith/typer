const typer = require('../typer.min')

describe('Testing the uuid of individual Typers', () => {
  beforeEach(() => document.body.innerHTML = '<div id="test1"></div><div id="test2"></div>')

  test('Each Typer instance should have a unique identifier', () => {
    typer('#test1', 1).line('test')
    typer('#test2', 1).line('test')

    const typers = document.querySelectorAll('[data-typer]')
    const length = typers.length
    const uuid1 = typers[0].getAttribute('data-typer')
    const uuid2 = typers[1].getAttribute('data-typer')

    expect(length).toBe(2)
    expect(uuid1).not.toBe(uuid2)
    expect(uuid1).toBeTruthy()
    expect(uuid2).toBeTruthy()
  })
})
