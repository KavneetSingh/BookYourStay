const mongoose= require("mongoose");

const listingSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg",
        set: (v) => v===""? "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg" : v,
    },
    price: Number,
    location: String,
    country: String
});

const Listing= new mongoose.model("Listing", listingSchema);

module.exports= Listing;