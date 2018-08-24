var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} es un rol invalido!'
};

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido.'] },
    email: { type: String, unique: true, required: [true, 'El correo es requerido.'] },
    password: { type: String, required: [true, 'La contraseña es requerido.'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser unico! Stupido' });

module.exports = mongoose.model('Usuario', usuarioSchema);