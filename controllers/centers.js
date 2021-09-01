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

// module.exports.createAnimal = async (req, res) => {
//   const { id } = req.params;
//   const center = await Center.findById(id);
//   res.render('animals/new', { id, center });
// };

// module.exports.showAnimal = async (req, res) => {
//   const center = await Center.findById(req.params.id);
//   const animal = new Animal(req.body.animal);
//   center.animals.push(animal);
//   animal.center = center;
//   await center.save();
//   await animal.save();
//   req.flash('success', 'New animal successfully added!');
//   res.redirect(`/centers/${center._id}`);
// };

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
  // res.send(geoData.body.features[0].geometry.coordinates);
  const center = new Center(req.body.center);
  center.geometry = geoData.body.features[0].geometry;
  center.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  center.author = req.user._id;
  await center.save();
  console.log(center);
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

module.exports.updateCampground = async (req, res) => {
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
