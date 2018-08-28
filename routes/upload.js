var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Validacion de las colecciones
    var coleccionesValidas = ['usuario', 'hospital', 'medico'];

    if (coleccionesValidas.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Coleccion invalida',
            errors: { message: 'Debe ingresar una coleccion valida: ' + coleccionesValidas.join(', ') }
        });
    }

    // Validar si existe un archivo
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No existen archivos para subir',
            errors: { message: 'Debe seleccionar un archivo valido para subir' }
        });
    }

    // Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var verExtend = archivo.name.split('.');
    var extencion = verExtend[verExtend.length - 1];

    // Extenciones Validas
    var extencionesAllowed = ['jpg', 'jpeg', 'png', 'gif'];

    if (extencionesAllowed.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extencion de archivo no valida',
            errors: { message: 'Las extenciones admitidas son: ' + extencionesAllowed.join(', ') }
        });
    }

    // Nombre del Archivo personalizado Ej: 5464564-5465.jpg
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extencion }`;

    // Mover el Archivo del Temporal a un Path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    subirPorTipo(tipo, id, nombreArchivo, res, path, archivo);

});

// Funcion unica para asignar el nombre del archivo al usuario etc.. y moverlo a la carpeta correspondiente si todo es OK!
function subirPorTipo(tipo, id, nombreArchivo, res, path, archivo) {

    if (tipo === 'usuario') {
        Usuario.findById(id, (err, usuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se encontro o no existe el usuario espesificado',
                    error: err
                });
            }

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    message: 'El usuario no existe',
                    errors: { message: 'No existe el usuario con el ID solicitado' }
                });
            }

            var oldPath = './uploads/usuario/' + usuario.img;

            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'No se pudo remover el archivo viejo',
                            error: err
                        });
                    }
                });
            }
            usuario.img = nombreArchivo;

            usuario.save((err, usuarioUpdate) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'No se pudo actualizar la imagen del usuario',
                        error: err
                    });
                }

                usuarioUpdate.password = ':)';

                archivo.mv(path, err => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'No se pudo mover el archivo',
                            error: err
                        });
                    }
                });

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioUpdate,
                    old_path: oldPath
                });
            });

        });
    }

    if (tipo === 'medico') {
        Medico.findById(id, (err, medico) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se encontro o no existe el medico espesificado',
                    error: err
                });
            }

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    message: 'El medico no existe',
                    errors: { message: 'No existe el medico con el ID solicitado' }
                });
            }

            var oldPath = './uploads/medico/' + medico.img;

            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'No se pudo remover el archivo viejo',
                            error: err
                        });
                    }
                });
            }
            medico.img = nombreArchivo;

            medico.save((err, medicoUpdate) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'No se pudo actualizar la imagen del medico',
                        error: err
                    });
                }

                archivo.mv(path, err => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'No se pudo mover el archivo',
                            error: err
                        });
                    }
                });

                return res.status(200).json({
                    ok: true,
                    medico: medicoUpdate,
                    old_path: oldPath
                });
            });
        });
    }

    if (tipo === 'hospital') {
        Hospital.findById(id, (err, hospital) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se encontro o no existe el hospital espesificado',
                    error: err
                });
            }

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    message: 'El hospital no existe',
                    errors: { message: 'No existe el hospital con el ID solicitado' }
                });
            }

            var oldPath = './uploads/hospital/' + hospital.img;

            if (fs.existsSync(oldPath)) {
                fs.unlink(oldPath, (err) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'No se pudo remover el archivo viejo',
                            error: err
                        });
                    }
                });
            }
            hospital.img = nombreArchivo;

            hospital.save((err, hospitalUpdate) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'No se pudo actualizar la imagen del hospital',
                        error: err
                    });
                }

                archivo.mv(path, err => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'No se pudo mover el archivo',
                            error: err
                        });
                    }
                });

                return res.status(200).json({
                    ok: true,
                    hospital: hospitalUpdate,
                    old_path: oldPath
                });
            });
        });
    }
}

module.exports = app;