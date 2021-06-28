const express = require ('express');
const morgan = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authorization = require('auth-header');

//Modelo de datos de usuarios
const Users = require('./models/Users');

const app = express();

//Conectamos la base de datos
const { mongoose } = require('./database');
const { head } = require('./routes/empleados.routes');
const { request } = require('express');

//Configuraciones
app.set('port', process.env.PORT || 3100 );
app.set('secret', 'my_Secret_1357');

//Middleware 
app.use(express.urlencoded({extended:true})); //Para recibir los datos del formulario en texto
app.use(morgan('dev')); //Enviar mensajes a consola de lo que el usuario pide de manera externa
app.use(express.json()); //Obtener los datos del usuario en request.body
app.use(cors()); //Permite la comunicación desde fuera del servidor

//Ruta para iniciar sesión en el api
app.post('/api/login', async (req, res)=>{
    const email = req.body.email;
    const passwd = req.body.password;
    return new Promise( (resolve, reject)=>{
        Users.findOne({email: email})
             .then ((user)=>{
                 if(!user){ //Si la consulta no regresa ningun usuario
                     res.json({success: false, message: 'Usuario no encontrado'})
                 }else { //Si se encontró el usuario
                    //Comprobar que el password corresponada al del usuario
                    if(bcrypt.compareSync(passwd, user.password)){
                        const expire = 3600; //1 hora
                        const token = jwt.sign(
                                                {user},
                                                app.get('secret'),
                                                { expiresIn: expire }
                                              )
                        res.json ({
                            success: true,
                            token: token
                        })
                    }else {
                        res.json({success: false, message: 'Password no coincide'})
                    }//else
                 }//else
             })//.then
    })//New promise
});//Fin del api login

//El token se envia atraves de request.body (en un json)
//Request.query.token (en la url)
//request.headers (contiene las cabeceras)

//http://localhost:3100/api/users HTTP/1.1
//Content-Type: application/json
//Authorizaton: token-auth token
app.use( (req, res, next)=>{
    //Verificamos si el token viene por el header
    var tokenauth='';
    if (req.get('authorization')){
        auth = authorization.parse(req.get('authorization'));
        if (auth.scheme == 'token-auth')
            tokenauth = auth.token;
    }

    const token = req.body.token || //json
                  req.query.token ||//url
                  tokenauth;//headers
    if (token) {
        jwt.verify(token, app.get('secret'), (err, decoded)=>{
            if (err){
                //console.log(err);
                return res.json( {success: false, message: 'fallo en la auteticación'})
            }
            else {
                req.decoded = decoded; //Almacenamos en req el token descodificado
                next(); //permite ejecutar las sig func de las rutas
            }
        })
    }else { //Si no existe el token o no se ha enviado en el request
        return res.status(403).send({
            success: false,
            message: 'el token no existe'
        })
    }
}); //fin de app.use

//Las rutas que estan de aqui hacia abajo solo se tendrá accesso si el usuario envia un token y ha iniciado sesion

//Rutas del servidor
app.use('/api/empleados',require('./routes/empleados.routes'));
app.use('/api/users', require('./routes/users.routes'));

/*
//Ruta para usuarios
app.get('/api/loginusers', ensureToken, (req, res)=>{
    //Verificar que la contraseña corresponda a la indicada
    jwt.verify(req.token, 'password', (err, data)=>{
        if (err){
            //Se genera un estatus 403 que indica que el token
            //no fue generado a partir de esta llave secreta
            res.sendStatus(403);
        } else {
            //Significa que el token es váliudo y se regresan
            //los datos del usuario en la variable data
            res.json({
                text: 'users',
                data
            });        
        }
    })    
});
*/

//Iniciar Servidor
app.listen(app.get('port'), ()=>{
    console.log("Servidor corriendo en el puerto " + app.get('port'));
});

//Funciones
function ensureToken(req, res, next){
    const headerAuth = req.headers['authorization']
    console.log(headerAuth);

    //headerAuth será igual a undefined si el usuario no ha inciado sesión
    if(typeof headerAuth !=='undefined'){
        //el usuario ha iniciado sesión
        //Separamos el encabezado
        const auth = headerAuth.split(" ");
        const authToken = auth[1];
        req.token = authToken;
        next();
    }else {
        //El usuario no ha iniciado sesión
        //Codígo 403 indica que la ruta no está permitida hasta
        //que el usuario inicie sesión o se autentique
        res.sendStatus(403);
    }
}//Fin de ensureToken