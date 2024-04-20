const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path"); // Import the path module to handle file paths

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DBNAME; // Adding dbname to your .env file

// Connect to your local MongoDB instance
mongoose.connect('mongodb://localhost/registration', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// registration Schema
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

// Model of registration schema
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set the static folder for serving HTML files
app.use(express.static(path.join(__dirname, 'pages')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/index.html"));
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Registration.findOne({ email: email });
        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        } else {
            res.redirect("/error");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/success.html"));
});

app.get("/error", (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/error.html"));
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
