const express = require("express")
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const expresserror = require("../utils/expresserror.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const List = require("../models/list");
const { validatereview, isLoggedIn, validatereviewAuthor } = require("../middleware.js");
const reviewController = require("../controller/review.js")

//review route
// post route
router.post("/", isLoggedIn, validatereview, wrapAsync(reviewController.createreview));

//delete review route
router.delete("/:reviewId", isLoggedIn, validatereviewAuthor, wrapAsync(reviewController.destroyreview));

module.exports = router;
