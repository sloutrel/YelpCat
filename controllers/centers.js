const Center = require('../models/center');
const Animal = require('../models/animal');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.centerIndex = async (req, res) => {
  const centers = await Center.find({});
  res.render('centers/indexCenter', { centers });
};

module.exports.renderNewForm = (req, res) => {
  res.render('centers/newCenter');
};

module.exports.showCenter = async (req, res) => {
  const center = await Center.findById(req.params.id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('animals')
    .populate('author');
  if (!center) {
    req.flash('error', 'Center does not exist');
    return res.redirect('/centers');
  }
  res.render('centers/showCenter', { center });
};

module.exports.createCenter = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.center.location,
      limit: 1,
    })
    .send();
  const center = new Center(req.body.center);
  center.geometry = geoData.body.features[0].geometry;
  center.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  center.author = req.user._id;
  await center.save();
  console.log(center.geometry);
  req.flash('success', 'New center successfully added!');
  res.redirect(`/centers/${center._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const center = await Center.findById(req.params.id);
  if (!center) {
    req.flash('error', 'Center does not exist');
    return res.redirect('/centers');
  }
  res.render('centers/editCenter', { center });
};

module.exports.updateCenter = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const center = await Center.findByIdAndUpdate(id, { ...req.body.center });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  center.images.push(...imgs);
  await center.save();
  console.log(req.body.deleteImages);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await Center.findByIdAndUpdate(id, {
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(center);
  }

  req.flash('success', 'Successfully updated center info!');
  res.redirect(`/centers/${center._id}`);
};

module.exports.deleteCenter = async (req, res) => {
  const { id } = req.params;
  await Center.findByIdAndDelete(id);
  req.flash('success', 'Center successfully deleted!');
  res.redirect('/centers');
};

module.exports.animalIndex = async (req, res) => {
  const { id } = req.params.id;
  const center = await Center.find({});
  const animals = await Animal.find({});

  console.log(center);
  console.log(animals);
  res.render('animals/index', { animals, center });
};
