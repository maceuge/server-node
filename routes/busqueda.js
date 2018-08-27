var express = require('express');
var app = express();

var Hospital = require('../models/hospital');

// ===================================================
// Buscar todo con parametro
// ===================================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regexp = new RegExp(busqueda, 'i');

    Hospital.find({ nombre: regexp }, (err, hospital) => {
        res.status(200).json({
            ok: true,
            hospital: hospital,
            parametro: busqueda
        });
    });
});

function buscarHospitales ( busqueda, regexp) {

    return new Promise( (resolve, reject) => {
        
        Hospital.find({ nombre: regexp }, (err, hospital) => {
    
        });

    });

}

module.exports = app;