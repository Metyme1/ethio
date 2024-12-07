const express = require("express");
const router = express.Router();
const specialPackagesController = require("../controllers/specialPackagesController");

// Route to create a new package
router.post("/packages", specialPackagesController.createPackage);

// Route to get all packages
router.get("/packages", specialPackagesController.getSpecialPackages);

// Route to add a custom message
router.post(
  "/packages/custom-message",
  specialPackagesController.addCustomMessage
);

module.exports = router;
