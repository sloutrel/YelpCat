const Center = require('../models/center');
const Animal = require('../models/animal');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.createAnimal = async (req, res, next) => {
  const center = await Center.findById(req.params.id);
  const geoData = await geocoder
    .forwardGeocode({
      query: center.location,
      limit: 1,
    })
    .send();
  const animal = new Animal(req.body.animal);
  animal.center = center;
  animal.url = `/centers/${center._id}/animals/${animal.id}`;
  animal.geometry = geoData.body.features[0].geometry;
  animal.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  center.animals.push(animal);
  await animal.save();
  await center.save();
  req.flash('success', 'New animal successfully added!');
  res.redirect(`/centers/${center._id}/animals/${animal.id}`);
};

module.exports.showAnimal = async (req, res) => {
  const { id, animalId } = req.params;
  const center = await Center.findById(id);
  const animal = await Animal.findById(animalId)
    .populate('center')
    .populate('location')
    .populate('geometry');
  console.log('trying to show animals', req.params, animal);
  if (!animal) {
    req.flash('error', 'Animal does not exist!');
  }
  res.render(`animals/showAnimal`, { animal, center });
};

module.exports.animalIndex = async (req, res) => {
  const { id } = req.params;
  const center = await Center.findById(id);
  const animals = await Animal.find({
    center: id,
  });
  res.render(`animals/indexAnimal`, { animals, id, center });
};

module.exports.renderNewForm = async (req, res) => {
  const { id } = req.params;
  const center = await Center.findById(id);

  res.render(`animals/newAnimal`, { id, center });
};

module.exports.updateAnimal = async (req, res) => {
  const { id, animalId } = req.params;
  const center = await Center.findById(id);

  const animal = await Animal.findByIdAndUpdate(animalId, {
    ...req.body.animal,
  });
  console.log(`BODY: ${req}`);
  console.log(animal);
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  animal.images.push(...imgs);
  await animal.save();
  console.log(`DELETED-IMG`);
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await Animal.findByIdAndUpdate(animalId, {
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(`CENTER ${center}`);
  }
  req.flash('success', 'Successfully updated animal info!');
  res.redirect(`/centers/${center._id}/animals/${animal._id}`);
};

module.exports.deleteAnimal = async (req, res) => {
  const { id, animalId } = req.params;
  const center = await Center.findById(id);
  await Center.findByIdAndUpdate(id, { $pull: { animals: animalId } });
  await Animal.findByIdAndDelete(animalId);
  req.flash('success', 'Animal successfully deleted!');
  res.redirect(`/centers/${center._id}/animals`);
};

module.exports.renderEditForm = async (req, res) => {
  const { id, animalId } = req.params;
  const animal = await Animal.findById(animalId);
  const center = await Center.findById(id);
  if (!animal) {
    req.flash('error', 'Animal does not exist');
    return res.redirect(`/centers/${center._id}/animals`);
  }
  res.render(`animals/editAnimal`, { center, animal });
};

// router.get(
//   '/:id',
//   catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const animal = await Animal.findById(id).populate({
//       path: 'center',
//       populate: { path: 'name' },
//     });

//     if (!animal) {
//       req.flash('error', 'Animal does not exist');
//       return res.redirect('/animals');
//     }
//     res.render('animals/show', { animal });
//   })
// );

// router.get(
//   '/:id/edit',
//   catchAsync(async (req, res) => {
//     const animal = await Animal.findById(req.params.id);
//     if (!animal) {
//       req.flash('error', 'Animal does not exist');
//       return res.redirect('/animals');
//     }
//     res.render('animals/edit', { animal });
//   })
// );

// router.put(
//   '/:id',
//   isLoggedIn,
//   catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const animal = await Animal.findByIdAndUpdate(id, { ...req.body.animal });
//     req.flash('success', 'Successfully updated animal!');
//     res.redirect(`/animals/${animal._id}`);
//   })
// );

// router.delete(
//   '/:id',
//   isLoggedIn,
//   catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Animal.findByIdAndDelete(id);
//     req.flash('success', 'Animal successfully deleted!');
//     res.redirect('/animals');
//   })
// );
