var request = require('request');
var express = require('express');
var merge = require('lodash.merge');

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

// var pageNames = ['antrebloc94', 'arkosenation' , 'arkosemontreuil', 'hardblocparis', '446762318846420', 'karma.escalade', 'murmurescalade', 'blockoutofficiel', '245288228917623'];

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
    {
        name: 'hardbloc',
        sources: [
            {id: 'ChIJGwquiQZz5kcRT7q_2UcHwcg', provider: providers.google},
            {id: 'hardblocparis', provider: providers.facebook}
        ]
    },
    {
        name: 'arkosemontreuil',
        sources: [
            {id: 'ChIJV0KhsYNy5kcRcXctX9iFB58', provider: providers.google},
            {id: 'arkosemontreuil', provider: providers.facebook}
        ]
    },
    {
        name: 'karma',
        sources: [
            {id: 'ChIJ94B4cPv05UcR4iE8Q0q6uyc', provider: providers.google},
            {id: 'karma.escalade', provider: providers.facebook}
        ]
    },
    {
        name: 'murmurpantin',
        sources: [
            {id: 'ChIJV0KhsYNy5kcRcXctX9iFB58', provider: providers.google},
            {id: 'murmurescalade', provider: providers.facebook}
        ]
    },
    // {
    //     name: 'blockoutstouen',
    //     sources: [
    //         {id: 'ChIJRY3odh5v5kcRQZP4WgfKm', provider: providers.google},
    //         {id: '1734869523403048', provider: providers.facebook} // 1734869523403048 BlockOut
    //     ]
    // },
    // {
    //     name: 'blocbustercnit',
    //     sources: [
    //         {id: 'eQD5gNl5kcR1fa8broSsfo', provider: providers.google},
    //         {id: '446762318846420', provider: providers.facebook} // 446762318846420 Blocbuster-La-Défense
    //     ]
    // },
    {
        name: 'blocbustercourbevoie',
        sources: [
            {id: 'ChIJlV-HgaJl5kcRL5xnLcfssX8', provider: providers.google},
            {id: 'blocbuster', provider: providers.facebook}
        ]
    }
]

var fetchAllPlacesPromise = Promise.all(genericPlaces.map(place => {

    var fetchPlaceFromSources = place.sources.map(source => source.provider.deliver(source.id));

    return Promise.all(fetchPlaceFromSources).then(placeVersions => {
        var finalPlace = {};
        placeVersions.forEach(version => {
            merge(finalPlace, version);
        });
        return finalPlace;
    });
}));

fetchAllPlacesPromise
    .then(allFinalPlaces => ({places: allFinalPlaces}))
    // .then(apiResponse => JSON.stringify(apiResponse, null, 2)).then(console.log)
    .then(apiResponse => {
        var app = express();

        console.log(`${apiResponse.places.length} places fetched`);

        app.get('/places.json', (req, res) => {
            res.send(apiResponse);
        });

        var port = process.env.PORT || 8000;
        app.listen(port, () => console.log(`Listening on port ${port}`));
    });
