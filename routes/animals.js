const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Animal = require("../models/animal");
const { isLoggedIn } = require("../middleware");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const animals = await Animal.find({});
    res.render("animals/index", { animals });
  })
);

router.get("/new", (req, res) => {
  res.render("animals/new");
});

// router.post(
//   "/",
//   validateAnimal,
//   catchAsync(async (req, res, next) => {
//     const animal = new Animal(req.body.animal);
//     await animal.save();
//     req.flash("success", "New animal successfully added!");
//     res.redirect(`/animals/${animal._id}`);
//   })
// );

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const animal = await Animal.findById(id).populate({
      path: "center",
      populate: { path: "name" },
    });

    if (!animal) {
      req.flash("error", "Animal does not exist");
      return res.redirect("/animals");
    }
    console.log(`og animal--- ${animal}`);
    res.render("animals/show", { animal });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const animal = await Animal.findById(req.params.id);
    if (!animal) {
      req.flash("error", "Animal does not exist");
      return res.redirect("/animals");
    }
    res.render("animals/edit", { animal });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const animal = await Animal.findByIdAndUpdate(id, { ...req.body.animal });
    req.flash("success", "Successfully updated animal!");
    res.redirect(`/animals/${animal._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Animal.findByIdAndDelete(id);
    req.flash("success", "Animal successfully deleted!");
    res.redirect("/animals");
  })
);

module.exports = router;
