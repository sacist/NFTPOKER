const Router = require("express")
const router=new Router()
const userController = require("../controllers/userController")
const authToken=require('../middleware/JWTmiddleware')


router.post('/auth',userController.createUser)

router.post('/login',userController.login)

router.post('/setBalance',authToken,userController.setBalance)

router.get('/getUserByNickname/:nickname',authToken,userController.getUserByNickname)

router.get('/getUserById/:id',authToken,userController.getUserById)

router.get('/getAllUsers',authToken,userController.getAllUsers)

router.delete('/deleteUserById/:id',authToken,userController.deleteUserById)

router.delete('/deleteUserByNickname/:nickname',authToken,userController.deleteUserByNickname)

module.exports=router