const mongoose = require('mongoose');

//Configuración de los parámetros de la base de datos
url = 'mongodb://localhost/empleados';
dbparams = {
    useCreateIndex:true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
};

mongoose.connect(url, dbparams)
        .then(db => console.log('BD está conectada succesfully'))
        .catch( err => console.log(err));

module.exports = mongoose;