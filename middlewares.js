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

// module.exports.isOwner = async (req, res, next)=>{
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     if(listing.owner.equals(res.locals.arslan)){
//         req.flash("error", "You can ");
//         return res.redirect(`/listings/${id}`);
//     }
//     next();
// }

module.exports.isReviewAuthor = async(req, res, next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        if(res.locals.currUser._id.equals(res.locals.arslan)){
            req.flash("success", "You deleted the review as an website owner!");
            return res.redirect(`/listings/${id}`);
        }
        req.flash("error", "You are not the auther of this review");
        return res.redirect(`/listings/${id}`)
    }
    if(review.author.equals(res.locals.arlan))
    next();
}

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}