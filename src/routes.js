module.exports = function(app, express) {
    var user = require('routes/user')(express.Router(), app);
    app.use('/api/user', user);
    
    var resource = require('routes/resource')(express.Router(), app);
    app.use('/api/resource', resource);
};
