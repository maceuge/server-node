var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// ===================================================
// Verificar el TOKEN
// ===================================================
exports.verifyToken = function (req, res, next) {
    var token = req.query.token;
    
    jwt.verify( token, SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token Incorrecto!',
                errors: err
            });
        }  
        req.usuario = decode.usuario;
        next();
    });
};

// ===================================================
// Verificar si es Administrador
// ===================================================
exports.verifyAdminRole = function (req, res, next) {
    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Tenes que tener permisos de Administrador para realizar la accion solicitada!',
            errors: { message: 'Solo Administradores tienen el nivel de acceso a la peticion solicitada' }
        });
    }
};

// ===================================================
// Verificar si es Administrador o mismo Usuario
// ===================================================
exports.verifyAdminRoleOrSameUser = function (req, res, next) {
    var usuario = req.usuario;
    var id = req.params.id

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Tenes que tener permisos de Administrador o ser Propietario de la cuenta para realizar la accion solicitada!',
            errors: { message: 'Solo Administradores o Usuario de su cuenta tienen el nivel de acceso a la peticion solicitada' }
        });
    }
};