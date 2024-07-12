const express= require('express');
const router= express.Router();
const wrapAsync= require('../utils/wrapAsync.js');
const Listing= require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

//Validation for listing


//All Listings
router.get("/", wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("index.ejs", {allListings});
    // console.log(data);
}));


//New listing form
router.get("/new", 
isLoggedIn, 
(req, res, next)=>{
    console.log(req.user);
    res.render("new.ejs");
    next(err);
})

//Show Listing route
router.get("/:id", wrapAsync(async (req,res)=>{
    const {id}= req.params;
    let item= await Listing.findById(id)
        .populate({path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    if(!item){
        req.flash("error", "This listing does not exist!");
        res.redirect("/listings");
    }
    res.render("listing.ejs", {item});
}));

//Adding new listing
router.post("/", 
isLoggedIn, 
validateListing, 
(req, res, next)=>{
    // console.log(req.body);
    let listing = new Listing(req.body.listing);
    listing.owner= req.user._id;
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
router.get("/:id/edit" ,
isLoggedIn, 
isOwner,
wrapAsync(
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
router.patch("/:id", 
isLoggedIn, 
isOwner,
validateListing, 
wrapAsync(async (req,res)=>{
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
router.delete("/:id", 
isLoggedIn, 
isOwner,
wrapAsync(async (req,res)=>{
    const {id}= req.params;
    console.log(id);
    await Listing.findByIdAndDelete(id);
    console.log("Deleted");
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}))


module.exports= router;