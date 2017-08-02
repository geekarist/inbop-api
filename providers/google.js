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
    var parsedBody = JSON.parse(body);

    if (parsedBody.status == 'INVALID_REQUEST') {
        var exception = new Error('INVALID_REQUEST received');
        throw new Error(exception);
    }

    var originalPlace = parsedBody.result;

    var mappedPlace = {
        id: originalPlace.id || originalPlace.place_id,
        name: originalPlace.name,
        city: extractCity(originalPlace),
        // 'img-reference': extractImgReference(originalPlace),
        url: originalPlace.website,
        phone: originalPlace.international_phone_number,
        "position": {
            "lat": originalPlace.geometry && originalPlace.geometry.location && originalPlace.geometry.location.lat,
            "lon": originalPlace.geometry && originalPlace.geometry.location && originalPlace.geometry.location.lng,
            "address": originalPlace.formatted_address
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
        }
    };
    return mappedPlace;
}

function fetchPlace(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, html) => {
            if (error) {
                var exception = new Error(`Fetching url [${url}] failed with error: ${error}, response body: ${response.body}`);
                reject(exception);
                return;
            }
            resolve(response.body);
        });
    });
}

function makePageUrl(placeId) {

    if (!process.env.GOOGLE_API_KEY) {
        throw new Error('Environment variable not found: GOOGLE_API_KEY');
    }
    var token=process.env.GOOGLE_API_KEY;

    var baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json';

    var url = `${baseUrl}?key=${token}&placeid=${placeId}&language=fr`;
    return url;
}

function deliver(placeId) {
    return Promise.resolve(placeId)
        .then(makePageUrl)
        .then(fetchPlace)
        .then(mapPlace);
}

module.exports = {
    deliver: deliver
};
