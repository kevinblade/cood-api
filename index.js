'use strict';

var	Client = require('node-rest-client').Client,
	deferred = require('deferred'),
	client = new Client();

module.exports = {
	Service: function(apiOpts) {
		var Service = {
			// ----------------------------------------------------------
			// OAuth2 singleton object
			// ----------------------------------------------------------
			OAuth2: {
				accessToken: '',
				expiresIn: '',
				scope: '',
				
				// get new OAuth2 token from COOD service.
				// new token is going to be used to request of other services.
				getToken: function(opts) {
					var self = this,	// this is OAuth2
						args = {
							data: {
								grant_type: "client_credentials",
								client_id: opts.clientId,
								client_secret: opts.clientSecret
							},
							headers:{
								"Content-Type": "application/json; charset=utf-8"
							} 
						}; // args

					var df = deferred();

					client.post(apiOpts.apiUrl + '/oauth/token', args,
							function(data, response) {
								data = JSON.parse(data);

								if (data.error) {
									df.reject(data);
								} else {
									// We need closure to access variables in OAuth2 object
									self.accessToken = data.access_token;
									self.expiresIn = data.expires_in;
									self.scope = data.scope;
									
									df.resolve(data, response);
								}
							}); // client.post

					client.on('error',
							function(err) {
								// console.log("알수없는 에러발생: " + err.request.apiOpts);
								df.reject(err);
							}); // client.on('error')

					return df.promise;
				} // getToken()
			}, // OAuth2

			// ----------------------------------------------------------
			// User singleton object
			// ----------------------------------------------------------
			User: {
				signUp: function(opts) {
					var self = this,	// this is User
						args = {
							data: JSON.stringify({
								user: {
									email: opts.email,
									firstname: opts.firstname,
									lastname: opts.lastname,
									nickname: opts.nickname,
									password: opts.password,
									password_confirmation: opts.passwordConfirmation,
									deivce: opts.device,
									invite_id: opts.invite_id || ''
								}
							}),
							type: "text",
							xhrFields: {
								withCredentials: true
							},
							headers:{
								"Content-Type": "application/json; charset=utf-8",
								'Authorization': 'Bearer ' + Service.OAuth2.accessToken,
	                			'Accept': 'application/vnd.coddr.v1'
	            			}
						}; // args

					var df = deferred();

					client.post(apiOpts.webUrl + '/users.json', args,
							function(data, response) {
								data = JSON.parse(data);

								if (data.success) {
									df.resolve(data);
								} else {
									df.reject(data);
								}
							}); // client.post()

					client.on('error',
							function(err) {
								df.reject(err);
							}); // client.on('error')

					return df.promise;
				}, // signUp()
				
				signIn: function(opts) {
					var self = this,
						args = {
							data: JSON.stringify({
								api_user: {
									email: opts.email,
									password: opts.password,
									device: opts.device
								}
							}),
							type: "text",
							xhrFields: {
								withCredentials: true
							},
							headers:{
								"Content-Type": "application/json; charset=utf-8",
								'Authorization': 'Bearer ' + Service.OAuth2.accessToken,
	                			'Accept': 'application/vnd.coddr.v1'
	            			}
						}; // args
					
					var df = deferred();
					
					client.post(apiOpts.apiUrl + '/api/users/sign_in.json', args,
						function(data, response) {
						    data = JSON.parse(data);

							if (data.success) {
								df.resolve(data);
							} else {
								df.reject(data);
							}
						}); // client.post()
					
					client.on('error',
						function(err) {
						    df.reject(err);
						}); // client.on('error')
						
					return df.promise;
				}, // signIn()
				
				checkExistEmail: function(opts) {
					var self = this,
						args = {
							data: {
								api_user: {
									email: opts.email
								}
							}
						}; // args
						
					var df = deferred();
					
					client.post(apiOpts.apiUrl + '/api/users/check_exist_email.json', args,
						function(data, response) {
						    data = JSON.parse(data);

							if (data.success) {
								df.resolve(data);
							} else {
								df.reject(data);
							}
						}); // client.post()
					
					client.on('error',
						function(err) {
						    df.reject(err);
						}); // client.on('error')
						
					return df.promise;
				}, // checkExistEmail()
				
				checkExistNickname: function(opts) {
					var self = this,
						args = {
							data: {
								api_user: {
									nickname: opts.nickname
								}
							}
						}; // args
						
					var df = deferred();
					
					client.post(apiOpts.apiUrl + '/api/users/check_exist_nickname.json', args,
						function(data, response) {
						    data = JSON.parse(data);

							if (data.success) {
								df.resolve(data);
							} else {
								df.reject(data);
							}
						}); // client.post()
					
					client.on('error',
						function(err) {
						    df.reject(err);
						}); // client.on('error')
						
					return df.promise;
				}, // checkExistNickname()
			} // User
		}; // Service
		
		return Service;
	}
};
