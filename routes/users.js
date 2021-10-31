const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport'); 
var uploads3=require('../middleware/awsupload')


router.get('/',(req,res)=>{
    res.render('welcome');
})
//Login Page
router.get('/login',(req,res)=>{
    res.render('login')
})

//Register Page
router.get('/register',(req,res)=>{
    res.render('register')
});

//upload file get
router.get('/upload',(req,res)=>{
    res.render('upload')
});

//upload a file post
router.post('/uploaddata',uploads3.array('img',10),(req,res)=>{
    // console.log(req.file)
    res.redirect("/dashboard")
    
    })

//Register Handler
router.post('/register',(req,res)=>{
    const {name,email,password,password2} = req.body;
    let errors = [];

    //Check required fields
    if(!name || !email || !password || !password2){
    errors.push({msg:'Please Fill all the fields'})
    }

    //Check password match
    if(password2 !== password){
        errors.push({msg:'Password do not match'});
    }

    //Check pass length
    if(password.length < 6)
    {
        errors.push({msg:'Password must contain more than 6 character'});
    }

    if(errors.length>0){
        res.render('register',{errors,name,email,password,password2});
    }
    else{
        const newUser = new User({
            name,
            email,
            password
        })
        //Hash Password
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err) throw err;
            //Set Password to hashed
            newUser.password = hash;             
            newUser.save()
            .then(user=>{
                req.flash('success_msg','You are now register and can log in')
                res.redirect('/login');
            })
            .catch(err=>console.log(err));
            })
        })
        //Save the User
        // newUser.save((err,data)=>{
        //     if(err) throw err;
        //     else{
        //     console.log(newUser);
        //     res.redirect('/users/login');
        //     }
        // })
    }
})

const checkAuthenicated = function(req,res,next){
    if(req.isAuthenticated()){
        res.set('Cache-Control','no-cache,private,no-store,must-relative,post-check=0,pre-check=0');
        return next();
    }
    else{
        res.redirect('/login');
    }
}
//Dashboard Handler
router.get('/dashboard',checkAuthenicated,(req,res)=>{
    res.render('dashboard')
})

//Login Handler
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect :'/dashboard',
        failureRedirect : '/',
        failureFlash:true
    })(req,res,next);
})


//Logout Handler
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg',"You are logged Out");
    res.redirect('/');
})

module.exports = router;