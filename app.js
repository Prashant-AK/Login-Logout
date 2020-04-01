const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const router = require('./routes/index');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const app = express();

// Passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/key').MongoURI;

//Connect to Mongo
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology: true})
    .then(()=> console.log(`Mongodb Connected`))
    .catch((err)=> console.log(err));

//View Engine
app.use(expressLayouts);
app.set('view engine','ejs');

//Body Parser
app.use(express.urlencoded({extended:false}));

//Express Session
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:true
}))

//Passport middleware
app.use(passport.initialize()); // invoke serializeuser method
app.use(passport.session()); // invoke deserializuser method


//Connect Flash
app.use(flash())

//Globals vars 
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',router);
app.use('/users',require('./routes/users'));

const PORT = process.env.PORT || 8000
app.listen(PORT,()=>{
    console.log(`server started on port ${PORT}`);
})