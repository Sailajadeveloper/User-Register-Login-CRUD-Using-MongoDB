const router = require("express").Router()
const { verifyToken } = require("../../utils/Utils");
const usersController = require('../Controller/UserController');
const validationController = require('../Controller/ValidationController');

module.exports = (app)=>{
    router.post('/register',[validationController.validateUserRegistration, usersController.userRegistration]);
    router.post('/login',[validationController.validateUserLogin, usersController.userLogin]);
    router.get('/userslist', usersController.userList);
    router.get('/users/:id',[verifyToken, validationController.validateUserData, usersController.userData]);
    router.post('/saveuser',[verifyToken, validationController.validateSaveUser, usersController.saveUser]);
    router.put('/users/:id',[verifyToken, validationController.validateUpdateUserData, usersController.updateUserData]);
    router.delete('/users/:id',[verifyToken, validationController.validateDeleteUserData, usersController.DeleteUserData]);
    app.use('/', router);
}