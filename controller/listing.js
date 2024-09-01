const List = require("../models/list");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  try {
    const allListings = await List.find();
    res.render('listings/index', { allListings }); // Use 'allListings' here
  } catch (err) {
    res.status(500).send('Error fetching listings');
  }
}

module.exports.new = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.show = async (req, res, next) => {
  let { id } = req.params;
  const listing = await List.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }
  console.log(listing); // Check if this logs the user object
  res.render("listings/show.ejs", { listing });
}

module.exports.create = async (req, res, next) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send()

  let filename = req.file.filename;
  let url = req.file.path;
  const newListing = new List(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { filename, url }
  newListing.geometry = response.body.features[0].geometry;
  let savelisting = await newListing.save();
  console.log(savelisting);
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
}

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await List.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  let originalImageurl = listing.image.url
  originalImageurl = originalImageurl.replace("/upload", "/upload/h_300")
  res.render("listings/edit.ejs", { listing, originalImageurl });
}

module.exports.update = async (req, res) => {
  try {
    let { id } = req.params;
    // const { title, description, image, price, country, location } = req.body.listing;
    // Update the listing with new values
    let listing = await List.findByIdAndUpdate(id, {
      ...req.body.listing
    });
    if (typeof req.file !== "undefined") {
      let filename = req.file.filename;
      let url = req.file.path;
      listing.image = { filename, url }
      await listing.save();
    }

    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).send("Error updating listing");
  }
}

module.exports.destroy = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await List.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", " Listing Deleted");
  res.redirect("/listings");
}


