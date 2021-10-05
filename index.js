const express = require("express");
const app = express(); // This will be our application

const dotenv = require("dotenv");
dotenv.config();

const userRoutes = require("./routes/users")
const authRoutes = require('./routes/auth');

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE)
    .then(() => console.log("Database Connected!"))
    .catch((error) => console.log(`There is error while Connecting to database! ${error}`))

app.use(express.json());
app.use("/api/users", userRoutes); // Whenever user hits `/api/users` go to `userRoutes`
app.use("/api/auth", authRoutes); // Whenever user hits `/api/users` go to `userRoutes`

app.listen(process.env.PORT || 6363, () => {
    console.log(`Running on port ${process.env.PORT}`)
})
