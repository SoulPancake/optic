const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
// Register

router.post("/register", async (req, res) => {
  try {
    // Generate new Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new User
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save user and send response
    const user = await newUser.save();
    res.status(200).json(user._id);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Login

router.post("/login", async (req, res) => {
  try {
    //Find user
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(400).json("Username not registered!");
      return;
    }

    //Validate password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).json("Incorrect credentials, Try Again!");
      return;
    }

    //Send response
    res.status(200).json({ _id: user._id, username: user.username });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
