const express = require("express")
const router = express.Router();
const { listingSchema } = require('../schema.js');  // Destructuring to get listingSchema
const List = require("../models/list");
const wrapAsync = require("../utils/wrapasync.js");
const expresserror = require("../utils/expresserror.js");
const { isLoggedIn,validateOwnership,validatelistening } = require("../middleware.js");
const listingController = require("../controller/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudconflict.js")
const upload = multer({storage})

router.route("/")
//index route
.get(wrapAsync( listingController.index))
//create
.post(isLoggedIn,upload.single('listing[image]'),validatelistening,wrapAsync(listingController.create));


//new
router.get("/new", isLoggedIn,listingController.new )

router.route("/:id")
//show
.get(wrapAsync(listingController.show))
//update
.put(isLoggedIn,validateOwnership,upload.single('listing[image]'), validatelistening, wrapAsync(listingController.update))
//Delete Route
.delete(isLoggedIn,validateOwnership, wrapAsync(listingController.destroy));

//edit
router.get("/:id/edit", isLoggedIn,validateOwnership, wrapAsync(listingController.edit));

module.exports = router;