const express = require('express');
const router = express.Router();


//Welcome Page
router.get('/',(req,res)=>{
    res.render('welcome');
})

//Login Page
router.get('/login',(req,res)=>{
    res.send('Welcome to Login Page');
})

//Register Page
router.get('/register',(req,res)=>{
    res.send(`Welcome to register Page`)
})

module.exports = router;