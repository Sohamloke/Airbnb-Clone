const List = require("../models/list");
const Review = require("../models/review");

module.exports.createreview = async (req, res) => {
    let listing = await List.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview)
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`)
}
module.exports.destroyreview = async (req, res) => {
    let { id, reviewId } = req.params;

    // Remove the review from the database
    await Review.findByIdAndDelete(reviewId);

    // Update the listing to remove the review reference
    await List.findByIdAndUpdate(
        id,
        { $pull: { reviews: reviewId } }
    );
    req.flash("success", "Review Deleted");
    // Redirect to the listing page
    res.redirect(`/listings/${id}`);
}