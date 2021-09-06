const express = require('express');
const router = express.Router({ mergeParams: true });
const centerAnimals = require('../controllers/centerAnimals');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAnimalCenter, validateAnimal } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// '/centers/:id/animals'

router
  .route('/')
  .get(catchAsync(centerAnimals.animalIndex))
  .post(
    isLoggedIn,
    upload.array('image'),
    catchAsync(centerAnimals.createAnimal)
  );

router.get('/new', isLoggedIn, catchAsync(centerAnimals.renderNewForm));

router
  .route('/:animalId')
  .get(catchAsync(centerAnimals.showAnimal))
  .put(
    isLoggedIn,
    // isAnimalCenter,
    upload.array('image'),
    validateAnimal,
    catchAsync(centerAnimals.updateAnimal)
  )
  .delete(
    isLoggedIn,
    // isAnimalCenter,
    catchAsync(centerAnimals.deleteAnimal)
  );

router.get(
  '/:animalId/edit',
  isLoggedIn,
  // isAnimalCenter,
  catchAsync(centerAnimals.renderEditForm)
);
module.exports = router;
