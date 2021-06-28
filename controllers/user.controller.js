const bcrypt = require('bcryptjs');
const Users = require('../models/Users');
const userController = { }

//lISTA PARA TODOS LOS USUARIOS
userController.getUsers = async(req, res) =>{
    const users = await Users.find();
    res.json(users);
}

//Crear un usuario
userController.createUser = async (req, res) =>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password; 
    const tipo = req.body.tipo;
    //Creamos un objeto usuario para almacenarlo en la bd
    const User = new Users({
        name: name,
        email : email,
        password: password,
        tipo: tipo
    });
    //Encriptamos la contraseña
    User.password = bcrypt.hashSync(password, 10);
    await User.save().then( (user)=>{
        return res.json(user)
    }).catch((err) =>{
        return res.json({message: 'Error al agregar usuario'})
    })
}//Fin del createuser

userController.deleteUser = async (req, res)=>{
    await Users.findByIdAndRemove(req.params.id)
                .then( (user)=>{
                    res.json({status: 'Usuario eliminado', user: user});
                })
                .catch((err)=>{
                    console.log(err);
                    return res.json({message: 'Error al eliminar el usuario'})
                })
}//Fin deleteuser

userController.updateUser = async (req, res) =>{
    const {id} = req.params;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const tipo = req.body.tipo;

    const user = new Users({
        name: name,
        email: email,
        password: password,
        tipo: tipo
    });
    user._id = id;
    user.password = bcrypt.hashSync(password, 10);
    await Users.findByIdAndUpdate(id, {$set: user}, {new: true})
                .then((user)=>{
                    res.json({status: 'Usuario actualizado', user:user});
                })
                .catch((err)=>{
                   console.log(err);
                   return res.json({message: 'Error al actualizar el usuario'}); 
                });
}//fin del updateUser

//Buscar un usuario por ID
userController.getUser = async (req, res) =>{
    const user = await Users.findById(req.params.id)
                            .then((user)=>{
                                res.json(user);
                            })
                            .catch((err)=>{
                                console.log(err);
                                return res.json({message: 'Error al obtener usuario'})
                            })
}//Fin del getUser

module.exports = userController;