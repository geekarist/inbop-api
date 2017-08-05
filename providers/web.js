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

function deliver(placeUrl, configuration) {

    return request(placeUrl)
        .then(body =>
            configuration.selection.map(sel => {
                var selector = sel.selector;
                var field = sel.field;
                const $ = cheerio.load(body);
                var data = {};
                setValue(data, field, $(selector).text());
                return data;
            })).reduce((a, b) => merge(a, b))
        .then((resultToDeliver) => {
            return resultToDeliver;
        });
}

module.exports = {
    deliver: deliver
};
