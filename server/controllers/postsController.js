const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");

//Get single post
const getPost = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug }).lean();
        if (!post) return res.status(400).json({ message: "No post found!" });

        //Map author
        const author = await User.findById(post.user, {fullName:1, _id:0}).lean().exec();
        const resultPost = { ...post, author: author ? author.fullName : undefined };

        res.status(200).json(resultPost);
    } catch(err) {
        res.status(500).json({ err });
    }
}

//Get multiple posts
const getPosts = async (req, res) => {
    const { author, cate: category, tags } = req.query;

    try {
        const page = req.query.page ? (Number(req.query.page) - 1) : 0;
        const size = req.query.size ? Number(req.query.size) : 8;
        const startIndex = page * size;
        let condition = {};
        let total;
        let posts;
        
        //Apply condition
        if (author) condition = { ...condition, 'author.fullName': {'$regex': author, '$options': 'i'}};
        if (category) condition = { ...condition, category };
        if (tags) {
            const tagsArr = [].concat(tags);
            condition = { ...condition, tags: { "$in": tagsArr } }
        }
        
        if (author) {
            const agg = await Post.aggregate().lookup({ from: 'users', localField: 'user', foreignField: '_id', as: 'author' })
            .unwind({ path: '$author', preserveNullAndEmptyArrays: true })
            .match(condition)
            .facet({
                data: [{ $skip: startIndex }, { $limit: size }, { $sort: { _id: -1 }}],
                info: [{ $count: 'totalElements'}]
            })
            .project({ author: 0 })
            .exec();

            posts = agg[0].data;
            total = agg[0]?.info[0]?.totalElements || 0;
        } else {
            posts = await Post.find(condition).sort({ _id: -1 }).limit(size).skip(startIndex).lean();
            total = await Post.countDocuments(condition) || 0;
        }

        res.status(200).json({ 
            data: posts, 
            info: {
                currPage: page, 
                pageSize: size,
                totalElements: total,
                numberOfPages: Math.ceil(total / size)
            }
        });
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

//Create new post
const createPost = async (req, res) => {
    const { title, description, markdown, category, tags } = req.body;
    const baseUrl = req.protocol + "://" + req.headers.host + "/api/images/";

    //Authorization
    if (!title || !description || !markdown || !category) {
        return res.status(400).json({ message: "Please fill in all required!" });
    }

    //Check if post existed
    const post = await Post.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (post) return res.status(409).json({ message: "Post with this Title already existed!"});

    //Create new post
    const newPost = new Post({
        title,
        description,
        markdown,
        category,
        thumbnail: baseUrl + req.file.filename,
        tags: tags.split(","),
        user: req.auth.id
    });

    try {
        const post = await newPost.save();
        res.status(200).json(post);
    } catch(err) {
        res.status(500).send(err);
    }
}

//Update post
const updatePost = async (req, res) => {
    const { title, description, markdown, category, thumbnail, tags } = req.body;
    const { id } = req.params;
    const baseUrl = req.protocol + "://" + req.headers.host + "/api/images/";

    //Authorization
    if (!title || !description || !markdown || !category) {
        return res.status(400).json({ message: "Please fill in all required!" });
    }

    //Get original post
    let post = await Post.findById(id).exec();
    if (!post) return res.status(400).json({ message: "Post not found!"});

    //Check if post existed
    const duplicate = await Post.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== post.id) return res.status(409).json({ message: "Post with this Title already existed!"})

    try {
        post.title = title;
        post.description = description;
        post.markdown = markdown;
        post.category = category;
        post.tags = tags.split(",");

        if (thumbnail && !req.file) {
            post.thumbnail = thumbnail;
        } else {
            post.thumbnail = baseUrl + req.file.filename;
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
        console.log(err);
        res.status(500).send(err);
    }
}

//Delete post
const deletePost = async (req, res) => {
    //Get original post
    const { id } = req.params;
    const post = await Post.findById(id).exec();
    if (!post) return res.status(400).json({ message: "Post not found!"});

    try {
        if (post.user == req.auth.id || req.auth.isAdmin) {
            try{
                //Delete post's comment
                await Comment.deleteMany({ post: post._id }).exec();
                //Delete post
                await Post.findByIdAndDelete(id);
                res.status(200).json({ message: "Post deleted"});
            } catch(err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json({ message: "Wrong user!" });
        }
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

module.exports = {
    getPost,
    getPosts,
    createPost,
    updatePost,
    deletePost
}