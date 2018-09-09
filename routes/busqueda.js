var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuaro = require('../models/usuario');

// ===================================================
// Buscar todo con parametro
// ===================================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regexp = new RegExp(busqueda, 'i');

    Promise.all(
        [
            buscarHospitales(busqueda, regexp),
            buscarMedicos(busqueda, regexp),
            buscarUsuarios(busqueda, regexp)
        ]
    ).then(data => {
        res.status(200).json({
            ok: true,
            hospital: data[0],
            medico: data[1],
            usuario: data[2],
            parametro: busqueda,
            total_hospitales: data[0].length,
            total_medicos: data[1].length,
            total_usuarios: data[2].length
        });
    });

});

function buscarHospitales(busqueda, regexp) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regexp })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('No se encontro el registro buscado', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
};

function buscarMedicos(busqueda, regexp) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regexp })
            .populate('hospital', 'nombre')
            .populate('usuario', 'nombre email')
            .exec((err, medicos) => {
                if (err) {
                    reject('No se encontro el registro buscado', err);
                } else {
                    resolve(medicos);
                }
            });
    });
};

function buscarUsuarios(busqueda, regexp) {
    return new Promise((resolve, reject) => {
        Usuaro.find({}, 'nombre email img role google')
            .or([{ nombre: regexp }, { email: regexp }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('No se encontro el registro buscado', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
};

// ===================================================
// Buscar por coleccion
// ===================================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regBus = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuario':
            promesa = buscarUsuarios(busqueda, regBus);
            break;
        case 'hospital':
            promesa = buscarHospitales(busqueda, regBus);
            break;
        case 'medico':
            promesa = buscarMedicos(busqueda, regBus);
            break;
        default:
            res.status(400).json({
                ok: true,
                mensaje: 'No se encontro la tabla',
                error: { message: 'La coleccion solicitada no existe' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data,
            tabla_param: tabla,
            busqueda_param: busqueda
        });
    });
});

module.exports = app;