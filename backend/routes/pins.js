const router = require("express").Router();

const Pin = require("../models/Pin");

// Create a Pin

router.post("/", async (req, res) => {
  req.body.nest = generateNestLink(req.body.lat, req.body.long);
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all Pins

router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});

function generateNestLink(lat, lng) {
  // This would be the mission room in SyncNest that would be 
  // Generated for a location
  // # TO-DO
  return lat + "boom" + lng;
}

module.exports = router;
