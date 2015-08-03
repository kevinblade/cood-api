


'use strict';

var	Client = require('node-rest-client').Client,
		deferred = require('deferred'),
		client = new Client();

module.exports = {
	API: function(apiOpts) {
		return {
			OAuth2: {
				getToken: function(opts) {
					var args = {
						data: {
							grant_type: "client_credentials",
							client_id: opts.clientId,
							client_secret: opts.clientSecret
						},
						headers:{
							"Content-Type": "application/json; charset=utf-8"
						} 
					};

					var df = deferred();

					client.post(apiOpts.url + '/oauth/token', args,
							function(data, response) {
								data = JSON.parse(data);

								if (data.error) {
									df.reject(data);
								} else {
									df.resolve(data, response);
								}
							});

					client.on('error',
							function(err) {
								// console.log("알수없는 에러발생: " + err.request.apiOpts);
								df.reject(err);
							});

					return df.promise;
				}
			},

			User: {
				signUp: function(opts) {
					var args = {
						data: {
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
						}
					};

					var df = deferred();

					client.post(apiOpts.url + '/users.json', args,
							function(data, response) {
							});

					client.on('error',
							function(err) {
								df.reject(err);
							});

					return df.promise;
				}
			}
		}
	}
};
