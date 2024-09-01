const List = require('./models/list')
const Review = require('./models/review')
const { listingSchema,reviewSchema } = require('./schema.js');  // Destructuring to get listingSchema
const expresserror = require("./utils/expresserror.js");
module.exports.isLoggedIn = (req, res, next) => {
    console.log(req);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if (req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
}
next();
};

module.exports.validateOwnership=async(req,res,next)=>{
    try {
        const { id } = req.params;
        const listing = await List.findById(id);
    
        if (!listing) {
          req.flash("error", "Listing not found");
          return res.redirect(`/listings/${id}`);
        }
    
        if (!listing.owner.equals(res.locals.currUser._id)) {
          req.flash("error", "You don't have access");
          return res.redirect(`/listings/${id}`);
        }
    
        // If the user is the owner, proceed to the next middleware or route handler
        next();
      } catch (error) {
        console.error("Error checking ownership:", error);
        req.flash("error", "Something went wrong");
        res.redirect(`/listings/${id}`);
      }
    };
module.exports.validatelistening = (req, res, next) => {
        let { error } = listingSchema.validate(req.body);
        if (error) {
          let errmsg = error.details.map((er) => er.message).join(","); // Use 'er' instead of 'el'
          throw new expresserror(400, errmsg); // Also ensure you are passing the error message correctly
        }
        next();
      };
module.exports.validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errmsg = error.details.map((er) => er.message).join(", ");
        throw new expresserror(400, errmsg); // Correctly pass the error message
    } else {
        next(); // Pass control to the next middleware or route handler
    }
  };
  module.exports.validatereviewAuthor=async(req,res,next)=>{
    try {
        const {id, reviewId } = req.params;
        const review= await Review.findById(reviewId);
    
        if (!review) {
          req.flash("error", "Listing not found");
          return res.redirect(`/listings/${reviewId}`);
        }
    
        if (!review.author.equals(res.locals.currUser._id)) {
          req.flash("error", "You don't have access");
          return res.redirect(`/listings/${id}`);
        }
    
        // If the user is the owner, proceed to the next middleware or route handler
        next();
      } catch (error) {
        console.error("Error checking ownership:", error);
        req.flash("error", "Something went wrong");
        res.redirect(`/listings/${id}`);
      }
    };