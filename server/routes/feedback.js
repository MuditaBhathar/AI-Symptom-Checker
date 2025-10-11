const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post('/', async (req,res)=>{
  try{
    const {name,email,message,userId} = req.body;
    const fb = new Feedback({name,email,message,userId});
    await fb.save();
    res.json({message:'Feedback received'});
  }catch(err){ console.error(err); res.status(500).json({message:'Server error'}); }
})

module.exports = router;
