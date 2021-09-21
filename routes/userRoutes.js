const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.patch('/', userController.updateUser);
router.delete('/', userController.deleteUser);


module.exports = router;