const Listing= require("./models/listing");
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema , reviewSchema }= require('./schema.js');
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "You need to be logged in to make any changes.");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next)=>{
    const id= req.params.id;
    let listing1= await Listing.findById(id);
    if(!listing1.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have the permission to edit.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next)=>{
    // console.log(req.body);
    let {error}= listingSchema.validate(req.body);
    if(error){
        console.log("----------Validation error----------");
        let errMsg= error.details.map((el)=> el.message).join(",");
        console.log(error);
        throw new ExpressError(400, errMsg);
    } else{
        console.log("----------Validation cleared----------");
        next();
    }
}

module.exports.validateReview = (req, res, next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        console.log("----------Validation error----------");
        let errMsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else{
        console.log("----------Validation cleared----------");
        next();
    }
}

module.exports.isReviewAuthor= async (req, res, next)=>{
    const {id, reviewId}= req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}