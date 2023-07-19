const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const path = require("path");

const checkFileType = function (file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|svg/;

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Can only upload image!");
  }
};

var storage = new GridFsStorage({
  url: process.env.MONGO_URL,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: 'images',
      filename: `${Date.now()}-${file.originalname}`
    };
  }
});

var upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});
var uploadFileMiddleware = util.promisify(upload.single("file"));
var uploadFilesMiddleware = util.promisify(upload.array("file", 10));
module.exports = {
  upload,
  uploadFileMiddleware,
  uploadFilesMiddleware
}