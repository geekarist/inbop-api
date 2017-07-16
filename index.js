var request = require('request');
var facebook = require('./secret/facebook.json');

var token=`${facebook.appId}|${facebook.secretKey}`;

var fields = [ 'name', 'hours', 'location', 'website', 'emails', 'cover',
'link', 'parking', 'phone', 'public_transit', 'single_line_address'];

var joinedFields = fields.join(',');

var baseUrl = 'https://graph.facebook.com/v2.8';
var url = `${baseUrl}/antrebloc94?fields=${joinedFields}&access_token=${token}`;

// function mapPlace(body) {
//     var originalPlace = JSON.parse(body);
//     var mappedPlace = {
//         id: originalPlace.id,
//         name: originalPlace.name
//     };
//     return mappedPlace;
// }

request(url,
    (error, response, html) => {
        console.log(`Response: ${response.statusCode}`);
        // var mappedResponse = mapPlace(response.body);
        console.log(response.body);
    });
