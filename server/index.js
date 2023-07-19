require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const {google} = require("googleapis");
const { default: axios } = require("axios");
const { logger, logEvents } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./configs/dbConn");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const cateRoute = require("./routes/categories");
const imageRoute = require("./routes/images");
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(logger);

app.use(express.json());

app.use(cors());

app.use("/images", express.static(path.join(__dirname, "/images")));

//Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", cateRoute);
app.use("/api/images", imageRoute);

const apiKey = process.env.API_KEY;
const youtube = google.youtube({
    version: 'v3',
    auth: apiKey,
})

app.get("/api/videos", async (req, res, next) => {
    let amount = req.query.amount;

    try {
        if (!amount) amount = 5;

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
        });
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

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Connected port: ${PORT}`);
    });
})

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
})