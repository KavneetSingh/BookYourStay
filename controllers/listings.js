const Listing= require("../models/listing.js");


//index route
module.exports.index = async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("index.ejs", {allListings});
}

//render new listing form
module.exports.renderNewForm= (req, res, next)=>{
    console.log(req.user);
    res.render("new.ejs");
    next(err);
}


//show listing route
module.exports.showListing= async (req,res)=>{
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
}


//create listing route
module.exports.addListing = (req, res, next)=>{
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
}


//render edit form route
module.exports.renderEditForm= async (req,res)=>{
    const {id}= req.params;
    let item= await Listing.findById(id);
    if(!item){
        req.flash("error", "This listing does not exist!");
        res.redirect("/listings");
    }
    res.render("edit.ejs", {item});
}


//update liting route
module.exports.updateListing= async (req,res)=>{
    let listing = new Listing(req.body.listing);
    // console.log(req.body);
    console.log(listing);
    const id= req.params.id;
    
    let item= await Listing.findByIdAndUpdate(id, {title: listing.title, description: listing.description, price: listing.price, image: listing.image, country: listing.country, location: listing.location});
    console.log("prev item: " , item);
    console.log("Successfully updated");
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}


//Destroy listing route
module.exports.destroyListing = async (req,res)=>{
    const {id}= req.params;
    console.log(id);
    await Listing.findByIdAndDelete(id);
    console.log("Deleted");
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}