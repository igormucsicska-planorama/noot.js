module.exports = {
  all: {
    tasks: ['say-hello', 'keep-alive', 'do-some-stuff', 'do-something-else'],
    mongo: { host: 'myhost.com', port: 28888, name: 'test' },
    isForAll: true
  },

  test: {
    tasks: ['say-hello', 'keep-alive', 'do-some-stuff', 'test-task'],
    mongo: { host: 'localhost', port: 27017 },
    isTest: true
  }

};