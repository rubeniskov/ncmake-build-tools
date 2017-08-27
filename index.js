module.export = require('./lib/install').default().then(function(status) {
    console.log('Installed', status);
}, function(err) {
    console.log("ERROR: " + err);
});
