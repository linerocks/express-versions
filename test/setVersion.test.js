'use strict'

const test = require('ava')
const { versionRequest } = require('../index')
const sinon = require('sinon')

test.beforeEach(t => {
  t.context.req = {}
})

test('we can manually set a specific version to be integer', t => {
  const versionNumber = 1
  const versionRequestSpy = sinon.spy(versionRequest, 'formatVersion')

  const middleware = versionRequest.setVersion(versionNumber)
  middleware(t.context.req, {}, () => {
    t.is(t.context.req.version, versionNumber + '.0.0')
    t.is(versionRequestSpy.called, true)
  })

  versionRequestSpy.restore()
})

test('we can manually set a specific version to be string', t => {
  const versionNumber = '1.0.0'

  const middleware = versionRequest.setVersion(versionNumber)
  middleware(t.context.req, {}, () => {
    t.is(versionNumber, t.context.req.version)
  })
})

test('we can manually set a specific version to be object', t => {
  const versionNumber = { myVersion: 'alpha' }

  const middleware = versionRequest.setVersion(versionNumber)
  middleware(t.context.req, {}, () => {
    t.is(JSON.stringify(versionNumber), t.context.req.version)
  })
})
