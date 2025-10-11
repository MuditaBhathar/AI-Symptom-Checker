const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/signup', async (req,res)=>{
  try{
    const {name,email,password,age,gender} = req.body;
    if(!name||!email||!password) return res.status(400).json({message:'Missing fields'});
    const exists = await User.findOne({email});
    if(exists) return res.status(400).json({message:'Email already registered'});
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const user = new User({name,email,passwordHash:hash,age,gender});
    await user.save();
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET || 'secret', {expiresIn:'7d'});
    res.json({token, user:{id:user._id, name:user.name, email:user.email}});
  }catch(err){ console.error(err); res.status(500).json({message:'Server error'}); }
})

router.post('/login', async (req,res)=>{
  try{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message:'Invalid credentials'});
    const ok = bcrypt.compareSync(password, user.passwordHash);
    if(!ok) return res.status(400).json({message:'Invalid credentials'});
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET || 'secret', {expiresIn:'7d'});
    res.json({token, user:{id:user._id, name:user.name, email:user.email}});
  }catch(err){ console.error(err); res.status(500).json({message:'Server error'}); }
})

module.exports = router;
