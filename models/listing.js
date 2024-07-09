const mongoose= require("mongoose");
const Review= require("./review.js");

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
    price: {
        type: Number,
        required: true
    },
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}});
        console.log("Reviews deletion done");
    }
})

const Listing= new mongoose.model("Listing", listingSchema);

module.exports= Listing;