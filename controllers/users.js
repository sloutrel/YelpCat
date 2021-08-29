const User = require("../models/user");

module.exports.registerNewUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Registration Complete! Welcome to YelpCat!");
      res.redirect("/centers");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  const { username } = req.body;
  req.flash("success", `Welcome back ${username}!`);
  const redirectUrl = req.session.returnTo || "/centers";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash("success", "Bye bye");
  res.redirect("/centers");
};
