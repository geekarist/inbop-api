var request = require('request');
var express = require('express');

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
            {id: 'antrebloc94', provider: providers.facebook},
            {id: 'ChIJperuhX1x5kcRBWCfNzLZfCA', provider: providers.google},
            {id: 'antrebloc', provider: providers.custom}
        ]
    },
    {
        name: 'arkosenation',
        sources: [
            {id: 'xxx', provider: providers.facebook},
            {id: 'ChIJperuhX1x5kcRBWCfNzLZfCA', provider: providers.google},
            {id: 'arkosenation', provider: providers.custom}
        ]
    },
]

genericPlaces.forEach(place => {
    place.sources.forEach(source => {
        source.provider.locate(source.id).then(TODO);
    });
});

var urls = sourcePlaces.map(makePageUrl);

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
