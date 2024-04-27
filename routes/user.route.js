const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");


const userController = require("../controllers/user.controller.js");

// Signup form // Sigup route
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// Login form // Login route
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
      saveRedirectUrl,
      passport.authenticate("local", 
      {failureRedirect: "/login", 
      failureFlash: true,
    }),
    userController.login
    );

// passport.authenticate() <- is a middleware

// Logout route
router.get("/logout", userController.logout)

module.exports = router;