const express = require("express");
const cors = require("cors")
const connection = require("./config/db");
const authentication = require("./middleware/authentication.mw");
const user = require("./routes/user.routes");
const posts = require("./routes/post.routes");
require("dotenv").config();
const port = process.env.PORT

const app = express();

app.use(express.json());
app.use(cors());
app.use("/users", user);
app.use(authentication);
app.use("/posts", posts)


app.listen(port, async () => {
    try {
        await connection
        console.log("Connected to MongoDB Atlas");
    } catch (err) {
        console.log(err);
    }
    console.log(`server is running at port ${port}`);
})