Node-COOD-API
=========

A Node library providing to access to the COOD API service.

## Installation
,,,
npm install node-cood-api --save
,,,

## Usage
,,,
var service = new Service({
		apiUrl: "http://coddr-v1-dev.coddr.biz:3000",
		webUrl: "http://coddr-v1-dev.coddr.biz:4000"
	});
,,,
# get an OAuth2 token for authotized access to the COOD API service
,,,
service.OAuth2.getToken({
        clientId: "f30013...",
        clientSecret: "f6578..."
    }).done(function(data, response) {
        var data = JSON.parse(data);
        console.log("access_token = " + data.access_token);
    });
,,,

# sign-in into the COOD Service
,,,
service.User.signIn({
        email: "kwangje2015@gmail.com",
		password: "Wnl!@#1231",
		device: {
		    key: 'c8:2a:99:99:99:99',           // MAC address
			token: '5576....',	                // Team Member's ID
			platform: 'desktop'					// Application Platform
		}
	}).done(function(data, response) {
	    var data = JSON.parse(data);
	    console.log("user's email => " + data.email);
	});
,,,

## Tests

npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.1.0 Initial release
