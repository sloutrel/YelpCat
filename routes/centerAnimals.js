const express = require('express');
const router = express.Router();
const centers = require('../controllers/centers');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCenter } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
// const upload = multer({ storage });

router.get('/new', isLoggedIn, centers.createAnimal);

router.post('/', isLoggedIn, centers.showAnimal);
