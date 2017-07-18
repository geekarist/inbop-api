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

function fetchPlace(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, html) => {
            if (error) {
                reject(`Fetching url [${url}] failed with error: ${error}, response body: ${response.body}`);
                return;
            }
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

    return `${baseUrl}/?api_key=${token}&placeid=${placeId}&language=fr`;
}

var googlePlaceIds = [
    {antrebloc: 'ChIJperuhX1x5kcRBWCfNzLZfCA'},
    {arkosenation: 'ChIJ9wDUl3ly5kcR8t3okyximic'},
    {hardbloc: 'ChIJGwquiQZz5kcRT7q_2UcHwcg'},
    {arkosemontreuil: 'ChIJV0KhsYNy5kcRcXctX9iFB58'},
    {karma: 'ChIJ94B4cPv05UcR4iE8Q0q6uyc'},
    {murmurpantin: 'ChIJV0KhsYNy5kcRcXctX9iFB58'},
    {blockoutstouen: 'ChIJRY3odh5v5kcRQZP4WgfKm'},
    {blocbustercnit: 'eQD5gNl5kcR1fa8broSsfo'},
    {blocbustercourbevoie: 'ChIJlV-HgaJl5kcRL5xnLcfssX8'}
]

var urls = pageNames.map(makePageUrl);

var fetchAllPlacesPromises = urls.map(fetchPlace);

console.log('Fetching places...');

Promise.all(fetchAllPlacesPromises).then(allFetchedPlaces => {

    var app = express();

    var mappedPlaces = {places: allFetchedPlaces.map(mapPlace)};
    console.log(`${mappedPlaces.places.length} places fetched`);

    app.get('/places.json', (req, res) => {
        res.send(mappedPlaces);
    });

    var port = process.env.PORT || 8000;
    app.listen(port, () => console.log(`Listening on port ${port}`));
});
