const SpecialPackage = require("../models/specialPackage");

exports.createPackage = async (req, res) => {
  const { title, description, price, deliveryDate, products, category } =
    req.body;

  if (!title || !description || !price || !category || !products) {
    return res
      .status(400)
      .json({ error: "All required fields must be provided" });
  }

  try {
    const newPackage = new SpecialPackage({
      title,
      description,
      price,
      category,
      products,
      deliveryDate,
      customMessage: "",
    });

    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    console.error("Error creating package: ", error);
    res.status(500).json({ error: "Error creating package" });
  }
};

// Get all special packages
exports.getSpecialPackages = async (req, res) => {
  try {
    const packages = await SpecialPackage.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching packages" });
  }
};

// Add a custom message for the package
exports.addCustomMessage = async (req, res) => {
  const { packageId, customMessage } = req.body;
  try {
    const specialPackage = await SpecialPackage.findById(packageId);
    if (!specialPackage)
      return res.status(404).json({ error: "Package not found" });

    specialPackage.customMessage = customMessage;
    await specialPackage.save();

    res.status(200).json(specialPackage);
  } catch (error) {
    res.status(500).json({ error: "Error adding custom message" });
  }
};
