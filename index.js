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
        id: 'TODO',
        name: 'TODO',
        city: 'TODO',
        'img-url': 'TODO',
        url: 'TODO',
        "facebook": 'TODO',
        "email": 'TODO',
        "description": 'TODO',
        "position": {
            "lat": 'TODO',
            "lon": 'TODO',
            "address": 'TODO',
            "transport": 'TODO',
        },
        "hours": 'TODO' && {
            "weekdays": {
                "opening": 'TODO',
                "closing": 'TODO'
            },
            "weekend": {
                "opening": 'TODO',
                "closing": 'TODO'
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

    var url = `${baseUrl}?api_key=${token}&placeid=${placeId.id}&language=fr`;
    console.log(url);
    return url;
}

var googlePlaceIds = [
    {name: 'antrebloc', id: 'ChIJperuhX1x5kcRBWCfNzLZfCA'},
    {name: 'arkosenation', id: 'ChIJ9wDUl3ly5kcR8t3okyximic'},
    {name: 'hardbloc', id: 'ChIJGwquiQZz5kcRT7q_2UcHwcg'},
    {name: 'arkosemontreuil', id: 'ChIJV0KhsYNy5kcRcXctX9iFB58'},
    {name: 'karma', id: 'ChIJ94B4cPv05UcR4iE8Q0q6uyc'},
    {name: 'murmurpantin', id: 'ChIJV0KhsYNy5kcRcXctX9iFB58'},
    {name: 'blockoutstouen', id: 'ChIJRY3odh5v5kcRQZP4WgfKm'},
    {name: 'blocbustercnit', id: 'eQD5gNl5kcR1fa8broSsfo'},
    {name: 'blocbustercourbevoie', id: 'ChIJlV-HgaJl5kcRL5xnLcfssX8'}
]

var urls = googlePlaceIds.map(makePageUrl);

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
