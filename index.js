var request = require('request');
var facebook = require('./secret/facebook.json');

var token=`${facebook.appId}|${facebook.secretKey}`;

request(
    `https://graph.facebook.com/v2.8/antrebloc94?fields=name&access_token=${token}`,
    (error, response, html) => {
        console.log(`Response: ${response.statusCode}`);
        console.log(response.body);
    });
