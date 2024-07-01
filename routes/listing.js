const express= require('express');
const router= express.Router();
const wrapAsync= require('../utils/wrapAsync.js');
const { listingSchema}= require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing= require("../models/listing.js");


//Validation for listing
const validateListing= (req, res, next)=>{
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

//All Listings
router.get("/", wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("index.ejs", {allListings});
    // console.log(data);
}));


//New listing form
router.get("/new", (req, res, next)=>{
    res.render("new.ejs");
    next(err);
    // console.log("REq")
})

//Listing page
router.get("/:id", wrapAsync(async (req,res)=>{
    const {id}= req.params;
    let item= await Listing.findById(id).populate("reviews");
    // console.log(item);
    if(!item){
        req.flash("error", "This listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listing.ejs", {item});
}));

//Adding new listing
router.post("/", validateListing, (req, res, next)=>{
    // console.log(req.body);
    let listing = new Listing(req.body.listing);
    console.log(listing);
    listing.save().then(res=>{
        console.log("saved");
    }).catch(err=>{
        console.log("-----------Caught error-----------");
        console.log(err);
        next(err);
    })
    req.flash("success", "New listing was saved!");
    res.redirect("/listings");
})

//Edit form for listing
router.get("/:id/edit", wrapAsync(
    async (req,res)=>{
        const {id}= req.params;
        let item= await Listing.findById(id);
        if(!item){
            req.flash("error", "This listing does not exist!");
            res.redirect("/listings");
        }
        res.render("edit.ejs", {item});
    }
));

//Editing and patching listing
router.patch("/:id", validateListing, wrapAsync(async (req,res)=>{
    let listing = new Listing(req.body.listing);
    // console.log(req.body);
    console.log(listing);
    const id= req.params.id;
    let item= await Listing.findByIdAndUpdate(id, {title: listing.title, description: listing.description, price: listing.price, image: listing.image, country: listing.country, location: listing.location});
    console.log("new item: " , item);
    console.log("Successfully updated");
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

//Delete listing
router.delete("/:id", wrapAsync(async (req,res)=>{
    const {id}= req.params;
    console.log(id);
    await Listing.findByIdAndDelete(id);
    console.log("Deleted");
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}))


module.exports= router;