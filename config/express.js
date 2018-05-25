const express = require('express');
const favicon = require('serve-favicon');
const os = require('os');

module.exports = () => {
    const app = express();

    app.set('port', 8080);
    app.set('ip', os.networkInterfaces()['Ethernet'].filter(interface => interface.family == 'IPv4')[0].address);

    app.use(favicon('public/favicon.png'));
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(express.static('public'));

    return app;
}