module.exports = {
  methodNames: [
    'cursor',
    'line',
    'continue',
    'military',
    'pause',
    'emit',
    'listen',
    'back',
    'empty',
    'run',
    'end',
    'halt',
    'resume',
    'repeat',
    'kill',
  ],
  wait: (time = 100) => new Promise(resolve => setTimeout(resolve, time)),
}
