var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var middleAuth = require('../middlewares/authentication');

// ===================================================
// Obtener todos los Hospitales (PAGINADOS)
// ===================================================
app.get('/', (req, res) => {

    var page = req.query.page || 0;
    page = Number(page);

    Hospital.find({}, 'nombre img')
        .skip(page)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitalDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No existen registros de hospitales',
                    errors: err
                });
            }

            Hospital.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    hospital: hospitalDb,
                    total: count
                });
            });

        });
});

// ===================================================
// Obtener todos los Hospitales (SIN PAGINAR)
// ===================================================
app.get('/todos', (req, res) => {

    Hospital.find({}, 'nombre img')
        .populate('usuario', 'nombre email')
        .exec((err, hospitalDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No existen registros de hospitales',
                    errors: err
                });
            }

            Hospital.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    hospital: hospitalDb,
                    total: count
                });
            });

        });
});


// ===================================================
// Obtener Hospital por ID
// ===================================================
app.get('/:id', (req, res) => {
    let id = req.params.id;

    Hospital.findById(id, 'nombre img')
        .populate('usuario', 'nombre email img')
        .exec((err, hospital_db) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se pudo obtener hospital',
                    error: err
                });
            }

            if (!hospital_db) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se encontro el hospital con el ID ' + id,
                    error: { message: 'El hospital con el ID solicitado no se encontro.' }
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospital_db
            });
        });
});


// ===================================================
// Crear Hospital
// ===================================================
app.post('/', middleAuth.verifyToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalSaved) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'No se pudo guardar el hospital',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalSaved
        })
    });
});

// ===================================================
// Actualizar Hospital
// ===================================================
app.put('/:id', middleAuth.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, 'nombre img usuario').exec((err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No existe el Hospital solicitado!',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'El hospital con el ' + id + ' no existe!',
                errors: { message: 'No existe un hospital con el ID solicitado!' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;


        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar el Hospital!',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });
});

// ===================================================
// Eliminar Hospital
// ===================================================
app.delete('/:id', middleAuth.verifyToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No existe el Hospital solicitado!',
                errors: err
            });
        }
        if (!hospitalEliminado) {
            return res.status(400).json({
                ok: false,
                message: 'El hospital con el ' + id + ' no existe!',
                errors: { message: 'No existe un hospital con el ID solicitado!' }
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalEliminado
        });

    });
});

module.exports = app;