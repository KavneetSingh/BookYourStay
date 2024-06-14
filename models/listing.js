const mongoose= require("mongoose");

const listingSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://www.pexels.com/photo/beautiful-view-of-moraine-lake-2662116/",
        set: (v) => v===""? "https://www.pexels.com/photo/beautiful-view-of-moraine-lake-2662116/" : v,
    },
    price: Number,
    location: String,
    country: String
});

const Listing= new mongoose.model("Listing", listingSchema);

module.exports= Listing;