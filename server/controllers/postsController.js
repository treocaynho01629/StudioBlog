const Post = require("../models/Post");
const User = require("../models/User");

//Get single post
const getPost = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug }).lean();
        if (!post) return res.status(400).json({ message: "No user found!" });

        //Map author
        const author = await User.findById(post.user, {fullName:1, _id:0}).lean().exec();
        const resultPost = { ...post, author: author.fullName };

        res.status(200).json(resultPost);
    } catch(err) {
        res.status(500).json(err);
    }
}

//Get multiple posts
const getPosts = async (req, res) => {
    const username = req.query.user;
    const category = req.query.cate;
    const tags = req.query.tags;

    try {
        let posts;
        
        if (username){ //Find by author
            posts = await Post.find({username}).lean();
        } else if (category) { //Find by category
            posts = await Post.find({category}).lean();
        } else if (tags) { //Find by tags
            posts = await Post.find({tags: {
                $in: [tags]
            }}).lean();
        } else { //Find all
            posts = await Post.find().lean();
        }

        if (!posts.length) return res.status(400).json({ message: "No posts found!"});

        res.status(200).json(posts);
    } catch(err) {
        res.status(500).json(err);
    }
}

//Create new post
const createPost = async (req, res) => {
    const { title, description, markdown, category, thumbnail, tags } = req.body

    //Authorization
    if (!title || !description || !markdown || !category) {
        return res.status(400).json({ message: "Please fill in all required!" })
    }

    //Check if post existed
    const post = await Post.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (post) return res.status(409).json({ message: "Post with this Title already existed!"})

    //Create new post
    const newPost = new Post({
        title,
        description,
        markdown,
        category,
        thumbnail,
        tags,
        user: req.auth.id
    });

    try {
        const post = await newPost.save();
        res.status(200).json(post);
    } catch(err) {
        res.status(500).json(err);
    }
}

//Update post
const updatePost = async (req, res) => {
    const { title, description, markdown, category, thumbnail, tags } = req.body

    //Authorization
    if (!title || !description || !markdown || !category) {
        return res.status(400).json({ message: "Please fill in all required!" })
    }

    //Get original post
    let post = await Post.findOne({ slug: req.params.slug }).exec();
    if (!post) return res.status(400).json({ message: "Post not found!"})

    //Check if post existed
    const duplicate = await Post.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== post.id) return res.status(409).json({ message: "Post with this Title already existed!"})
    
    try {
        post.title = title;
        post.description = description;
        post.markdown = markdown;
        post.category = category;
        post.thumbnail = thumbnail;

        if (tags.length) {
            post.tags = tags;
        }

        if (post.user == req.auth.id || req.auth.isAdmin) {
            try{
                const updatedPost = await post.save();
                res.status(200).json(updatedPost);
            } catch(err){
                res.status(500).json(err);
            }
        } else {
            res.status(401).json({ message: "Wrong user!"});
        }
    } catch(err) {
        res.status(500).json(err);
    }
}

//Delete post
const deletePost = async (req, res) => {
    //Get original post
    const post = await Post.findOne({ slug: req.params.slug }).exec();
    if (!post) return res.status(400).json({ message: "Post not found!"})

    try {
        if (post.user == req.auth.id || req.auth.isAdmin) {
            try{
                await Post.findOneAndDelete({ slug: req.params.slug });
                res.status(200).json({ message: "Post deleted"});
            } catch(err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json({ message: "Wrong user!" });
        }
    } catch(err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getPost,
    getPosts,
    createPost,
    updatePost,
    deletePost
}