// Requieres
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar Variables
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    next();
});

// Pruba de Socket

var messages = {
    nombre: 'Juan Sokete',
    mensaje: 'Hola como estas?'
};

io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado');
    socket.emit('messages', messages);
});

// Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagesRoutes = require('./routes/imagenes');


// Iniciar Body-Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Conexion a la BD local
// mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB', (err, res) => {
//     if (err) throw err;
//     console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'OnLine!');
// });

// Conxion Remota
mongoose.connection.openUri('mongodb://maceuge:test1234@ds155418.mlab.com:55418/anghospitaldb', (err, res) => {
    if (err) throw err;
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'OnLine!');
});

// Server Index Config (es para ver la carpeta "uploads" desde navegador con todas sus imagenes)
// El servido comparte su carpeta imagenes para que uno pueda acceder a ella 
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));

// Rutas
app.use('/img', imagesRoutes);
app.use('/upload', uploadRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/medico', medicoRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
server.listen(3000, () => {
    console.log('Express Server Puerto: 3000 \x1b[32m%s\x1b[0m', 'OnLine!');
});