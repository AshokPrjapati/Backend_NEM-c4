const express = require("express");
const UserModel = require("../model/User.model");
const user = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require("dotenv").config();

user.post("/register", async (req, res) => {
    const payload = req.body;
    try {
        let user = await UserModel.findOne(payload);
        if (user) return res.status(401).send({ message: "User already exist, please login" });
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(payload.password, saltRounds);
        payload.password = hashedPassword;
        let newUser = new UserModel(payload);
        await newUser.save();
        res.status(200).send({ message: "New user registered succesfully" });
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
});

user.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await UserModel.findOne({ email });
        if (!user) return res.status(401).send({ message: "Wrong Credentials" });
        bcrypt.compare(password, user.password, function (error, result) {
            if (result) {
                const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
                res.status(200).send({ message: "Login Success", token });
            } else res.send({ message: "Incorrect Password", error })
        });

    } catch (err) {
        res.status(500).send({ error: e.message });
    }
});


module.exports = user;