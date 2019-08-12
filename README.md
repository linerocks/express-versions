# express-versions

[![view on npm](http://img.shields.io/npm/v/express-versions.svg)](https://www.npmjs.org/package/express-versions)
[![view on npm](http://img.shields.io/npm/l/express-versions.svg)](https://www.npmjs.org/package/express-versions)
[![npm module downloads](http://img.shields.io/npm/dt/express-versions.svg)](https://www.npmjs.org/package/express-versions)
[![Build Status](https://travis-ci.com/linerocks/express-version-request.svg?branch=master)](https://travis-ci.com/linerocks/express-version-request)

## What is this?

This npm package provides an ExpressJS middleware that sets the request object with a `version` property.  This is an extension package from [express-version-route](https://www.npmjs.com/package/express-version-route) and [express-version-request](https://www.npmjs.com/package/express-version-request)

## Installation

```bash
npm install express-versions
```

## Tests

```bash
npm run test
```

## Usage
### API versioning based on URI

Example : 

```js
const express = require('express')
const {versionRouter, versionRequest} = require('express-versions')

const app = express()

app.use(versionRequest.setVersionByURI())

const routesMap = new Map()

routesMap.set('1.0.0', (req, res, next) => {
  return res.status(200).json({'message': 'hello to you from version 1.0.0'})
})

routesMap.set('2.0.0', (req, res, next) => {
  return res.status(200).json({'message': 'hello to you from version 2.0.0'})
})


routesMap.set('default', (req, res, next) => {
  return res.status(200).json({'message': 'hello to you from default version'})
})

app.get('/test/:version', versionRouter.route(routesMap))


app.listen(5000, () => console.log('Listening on port 5000'))
``` 

and testing curl:
```curl
curl 0.0.0.0:5000/test/v2.0.0
```

### API versioning based on Query String

You need to add `api-version` and the desired version when sending request on the query string.


Example : 

```js
const express = require('express')
const {versionRouter, versionRequest} = require('express-versions')

const app = express()

app.use(versionRequest.setVersionByQueryParam())

const routesMap = new Map()

routesMap.set('1.0.0', (req, res, next) => {
  return res.status(200).json({'message': 'hello to you from version 1.0.0'})
})

routesMap.set('2.0.0', (req, res, next) => {
  return res.status(200).json({'message': 'hello to you from version 2.0.0'})
})

routesMap.set('default', (req, res, next) => {
  return res.status(200).json({'message': 'hello to you from default version'})
})

app.get('/test', versionRouter.route(routesMap))


app.listen(5000, () => console.log('Listening on port 5000'))
``` 

and testing curl:
```curl
curl 0.0.0.0:5000/test?api-version=2.0.0
```

### API versioning based on Header

You need to add `x-version-api` and the desired version in the header when sending request.

Example : 

```js
const express = require('express')
const {versionRouter, versionRequest} = require('express-versions')

const app = express()

app.use(versionRequest.setVersionByHeader())

const routesMap = new Map()

routesMap.set('1.0.0', (req, res, next) => {
  return res.status(200).json({'message': 'hello to you from version 1.0.0'})
})

routesMap.set('2.0.0', (req, res, next) => {
  return res.status(200).json({'message': 'hello to you from version 2.0.0'})
})


routesMap.set('default', (req, res, next) => {
  return res.status(200).json({'message': 'hello to you from default version'})
})

app.get('/test', versionRouter.route(routesMap))


app.listen(5000, () => console.log('Listening on port 5000'))

``` 

and testing curl:
```curl
curl --header "x-api-version: 2.0.0"  0.0.0.0:5000/test
```

## How it works : Client-Server flow

1. An API client will send a request to your API endpoint. Depends on the schema you defining the version, either using URI, header, or query string; your request are required to specify certain version. The common methods are either : 

```bash
curl https://www.example.com/api/v1.0.0/users

curl --header "x-api-version: 1.0.0" https://www.example.com/api/users

curl https://www.example.com/api/users?v=1.0.0
```

2. The `express-versions` library will parse the api version and sets ExpressJS's `req.version` property to 1.0.0.

3. The `express-version` library, when implemented like the usage example above will match the 1.0 route version because semver will match 1.0.0 to 1.0, and then reply with the JSON payload `{'message': 'hello to you version 1.0.0'}`.  

## [How to Version](https://restfulapi.net/versioning/)

REST doesn’t provide for any specific versioning guidelines but the more commonly used approaches fall into three categories:

- **URI Versioning** : 
  Using the URI is the most straightforward approach (and most commonly used as well) though it does violate the principle that a URI should refer to a unique resource. You are also guaranteed to break client integration when a version is updated. For example : `http://api.example.com/v1` or `http://apiv1.example.com` . The version need not be numeric, nor specified using the “v[x]” syntax. Alternatives include dates, project names, seasons or other identifiers that are meaningful enough to the team producing the APIs and flexible enough to change as the versions change.

- **Versioning using Custom Request Header** : A custom header (e.g. Accept-version) allows you to preserve your URIs between versions though it is effectively a duplicate of the content negotiation behavior implemented by the existing Accept header. For instance : `x-accept-version: v1` or `x-version-api: 2.0.0`

- **Query String Versioning** : An extension to URI noted by question mark `?` allow you to add variables in to complete URI. For example : `http://api.example.com?version=1.0.0` or `http://abc.com/user?id=U2hfg49823d&v=2.0.0`

## Why API Versioning at all ?

Upgrading APIs with some breaking change would lead to breaking existing products, services or even your own frontend web application which is dependent on your API contract. By implementing API versioning you can ensure that changes you make to your underlying API endpoints are not affecting systems that consume them, and using a new version of an API is an opt-in on the consumer. [read more...](https://apigee.com/about/blog/technology/restful-api-design-tips-versioning)

## Author

Tirtadwipa Manunggal <tirtadwipa.manunggal@gmail.com>
