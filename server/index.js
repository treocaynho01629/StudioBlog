require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const corsOptions = require("./configs/corsOption");
const { logger, logEvents } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./configs/dbConn");
const cookieParser = require('cookie-parser');
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");
const cateRoute = require("./routes/categories");
const imageRoute = require("./routes/images");
const googleRoute = require("./routes/google");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.enable('trust proxy');

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use("/images", express.static(path.join(__dirname, "/images")));

//Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/categories", cateRoute);
app.use("/api/images", imageRoute);
app.use("/api/google", googleRoute);

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