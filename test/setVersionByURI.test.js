'use strict'

const test = require('ava')
const { versionRequest } = require('../index')

test.beforeEach(t => {
  t.context.req = {
    headers: {}
  }
})

test('we can set the version using the uri default regex', t => {
  const versionNumber = '1.0.0'

  t.context.req.originalUrl = 'localhost/v' + versionNumber
  const middleware = versionRequest.setVersionByURI()

  middleware(t.context.req, {}, () => {
    t.deepEqual(t.context.req.version, versionNumber)
  })
})
