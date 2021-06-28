const mongoose = require('mongoose');

const { Schema } = mongoose;

//Modulo para encriptar las contraseñas
const bcrypt = require ('bcryptjs');

//Modificadores
//  trim: sirve para limpiar espacios en blanco
//  unique: Sirve para que el atributo email sea unico en la BD
//  requires: Sirve para indicar que el atributo debe contener valores

const UsersSchema = new Schema({
    name: {
        type:String,
        required: true,
        trim: true
    },
    email: {
        type:String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type:String,
        required: true,
        trim: true
    },
    tipo: {
        type:String,
        required: true,
        trim: true
    }
});
module.exports = mongoose.model('Users', UsersSchema);