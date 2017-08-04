var request = require('request');

function deliver(placeUrl, configuration) {

    Promise.resolve(placeUrl)
        .then(url => request(url, (error, response, html) => {
            if (error) {
                var message = `Error fetching [${url}] with error [${error}], response body: ${response.body}`;
                throw new Error(message);
            }

            return response.body;
        }))
        .then(body => configuration.selection.map(sel => {
                return sel;
        }))
        .then((resultToDeliver) => {
            return resultToDeliver;
        });
}

module.exports = {
    deliver: deliver
};
