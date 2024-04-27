const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {isLoggedIn} = require("../middlewares.js");
const {isOwner} = require("../middlewares.js");
const listingConroller = require("../controllers/listing.controllers.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


// Joi validation function
const validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

/*
router.route(path)
Returns an instance of a single route which you can then use to handle HTTP verbs with optional middleware. Use router.route() to avoid duplicate route naming and thus typing errors.
*/

// Index route // Create route
router
    .route("/")
    .get(wrapAsync(listingConroller.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        wrapAsync(listingConroller.createListing),
        validateListing, 
    )
    

// Create new list
router.get("/new", 
  isLoggedIn, 
  listingConroller.renderNewForm);

// edit route // edit route
router
    .route("/:id/edit")
    .get(
      isLoggedIn,
      isOwner,
      wrapAsync(listingConroller.renderEditForm))
    .get(
      isLoggedIn,
      isOwner,
      wrapAsync(listingConroller.editRoute))
    

// Show routes // update route // Delete route
router.route("/:id")
    .get( 
    isLoggedIn,
    wrapAsync(listingConroller.showListing))
    .put(
      isLoggedIn,
      isOwner,
      upload.single("listing[image]"),
      wrapAsync(listingConroller.updateListing),
      validateListing)
    .delete( 
      isLoggedIn,
      isOwner,
      wrapAsync(listingConroller.destroyLising));


module.exports = router;