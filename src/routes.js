module.exports = function(app, express) {
    var user = require('routes/user')(express.Router(), app);

    app.use('/api/user', user);
};
