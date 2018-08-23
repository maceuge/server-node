// Requieres
var express = require('express');
var mongoose = require('mongoose');

// Inicializar Variables
var app = express();

// Conexion a la BD
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'OnLine!');
});

// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        message: 'Peticion realizada correctamente!'
    });

});


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server Puerto: 3000 \x1b[32m%s\x1b[0m', 'OnLine!');
});