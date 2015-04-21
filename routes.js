module.exports = function(app) {
    // Test route, eventually need to make this robust and serve a web page if the user is accessing from a browser.
    app.get('/api', function(req, res) {
        res.json({
            'test': 'ok'
        });
    });
};
