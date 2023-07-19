const { uploadFileMiddleware, uploadFilesMiddleware} = require("../middlewares/upload");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = process.env.MONGO_URL;

const mongoClient = new MongoClient(url);

const uploadImage = async (req, res, next) => {
  try {
    await uploadFileMiddleware(req, res);
    console.log(req.file);

    if (req.file == undefined) return res.status(400).json({ message: "Must select an image!" });

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const uploadImages = async (req, res, next) => {
  try {
    await uploadFilesMiddleware(req, res);
    console.log(req.files);

    if (req.files.length <= 0) {
      return res.status(400).json({ message: "Must select at least 1 image!" });
    }

    next();
  } catch (err) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: "Too many images (limit: 10)!" });
    }

    return res.status(500).json(err);
  }
};

const getListImages = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(process.env.DATABASE_NAME);
    const images = database.collection('images' + ".files");

    const cursor = images.find({});

    if ((await cursor.count()) === 0) {
      return res.status(500).json({ message: "Not found any images!" });
    }

    const baseUrl = req.protocol + "://" + req.headers.host + "/api/images/"
    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    return res.status(200).json(fileInfos);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const download = async (req, res) => {
  try {
    await mongoClient.connect();

    const database = mongoClient.db(process.env.DATABASE_NAME);
    const bucket = new GridFSBucket(database, {
      bucketName: 'images',
    });

    let downloadStream = bucket.openDownloadStreamByName(req.params.name);

    downloadStream.on("data", function (data) {
      return res.status(200).write(data);
    });

    downloadStream.on("error", function (err) {
      return res.status(404).json({ message: "Cannot download the image!" });
    });

    downloadStream.on("end", () => {
      return res.end();
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  uploadImage,
  uploadImages,
  getListImages,
  download,
};