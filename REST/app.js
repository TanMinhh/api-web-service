const express = require("express");
const app = express();
const productRoutes = require("./routes/products");
const connectDB = require("./mongodb/connect");
require("dotenv").config();

// Define a route
app.get("/", (req, res) => {
    res.send("Hi, I'm live!");
});

// Middleware - Set router
app.use("/api/products", productRoutes);

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(PORT, () => {
            console.log(`${PORT} Yes I am connected`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();