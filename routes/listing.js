const express= require('express');
const router= express.Router();
const wrapAsync= require('../utils/wrapAsync.js');
const Listing= require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const {index, renderNewForm, showListing, addListing, renderEditForm, updateListing, destroyListing}= require("../controllers/listings.js");

//index routes
router
    .route("/")
    .get(wrapAsync(index))         //Index Route
    .post(                         //Adding new listing
        isLoggedIn, 
        validateListing, 
        addListing
    );


//New listing form
router.get("/new", 
isLoggedIn, 
renderNewForm
)

//listing routes
router.route("/:id")
    .get(wrapAsync(showListing))             //Show Listing route
    .patch(                                  //Editing and patching listing
        isLoggedIn, 
        isOwner,
        validateListing, 
        wrapAsync(updateListing)
    )
    .delete(                                 //Delete listing
        isLoggedIn, 
        isOwner,
        wrapAsync(destroyListing)
    )


//Edit form for listing
router.get("/:id/edit" ,
isLoggedIn, 
isOwner,
wrapAsync(
    renderEditForm
));


module.exports= router;