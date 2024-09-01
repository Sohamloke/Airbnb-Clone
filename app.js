if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const expresserror= require("./utils/expresserror.js");
const listingRouter = require("./route/listing.js");
const reviewRouter = require("./route/review.js")
const userRouter = require("./route/user.js")
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport =require("passport");
const LocalStrategy = require("passport-local")
const User = require("./models/user.js");


app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, '/public')))


const dburl = process.env.ATLASDB_URL;

main().then(() => {
  console.log("database conected");
}).catch((err) => {
  console.log(err);
})
async function main() {
  await mongoose.connect(dburl);
}

const store=  MongoStore.create({
  mongoUrl: dburl,
  crypto:{
    secret:process.env.SECRETKEY 
  },
  touchAfter: 24 * 3600 // time period in seconds
});

store.on("error",()=>{
  console.log("Error in Mongodb Session",err);
});

const sessionOptions ={
  store,
  secret:process.env.SECRETKEY ,
  resave: false,
  saveUninitialized:true,
  cookie:{
   expires:Date.now() +7*24*60*60*1000,
   maxAge:7*24*60*60*1000,
   httpOnly:true
  }
 }
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/", (req, res) => {
//   res.send("root dictionary");
// });

app.use((req,res,next)=>{
res.locals.success = req.flash("success");
res.locals.error = req.flash("error");
res.locals.currUser =req.user;
next();
})

// app.get("/demo",async(req,res)=>{
//   let fakeuser = new User({
//     email:"student@.com",
//     username:"delta-student"
//   })

//   let registeruser= await User.register(fakeuser,"helloworld");
//   res.send(registeruser);
// })

app.use("/listings",listingRouter)
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter);
app.all("*",(req,res,next)=>{
next(new expresserror(404,"page not found"));
})
app.use((err, req, res, next) => {
  let { status = 500, message = "Something has occurred" } = err;
  res.status(status).render("listings/error", {message});

});


app.listen(8080, () => {
  console.log("port is lsitening");
})