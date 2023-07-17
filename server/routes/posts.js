const router = require("express").Router();
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; //Remove Bearer
    if (token == null) res.status(401).json("Not authenticated!")

    jwt.verify(token, process.env.SECRET_KEY, (err, auth) => {
        if (err) return res.status(403).json("Invalid token!");
        req.auth = auth;
        next();
    });
}

//Get post by [id]
router.get("/:slug", async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });
        res.status(200).json(post);
    } catch(err) {
        res.status(500).json(err);
    }
})

//Get all posts
router.get("/", async (req, res) => {
    const username = req.query.user;
    const category = req.query.cate;
    const tags = req.query.tags;

    try {
        let posts;
        if (username){
            posts = await Post.find({username});
        } else if (category) {
            posts = await Post.find({category});
        } else if (tags) {
            posts = await Post.find({tags: {
                $in: [tags]
            }});
        } else {
            posts = await Post.find();
        }
        res.status(200).json(posts);
    } catch(err) {
        res.status(500).json(err);
    }
});

//Create post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const post = await newPost.save();
        res.status(200).json(post);
    } catch(err) {
        res.status(500).json(err);
    }
})

//Update post by [id]
router.put("/:slug", async (req, res) => {
    try {
        let post = await Post.findOne({ slug: req.params.slug });
        post.title = req.body.title;
        post.description = req.body.description;
        post.markdown = req.body.markdown;
        post.thumbnail = req.body.thumbnail;
        post.category = req.body.category;

        if (req.body.tags) {
            post.tags = req.body.tags;
        }

        if (post.username === req.body.username) {
            try{
                const updatedPost = await post.save();
                res.status(200).json(updatedPost);
            } catch(err){
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("Wrong user");
        }
    } catch(err) {
        res.status(500).json(err);
    }
})

//Delete post by [id]
router.delete("/:slug", async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });
        if (post.username === req.body.username) {
            try{
                await Post.findOneAndDelete({ slug: req.params.slug });
                res.status(200).json("Post deleted");
            } catch(err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("Wrong user");
        }
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router