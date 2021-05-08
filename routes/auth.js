const express = require("express");
const createError = require("http-errors");
const { accessToken, verifyAccessToken } = require("../helpers/token");
const { authSchema } = require("../helpers/validator");
const router = express.Router();
const User = require("../models/User");

// router.use("/", apiKeyHandler);

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw createError.BadRequest("Email and Password Required");
    const result = await authSchema.validateAsync(req.body);
    const doesExist = await User.findOne({ email: email });
    if (doesExist) throw createError.Conflict(`${email} already registered`);

    const user = new User({ email, password });
    const savedUser = await user.save();

    res.send({ message: "Account Created Successfully. Please login" });
  } catch (error) {
    if (error.isjoi === true) error.status = 422;
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    if (!user) throw createError.NotFound("User Not Registered");
    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch) throw createError.Unauthorized("Username/Password not Valid");
    const accesstoken = await accessToken(user._id);
    const userId = user._id;

    return res.send({ userId, accesstoken, message: "Successfully logged in" });
  } catch (error) {
    if (error.isjoi === true) {
      return next(createError.BadRequest("Invalid Username/Password"));
    }
    next(error);
  }
});

module.exports = router;
