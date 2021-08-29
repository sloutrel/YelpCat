const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressErrors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const centerRoutes = require("./routes/centers");
const animalRoutes = require("./routes/animals");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

mongoose.connect("mongodb://localhost:27017/yelp-cat", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
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
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "meowcret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/centers", centerRoutes);
app.use("/animals", animalRoutes);
app.use("/centers/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

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

// app.get(
//   "/animals",
//   catchAsync(async (req, res) => {
//     const animals = await Animal.find({});
//     res.render("animals/index", { animals });
//   })
// );

// app.get(
//   "/centers",
//   catchAsync(async (req, res) => {
//     const centers = await Center.find({});
//     res.render("centers/indexCenter", { centers });
//   })
// );

// app.get("/animals/new", (req, res) => {
//   res.render("animals/new");
// });

// app.get("/centers/new", (req, res) => {
//   res.render("centers/newCenter");
// });

// app.get("/centers/:id/animals/new", async (req, res) => {
//   const { id } = req.params;
//   const center = await Center.findById(id);
//   res.render("animals/new", { id, center });
// });

// app.post("/centers/:id/animals", async (req, res) => {
//   const center = await Center.findById(req.params.id);
//   const animal = new Animal(req.body.animal);
//   console.log(`animal--- ${animal}`);
//   center.animals.push(animal);
//   animal.center = center;
//   console.log(`formCenter--- ${center}`);
//   await center.save();
//   await animal.save();
//   res.redirect(`/centers/${center._id}`);
// });

// app.post(
//   "/animals",
//   validateAnimal,
//   catchAsync(async (req, res, next) => {
//     const animal = new Animal(req.body.animal);
//     await animal.save();
//     res.redirect(`/animals/${animal._id}`);
//   })
// );
// app.post(
//   "/centers",
//   validateCenter,
//   catchAsync(async (req, res, next) => {
//     const center = new Center(req.body.center);
//     await center.save();
//     res.redirect(`/centers/${center._id}`);
//   })
// );

// app.get(
//   "/animals/:id",
//   catchAsync(async (req, res) => {
//     const animal = await Animal.findById(req.params.id).populate("center");
//     // .populate({
//     //   path: "center",
//     //   populate: { path: "name" },
//     // });
//     console.log(`og animal--- ${animal}`);
//     res.render("animals/show", { animal });
//   })
// );

// app.get(
//   "/centers/:id",
//   catchAsync(async (req, res) => {
//     const center = await Center.findById(req.params.id).populate(
//       "reviews animals"
//     );
//     console.log(`center--- ${center}`);
//     res.render("centers/showCenter", { center });
//   })
// );

// app.get(
//   "/animals/:id/edit",
//   catchAsync(async (req, res) => {
//     const animal = await Animal.findById(req.params.id);
//     res.render("animals/edit", { animal });
//   })
// );

// app.get(
//   "/centers/:id/edit",
//   catchAsync(async (req, res) => {
//     const center = await Center.findById(req.params.id);
//     res.render("centers/editCenter", { center });
//   })
// );

// app.put(
//   "/animals/:id",
//   catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const animal = await Animal.findByIdAndUpdate(id, { ...req.body.animal });
//     res.redirect(`/animals/${animal._id}`);
//   })
// );

// app.put(
//   "/centers/:id",
//   catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const center = await Center.findByIdAndUpdate(id, { ...req.body.center });
//     res.redirect(`/centers/${center._id}`);
//   })
// );

// app.delete(
//   "/animals/:id",
//   catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Animal.findByIdAndDelete(id);
//     res.redirect("/animals");
//   })
// );

// app.delete(
//   "/centers/:id",
//   catchAsync(async (req, res) => {
//     const { id } = req.params;
//     await Center.findByIdAndDelete(id);
//     res.redirect("/centers");
//   })
// );

// app.delete(
//   "/center/:id/reviews/:reviewId",
//   catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Center.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/centers/${id}`);
//   })
// );

// app.post(
//   "/centers/:id/reviews",
//   validateReview,
//   catchAsync(async (req, res) => {
//     const center = await Center.findById(req.params.id);
//     const review = new Review(req.body.review);
//     center.reviews.push(review);
//     await review.save();
//     await center.save();
//     res.redirect(`/centers/${center._id}`);
//   })
// );
