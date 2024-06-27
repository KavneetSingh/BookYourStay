const express= require('express');
const app= express();
const mongoose= require("mongoose");
const path= require('path');
const Listing= require("./models/listing.js");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const port= 8080;
const data= require("./init/data.js");
const methodOverride= require("method-override");
app.use(methodOverride('_method'));
const ejsMate= require('ejs-mate');
app.engine("ejs", ejsMate);

const wrapAsync= require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema }= require('./schema.js');
const Review= require("./models/review.js");
const { reviewSchema }= require('./schema.js');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/BookYourStay');
}
main()
    .then(res=>{
        console.log("connection established");
    })
    .catch(err=>{
        console.log(err);
    })


//Home page
app.get("/", (req, res, next)=>{
    res.send("Requested");
    next(err);
})

//All Listings
app.get("/listings", wrapAsync(async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("index.ejs", {allListings});
    // console.log(data);
}));

//New listing form
app.get("/listings/new", (req, res, next)=>{
    res.render("new.ejs");
    next(err);
    // console.log("REq")
})

//Listing page
app.get("/listings/:id", wrapAsync(async (req,res)=>{
    const {id}= req.params;
    let item= await Listing.findById(id).populate("reviews");
    // console.log(item);
    res.render("listing.ejs", {item});
}));

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

//Review validation
const validateReview= (req, res, next)=>{
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

//Adding new listing
app.post("/listings", validateListing, (req, res, next)=>{
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
    res.redirect("/listings");
})

//Edit form for listing
app.get("/listings/:id/edit", wrapAsync(
    async (req,res)=>{
        const {id}= req.params;
        let item= await Listing.findById(id);
        res.render("edit.ejs", {item});
    }
));

//Editing and patching listing
app.patch("/listings/:id", validateListing, wrapAsync(async (req,res)=>{
    console.log(req.body);
    let {title, img, description, price, country, location}= req.body;
    console.log(req.body);
    let item= await Listing.findByIdAndUpdate(id, {title: title, description: description, price: price, img: img, country: country, location: location});
    console.log("Successfully updated");
    res.redirect(`/listings/${id}`);
}));

//Delete listing
app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    const {id}= req.params;
    console.log(id);
    await Listing.deleteOne({_id: id})
    console.log("Deleted");
    
    res.redirect("/listings");
}))

//Adding a new Review
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req,res)=>{
    let listing= await Listing.findById(req.params.id);
    // console.log(listing);
    // console.log(req.body);
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("Review added");
    res.redirect(`/listings/${req.params.id}`);
}));

//Default page error handling
app.all("*", (req,res,next)=>{
    next(new ExpressError(404, "Page Not Found!"));
});

//Error handling middleware
app.use((err, req, res, next)=>{
    let {status= 500, message= "Some error occurred"}= err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs", {message});
    // ExpressError
})

//Port listener
app.listen(port, (req,res)=>{
    console.log("Listening on port");
})

// app.delete("/listings/:id", (req,res)=>{
//     let {id}= req.params;
// //     console.log(id);
// });

