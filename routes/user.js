const express= require('express');
const router= express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport= require("passport");
const { saveRedirectUrl } = require('../middleware.js');
const { renderSignupForm, signup, renderLoginForm, login, logout } = require('../controllers/users.js');

//signup routes
router.route("/signup")
    .get(renderSignupForm)                  //Render signup form
    .post(wrapAsync(signup))                //Signup route

//login routes
router.route("/login")
    .get(renderLoginForm)                    //Render login form
    .post(saveRedirectUrl,                   //Login route
        passport.authenticate("local", {failureRedirect: '/login', failureFlash: true}), 
        wrapAsync(login)
    );


//Logout route
router.get("/logout", logout);

module.exports= router;