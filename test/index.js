'use strict';

var chai = require('chai'),
	chaiAsPromised = require('chai-as-promised'),
	Service = require('../index').Service,
	service = new Service({
		apiUrl: "http://coddr-v1-dev.coddr.biz:3000",
		webUrl: "http://coddr-v1-dev.coddr.biz:4000"
	});

chai.use(chaiAsPromised);
chai.should();

describe("OAuth2.getToken", function() {
	it('should be fulfilled', function(done) {
		var promise = service.OAuth2.getToken({
			clientId: "f30013fd0985d0e8cb5a64b1b6e0e6075cf8b10811c8ee000fd7b62f3553c193",
			clientSecret: "f6578d5fb3e1ad28b9e23a85c24e9409ac570c0442f2255146be2e9a0cc2d3aa"
		});
		
		promise.should.be.fulfilled.then(function(data, response) {
			console.log("oauth2.access_token => " + data.access_token);
			console.log("oauth2.expires_in => " + data.expires_in);
			console.log("oauth2.scope => " + data.scope);
		});

		promise.should.be.fulfilled.and.notify(done);
	});

	it('should be rejected', function(done) {
		var promise = service.OAuth2.getToken({
			clientId: "unknown",
			clientSecret: "unknown"
		});
		
		promise.should.be.rejected.then(function(err) {
			console.log("oauth2 getToken error => " + JSON.stringify(err));
		});

		promise.should.be.rejected.and.notify(done);
	});
});

describe("User.signIn", function() {
	it('should be fulfilled', function(done) {
		require('getmac').getMac(function(err, macAddress){
			if (err)  throw err;
			
			var promise = service.User.signIn({
				email: "kwangje2015@gmail.com",
				password: "1234!@#$",
				device: {
					key: macAddress,
					token: '5576d5db636f6441fa0001dd',	// member id
					platform: 'desktop'					// application platform
				}
			});
			
			promise.should.be.fulfilled.then(function(data, response) {
				console.log("user signIn success code => " + data.code);
			});
	
			promise.should.be.fulfilled.and.notify(done);
		});
	});

	it('should be rejected because of user is not found.', function(done) {
		require('getmac').getMac(function(err, macAddress){
			if (err)  throw err;
			
			var promise = service.User.signIn({
				email: "unknown@gmail.com",
				password: "1234!@#$",
				device: {
					key: macAddress,
					token: '5576d5db636f6441fa0001dd',	// member id
					platform: 'desktop'					// application platform
				}
			});
			
			promise.should.be.rejected.then(function(err) {
				console.log("user signIn user not found error code => " + err.code);
			});
	
			promise.should.be.rejected.and.eventually.deep.equal({
				success: false,
				code: 'session_err_0001',
				message: '',
				result_data: null}).notify(done);
		});
	});

	it('should be rejected because of user is not confirmed.', function(done) {
		require('getmac').getMac(function(err, macAddress){
			if (err)  throw err;
			
			var promise = service.User.signIn({
				email: "not.confirmed@mail.com",
				password: "abcd1234!@#$",
				device: {
					key: macAddress,
					token: '5576d5db636f6441fa0001dd',	// member id
					platform: 'desktop'					// application platform
				}
			});
			
			promise.should.be.rejected.then(function(err) {
				console.log("user signIn not confirmed error code => " + err.code);
			});
	
			promise.should.be.rejected.and.eventually.deep.equal({
				success: false,
				code: 'session_err_0002',
				message: '',
				result_data: null}).notify(done);
		});
	});

	it('should be rejected because of user is not confirmed.', function(done) {
		require('getmac').getMac(function(err, macAddress){
			if (err)  throw err;
			
			var promise = service.User.signIn({
				email: "unknown@gmail.com",
				password: "1234!@#$123",
				device: {
					key: macAddress,
					token: '5576d5db636f6441fa0001dd',	// member id
					platform: 'desktop'					// application platform
				}
			});
			
			promise.should.be.rejected.then(function(err) {
				console.log("user signIn password incorrect error code => " + err.code);
			});
	
			promise.should.be.rejected.and.eventually.deep.equal({
				success: false,
				code: 'session_err_0003',
				message: '',
				result_data: null}).notify(done);
		});
	});
});
