var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');

var Usuario = require('../models/usuario')
var middleAuth = require('../middlewares/authentication');

// ===================================================
// Obtener todos los Usuarios
// ===================================================
app.get('/', (req, res, next) => {

    var page = req.query.page || 0;
    page = Number(page);

    Usuario.find({}, 'nombre email img role google theme')
        .skip(page)
        .limit(5)
        .exec((err, user) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error al cargar Usuarios!',
                    errors: err
                });
            }

            Usuario.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    usuarios: user,
                    total: count
                });
            });

        });
});


// ===================================================
// Crear un nuevo usuario
// ===================================================
app.post('/', (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
        theme: 'default'
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al guardar Usuario!',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            body: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });
});

// ===================================================
// Actualizar Usuario
// ===================================================
app.put('/:id', [middleAuth.verifyToken, middleAuth.verifyAdminRoleOrSameUser], (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, 'nombre email img role google theme').exec((err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No existe el usuario solicitado!',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario con el ' + id + ' no existe!',
                errors: { message: 'No existe un usuario con el ID solicitado!' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.theme = body.theme;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar el Usuario!',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

// ===================================================
// Eliminar Usuario
// ===================================================
app.delete('/:id', [middleAuth.verifyToken, middleAuth.verifyAdminRole], (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No existe el usuario solicitado!',
                errors: err
            });
        }
        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                message: 'El usuario con el ' + id + ' no existe!',
                errors: { message: 'No existe un usuario con el ID solicitado!' }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado
        });

    });
});



module.exports = app;