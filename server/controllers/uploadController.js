const { uploadFileMiddleware, uploadFilesMiddleware} = require("../middlewares/upload");
const Post = require("../models/Post");

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
    const total = await database.collection('images' + ".files").estimatedDocumentCount() || 0;

    if (total === 0) return res.status(500).json({ message: "Not found any images!" });

    //Pagination
    const page = req.query.page ? (Number(req.query.page) - 1) : 0;
    const size = req.query.size ? Number(req.query.size) : 8;
    const startIndex = page * size;
    const cursor = images.find({}).sort({ _id: -1 }).limit(size).skip(startIndex);

    const baseUrl = req.protocol + "://" + req.headers.host + "/api/images/"
    let fileInfos = [];
    await cursor.forEach((doc) => {
      fileInfos.push({
        id: doc._id,
        name: doc.filename,
        url: baseUrl + doc.filename,
      });
    });

    res.status(200).json({ 
        data: fileInfos, 
        info: {
            currPage: page, 
            pageSize: size,
            totalElements: total,
            numberOfPages: Math.ceil(total / size)
        }
    });
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

const deleteImage = async (req, res, next) => {
  const { name, id } = req.params;

  try {
    const database = mongoClient.db(process.env.DATABASE_NAME);
    const bucket = new GridFSBucket(database, {
      bucketName: 'images',
    });

    let filename;

    if (id) {
      const post = await Post.findById(id).exec();
      if (!post) return res.status(400).json({ message: "Post not found!"});

      const urlParts = post?.thumbnail.split('/');
      filename = urlParts[urlParts.length - 1];
    } else {
      filename = name;
    }

    const images = await bucket.find({ filename });
    images.forEach(image => bucket.delete(image._id));

    console.log(`Deleted image file: ${filename}`);
    next();
  } catch (err){
    console.log(err);
    return res.status(500).json(err);
  }
}

module.exports = {
  uploadImage,
  uploadImages,
  getListImages,
  download,
  deleteImage
};