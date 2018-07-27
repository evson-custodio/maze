const express = require('express');
const favicon = require('serve-favicon');
const os = require('os');

module.exports = () => {
    const app = express();

    app.set('port', process.env.PORT || 1337);
    

    app.use(favicon('public/favicon.png'));
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(express.static('public'));

    return app;
}