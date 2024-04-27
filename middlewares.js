const Review = require("./models/review");
const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const {listingSchema, reviewSchema} = require("./schema");


module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.orignalUrl;
        req.flash("error", "You must be login to create listing!");
        return res.redirect("/login")
    }
    next();
}

module.exports.isOwner = async (req, res, next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.crrUser._id)){
        req.flash("error", "You have not permission to edit or delete this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.crrUser._id)) {
        req.flash("error", "You are not the auther of this review");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}