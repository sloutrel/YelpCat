const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Cat = require("./models/cat");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressErrors");
const { catSchema } = require("./schemas.js");

mongoose.connect("mongodb://localhost:27017/yelp-cat", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, `error`));
db.once("open", () => {
  console.log(`db conected`);
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateCat = (req, res, next) => {
  const { error } = catSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/cats",
  catchAsync(async (req, res) => {
    const cats = await Cat.find({});
    res.render("cats/index", { cats });
  })
);

app.get("/cats/new", (req, res) => {
  res.render("cats/new");
});

app.post(
  "/cats",
  validateCat,
  catchAsync(async (req, res, next) => {
    const cat = new Cat(req.body.cat);
    await cat.save();
    res.redirect(`/cats/${cat._id}`);
  })
);

app.get(
  "/cats/:id",
  catchAsync(async (req, res) => {
    const cat = await Cat.findById(req.params.id);
    res.render("cats/show", { cat });
  })
);

app.get(
  "/cats/:id/edit",
  catchAsync(async (req, res) => {
    const cat = await Cat.findById(req.params.id);
    res.render("cats/edit", { cat });
  })
);

app.put(
  "/cats/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const cat = await Cat.findByIdAndUpdate(id, { ...req.body.cat });
    res.redirect(`/cats/${cat._id}`);
  })
);

app.delete(
  "/cats/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Cat.findByIdAndDelete(id);
    res.redirect("/cats");
  })
);
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log(`serving on port 3000`);
});
