var request = require('request');
var express = require('express');
var merge = require('lodash.merge');

var googleProvider = require('./providers/google.js');
var facebookProvider = require('./providers/facebook.js');
var webProvider = require('./providers/web.js');

var providers =
{
    google: googleProvider,
    facebook: facebookProvider,
    web: webProvider
};

var genericPlaces = [
    /*{
        name: 'antrebloc',
        sources: [
            {provider: providers.google, id: 'ChIJperuhX1x5kcRBWCfNzLZfCA'},
            {provider: providers.facebook, id: 'antrebloc94'},
            {
                provider: providers.web,
                id: 'http://www.antrebloc.com/antrebloc',
                configuration: {
                    selection: [{
                        field: 'price.adult',
                        selector: '#tarifs-tab-6 > table > tbody > tr:nth-child(1) > td:nth-child(2)'
                    }, {
                        field: 'price.student',
                        selector: '#tarifs-tab-6 > table > tbody > tr:nth-child(2) > td:nth-child(2)'
                    }, {
                        field: 'price.child',
                        selector: '#tarifs-tab-6 > table > tbody > tr:nth-child(3) > td:nth-child(2)'
                    }]
                }
            }
        ]
    },
    {
        name: 'arkosenation',
        sources: [
            {id: 'ChIJ9wDUl3ly5kcR8t3okyximic', provider: providers.google},
            {id: 'arkosenation', provider: providers.facebook},
            {
                provider: providers.web,
                id: 'https://nation.arkose.com',
                configuration: {
                    selection: [{
                        field: 'price.adult',
                        selector: '#prices-salle-0 > div > ul > li:nth-child(1) > strong'
                    }, {
                        field: 'price.student',
                        selector: '#prices-salle-1 > div > ul > li > strong'
                    }, {
                        field: 'price.child',
                        selector: '#prices-salle-0 > div > ul > li:nth-child(2) > strong'
                    }]
                }
            }
        ]
    },*/
    {
        name: 'hardbloc',
        sources: [
            {id: 'ChIJGwquiQZz5kcRT7q_2UcHwcg', provider: providers.google},
            {id: 'hardblocparis', provider: providers.facebook},
            {
                provider: providers.web,
                id: 'https://www.hardbloc.fr/nos-offres',
                configuration: {
                    selection: [{
                        field: 'price.adult',
                        selector: '#content > section > section.main-content.default-padding > div > div > div > div:nth-child(2) > div:nth-child(1) > div > div > span.number-value.timer'
                    }]
                }
            }
        ]
    }/*,
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
    {
        name: 'blockoutstouen',
        sources: [
            {id: 'ChIJRY3odh5v5kcRQZP4WgfKm-s', provider: providers.google},
            {id: '1734869523403048', provider: providers.facebook} // 1734869523403048 BlockOut
        ]
    },
    {
        name: 'blocbustercnit',
        sources: [
            {id: 'ChIJ-eQD5gNl5kcR1fa8broSsfo', provider: providers.google},
            {id: '446762318846420', provider: providers.facebook} // 446762318846420 Blocbuster-La-Défense
        ]
    },
    {
        name: 'blocbustercourbevoie',
        sources: [
            {id: 'ChIJlV-HgaJl5kcRL5xnLcfssX8', provider: providers.google},
            {id: 'blocbuster', provider: providers.facebook}
        ]
    }*/
]

var fetchAllPlacesPromise = Promise.all(genericPlaces.map(place => {

    var fetchPlaceFromSources = place.sources.map(source => source.provider.deliver(source.id, source.configuration));

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
    })
    .catch(error => {
        console.log(`There was an error: ${error.stack}`);
    });
