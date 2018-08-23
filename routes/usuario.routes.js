var express = require('express');
var app = express();

var Usuario = require('../models/usuario')

// ===================================================
// Obtener todos los Usuarios
// ===================================================
app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email img role').exec((err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al cargar Usuarios!',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuarios: user
        });
    });
});

// ===================================================
// Crear un nuevo usuario
// ===================================================
app.post('/', (req, res) => {

});



module.exports = app;