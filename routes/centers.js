const express = require("express");
const router = express.Router();
const centers = require("../controllers/centers");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCenter } = require("../middleware");

router
  .route("/")
  .get(catchAsync(centers.centerIndex))
  .post(validateCenter, isLoggedIn, catchAsync(centers.createCenter));

router.get("/new", isLoggedIn, centers.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(centers.showCenter))
  .put(isLoggedIn, isAuthor, catchAsync(centers.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(centers.deleteCenter));

router.get("/:id/animals/new", isLoggedIn, centers.createAnimal);

router.post("/:id/animals", isLoggedIn, centers.showAnimal);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(centers.renderEditForm)
);

module.exports = router;
