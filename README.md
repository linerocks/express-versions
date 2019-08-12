# express-versions

[![view on npm](http://img.shields.io/npm/v/express-versions.svg)](https://www.npmjs.org/package/express-versions)
[![view on npm](http://img.shields.io/npm/l/express-versions.svg)](https://www.npmjs.org/package/express-versions)
[![npm module downloads](http://img.shields.io/npm/dt/express-version-request.svg)](https://www.npmjs.org/package/express-versions)


## What is this?

This npm package provides an ExpressJS middleware that sets the request object with a `version` property by parsing a request HTTP header.  This is extension package from [express-version-route](https://www.npmjs.com/package/express-version-route) and [express-version-request](https://www.npmjs.com/package/express-version-request)

## Usage

Create a map where the key is the version of the supported controller, and the value is a regular ExpressJS route function signature.

```js
const {versionRouter} = require('express-versions')

const routesMap = new Map()
routesMap.set('1.0', (req, res, next) => {
  return res.status(200).json({'message': 'hello to you version 1.0'})
})
```

Then, on the route which you wish to version, call the `route` function of this module with the map you created:

```js
router.get('/test', versionRouter.route(routesMap))
```

If no route matches the version requested by a client then the next middleware in the chain will be called.
To set a route fallback incase no version matches set a 'default' key on the routes map, for example:

```js
routesMap.set('default', (req, res, next) => {
  return res.status(200).json({'message': 'hello to you, this is the default route'})
})
``` 

## How it works

### The Library

A requested version from the client must be available on the request object at `req.version`.
You are encouraged to use this module's twin: [express-version-request](https://github.com/lirantal/express-version-request) which is another simple ExpressJS middleware that populates `req.version` from the client's X-Api-Version header, Accept header or from a query string (such as 'api-version=1.0.0')

The key for the routes versions you define can be a non-semver format, for example: `1.0` or just `1`. Under the hood, `expression-version-route` uses the `semver` module to check if the version found on the request object at `req.version` matches the route. 

### Client-Server flow

1. An API client will send a request to your API endpoint with an HTTP header that specifies the requested version of the API to use: 
```bash
curl --header "X-Api-Version: 1.0.0" https://www.example.com/api/users
```

2. The `express-version-request` library will parse the `X-Api-Version` and sets ExpressJS's `req.version` property to 1.0.0.
3. The `express-version-route` library, when implemented like the usage example above will match the 1.0 route version because semver will match 1.0.0 to 1.0, and then reply with the JSON payload `{'message': 'hello to you version 1.0'}`.  


## Installation

```bash
npm install express-versions
```
## Tests

```bash
yarn test
```

Project linting:

```bash
yarn lint
```

## Coverage

```bash
yarn test:coverage
```

## On API Versioning...

An API versioning is a practice that enables services to evolve their APIs with new changes, signatures and the overall API contract without interrupting API consumers and forcing them to repeatedly make changes in order to keep in pace with changes to APIs.

Several methodologies exist to version your API:
* URL: A request specifies the version for the resource: `http://api.domain.com/api/v1/schools/3/students`
* Query String: A request specifies the resource in a query string: `http://api.domain.com/api/schools/3/students?api-version=1`
* Custom HTTP Header: A request to a resource `http://api.domain.com/api/schools/3/students` with a custom HTTP header set in the request `X-Api-Version: 1`
* MIME Type content negotiation: A request to a resource `http://api.domain.com/api/schools/3/students` with an `Accept` header that specifies the requested content and its version: `Accept: application/vnd.ecma.app-v2+json`

There is no strict rule on which methodology to follow and each has their own pros and cons. The RESTful approach is the semantic mime-type content negotiation, but a more pragmatic solution is the URL or custom HTTP header.

### Why API Versioning at all ?

Upgrading APIs with some breaking change would lead to breaking existing products, services or even your own frontend web application which is dependent on your API contract. By implementing API versioning you can ensure that changes you make to your underlying API endpoints are not affecting systems that consume them, and using a new version of an API is an opt-in on the consumer. [read more...](https://apigee.com/about/blog/technology/restful-api-design-tips-versioning)

## Alternative Node.js libraries

Several npm projects exist which provide similar API versioning capabilities to ExpressJS projects, and I have even contributed Pull Requests to some of them that provide fixes or extra functionality but unfortunately they all seem to be unmaintained, or buggy.

* https://github.com/Prasanna-sr/express-routes-versioning
* https://github.com/elliotttf/express-versioned-routes
* https://github.com/biowink/express-route-versioning

## Author

Tirtadwipa Manunggal <tirtadwipa.manunggal@gmail.com>