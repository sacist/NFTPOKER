const Router = require("express")
const router=new Router()
const userRouter=require('./userRouter')
const tableRouter=require('./tableRouter')

router.use('/user',userRouter)
router.use('/table',tableRouter)

module.exports=router
