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
const listingRouter= require('./routes/listing.js');
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");
const session= require("express-session");
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy= require('passport-local');
const User= require('./models/user.js');

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
        maxAge: 1000 * 60 * 60 * 24,      //1 day session
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    next();
})

// app.get("/demouser", async (req, res)=>{
//     let fakeUser= new User({
//         email: "student1@gmail.com",
//         username: "student1"
//     })

//     let registeredUser= await User.register(fakeUser, "student123");
//     res.send(registeredUser);
// })

//Home page
app.get("/", (req, res, next)=>{
    res.send("Requested");
    next(err);
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


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