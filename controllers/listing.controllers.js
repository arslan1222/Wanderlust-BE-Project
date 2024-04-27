const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}


// Create new list
module.exports.renderNewForm = (req, res)=>{
    // console.log(req.user);
    res.render("listings/new.ejs");
}

// Show route
module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews",
    populate : {
        path: "author"
    }
    })
    .populate("owner");
    if(!listing){
        req.flash("success", "That listing is not existed")
        res.redirect("/listings")
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
}

// Create a new listing

module.exports.createListing = async (req, res, next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user.id;
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;
    let savListing = await newListing.save();
    
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
    }

// Render Edit form
module.exports.renderEditForm = async (req, res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "That listing is not existed");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "upload/h_300,w_250/e_blur:300");
    res.render("listings/edit.ejs", { originalImageUrl, listing });
}

// Edit list
module.exports.editRoute = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}

// Update listing
module.exports.updateListing = async(req, res)=>{
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
}

// Delete Listing
module.exports.destroyLising = async (req, res)=>{
    let {id} = req.params;    
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}
