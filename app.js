if(process.env.NODE_ENV !="production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.route.js");
const reviewRouter = require("./routes/review.route.js");
const userRouter = require("./routes/user.route.js");


const db_connection = process.env.ATLAS_URL;


main().then(()=>{
    console.log(`connected to db`);
}).catch((e)=>{
    console.log(e);
});

// connected to mongodb
async function main(){
    await mongoose.connect(db_connection);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({    // Mongo store related info that is stored in our mongo atlas db
    mongoUrl: db_connection,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 48 * 3600
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expiry : Date.now() + 7 * 24 *60 * 60 * 1000,
        maxAge : 7 * 24 *60 * 60 * 1000,
        httpOnly : true
    }
    
}
// root
// app.get("/", (req, res)=>{
//     res.send("Hi, I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware for flash msg
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.arslan = process.env.ADMIN_ID;
    next();  // must call next()
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong!"} = err;  // statusCode=500, message="Something went wrong!" defaul values
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message });
});

// server is listning at PORT ${}
app.listen(8080, ()=>{
    console.log(`server is listning at PORT ${8080}`);
});