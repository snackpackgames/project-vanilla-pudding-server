module.exports = function(router, app) {

    var User = require('models/user')(app);
    var passport = app.get('passport');

    router.get('/:id', function(req, res) {
        var id = req.params.id;

        new User({ id: id })
        .fetch({ require: true })
        .then(function(user) {
            res.json(user);
        }).catch(function(err) {
            res.json({ error: err });
        });
    });

    router.post('/new', function(req, res) {
        new User(req.body).save().then(function(user) {
            res.json(user.omit('password'));
        }).catch(function(err) {
            res.json({ error: err });
        });
    });

    router.post('/login', passport.authenticate('basic-auth', { session: false }), function(req, res) {
        res.json(req.user);
    });
    
    return router;
};
