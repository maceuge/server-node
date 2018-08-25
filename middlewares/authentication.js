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
