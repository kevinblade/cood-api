var should = require('chai').should(),
		oauth2 = require('../index'),
		getToken = oauth2.getToken;

describe("#getToken", function() {
	it('NEW TOKEN', function() {
		getToken().should.equal('NEW TOKEN');
	});
});
