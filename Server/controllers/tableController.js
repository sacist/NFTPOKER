const Table = require('../models/table')
const Counter = require('../models/counter');
const User = require('../models/user')
const PokerEvaluator = require('poker-evaluator')

const deck = ['2c', '2d', '2h', '2s', '3c', '3d', '3h', '3s', '4c', '4d', '4h', '4s',
    '5c', '5d', '5h', '5s', '6c', '6d', '6h', '6s', '7c', '7d', '7h', '7s', '8c', '8d',
    '8h', '8s', '9c', '9d', '9h', '9s', 'Tc', 'Td', 'Th', 'Ts', 'Jc', 'Jd', 'Jh', 'Js',
    'Qc', 'Qd', 'Qh', 'Qs', 'Kc', 'Kd', 'Kh', 'Ks', 'Ac', 'Ad', 'Ah', 'As']

const shuffle = (array) => {
    let currentIndex = array.length;

    while (currentIndex != 0) {

        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array
}


const revertThings = (table) => {
    table.flop = [];
    table.turn = [];
    table.river = [];
    table.playerHands = {};
    table.foldedPlayers = [];
    table.lastAction = []
    table.playerTurn=[]
    table.pot = 0
    table.currentBet = 0
    table.playerBets = {}
    table.actionCount = 0
    table.currentIndex=0
    table.allInPlayers=[]
    table.maxWinSidePot={}
}
class tableController {
    async createTable(req, res) {
        try {
            let tableCounter = await Counter.findOne({ id: 'tableId' });
            if (!tableCounter) {
                tableCounter = await Counter.create({ id: 'tableId', seq: 1 });
            }

            const { blind, ante } = req.body;

            tableCounter = await Counter.findOneAndUpdate(
                { id: 'tableId' },
                { $inc: { seq: 1 } },
                { new: true }
            );

            if (!tableCounter || !tableCounter.seq) {
                return res.status(500).json({ error: 'Failed to retrieve or initialize table counter' });
            }

            const newTable = new Table({
                tableId: tableCounter.seq,
                blind,
                ante,
                pot: 0
            });

            await newTable.save();
            res.status(201).json({ message: 'Table created', table: newTable });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Failed to create table' });
        }
    }
    async getAllTables(req, res) {
        try {
            const tables = await Table.find().select('blind ante tableId currentPlayers');
            res.json(tables);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Failed to retrieve tables' });
        }
    }
    async getTableById(req, res) {
        try {
            const { tableId, nickname } = req.params;


            const table = await Table.findOne({ tableId }).select(`blind ante tableId currentPlayers foldedPlayers 
                playerHands.${nickname} flop turn river gameStarted pot ActionSequence playerTurn lastAction playerBets currentBet currentIndex roundCount
                allInPlayers maxWinSidePot`);
            if (!table) {
                return res.status(404).json({ message: 'Table not found' });
            }
            const user = await User.findOne({ nickname })
            if (!table.currentPlayers.includes(user.nickname)) {
                return res.status(404).json({ message: 'User not at the table' });
            }
            res.json(table);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Failed to get Table' });
        }
    }
    async delAllTables(req, res) {
        try {
            const tables = await Table.deleteMany();
            res.json(tables);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Failed to retrieve tables' });
        }
    }
    async joinTable(req, res) {
        try {
            const { tableId, nickname } = req.body;
            const table = await Table.findOne({ tableId: tableId });
            if (!table) {
                return res.status(404).json({ message: 'Table not found' });
            }

            const user = await User.findOne({ nickname });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (table.currentPlayers.includes(user.nickname)) {
                return res.status(200).json({ message: 'User already at the table' });
            }

            if (table.currentPlayers.length < 6 && !table.currentPlayers.includes(nickname)) {
                table.currentPlayers.push(user.nickname);
                user.currentTables.push(table.tableId);

                // table.ActionSequence = [
                // ...table.currentPlayers.slice(table.roundCount),
                // ...table.currentPlayers.slice(0, table.roundCount),]
                if (!table.foldedPlayers.includes(nickname)) {
                    table.foldedPlayers.push(nickname)
                }
                ;

                await user.save();
                await table.save();
            } else {
                return res.status(400).json({ message: "Table is full already" });
            }

            res.status(200).json({ message: 'Joined succesfully' });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Failed to join the table' });
        }
    }

    async leaveTable(req, res) {
        try {
            const { tableId, nickname, type } = req.body;

            const table = await Table.findOne({ tableId: tableId });
            if (!table) {
                return res.status(404).json({ message: 'Table not found' });
            }

            const user = await User.findOne({ nickname });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!table.currentPlayers.includes(nickname)) {
                return res.status(404).json({ message: "No such player at the table" });
            }

            table.currentPlayers = table.currentPlayers.filter((player) => player !== nickname);
            user.currentTables = user.currentTables.filter((tables) => tables !== table.tableId);

            table.ActionSequence = table.ActionSequence.filter(player => player !== nickname);
            if (!table.foldedPlayers.includes(nickname)) {
                table.foldedPlayers.push(nickname)
            }

            if (table.currentPlayers.length > 0) {
                table.roundCount = (table.roundCount + 1) % table.currentPlayers.length;
            } else {
                table.roundCount = 0;
                revertThings(table)
                table.gameStarted = false
            }
            table.playerHands[nickname] = []
            if (type==='forceQuit'){
                const foldingIndex = table.ActionSequence.indexOf(nickname);
                    table.ActionSequence = table.ActionSequence.filter(player => player !== nickname);
    
                    if (table.currentIndex >= table.ActionSequence.length) {
                        table.currentIndex = -1;
                    } else if (foldingIndex <= table.currentIndex) {
                        table.currentIndex -=1
                    }
    
                    if (table.ActionSequence.length === 1) {
                        const remainingPlayer = table.ActionSequence[0];
                        const winner = await User.findOne({ nickname: remainingPlayer });
                        winner.balance += table.pot;
                        table.pot = 0; 
                        revertThings(table)
                        table.gameStarted = false;

                        table.currentPlayers.forEach(player => {
                            table.playerHands[player] = [];
                        });

                        await winner.save();
                    }
                    table.foldedPlayers = [];
                    table.currentIndex = (table.currentIndex + 1) % table.ActionSequence.length;
                    const nextPlayer = table.ActionSequence[table.currentIndex];
                    table.playerTurn = [nextPlayer];
            }
            await user.save();
            await table.save();

            res.status(200).json({ message: 'left table succesfully' });
        } catch (e) {
            console.log(e);
        }
    }
    async startGame(req, res) {
        try {
            const { tableId } = req.params;
    
            const table = await Table.findOne({ tableId });
            if (!table) {
                return res.status(404).json({ message: 'Table not found' });
            }
    
            table.deck = shuffle(deck);
            revertThings(table);
    
            table.currentPlayers.forEach(player => {
                table.playerHands[player] = [];
                for (let i = 0; i < 2; i++) {
                    const card = table.deck.shift();
                    table.playerHands[player].push(card);
                }
                table.playerBets[player] = 0;
            });
    
            table.gameStarted = true;
    
            table.roundCount = (table.roundCount + 1) % table.currentPlayers.length;
            const startIndex = table.roundCount;
    
            table.ActionSequence = [
                ...table.currentPlayers.slice(startIndex),
                ...table.currentPlayers.slice(0, startIndex),
            ];
            

            table.playerTurn = [table.ActionSequence[0]];
            const user1= await User.findOne({nickname:table.ActionSequence.slice(-1)[0]})
            const user2= await User.findOne({nickname:table.ActionSequence[0]})
            table.playerBets[user1.nickname]=table.blind*2
            table.playerBets[user2.nickname]=table.blind
            user1.balance-=table.blind*2
            user2.balance-=table.blind
            table.currentBet=table.blind*2
            table.pot+=table.blind*3
            table.lastAction='bet'
            await user1.save()
            await user2.save()
            await table.save();
    
            res.status(200).json(table);
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Failed to start game at table' });
        }
    }
    

    async sharedCardsDeal(req, res) {
        try {
            const { tableId } = req.params;

            const table = await Table.findOne({ tableId: tableId });
            if (!table) {
                return res.status(404).json({ message: 'Table not found' });
            }
            switch (true) {
                case (table.flop.length === 0):
                    for (let i = 0; i < 3; i++) {
                        const card = table.deck.shift();
                        table.flop.push(card);
                    }
                    break;
                case (table.turn.length === 0):
                    const turnCard = table.deck.shift();
                    table.turn.push(turnCard);
                    break;
                case (table.river.length === 0):
                    const riverCard = table.deck.shift();
                    table.river.push(riverCard);
                    break;
                default:
                    return res.status(200).json(table)
            }
            table.lastAction = []
            table.currentBet = 0
            table.playerBets = {}
            table.actionCount = 0
            table.playerTurn[0]=table.ActionSequence[0]
            table.currentIndex=0
            await table.save()
            res.status(200).json(table)
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Failed to deal shared cards' });
        }
    }
    async placeBet(req, res) {
        try {
            const { tableId, nickname, betAmmount } = req.body;
            const table = await Table.findOne({ tableId });
            const user = await User.findOne({ nickname });

            switch (true) {
                case !table:
                    return res.status(404).json({ message: 'Table not found' });
                case !user:
                    return res.status(404).json({ message: 'User not found' });
                case !table.currentPlayers.includes(nickname):
                    return res.status(404).json({ message: 'No such player at the table' });
                case !table.gameStarted:
                    return res.status(408).json({ message: 'Game is not started yet' });
                case table.foldedPlayers.includes(nickname):
                    return res.status(409).json({ message: 'Folded players cannot place bets' });
                case betAmmount <= 0 || isNaN(betAmmount) || betAmmount > user.balance:
                    return res.status(400).json({ message: 'Invalid bet amount' });
                default:
                    break;
            }

            const totalBet = (table.playerBets[nickname] || 0) + betAmmount;
            table.playerBets[nickname] = totalBet;

            if (!table.pot) table.pot = 0;
            table.pot += betAmmount;

            user.balance -= betAmmount;

            if (betAmmount > table.currentBet) {
                table.currentBet = betAmmount;
            }

            await table.save();
            await user.save();

            res.status(200).json({
                message: `${nickname} placed a bet of ${betAmmount}`,
                pot: table.pot,
                currentBet: table.currentBet,
                playerBets: table.playerBets
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Failed to place bet' });
        }
    }


    async shipWinnings(req, res) {
        try {
            const { tableId, nickname } = req.body
            const table = await Table.findOne({ tableId: tableId })
            if (!table) {
                return res.status(404).json({ message: 'Table not found' });
            }

            const user = await User.findOne({ nickname })
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (!table.currentPlayers.includes(user.nickname)) {
                return res.status(404).json({ message: "No such player at the table" })
            }
            user.balance += table.pot
            revertThings(table)
            table.gameStarted = false;

            await table.save()
            await user.save()
            res.status(200).json({ message: 'success shipping money' })
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Failed to ship money' })
        }
    }
    async fold(req, res) {
        try {
            const { tableId, nickname } = req.body;
            const table = await Table.findOne({ tableId });

            if (!table) {
                return res.status(404).json({ message: 'Table not found' });
            }

            const user = await User.findOne({ nickname });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!table.currentPlayers.includes(user.nickname)) {
                return res.status(404).json({ message: "No such player at the table" });
            }

            table.playerHands[nickname] = [];
            table.foldedPlayers.push(nickname);


            const foldingIndex = table.ActionSequence.indexOf(nickname);


            table.ActionSequence = table.ActionSequence.filter(player => player !== nickname);
            console.log(table.ActionSequence);
            

            if (table.currentIndex >= table.ActionSequence.length) {
                table.currentIndex = 0;
            } else if (foldingIndex <= table.currentIndex) {
                table.currentIndex = Math.max(0, table.currentIndex - 1);
            }
            console.log(table.currentIndex);
            

            // table.playerTurn = [table.ActionSequence[table.currentIndex]];
            await table.save();

            res.status(200).json({
                playerHand: table.playerHands[nickname],
                currentPlayers: table.currentPlayers,
                foldedPlayers: table.foldedPlayers,
                actions: table.ActionSequence,
                playerTurn: table.playerTurn
            });

        } catch (e) {
            console.log(e);
            res.status(400).json({ message: "Failed to fold" });
        }
    }



    async endRound(req, res) {
        try {
            const { tableId } = req.params;
            const table = await Table.findOne({ tableId });
            if (!table) {
                return res.status(404).json({ message: 'Table not found' });
            }

            const handsToDisplay = table.currentPlayers
                .map((nickname) => ({
                    nickname,
                    hand: table.playerHands[nickname]
                }))
                .filter(({ hand }) => hand && hand.length === 2);

            let bestHand = null;
            let winnerNickname = null;
            let winningCards = null;
            let sharedCards = null
            handsToDisplay.forEach(({ nickname, hand }) => {
                const combinedHand = hand.concat(table.flop, table.turn, table.river);
                const evaluatedHand = PokerEvaluator.evalHand(combinedHand);
                sharedCards = table.flop.concat(table.turn, table.river)
                if (!bestHand || evaluatedHand.value > bestHand.value) {
                    bestHand = evaluatedHand;
                    winnerNickname = nickname;
                    winningCards = hand;
                }
            });

            const winner = await User.findOne({ nickname: winnerNickname });
            if (!winner) {
                return res.status(404).json({ message: 'Winner user not found' });
            }

            winner.balance += table.pot;
            await winner.save();

            table.pot = 0;
            revertThings(table)
            table.gameStarted = false;

            table.currentPlayers.forEach(player => {
                table.playerHands[player] = [];
            });

            table.foldedPlayers = [];
            await table.save();

            res.status(200).json({
                winner: winnerNickname,
                bestHandName: bestHand.handName,
                Hand: winningCards,
                sharedCards
                // winner
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Failed to determine winner' });
        }
    }
    async takeAction(req, res) {
        try {
            const { tableId, nickname, action, bet } = req.body;
            const table = await Table.findOne({ tableId });
            const user = await User.findOne({ nickname });
    
            if (!table) return res.status(404).json({ message: 'Table not found' });
            if (!user) return res.status(404).json({ message: 'User not found' });
    
            if (!table.currentPlayers.includes(nickname)) {
                return res.status(404).json({ message: 'No such player at the table' });
            }
    
            if (!table.gameStarted) {
                return res.status(408).json({ message: 'Game is not started yet' });
            }
    
            if (table.foldedPlayers.includes(nickname)) {
                return res.status(409).json({ message: 'Folded players cannot take actions' });
            }
    
            switch (action) {
                case 'raise':
                    const raiseAmount = bet;
                    if (raiseAmount <= table.currentBet) {
                        return res.status(400).json({ message: 'Raise amount must be higher than the current bet' });
                    }
    
                    if (raiseAmount <= 0 || isNaN(raiseAmount) || raiseAmount > user.balance) {
                        return res.status(400).json({ message: 'Invalid raise amount' });
                    }
    
                    table.pot +=raiseAmount;
                    user.balance -= raiseAmount;
                    table.maxWinSidePot[nickname] = (table.maxWinSidePot[nickname] || 0) + raiseAmount;      
                    table.currentBet = Math.max(table.currentBet, raiseAmount);
                    table.playerBets[nickname] = (table.playerBets[nickname] || 0)+raiseAmount;
                    table.actionCount = 1;
                    table.lastAction = action;
                    break;
    
                case 'call':
                    let callAmount = table.currentBet - (table.playerBets[nickname] || 0);
                    if (callAmount > user.balance) {
                        callAmount=user.balance
                        table.allInPlayers.push(nickname)
                        table.maxWinSidePot[nickname]=callAmount+table.playerBets[nickname]
                    }
                    table.pot += callAmount;
                    user.balance -= callAmount;
                    table.playerBets[nickname] = table.currentBet;
                    table.actionCount++;
                    table.lastAction = action;
                    break;
    
                case 'bet':
                    const betAmount = bet;
                    if (betAmount <= 0 || isNaN(betAmount) || betAmount > user.balance) {
                        return res.status(400).json({ message: 'Invalid bet amount' });
                    }
                    table.pot += betAmount;
                    user.balance -= betAmount;
                    table.currentBet = betAmount;
                    if (table.maxWinSidePot[nickname]) {
                        table.maxWinSidePot[nickname]+=bet            
                    }else{table.maxWinSidePot[nickname]=bet}
                    table.playerBets[nickname] = (table.playerBets[nickname] || 0) + betAmount;
                    table.actionCount = 1;
                    table.lastAction = action;
                    break;
    
                case 'check':
                    if (table.currentBet > 0 && !table.playerBets[nickname]===table.currentBet) {
                        return res.status(400).json({ message: 'Cannot check, there is a current bet' });
                    }
                    table.actionCount++;
                    table.lastAction = action;
                    break;
    
                case 'fold':
                    table.actionCount++;
                    table.lastAction = action;
                    table.playerHands[nickname] = [];
                    table.foldedPlayers.push(nickname);
    
                    const foldingIndex = table.ActionSequence.indexOf(nickname);
                    table.ActionSequence = table.ActionSequence.filter(player => player !== nickname);
    
                    if (table.currentIndex >= table.ActionSequence.length) {
                        table.currentIndex = -1;
                    } else if (foldingIndex <= table.currentIndex) {
                        table.currentIndex -=1
                    }
    
                    if (table.ActionSequence.length === 1) {
                        const remainingPlayer = table.ActionSequence[0];
                        const winner = await User.findOne({ nickname: remainingPlayer });
                        winner.balance += table.pot;
                        table.pot = 0; 
                        revertThings(table)
                        table.gameStarted = false;

                        await winner.save();
                        await table.save();
                        await user.save();
                        return res.status(200).json({ message: 'round ended by folding' }); 
                        
                    }
                    break;
    
                default:
                    return res.status(400).json({ message: 'Invalid action' });
            }
            

            table.currentIndex = (table.currentIndex + 1) % table.ActionSequence.length;
            const nextPlayer = table.ActionSequence[table.currentIndex];
            table.playerTurn = [nextPlayer];
    
            table.markModified('playerBets');
            await table.save();
            await user.save();
    
            return res.json({
                message: `${nickname} took action: ${action}`,
                playerTurn: table.playerTurn,
                actionCount: table.actionCount,
                pot: table.pot,
                currentBet: table.currentBet,
                playerBets: table.playerBets,
                index: table.currentIndex,
                foldedPlayers: table.foldedPlayers
            });
    
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Failed to take action' });
        }
    }
    
    

}

module.exports = new tableController()