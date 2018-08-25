// Requieres
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// Importar Models
var usuario = require('./models/usuario');

// Inicializar Variables
var app = express();

// Iniciar Body-Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Conexion a la BD
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'OnLine!');
});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server Puerto: 3000 \x1b[32m%s\x1b[0m', 'OnLine!');
});