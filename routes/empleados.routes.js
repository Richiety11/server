const express = require('express');
const router = express.Router();

//Incluimos el controlador
const empleados = require('../controllers/empleado.controller');


//Obtener todos los empleados
router.get('/', empleados.getEmpleados);

//Crear un empleado
router.post('/', empleados.createEmpleado);

//obtener  un  empleado
router.get('/:id', empleados.getEmpleado);

//actualizar empleado
router.put('/:id', empleados.updateEmpleado);

//Eliminar empleado
router.delete('/:id', empleados.deleteEmpleado);

module.exports = router;