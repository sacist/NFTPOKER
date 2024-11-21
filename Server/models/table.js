const mongoose = require ('mongoose')


const tableSchema=new mongoose.Schema({
    tableId:{type:Number,required:true,unique:true},
    currentPlayers:{type:Array,default:[]},
    blind:{type:Number,default:0},
    ante:{type:Number,default:0},
    flop:{type:Array,default:[]},
    turn:{type:Array,default:[]},
    river:{type:Array,default:[]},
    playerHands:{type:Object,default:{}},
    deck:{type:Array,default:[]},
    foldedPlayers:{type:Array,default:[]},
    pot:{type:Number,default:0},
    gameStarted:{type:Boolean,default:false},
    playerTurn:{type:Array,default:[]},
    ActionSequence:{type:Array,default:[]},
    roundCount: { type: Number, default: 0 },
    currentIndex:{type:Number,default:0},
    lastAction:{type:Array,default:[]},
    actionCount:{type:Number,default:0},
    currentBet:{type:Number,default:0},
    playerBets: {type:Object, default: {} },
    allInPlayers:{type:Array,default:[]},
    maxWinSidePot:{type:Object,default:{}}
})  


const Table=mongoose.model('table',tableSchema)
module.exports=Table