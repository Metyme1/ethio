
const Subcategory = require("../models/Subcategory");
const cloudinary = require("../config/cloudinaryConfig");

// Create a new subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const { name, category_id } = req.body;

    let imageUrl = "";

    // Check if an image is included in the request and upload it to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const subcategory = new Subcategory({
      name,
      category_id,
      image_url: imageUrl,
    });

    await subcategory.save();
    res.status(201).json({ message: "Subcategory created successfully", subcategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all subcategories
exports.getSubcategories = async (req, res) => {
  try {
    // Fetch all subcategories and populate the category reference
    const subcategories = await Subcategory.find().populate("category_id");
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category_id } = req.body;

    let imageUrl;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      id,
      {
        name,
        category_id,
        ...(imageUrl && { image_url: imageUrl }), // Update image_url only if a new image was uploaded
      },
      { new: true, runValidators: true }
    );

    if (!updatedSubcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json({ message: "Subcategory updated successfully", updatedSubcategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubcategory = await Subcategory.findByIdAndDelete(id);

    if (!deletedSubcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(204).send(); // No content response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
