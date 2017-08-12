var request = require('request-promise');
var cheerio = require('cheerio');
var merge = require('lodash.merge');

// Copy/pasted from there: https://stackoverflow.com/a/20240290/1665730
function setValue(object, path, value) {
    var a = path.split('.');
    var o = object;
    for (var i = 0; i < a.length - 1; i++) {
        var n = a[i];
        if (n in o) {
            o = o[n];
        } else {
            o[n] = {};
            o = o[n];
        }
    }
    o[a[a.length - 1]] = value;
}

function fetch(placeUrl) {
    return request(placeUrl);
}

function deliver(placeUrl, configuration) {

    return fetch(placeUrl)
        .then(body =>
            configuration.selection.map(sel => {
                var selector = sel.selector;
                var field = sel.field;
                const $ = cheerio.load(body);
                var data = {};
                var value;
                if (sel.attribute) value = $(selector).attr(sel.attribute);
                else value = $(selector).text();
                if (value && value.trim) setValue(data, field, value.trim());
                else console.warn(`No value for ${sel.field} in ${placeUrl}`)
                return data;
            }).reduce((a, b) => merge(a, b)))
        .catch((error) => {
            console.warn(`Error providing ${placeUrl}: ${error}`)
        });
}

module.exports = {
    deliver: deliver
};
