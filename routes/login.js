
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();
var Usuario = require('../models/usuario');
var SEED = require('../config/config').SEED;

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuario) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Usuario inexistente',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                message: 'El Correo ' + body.email + ' no pertenece a un usuario registrado!',
                errors: { message: 'Correo: Credinciales incorrectas.' }
            });
        }

        // Validar contraseña
        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                message: 'La Contraseña es incorrecta!',
                errors: { message: 'Contraseña: Credinciales incorrectas.' }
            });
        }

        usuario.password = ':)';

        // Generar Token JWT
        var token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 }); // 4hs


        res.status(200).json({
            ok: true,
            usuario: usuario,
            token: token,
            id: usuario._id
        });

    });
});


module.exports = app;