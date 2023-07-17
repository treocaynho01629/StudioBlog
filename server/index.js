const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const cateRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const {google} = require("googleapis");
const { default: axios } = require("axios");
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(console.log("Connected to MongoDB"))
.catch(err => console.log(err));

const apiKey = process.env.API_KEY;
const youtube = google.youtube({
    version: 'v3',
    auth: apiKey,
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images")
    }, filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
})

const upload = multer({storage: storage});
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("Image uploaded");
})

app.get("/api/videos", async (req, res, next) => {
    let amount = req.query.amount;

    try {
        if (!amount){
            amount = 5;
        }

        const response = await youtube.playlistItems.list({
            part: "snippet",
            type: "video",
            playlistId: "PLQvl7FIVVS7Ra5zXDWp1tp0D-5mM50DOR",
            maxResults: amount
        });

        const videos = response.data.items.map((item) => { 
            return { 
                videoId: item.snippet.resourceId.videoId, 
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.maxres.url
            } 
        }
        
        );
        res.status(200).json(videos);
    } catch(err) {
        next(err);
    }
})

app.get("/api/reviews", async (req, res, next) => {
    try {
        const placeId = 'ChIJs-ARcbATcTERIH6s54a3f00';
        const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&language=vi&key=${apiKey}`
        const response = await axios.get(url);
        const reviews = response.data.result.reviews.map((review) => { 
            return { 
                author: review.author_name, 
                content: review.text,
                rating: review.rating,
                time: review.relative_time_description,
                avatar: review.profile_photo_url,
                url: review.author_url
            } 
        });
	    res.status(200).json(reviews);
    } catch(err) {
        next(err);
    }
})

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", cateRoute);

app.listen("5000", () => {
    console.log("Connected");
});