'use strict'

module.exports = {
  Utils: {
    createApiParams: function(args) {
      return {
        data: args ? JSON.stringify(args) : '',
        type: "text",
        xhrFields: {
          withCredentials: true
        },
				headers:{
          "Content-Type": "application/json; charset=utf-8",
          'Authorization': 'Bearer ' + Service.OAuth2.accessToken,
          'Accept': 'application/vnd.coddr.v1'
        }
      };
    }
  }
}