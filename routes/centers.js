const express = require('express');
const router = express.Router();
const centers = require('../controllers/centers');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCenter } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router
  .route('/')
  .get(catchAsync(centers.centerIndex))
  .post(
    isLoggedIn,
    upload.array('image'),
    validateCenter,
    catchAsync(centers.createCenter)
  );

router.get('/new', isLoggedIn, centers.renderNewForm);

router
  .route('/:id')
  .get(catchAsync(centers.showCenter))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateCenter,
    catchAsync(centers.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(centers.deleteCenter));

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(centers.renderEditForm)
);

module.exports = router;
