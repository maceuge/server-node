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

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'No se pudo mover el archivo',
                error: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuario') {
        Usuario.findById(id, (err, usuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'No se encontro o no existe el usuario espesificado',
                    error: err
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

                res.status(200).json({
                    ok: true,
                    usuario: usuarioUpdate,
                    old_path: oldPath
                });
            });
        });
    }

    if (tipo === 'medico') {

    }

    if (tipo === 'hospital') {

    }
}

module.exports = app;