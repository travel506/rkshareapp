const router = require('express').Router();
const User = require('../models/user');

// /api/user/login
router.post('/login',async (req,res)=>{
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email,password});
        if(!user){
            return res.json({"status":"not success","message":"no account exists"});    
        }else{
            return res.json({"status":"success","email":user.email,"message":"login successfull"});
        }
    }catch(err){
        return res.json({statusCode:400, status:"not_success",message:err})
    }
})

// /api.user/signup
router.post('/signup',async (req,res)=>{
    try{
        const {firstname, lastname, email, password} = req.body;

        const user = await User.findOne({email,password});
        if(user){
            return res.send({"status":"not success","message":"account already exists"});    
        }else{
            const user = new User({firstname,lastname,email,password});
            const response = await user.save();
            return res.send({"status":"success","email":user.email,"message":"signup successfull"});
        }
    }catch(err){
        return res.send({statusCode:400, status:"not_success",message:err})
    }
})

module.exports = router;
