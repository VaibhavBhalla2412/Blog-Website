const express = require('express')
const router = express.Router();
const passport= require('passport');
const user = require('../controllers/user');

router.get('/register', user.renderRegisterForm)

router.post('/register', user.registerUser);

router.get("/login", user.renderLoginForm);

router.post("/login", passport.authenticate('local', {failureRedirect : "/user/login"}), user.loginUser)

router.get("/logout", user.logoutUser);

module.exports=router;
