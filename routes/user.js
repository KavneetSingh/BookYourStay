const express= require('express');
const router= express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport= require("passport");
const { saveRedirectUrl } = require('../middleware.js');
const { renderSignupForm, signup, renderLoginForm, login, logout } = require('../controllers/users.js');

//Render signup form
router.get("/signup", renderSignupForm);

//Signup route
router.post("/signup", wrapAsync(signup));


//Render login form
router.get("/login", renderLoginForm);

//Login route
router.post("/login", saveRedirectUrl,
    passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), 
    wrapAsync(login));


//Logout route
router.get("/logout", logout);

module.exports= router;