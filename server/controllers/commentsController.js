const Comment = require("../models/Comment");
const Post = require("../models/Post");

//Get single comment
const getComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).lean();
        if (!comment) return res.status(400).json({ message: "No comment found!" });

        res.status(200).json(comment);
    } catch (err) {
        res.status(500).send(err);
    }
}

//Get multiple comments
const getComments = async (req, res) => {
    const { post } = req.query;

    try {
        const projection = { post: 0, email: 0 };
        const page = req.query.page ? (Number(req.query.page) - 1) : 0;
        const size = req.query.size ? req.query.size : 8;
        const startIndex = page * size;
        let condition = {};

        //Apply condition
        if (post) condition = { ...condition, post };
        const total = await Comment.countDocuments(condition);
        const comments = await Comment.find({ ...condition }, { ...projection }).sort({ _id: -1 }).limit(size).skip(startIndex).lean();

        res.status(200).json({
            data: comments,
            info: {
                currPage: page,
                pageSize: size,
                totalElements: total,
                numberOfPages: Math.ceil(total / size)
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

//Create new comment
const createComment = async (req, res) => {
    const { fullName, email, content } = req.body;
    const { postId } = req.params;

    //Get original post
    const post = await Post.findById(postId).exec();
    if (!post) return res.status(400).json({ message: "Post not found!" });

    //Authorization
    if (!fullName || !email || !content) {
        return res.status(400).json({ message: "Please fill in all required!" });
    }

    //Create new Comment
    const newComment = new Comment({
        fullName,
        email,
        content,
        post: post._id
    });

    try {
        const comment = await newComment.save();
        res.status(200).json(comment);
    } catch (err) {
        res.status(500).send(err);
    }
}

//Delete comment
const deleteComment = async (req, res) => {
    //Get original comment
    const { id } = req.params;
    const comment = await Comment.findById(id).exec();
    if (!comment) return res.status(400).json({ message: "Comment not found!" });

    try {
        if (req.auth.isAdmin) {
            try {
                //Delete comment
                await Comment.findByIdAndDelete(id);
                res.status(200).json({ message: "Comment deleted" });
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json({ message: "Wrong user!" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

module.exports = {
    getComment,
    getComments,
    createComment,
    deleteComment
}