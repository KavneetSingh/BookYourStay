const express= require('express');
const app= express();
const mongoose= require("mongoose");
const path= require('path');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const port= 8080;
const ejsMate= require('ejs-mate');
app.engine("ejs", ejsMate);
const listings= require('./routes/listing.js');
const reviews= require("./routes/review.js");
const session= require("express-session");
const flash= require("connect-flash");

const methodOverride= require("method-override");
const { cookie } = require('express/lib/response.js');
app.use(methodOverride('_method'));

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


const sessionOptions= {
    secret: "mySuperSecretCode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 20000,
        maxAge: 20000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    next();
})

//Home page
app.get("/", (req, res, next)=>{
    res.send("Requested");
    next(err);
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


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