require('dotenv').config();
const express=require("express");
const app=express();
const path= require('path');
const mongoose= require('mongoose');
const ejsMate=require('ejs-mate');
const session = require('express-session');
const passport= require('passport');
const passportLocal= require('passport-local');
const User = require("./models/user");
const solace_routes = require("./routes/solaces_routes");
const review_routes = require("./routes/reviews");
const user_routes = require("./routes/user");
const flash = require('connect-flash');
app.use(flash());

mongoose.connect(`mongodb+srv://${process.env.DBusername}:${process.env.DBpassword}@cluster0.wvewqgu.mongodb.net/BlogProject?retryWrites=true&w=majority`
, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db=mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", ()=>{
    console.log("Database Connected");
});


const sessionConfig = {
    secret : 'BlogProject',
    resave : false,
    saveUninitialized : true,

}

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname,'views'));
app.use(express.static('static'));
app.use(express.urlencoded({extended : true}));
app.use(session(sessionConfig)); 
app.use(passport.initialize()); // middleware to initialize Passport 
app.use(passport.session()); // middleware to use persistent login sessions, Must be after app.use(session("..."))
passport.use(new passportLocal(User.authenticate())); // .authenticate and other methods are added by passport-local mongoose to our User model
passport.serializeUser(User.serializeUser()); // How store user in the session, added by passport-local mongoose to our User model
passport.deserializeUser(User.deserializeUser()); // How unn-store user in the session, added by passport-local mongoose to our User model

app.use((req, res, next) =>{
    res.locals.user=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next(); 

})

app.get('/', (req, res)=>{
    res.render('home');
})
app.use("/solaces", review_routes);
app.use("/solaces", solace_routes);
app.use("/user", user_routes);



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, ()=>{
    console.log(`its live on ${port}`);
})
