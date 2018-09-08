var express = require('express');
var app = express();
var Medico = require('../models/medico');
var middleAuth = require('../middlewares/authentication');

// ===================================================
// Obtener todos los Medicos
// ===================================================
app.get('/', (req, res) => {

    var page = req.query.page || 0;
    page = Number(page);

    Medico.find({})
        .skip(page)
        .limit(10)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicoDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No existen registros de medicos',
                    errors: err
                });
            }

            Medico.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    medicos: medicoDb,
                    total: count
                });
            });

        });
});

// ===================================================
// Obtener un Medico
// ===================================================
app.get('/:id', (req, res) => {
    var id = req.params.id;

    Medico.findById(id).populate('usuario', 'nombre mail img')
            .populate('hospital')
            .exec( (err, medicoDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No existe el Medico',
                    errors: err
                });
            }
            if (!medicoDb) {
                return res.status(400).json({
                    ok: false,
                    message: 'El medico con el ' + id + ' no existe!',
                    errors: { message: 'No existe un medico con el ID solicitado!' }
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoDb
            });
    });
});

// ===================================================
// Crear Medico
// ===================================================
app.post('/', middleAuth.verifyToken, (req, res) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo guardar al medico',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoGuardado
        })
    });
});

// ===================================================
// Actualizar Medico
// ===================================================
app.put('/:id', middleAuth.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, 'nombre img usuario hospital').exec((err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No existe el Medico solicitado!',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                message: 'El medico con el ' + id + ' no existe!',
                errors: { message: 'No existe un medico con el ID solicitado!' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar al Medico!',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});

// ===================================================
// Eliminar Medico
// ===================================================
app.delete('/:id', middleAuth.verifyToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No existe el Medico solicitado!',
                errors: err
            });
        }
        if (!medicoEliminado) {
            return res.status(400).json({
                ok: false,
                message: 'El medico con el ' + id + ' no existe!',
                errors: { message: 'No existe un medico con el ID solicitado!' }
            });
        }
        res.status(200).json({
            ok: true,
            medico: medicoEliminado
        });
    });
});

module.exports = app;