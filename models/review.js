const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const reviewSchema= new Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        max: 5,
        min: 1
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports= mongoose.model("Review",reviewSchema);

