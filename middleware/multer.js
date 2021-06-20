const multer = require("multer");
const { v4 } = require("uuid");
const path = require("path");

const fileType = {
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "image/png": "png",
};
const fileFilter = (req, file, cb) => {
  if (fileType[file.mimetype]) cb(null, true);
  else cb(null, false);
};
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "public", "uploads", "images"));
  },
  filename: (req, file, cb) => {
    cb(null, v4() + "." + fileType[file.mimetype]);
  },
});

module.exports = { multerStorage, fileFilter };
