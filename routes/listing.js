const express= require('express');
const router= express.Router();
const wrapAsync= require('../utils/wrapAsync.js');
const Listing= require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const {index, renderNewForm, showListing, addListing, renderEditForm, updateListing, destroyListing}= require("../controllers/listings.js");


//Index Route
router.get("/", wrapAsync(index));


//New listing form
router.get("/new", 
isLoggedIn, 
renderNewForm
)

//Show Listing route
router.get("/:id", wrapAsync(showListing));

//Adding new listing
router.post("/", 
isLoggedIn, 
validateListing, 
addListing
)

//Edit form for listing
router.get("/:id/edit" ,
isLoggedIn, 
isOwner,
wrapAsync(
    renderEditForm
));

//Editing and patching listing
router.patch("/:id", 
isLoggedIn, 
isOwner,
validateListing, 
wrapAsync(updateListing));

//Delete listing
router.delete("/:id", 
isLoggedIn, 
isOwner,
wrapAsync(destroyListing));


module.exports= router;