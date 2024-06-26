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



app.get("/", (req,res)=>{
    res.send("Requested");
})

app.get("/listings", async (req,res)=>{
    const allListings= await Listing.find({});
    res.render("index.ejs", {allListings});
    // console.log(data);
});

app.get("/listings/new", (req, res)=>{
    res.render("new.ejs");
    // console.log("REq")
})

app.get("/listings/:id", async (req,res)=>{
    const {id}= req.params;
    let item= await Listing.findById(id);
    // console.log(item);
    res.render("listing.ejs", {item});
});



app.post("/listings", (req,res)=>{
    let {
        title,
        image,
        description,
        price,
        location,
        country
      }= req.body;
    let newListing= new Listing({title,
        image,
        description,
        price,
        location,
        country});
    console.log(newListing);
    newListing.save().then(res=>{
        console.log("saved");
    }).catch(err=>{
        console.log(err);
    })
    res.redirect("/listings");
})

app.get("/listings/:id/edit", async (req,res)=>{
    const {id}= req.params;
    let item= await Listing.findById(id);
    res.render("edit.ejs", {item});
});

app.patch("/listings/:id", async (req,res)=>{
    const {id}= req.params;
    console.log(req.body);
    let {title, img, description, price, country, location}= req.body;
    console.log(req.body);
    let item= await Listing.findByIdAndUpdate(id, {title: title, description: description, price: price, img: img, country: country, location: location});
    console.log("Successfully updated");
    res.redirect(`/listings/${id}`);
})

app.delete("/listings/:id", async (req,res)=>{
    const {id}= req.params;
    console.log(id);
    await Listing.deleteOne({_id: id})
    console.log("Deleted");
    
    res.redirect("/listings");
})

app.use((err, req, res, next)=>{
    res.send("something went wrong");
})


app.listen(port, (req,res)=>{
    console.log("Listening on port");
})

// app.delete("/listings/:id", (req,res)=>{
//     let {id}= req.params;
// //     console.log(id);
// });

