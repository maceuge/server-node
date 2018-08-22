// Requieres
var express = require('express');

// Inicializar Variables
var app = express();

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