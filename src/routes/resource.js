module.exports = function(router, app) {
    var User = require('models/user')(app);
    var Resource = require('models/resource')(app);
    var passport = app.get('passport');
    var debug = app.get('debug');
    var InvalidRequestParametersError = require('errors/invalid-request-parameters');

    router.get('/', passport.authenticate('basic-auth', { session: false }), function(req, res) {
        debug("Got request from user ID: %d, user obj: %j", req.user.id, req.user);
        new Resource({
            user_id: req.user.id
        }).fetchAll({
            required: true
        }).then(function(resources) {
            debug("Got resources: %j", resources);
            res.json(resources);
        }).catch(function(error) {
            debug("Error %s", error.message);
            res.json(error);
        });
    });

    router.post('/', passport.authenticate('basic-auth', { session: false }), function(req, res) {
        if (Resource.validateRequest(req.body)) {
            _.forEach(req.body, function(element) {
                var resource = new Resource({
                    user_id: req.user.id,
                    resource_type_id: element.id
                }).fetch().then(function(resource) {
                    if (resource) {
                        return resource.set('value', resource.get('value') + element.value).save();
                    } else {
                        return resource.set('value', element.value).save();
                    }
                }).then(function(resource) {
                    res.json(resource);
                });
            });
        } else {
            debug("could not validate request body");
            res.json(new InvalidRequestParametersError("Cannot handle malformed request parameters"));
        }
    });

    return router;
};
