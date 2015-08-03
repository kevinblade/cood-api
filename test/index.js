'use strict';

var chai = require('chai'),
		chaiAsPromised = require('chai-as-promised'),
		API = require('../index').API;

chai.use(chaiAsPromised);
chai.should();

describe("#getToken", function() {
	it('OAuth2 getToken should be fulfilled', function(done) {
		var api = new API({
					url: "http://coddr-v1-dev.coddr.biz:3000",
					clientId: "f30013fd0985d0e8cb5a64b1b6e0e6075cf8b10811c8ee000fd7b62f3553c193",
					clientSecret: "f6578d5fb3e1ad28b9e23a85c24e9409ac570c0442f2255146be2e9a0cc2d3aa"
				}),
				promise = api.OAuth2.getToken();
		
		promise.should.be.fulfilled.then(function(data, response) {
			console.log("data.access_token => " + data.access_token);
			console.log("data.expires_in => " + data.expires_in);
			console.log("data.scope => " + data.scope);
		});

		promise.should.be.fulfilled.and.notify(done);
	});

	it('OAuth2 getToken should be rejected', function(done) {
		var api = new API({
					url: "http://coddr-v1-dev.coddr.biz:3000",
					clientId: "unknown",
					clientSecret: "unknown"
				}),
				promise = api.OAuth2.getToken();
		
		promise.should.be.rejected.then(function(err) {
			console.log("error  => " + JSON.stringify(err));
		});

		promise.should.be.rejected.and.notify(done);
	});
});
