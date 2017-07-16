var request = require('request');
var facebook = require('./secret/facebook.json');

var token=`${facebook.appId}|${facebook.secretKey}`;

var fields = [ 'name', 'username', 'hours', 'location', 'website', 'emails', 'cover', 'link', 'parking', 'phone', 'public_transit', 'single_line_address', 'about', 'price_range'];

var joinedFields = fields.join(',');

var baseUrl = 'https://graph.facebook.com/v2.8';
var url = `${baseUrl}/antrebloc94?fields=${joinedFields}&access_token=${token}`;

function mapPlace(body) {
    var originalPlace = JSON.parse(body);
    var mappedPlace = {
        id: originalPlace.id,
        name: originalPlace.name,
        city: originalPlace.location.city,
        'img-url': originalPlace.cover.source,
        url: originalPlace.website,
        "facebook": originalPlace.username,
        "email": originalPlace.emails.join(', '),
        "description": originalPlace.about,
        "position": {
          "lat": originalPlace.location.latitude,
          "lon": originalPlace.location.longitude,
          "address": originalPlace.location.street,
          "transport": originalPlace.public_transit,
        },
        "hours": {
          "weekdays": {
            "opening": originalPlace.hours.mon_1_open,
            "closing": originalPlace.hours.mon_1_close
          },
          "weekend": {
            "opening": originalPlace.hours.sat_1_open,
            "closing": originalPlace.hours.sat_1_close
          }
        },
        "price": {
          "adult": originalPlace.price_range,
          "student": originalPlace.price_range,
          "child": originalPlace.price_range
        }
    };
    return mappedPlace;
}

request(url,
    (error, response, html) => {
        console.log(`Response: ${response.statusCode}`);
        var mappedResponse = mapPlace(response.body);
        console.log(JSON.stringify(mappedResponse, null, 2));
    });