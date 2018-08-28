var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();
var Usuario = require('../models/usuario');
var SEED = require('../config/config').SEED;

// Google init Conf
var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// ===================================================
// Autenticacion de Google
// ===================================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {

    var body = req.body;
    var token = req.body.token;
    var googleUser = await verify(token)
        .catch(err => {
            res.status(403).json({
                ok: false,
                msg: 'Fallo al verificar el Token',
                error: err
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Usuario inexistente',
                errors: err
            });
        }
        // Si el usuario exisiste en la BD lo deriva a que se loguee con su cuenta creada
        if (usuarioDb) {
            if (usuarioDb.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: 'Debe utilizar su autenticacion estandar'
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDb }, SEED, { expiresIn: 14400 }); // 4hs
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDb,
                    token: token,
                    id: usuarioDb._id
                });
            }
        }
        // Si el usuario no existe hay que crearlo con datos de google
        else {
            var usuarioG = new Usuario({
                nombre: googleUser.nombre,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: ':)'
            });

            usuarioG.save((err, usuarioDb) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error al guardar Usuario!',
                        errors: err
                    });
                }

                var token = jwt.sign({ usuario: usuarioDb }, SEED, { expiresIn: 14400 }); // 4hs
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDb,
                    token: token,
                    id: usuarioDb._id
                });
            });
        }
    });
});


// ===================================================
// Auteticacion Estandar
// ===================================================
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