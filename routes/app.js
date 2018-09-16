var express = require('express');
var app = express();

var pusher = require('../config/config').PUSHER;

app.get('/', (req, res, next) => {

    pusher.trigger('server-status', 'ok-status', {
        nombre: 'Status 200',
        mensaje: 'Peticion realizada correctamente!'
    });

    res.status(200).json({
        ok: true,
        message: 'Peticion realizada correctamente!'
    });

});

module.exports = app;