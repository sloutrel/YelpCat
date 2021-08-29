const Center = require("../models/center");
const Animal = require("../models/animal");

module.exports.centerIndex = async (req, res) => {
  const centers = await Center.find({});
  res.render("centers/indexCenter", { centers });
};

module.exports.renderNewForm = (req, res) => {
  res.render("centers/newCenter");
};

module.exports.createAnimal = async (req, res) => {
  const { id } = req.params;
  const center = await Center.findById(id);
  res.render("animals/new", { id, center });
};

module.exports.showAnimal = async (req, res) => {
  const center = await Center.findById(req.params.id);
  const animal = new Animal(req.body.animal);
  center.animals.push(animal);
  animal.center = center;
  await center.save();
  await animal.save();
  req.flash("success", "New animal successfully added!");
  res.redirect(`/centers/${center._id}`);
};

module.exports.showCenter = async (req, res) => {
  const center = await Center.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("animals")
    .populate("author");
  if (!center) {
    req.flash("error", "Center does not exist");
    return res.redirect("/centers");
  }
  res.render("centers/showCenter", { center });
};

module.exports.createCenter = async (req, res, next) => {
  const center = new Center(req.body.center);
  center.author = req.user._id;
  await center.save();
  req.flash("success", "New center successfully added!");
  res.redirect(`/centers/${center._id}`);
};

module.exports.renderEditForm = async (req, res) => {
  const center = await Center.findById(req.params.id);
  if (!center) {
    req.flash("error", "Center does not exist");
    return res.redirect("/centers");
  }
  res.render("centers/editCenter", { center });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const center = await Center.findByIdAndUpdate(id, { ...req.body.center });
  req.flash("success", "Successfully updated center info!");
  res.redirect(`/centers/${center._id}`);
};

module.exports.deleteCenter = async (req, res) => {
  const { id } = req.params;
  await Center.findByIdAndDelete(id);
  req.flash("success", "Center successfully deleted!");
  res.redirect("/centers");
};
