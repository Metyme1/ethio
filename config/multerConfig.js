const multer = require("multer");
const path = require("path");

// Set up multer storage engine
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Please upload an image"), false);
    }
    cb(null, true);
  },
});

module.exports = upload;
