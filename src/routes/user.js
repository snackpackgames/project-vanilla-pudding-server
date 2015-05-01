module.exports = function(router, app) {

    var User = require('models/user')(app);
    var passport = app.get('passport');
    var debug = app.get('debug');

    router.get('/:id', function(req, res) {
        var id = req.params.id;

        new User({ id: id })
        .fetch({ require: true })
        .then(function(user) {
            debug('Fetched User: %j', user);
            res.json(user.toSecureJSON());
        }).catch(function(err) {
            res.status(404).send(err);
        });
    });

    router.post('/new', function(req, res) {
        debug(req.body);
        new User(req.body).save().then(function(user) {
            res.json(user.toSecureJSON());
        }).catch(function(err) {
            res.status(400).send(err); 
        });
    });

    router.post('/login', passport.authenticate('basic-auth', { session: false }), function(req, res) {
        res.json(req.user);
    });
    
    return router;
};
