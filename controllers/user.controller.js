const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const User = require("../models/user.js");


// User signup form
module.exports.renderSignupForm = (req, res)=>{
    res.render("./users/signup.ejs");
}

// Signup route
module.exports.signup = async (req, res)=>{
    try{
    let {username, email, password} = req.body;
    const newUser = new User({username, email});
    const registerUser = await User.register(newUser, password);
    // console.log(registerUser);
    req.login(registerUser, (error)=>{
        if(error){
            return next();
        }
        req.flash("success", "Wellcome to Wanderlust");
    res.redirect("/listings");
    })
    } catch(error){
        req.flash("error", error.message)
        res.redirect("/signup")
    }
}

// Login form 
module.exports.renderLoginForm = (req, res)=>{
    res.render("./users/login.ejs");
}

// Login route
module.exports.login = async (req, res)=>{
    req.flash("success", "Wellcome to the Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

// Logout route
module.exports.logout = (req, res, next)=>{
    req.logout((error)=>{
        if(error){
            return next();
        }
        req.flash("success", "You are loggedout!");
        res.redirect("/listings")
    })
}