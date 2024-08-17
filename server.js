require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // Middleware to parse incoming request bodies
const WebsiteItem = require("./models/websiteItem"); // Import the WebsiteItem model
const User = require("./models/user_collection"); // Import the User model

// Initialize Express app
const app = express();

// Middleware to parse form data
app.use(express.json()); 
// The express.json() middleware parses this JSON-formatted data and converts it into a JavaScript object.
// This makes it easier for you to work with the data in your routes.

app.use(express.urlencoded({ extended: true }));
// This line uses the express.urlencoded() middleware function to parse
// incoming requests with URL-encoded payloads (typically from HTML form submissions). 

// Serve static files (e.g., CSS, images) if needed
app.use(express.static('public'));
// When a client requests a static file (e.g., an image, CSS, or JavaScript file), 
//the server needs to know where to find it. 
//The express.static('public') middleware tells Express to look for static files in the public directory of your project. 
//For example, if a client requests http://yourdomain.com/styles.css , Express will look for styles.css in the public directory.

const cors = require('cors');
app.use(cors());

// explaination of above 2 lines -> If you are accessing the server from a different domain or port, ensure you handle CORS

// Route to handle the home page or a basic GET request
app.get("/", (req, res) => {
    res.send("Welcome to the homepage!");
    // You can also render an HTML page here using res.render if needed
});

// POST route to handle sign-up form submission
app.post("/signup", (req, res) => {
  console.log(req.body); // Log the incoming request body
  const { Name, Age, Address, Email, Password } = req.body;

  const newUser = new User({
      Name,
      Age,
      Address,
      Email,
      Password, // In a real application, hash the password before storing it!
  });

  newUser.save()
  .then((savedUser) => {
    console.log("User saved successfully:", savedUser); // Log the saved user document
    res.status(201).send("User registered successfully!");
})
.catch((err) => {
    console.error("Error saving user to the database:", err);
    res.status(500).send("Error registering user.");
});
});

// Get PORT and MONGODB_URL from environment variables
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/my_Database";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to the MongoDB database.");

    // Example: Find all entries in the WebsiteItems collection
    WebsiteItem.find({})
      .then((items) => {
        console.log(
          `Found ${items.length} items in the WebsiteItems collection.`
        );
      })
      .catch((err) => {
        console.error(
          "Error fetching items from the WebsiteItems collection:",
          err
        );
      });

    // Initialize user database and check connection
    User.find({})
      .then((users) => {
        console.log(
          `Found ${users.length} users in the users collection.`
        );
      })
      .catch((err) => {
        console.error("Error fetching items from the users collection:", err);
      });

  })
  .catch((err) => {
    console.error("Error connecting to the MongoDB database:", err);
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


