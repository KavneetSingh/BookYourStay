const express= require('express');
const router= express.Router({mergeParams: true});
const wrapAsync= require('../utils/wrapAsync.js');
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const { createReview, destrotReview } = require('../controllers/reviews.js');


//Post review route
router.post("/",
    isLoggedIn,
    validateReview, 
    wrapAsync(createReview));

//Delete review route
router.delete("/:reviewId",
    isLoggedIn, 
    isReviewAuthor, 
    wrapAsync(destrotReview))

module.exports= router;