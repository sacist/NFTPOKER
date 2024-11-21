const Router = require("express")
const router=new Router()
const tableController=require('../controllers/tableController')
const authToken=require('../middleware/JWTmiddleware')

router.post('/createTable',authToken,tableController.createTable)

router.post('/joinTable',authToken,tableController.joinTable)

router.post('/leaveTable',authToken,tableController.leaveTable)

router.post('/bet',authToken,tableController.placeBet)

router.post('/shipWinnings',authToken,tableController.shipWinnings)

router.post('/fold',authToken,tableController.fold)

router.post('/takeAction',authToken,tableController.takeAction)

router.get('/:tableId/start',authToken,tableController.startGame)

router.get('/:tableId/deal',authToken,tableController.sharedCardsDeal)

router.get('/getAllTables',tableController.getAllTables)

router.get('/getTableById/:tableId/:nickname',authToken,tableController.getTableById)

router.get('/del',authToken,tableController.delAllTables)

router.get('/:tableId/endRound',authToken,tableController.endRound)




module.exports=router