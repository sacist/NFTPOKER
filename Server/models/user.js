const mongoose= require ('mongoose')


const userSchema=new mongoose.Schema({
    id:{type:Number,unique:true, required:true},
    nickname:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    balance:{type:Number,default:0},
    currentTables:{type:Array,default:[]}
},{timestamps:true,versionKey: false})

    
const User=mongoose.model('User',userSchema)
module.exports=User