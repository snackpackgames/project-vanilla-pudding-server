var app = require('server')();
// Start server
var port = process.env.PORT || 8000;
app.listen(port);

var appName = process.env.APPNAME || "project-vanilla-pudding-server";
console.log("Starting application: " + appName + " on port: " + port);
