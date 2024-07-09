const express= require('express');
const router= express.Router({mergeParams: true});
const wrapAsync= require('../utils/wrapAsync.js');
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const { validateReview } = require('../middleware.js');


//Review validation


//Post review route
router.post("/", validateReview, wrapAsync(async (req,res)=>{
    console.log(req.params.id);
    let listing= await Listing.findById(req.params.id);
    // console.log(listing);
    // console.log(req.body);
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("Review added");
    req.flash("success", "New Review added!");
    res.redirect(`/listings/${req.params.id}`);
}));

//Delete review route
router.delete("/:reviewId", wrapAsync(async(req, res)=>{
    console.log("here");
    let {id, reviewId}= req.params;
    let listing= await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    let review= await Review.findByIdAndDelete(req.params.reviewId);
    console.log(listing);
    console.log(review);
    req.flash("success", "The review was deleted!");
    res.redirect(`/listings/${req.params.id}`);
}))

module.exports= router;