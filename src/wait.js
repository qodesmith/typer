const wait = (time = 100) => new Promise(resolve => setTimeout(resolve, time))

module.exports = wait
