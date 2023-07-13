const router = require("express").Router();
const Post = require("../models/Post");

//Get post by [id]
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch(err) {
        res.status(500).json(err);
    }
})

//Get all posts
router.get("/", async (req, res) => {
    const username = req.query.user;
    const categories = req.query.cate;

    try {
        let posts;
        if (username){
            posts = await Post.find({username});
        } else if (cate) {
            posts = await Post.find({categories: {
                $in: [categories]
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
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try{
                const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                    $set: req.body
                }, {new: true});
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
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try{
                await Post.findByIdAndDelete(req.params.id);
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