const {response} = require('express');

//Caegamos el modelo de datos
const Empleados = require('../models/Empleados');
const empleadoController = {};

//Obtener los empleados
empleadoController.getEmpleados = async (req, res) =>{
    const empleados = await Empleados.find();
    res.json(empleados);
}

//Crear un empleado
empleadoController.createEmpleado = async (req, res)=>{
    //Req.body contiene la información del empleado
    //console.log(req.body);
    //res.json("Recibido");
    const empleado = new Empleados({
        nombre: req.body.nombre,
        puesto: req.body.puesto,
        departamento: req.body.departamento,
        salario: req.body.salario
    });
    await empleado.save();
    res.json({
        'status': 'Empleado Guardado'
    });
}

//Actualizar empleado
empleadoController.updateEmpleado = async (req, res)=>{
    const { id } = req.params;
    const empleado = {
        nombre: req.body.nombre,
        puesto: req.body.puesto,
        departamento: req.body.departamento,
        salario: req.body.salario
    }
    //console.log(id);
    //console.log(empleado);
    await Empleados.findByIdAndUpdate(id, {$set: empleado}, {new: true});
    res.json({status: 'Empleado actualizado correctamente'});
}
//Consultar empleado
empleadoController.getEmpleado = async (req, res)=>{
    //Objeto req.params contiene el id que se va a enviar
    //console.log(req.params);
    //res.json("Recibido");
    const empleado = await Empleados.findById(req.params.id);
    res.json(empleado);
}

//Eliminar empleado
empleadoController.deleteEmpleado = async (req, res)=>{
    const { id } = req.params;
    await Empleados.findByIdAndDelete(id);
    res.json({ status : 'Empleado eliminado correctamente'});
}

module.exports = empleadoController;
