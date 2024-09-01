const express = require("express")
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapasync");
const passport = require("passport");
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js")

router.route("/signup")
.get(userController.rendersignupform)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderloginform)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login);

router.get("/logout",userController.logout)

module.exports =router