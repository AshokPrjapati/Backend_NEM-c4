const express = require("express");
const PostModel = require("../model/Post.model");
const posts = express.Router();

posts.get("/", async (req, res) => {

    try {
        const posts = await PostModel.find(req.body);
        res.status(200).send(posts);
    } catch (err) {
        res.status(500).send({ error: e.message });
    }
});


posts.get("/top", async (req, res) => {
    try {
        let posts = await PostModel.find(req.body);
        let max = 0;
        let post;
        for (let el of posts) {
            if (+el["no_of_comments"] > max) {
                max = +el["no_of_comments"];
                post = el
            }
        }
        res.status(200).send(post);
    } catch (err) {
        res.status(500).send({ error: e.message });
    }
});

posts.post("/create", async (req, res) => {
    const payload = req.body;
    try {
        let newPost = new PostModel(payload);
        await newPost.save();
        res.send({ message: "New post is added" })
    } catch (err) {
        console.log({ "error": err.message })
    }
})


posts.patch("/update/:id", async (req, res) => {
    let id = req.params.id;
    const post = await PostModel.findOne({ _id: id });
    const post_userId = post.userId;
    const req_userId = req.body.userId;
    try {
        if (post_userId !== req_userId) return res.send({ message: "You are not authorize to update the post" });
        await PostModel.findByIdAndUpdate({ _id: id }, req.body);
        res.status(200).send("Post has been updated successfully");
    } catch (err) {
        res.send({ message: err.message })
    }
});

posts.delete("/delete/:id", async (req, res) => {
    let id = req.params.id;
    let post = await PostModel.findOne({ _id: id });
    let post_userId = post.userId;
    let req_userId = req.body.userId;
    try {
        if (post_userId !== req_userId) return res.send({ message: "You are not authorize to delete the post" });
        await PostModel.findByIdAndDelete({ _id: id });
        res.status(200).send("Post has been deleted successfully");
    } catch (err) {
        res.send({ message: err.message })
    }
});

module.exports = posts;