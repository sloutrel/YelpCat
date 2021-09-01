const Center = require('../models/center');
const Animal = require('../models/animal');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.createAnimal = async (req, res) => {
  const { id } = req.params;
  const center = await Center.findById(id);
  res.render('animals/new', { id, center });
};

module.exports.showAnimal = async (req, res) => {
  const center = await Center.findById(req.params.id);
  const animal = new Animal(req.body.animal);
  center.animals.push(animal);
  animal.center = center;
  await center.save();
  await animal.save();
  req.flash('success', 'New animal successfully added!');
  res.redirect(`/centers/${center._id}`);
};

// module.exports.deleteReview = async (req, res) => {
//   const center = await Center.findById(req.params.id);
//   const { id, reviewId } = req.params;
//   await Center.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//   await Review.findByIdAndDelete(reviewId);
//   req.flash('success', 'Review successfully deleted!');
//   res.redirect(`/centers/${center._id}`);
// };
