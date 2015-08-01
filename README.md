Node-COOD-API
=========

A Node library providing to access to the COOD service.

## Installation

npm install node-cood-api --save

## Usage

var api = require('node-cood-api');

# get OAuth2 token to authotized access to the COOD service
var token = api.getToken();

console.log('OAuth2 Token: ', token);

## Tests

npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.1.0 Initial release
