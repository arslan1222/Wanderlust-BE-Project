const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middlewares.js");

const reviewController = require("../controllers/reviews.controller.js")


const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Post reviews route
router.post("/",
    validateReview,
    isLoggedIn,
    wrapAsync(reviewController.createReview));

// Delete review route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync (reviewController.destroyReview));

module.exports = router;