const express = require("express");
const bodyParser = require('body-parser');
const app = express(); // This will be our application

const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors")
app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: false,
}))

const userRoutes = require("./routes/users")
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart');
const stripeRoutes = require('./routes/stripe');

const mongoose = require("mongoose");
mongoose.debug = true
mongoose.set('debug', true);
mongoose.connect(process.env.DATABASE)
    .then(() => console.log("Database Connected!"))
    .catch((error) => console.log(`There is error while Connecting to database! ${error}`))

app.use(express.json());
app.use("/api/auth", authRoutes); // Whenever user hits `/api/users` go to `userRoutes`
app.use("/api/users", userRoutes); // Whenever user hits `/api/users` go to `userRoutes`
app.use("/api/products", productRoutes)
app.use("/api/carts", cartRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/checkout", stripeRoutes)


app.listen(process.env.PORT || 6363, () => {
    console.log(`Running on port ${process.env.PORT}`)
})
