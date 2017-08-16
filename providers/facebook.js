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
        // id: originalPlace.id,
        // name: originalPlace.name,
        // city: originalPlace.location && originalPlace.location.city,
        'img-url': originalPlace.cover && originalPlace.cover.source,
        url: originalPlace.website,
        "facebook": originalPlace.username,
        "email": originalPlace.emails && originalPlace.emails.join(', '),
        "description": originalPlace.about,
        "position": {
            // "lat": originalPlace.location && originalPlace.location.latitude,
            // "lon": originalPlace.location && originalPlace.location.longitude,
            // "address": makeAddressString(originalPlace),
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
        }/*,
        "price": originalPlace.price_range && {
            "adult": originalPlace.price_range,
            "student": originalPlace.price_range,
            "child": originalPlace.price_range
        }*/
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

function makePageUrl(pageName) {

    if (!process.env.FB_APP_ID || !process.env.FB_SECRET_KEY) {
        throw 'Environment variables not found: FB_APP_ID and FB_SECRET_KEY';
    }
    var token=`${process.env.FB_APP_ID}|${process.env.FB_SECRET_KEY}`;

    var baseUrl = 'https://graph.facebook.com/v2.8';
    var fields = ['name', 'username', 'hours', 'location', 'website', 'emails', 'cover', 'link', 'parking', 'phone', 'public_transit', 'single_line_address', 'about', 'price_range'];
    var joinedFields = fields.join(',');

    return `${baseUrl}/${pageName}?fields=${joinedFields}&access_token=${token}`;
}

function deliver(placeId) {
    return Promise.resolve(placeId)
        .then(makePageUrl)
        .then(fetchPlace)
        .then(mapPlace);
}

module.exports = {
    deliver: deliver
}
