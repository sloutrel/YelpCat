const Review = require('../models/review');
const Center = require('../models/center');

module.exports.createReview = async (req, res) => {
  const center = await Center.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  center.reviews.push(review);
  await review.save();
  await center.save();
  req.flash('success', 'New review successfully added!');
  res.redirect(`/centers/${center._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const center = await Center.findById(req.params.id);
  const { id, reviewId } = req.params;
  await Center.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review successfully deleted!');
  res.redirect(`/centers/${center._id}`);
};
