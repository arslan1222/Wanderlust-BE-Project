const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating : Number,
    createdAt : {
        type : Date,
        default : Date.now()
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true})

module.exports = mongoose.model("Review", reviewSchema)
