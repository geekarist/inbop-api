var request = require('request');
var express = require('express');
var merge = require('lodash.merge');

var googleProvider = require('./providers/google.js');
var facebookProvider = require('./providers/facebook.js');
var webProvider = require('./providers/web.js');
var customProvider = require('./providers/custom.js');

var providers =
{
    google: googleProvider,
    facebook: facebookProvider,
    web: webProvider,
    custom: customProvider
};

var genericPlaces = [
    {
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
    },
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
                        selector: '#content > section > section.main-content.default-padding > div > div > div > div:nth-child(2) > div:nth-child(1) > div > div > span.number-value.timer',
                        attribute: 'data-to'
                    }, {
                        field: 'price.student',
                        selector: '#content > section > section.main-content.default-padding > div > div > div > div:nth-child(2) > div:nth-child(2) > div > div > span.number-value.timer',
                        attribute: 'data-to'
                    }, {
                        field: 'price.child',
                        selector: '#content > section > section.main-content.default-padding > div > div > div > div:nth-child(2) > div:nth-child(3) > div > div > span.number-value.timer',
                        attribute: 'data-to'
                    }]
                }
            }
        ]
    },
    {
        name: 'arkosemontreuil',
        sources: [
            {id: 'ChIJV0KhsYNy5kcRcXctX9iFB58', provider: providers.google},
            {id: 'arkosemontreuil', provider: providers.facebook},
            {
                provider: providers.web,
                id: 'https://montreuil.arkose.com',
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
    },
    {
        name: 'karma',
        sources: [
            {id: 'ChIJ94B4cPv05UcR4iE8Q0q6uyc', provider: providers.google},
            {id: 'karma.escalade', provider: providers.facebook},
            {
                provider: providers.web,
                id: 'http://karma.ffme.fr/index.php/tarifs/acces',
                configuration: {
                    selection: [{
                        field: 'price.adult',
                        selector: 'body > section > section.website-content.clearfix.zindex10 > div > div.main_component > article > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(2)'
                    }, {
                        field: 'price.student',
                        selector: 'body > section > section.website-content.clearfix.zindex10 > div > div.main_component > article > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(3)'
                    }, {
                        field: 'price.child',
                        selector: 'body > section > section.website-content.clearfix.zindex10 > div > div.main_component > article > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(4)'
                    }]
                }
            }
        ]
    },
    {
        name: 'murmurpantin',
        sources: [
            {id: 'ChIJf2CV6E5s5kcRy6vgrFZNOY4', provider: providers.google},
            {id: 'murmurescalade', provider: providers.facebook},
            {
                provider: providers.web,
                id: 'https://www.murmur.fr/escalade-bloc-paris',
                configuration: {
                    selection: [{
                        field: 'price.adult',
                        selector: 'body > div.site_wrapper > div > div > div > div > div > div > div > div.contentarea > div:nth-child(17) > div > div.module_price_table.price_table_wrapper > div:nth-child(3) > div > div.price_item_body > div.item_cost_wrapper > div.price_item_cost > h1'
                    }, {
                        field: 'price.student',
                        selector: 'body > div.site_wrapper > div > div > div > div > div > div > div > div.contentarea > div:nth-child(17) > div > div.module_price_table.price_table_wrapper > div:nth-child(3) > div > div.price_item_body > div.item_cost_wrapper > div.price_item_cost > h1'
                    }, {
                        field: 'price.child',
                        selector: 'body > div.site_wrapper > div > div > div > div > div > div > div > div.contentarea > div:nth-child(17) > div > div.module_price_table.price_table_wrapper > div:nth-child(3) > div > div.price_item_body > div.item_cost_wrapper > div.price_item_cost > h1'
                    }]
                }
            }
        ]
    },
    {
        name: 'blockoutstouen',
        sources: [
            {id: 'ChIJRY3odh5v5kcRQZP4WgfKm-s', provider: providers.google},
            {id: '1734869523403048', provider: providers.facebook},
            {
                provider: providers.custom,
                configuration: {
                    'img-url': 'https://www.gymlib.com/img/gyms/block-out-paris-st-ouen/e079b993-bcd2-49d0-a2d3-1d7a06498020.jpeg'
                }
            },
            {
                provider: providers.web,
                id: 'http://www.blockout.fr/bo2-paris/tarifs',
                configuration: {
                    selection: [{
                        field: 'price.adult',
                        selector: '#sp-page-builder > div > section.sppb-section.no-padding > div > div > div > div > div > div > div.sppb-tab-pane.fluid-row.sppb-fade.active.in > section:nth-child(1) > div > div > div > section > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div'
                    }, {
                        field: 'price.student',
                        selector: '#sp-page-builder > div > section.sppb-section.no-padding > div > div > div > div > div > div > div.sppb-tab-pane.fluid-row.sppb-fade.active.in > section.sppb-section.table_tarifs.tarifs_green.white_sousligne.tarifs_six > div > div > div > section > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div'
                    }, {
                        field: 'price.child',
                        selector: '#sp-page-builder > div > section.sppb-section.no-padding > div > div > div > div > div > div > div.sppb-tab-pane.fluid-row.sppb-fade.active.in > section:nth-child(3) > div > div > div > section.sppb-section.tarifs_five > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div'
                    }]
                }
            }
        ]
    },
    {
        name: 'blocbustercnit',
        sources: [
            {id: 'ChIJ-eQD5gNl5kcR1fa8broSsfo', provider: providers.google},
            {id: '446762318846420', provider: providers.facebook},
            {
                provider: providers.custom,
                configuration: {
                    'img-url': 'http://www.blocbuster.fr/wp-content/uploads/2015/11/12265661_1202040076478235_5268962440861218534_o-1170x780.jpg'
                }
            }
        ]
    },
    {
        name: 'blocbustercourbevoie',
        sources: [
            {id: 'ChIJlV-HgaJl5kcRL5xnLcfssX8', provider: providers.google},
            {id: 'blocbuster', provider: providers.facebook}
        ]
    }
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
