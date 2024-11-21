const User = require('../models/user');
const Counter = require('../models/counter');
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken')
const cookie=require('cookie')
require('dotenv').config()


const JWT_key=process.env.JWT_KEY

class userController {


  
    async createUser(req, res) {
        try {
            const { nickname, password } = req.body;

            const existingUser = await User.findOne({ nickname });
            if (existingUser) {
                return res.status(400).json({ error: 'Nickname already exists' });
            }
            const hashedPassword=await bcrypt.hash(password,10)

            const counter = await Counter.findOneAndUpdate(
                { id: 'userId' },
                { $inc: { seq: 1 } },
                { new: true }
            );

            const newUser = new User({
                id: counter.seq,
                nickname,
                password:hashedPassword
            });

            await newUser.save();
            res.status(201).json({ message: 'User created', user: newUser });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Failed to create user' });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            console.log(`Fetching user with ID: ${id}`)

            const userId = id;
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }

            const user = await User.findOne({ id: userId });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
            
            
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Failed to get user' });
        }
    }
    async getUserByNickname(req, res) {
        try {
            const { nickname } = req.params;

            const userNick = nickname;

            const user = await User.findOne({ nickname: userNick });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Failed to get user' });
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Failed to retrieve users' });
        }
    }
    async deleteUserById(req, res) {
        try {
            const { id } = req.params;
            console.log(`Deleting user with ID: ${id}`);
    
            const user = await User.findOneAndDelete({ id: id });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }
    async deleteUserByNickname(req, res) {
        try {
            const { nickname } = req.params;
            console.log(`Deleting user with ID: ${nickname}`);
    
            const user = await User.findOneAndDelete({ nickname:nickname });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        } catch (e) {
            console.log(e);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }
    async login (req, res) {
        try {
          const {nickname,password}=req.body
          
          const user=await User.findOne({nickname:nickname})

          if(!user){
            return res.status(404).json({error:'User not found'})
          }

          const matchedPassword=await bcrypt.compare(password,user.password)
          if(!matchedPassword){
            return res.status(400).json({error:'Wrong password'})
          }

            const token=jwt.sign({userId:user.id,nickname:user.nickname,timestamp:Date.now()},JWT_key,{expiresIn:'200000h'})

            res.setHeader('Set-Cookie', cookie.serialize('token',token,{
                httpOnly:false,
                secure:process.env.NODE_ENV === 'production',
                maxAge: 900000,
                path:'/'
            }))

          res.status(208).json({message:"Login complete",token,nickname: user.nickname})


        } catch (e) {
            console.log(e);
            res.status(500).json({error:'Failed to login'})
            
        }
    }
    async setBalance(req,res){
        try {
            const {nickname,ammount}=req.body
            
            const user=await User.findOne({nickname:nickname})

            if(!user){
                return res.status(404).json({error:'User not found'})
              }

            user.balance+=ammount
            await user.save()
            res.status(200).json(user)
        } catch (e) {
            console.log(e);
            res.status(500).json({error:'Failed to set balance'})
        }
    }
}

module.exports = new userController();
