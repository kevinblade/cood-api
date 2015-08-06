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

		promise.should.be.rejected.and.eventually.have.property('error').notify(done);
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
	
			promise.should.be.fulfilled.and.eventually.include({
				success: true,
				code: 'session_succ_0001'
			}).notify(done);
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
	
			promise.should.be.rejected.and.eventually.include({
				success: false,
				code: 'session_err_0001'
			}).notify(done);
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
	
			promise.should.be.rejected.and.eventually.include({
				success: false,
				code: 'session_err_0002'
			}).notify(done);
		});
	});

	it('should be rejected because of user password is not correct.', function(done) {
		require('getmac').getMac(function(err, macAddress){
			if (err)  throw err;
			
			var promise = service.User.signIn({
				email: "kwangje2015@gmail.com",
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
	
			promise.should.be.rejected.and.eventually.include({
				success: false,
				code: 'session_err_0003'
			}).notify(done);
		});
	});
});

describe("User.checkExistEmail", function() {
	it('should be fulfilled', function(done) {
		var promise = service.User.checkExistEmail({
			email: "kwangje2015@gmail.com"
		});
		
		promise.should.be.fulfilled.then(function(data, response) {
			console.log("user checkExistEmail success code => " + data.code);
		});

		promise.should.be.fulfilled.and.eventually.include({
			success: true,
			code: 'user_succ_0006'
		}).notify(done);
	});

	it('should be rejected because of user is not found.', function(done) {
		var promise = service.User.checkExistEmail({
			email: "unknown@gmail.com"
		});
		
		promise.should.be.rejected.then(function(err) {
			console.log("user checkExistEmail user not found error code => " + err.code);
		});

		promise.should.be.rejected.and.eventually.include({
			success: false,
			code: 'user_err_0001'
		}).notify(done);
	});
});

describe("User.checkExistNickname", function() {
	it('should be fulfilled', function(done) {
		var promise = service.User.checkExistNickname({
			nickname: "케빈2"
		});
		
		promise.should.be.fulfilled.then(function(data, response) {
			console.log("user checkExistNickname success code => " + data.code);
		});

		promise.should.be.fulfilled.and.eventually.include({
			success: true,
			code: 'user_succ_0007'
		}).notify(done);
	});

	it('should be rejected because of user is not found.', function(done) {
		var promise = service.User.checkExistNickname({
			nickname: "unknown"
		});
		
		promise.should.be.rejected.then(function(err) {
			console.log("user checkExistNickname user not found error code => " + err.code);
		});

		promise.should.be.rejected.and.eventually.include({
			success: false,
			code: 'user_err_0002'
		}).notify(done);
	});
});

describe("User.findUserByID", function() {
	it('should be fulfilled', function(done) {
		var promise = service.User.findUserByID({
			user_id: "556b1053636f6477fc010000"
		});
		
		promise.should.be.fulfilled.then(function(data, response) {
			console.log("User findUserByID success code => " + data.code);
		});
		
		promise.should.be.fulfilled.and.eventually.include({
			success: true,
			code: 'user_succ_0010'
		}).notify(done);
	});
	
	it('should be rejected because of illegal id.', function(done) {
		var promise = service.User.findUserByID({
			user_id: ""
		});
		
		promise.should.be.rejected.then(function(data, response) {
			console.log("User findUserByID success code => " + data.code);
		});
		
		promise.should.be.rejected.and.eventually.include({
			success: false,
			code: 'user_err_0007'
		}).notify(done);
	});
});