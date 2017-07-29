var request = require('request');
var express = require('express');

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

function extractCity(originalPlace) {

    var components = originalPlace.address_components;
    if (!components || components.length == 0) return undefined;
    var localityComponent = components.find(item => item.types && item.types.includes('locality'));
    return localityComponent.long_name;
}

function extractImgReference(originalPlace) {

    var photos = originalPlace.photos;
    if (!photos || photos.length == 0) return undefined;
    var reference = photos[0].photo_reference;
    return reference;
}

function extractWeekOpening(originalPlace) {
    var mondayPeriod = originalPlace.opening_hours.periods.find(period => period.close.day == 1);
    return mondayPeriod && mondayPeriod.open && mondayPeriod.open.time;
}

function extractWeekClosing(originalPlace) {
    var mondayPeriod = originalPlace.opening_hours.periods.find(period => period.close.day == 1);
    return mondayPeriod && mondayPeriod.close && mondayPeriod.close.time;
}

function extractWeekendOpening(originalPlace) {
    var saturdayPeriod = originalPlace.opening_hours.periods.find(period => period.close.day == 6);
    return saturdayPeriod && saturdayPeriod.open && saturdayPeriod.open.time;
}

function extractWeekendClosing(originalPlace) {
    var saturdayPeriod = originalPlace.opening_hours.periods.find(period => period.close.day == 6);
    return saturdayPeriod && saturdayPeriod.close && saturdayPeriod.close.time;
}

function mapPlace(body) {
    var originalPlace = JSON.parse(body).result;
    var mappedPlace = {
        id: originalPlace.id || originalPlace.place_id,
        name: originalPlace.name,
        city: extractCity(originalPlace),
        // 'img-reference': extractImgReference(originalPlace),
        url: originalPlace.website,
        phone: originalPlace.international_phone_number,
        "facebook": 'TODO',
        "email": 'TODO',
        "description": 'TODO',
        "position": {
            "lat": originalPlace.geometry && originalPlace.geometry.location && originalPlace.geometry.location.lat,
            "lon": originalPlace.geometry && originalPlace.geometry.location && originalPlace.geometry.location.lng,
            "address": originalPlace.formatted_address,
            "transport": 'TODO',
        },
        "hours": originalPlace.opening_hours && originalPlace.opening_hours.periods && {
            "open_now": originalPlace.opening_hours.open_now,
            "weekdays": {
                "opening": extractWeekOpening(originalPlace),
                "closing": extractWeekClosing(originalPlace)
            },
            "weekend": {
                "opening": extractWeekendOpening(originalPlace),
                "closing": extractWeekendClosing(originalPlace)
            }
        },
        "price": 'TODO' && {
            "adult": 'TODO',
            "student": 'TODO',
            "child": 'TODO'
        }
    };
    return mappedPlace;
}

function fetchPlace(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, html) => {
            if (error) {
                reject(`Fetching url [${url}] failed with error: ${error}, response body: ${response.body}`);
                return;
            }
            // TODO map place photo reference to url
            resolve(response.body);
        });
    });
}

function makePageUrl(placeId) {

    if (!process.env.GOOGLE_API_KEY) {
        throw 'Environment variable not found: GOOGLE_API_KEY';
    }
    var token=process.env.GOOGLE_API_KEY;

    var baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json';

    var url = `${baseUrl}?key=${token}&placeid=${placeId}&language=fr`;
    return url;
}

var sourcePlaces = [
    {name: 'antrebloc', id: 'ChIJperuhX1x5kcRBWCfNzLZfCA'},
    // {name: 'arkosenation', id: 'ChIJ9wDUl3ly5kcR8t3okyximic'},
    // {name: 'hardbloc', id: 'ChIJGwquiQZz5kcRT7q_2UcHwcg'},
    // {name: 'arkosemontreuil', id: 'ChIJV0KhsYNy5kcRcXctX9iFB58'},
    // {name: 'karma', id: 'ChIJ94B4cPv05UcR4iE8Q0q6uyc'},
    // {name: 'murmurpantin', id: 'ChIJV0KhsYNy5kcRcXctX9iFB58'},
    // {name: 'blockoutstouen', id: 'ChIJRY3odh5v5kcRQZP4WgfKm'},
    // {name: 'blocbustercnit', id: 'eQD5gNl5kcR1fa8broSsfo'},
    // {name: 'blocbustercourbevoie', id: 'ChIJlV-HgaJl5kcRL5xnLcfssX8'}
]

var providers = [
    {
        name: 'google',
        locate: id => 'http://TODO',
        fetch: url => {},
        convert: originalPlace => {}
    },
    {
        name: 'facebook',
        locate: id => 'http://TODO',
        fetch: url => {},
        convert: originalPlace => {}
    },
    {
        name: 'antrebloc',
        locate: id => 'http://TODO',
        fetch: url => {},
        convert: originalPlace => {}
    }
];

// var urls = sourcePlaces.map(makePageUrl);
//
// var fetchAllPlacesPromises = urls.map(fetchPlace);
//
// console.log('Fetching places...');
//
// Promise.all(fetchAllPlacesPromises).then(allFetchedPlaces => {
//
//     var app = express();
//
//     var mappedPlaces = {places: allFetchedPlaces.map(mapPlace)};
//     console.log(`${mappedPlaces.places.length} places fetched`);
//
//     app.get('/places.json', (req, res) => {
//         res.send(mappedPlaces);
//     });
//
//     var port = process.env.PORT || 8000;
//     app.listen(port, () => console.log(`Listening on port ${port}`));
// });

function deliver(placeId) {
    return Promise.resolve(placeId)
        .then(makePageUrl)
        .then(fetchPlace)
        .then(mapPlace);
}

module.exports = {
    deliver: deliver
};
