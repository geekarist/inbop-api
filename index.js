var request = require('request');
var facebook = require('./secret/facebook.json');

var token=`${facebook.appId}|${facebook.secretKey}`;

var pageName = 'antrebloc94';
// var pageName = 'arkosenation';
// var pageName = 'arkosemontreuil';
// var pageName = 'hardblocparis';
// Blocbuster CNIT
// var pageName = '446762318846420';
// var pageName = 'karma.escalade';
// var pageName = 'murmurescalade';
// Block'Out Osny
// var pageName = 'blockoutofficiel';
// Block'Out Cergy
// var pageName = '245288228917623';

var fields = [ 'name', 'username', 'hours', 'location', 'website', 'emails', 'cover', 'link', 'parking', 'phone', 'public_transit', 'single_line_address', 'about', 'price_range'];

var joinedFields = fields.join(',');

var baseUrl = 'https://graph.facebook.com/v2.8';
var url = `${baseUrl}/${pageName}?fields=${joinedFields}&access_token=${token}`;

function makeAddressString(originalPlace) {

    if (!originalPlace.location) return null;

    var originalStreet = originalPlace.location.street;

    if (originalStreet && originalStreet.includes(originalPlace.location.city)) {
        return originalStreet;
    }

    var addressString = originalStreet;

    if (originalPlace.location.city) addressString += `, ${originalPlace.location.city}`

    return addressString;
}

function mapPlace(body) {
    var originalPlace = JSON.parse(body);
    var mappedPlace = {
        id: originalPlace.id,
        name: originalPlace.name,
        city: originalPlace.location && originalPlace.location.city,
        'img-url': originalPlace.cover && originalPlace.cover.source,
        url: originalPlace.website,
        "facebook": originalPlace.username,
        "email": originalPlace.emails && originalPlace.emails.join(', '),
        "description": originalPlace.about,
        "position": {
          "lat": originalPlace.location && originalPlace.location.latitude,
          "lon": originalPlace.location && originalPlace.location.longitude,
          "address": makeAddressString(originalPlace),
          "transport": originalPlace.public_transit,
        },
        "hours": originalPlace.hours && {
          "weekdays": {
            "opening": originalPlace.hours.mon_1_open,
            "closing": originalPlace.hours.mon_1_close
          },
          "weekend": {
            "opening": originalPlace.hours.sat_1_open,
            "closing": originalPlace.hours.sat_1_close
          }
        },
        "price": originalPlace.price_range && {
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
