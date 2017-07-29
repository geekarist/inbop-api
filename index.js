var request = require('request');
var express = require('express');

var googleProvider = require('./providers/google.js')
var facebookProvider = require('./providers/facebook.js')

var providers =
{
    google: googleProvider,
    facebook: facebookProvider
};

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

var genericPlaces = [
    {
        name: 'antrebloc',
        sources: [
            {id: 'ChIJperuhX1x5kcRBWCfNzLZfCA', provider: providers.google},
            {id: 'antrebloc94', provider: providers.facebook}
        ]
    },
    {
        name: 'arkosenation',
        sources: [
            {id: 'ChIJ9wDUl3ly5kcR8t3okyximic', provider: providers.google},
            {id: 'arkosenation', provider: providers.facebook}
        ]
    },
]

var fetchAllPlacesPromise = Promise.all(genericPlaces.map(place => {

    var fetchPlaceFromSources = place.sources.map(source => source.provider.deliver(source.id));

    return Promise.all(fetchPlaceFromSources).then(placeVersions => {
        var finalPlace = {};
        placeVersions.forEach(version => {
            Object.assign(finalPlace, version);
        });
        return finalPlace;
    });
}));

fetchAllPlacesPromise
    .then(allFinalPlaces => ({places: allFinalPlaces}))
    .then(apiResponse => JSON.stringify(apiResponse, null, 2))
    .then(console.log);
