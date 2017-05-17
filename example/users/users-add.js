'use strict';
/*
* test case
* */
const util = require('util');
const restify = require('restify');

var client = restify.createJsonClient({ // simulate client
  url: 'http://localhost:'+process.env.PORT, // port
  version: '*'
});

client.basicAuth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');

client.post('/create-user', { // post
    username: "me", password: "w0rd", provider: "local", // parameters
    familyName: "Einarrsdottir", givenName: "Ashildr", middleName: "",
    emails: [], photos: []
},
(err, req, res, obj) => {   // callback
    if (err) console.error(err.stack);
    else console.log('Created '+ util.inspect(obj));
});
