const { default: axios } = require("axios");
const {google} = require("googleapis");

const apiKey = process.env.API_KEY;
const youtube = google.youtube({
    version: 'v3',
    auth: apiKey,
});

const getVideos = async (req, res, next) => {
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
}

const getReviews = async (req, res, next) => {
    try {
        const placeId = 'ChIJs-ARcbATcTERIH6s54a3f00';
        const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&language=vi&key=${apiKey}`
        const response = await axios.get(url);
        const reviews = response.data.result?.reviews?.map((review) => { 
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
}

module.exports = {
    getVideos,
    getReviews
}