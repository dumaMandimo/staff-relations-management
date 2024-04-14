const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const path = require("path");

// Serve static files from the public directory
app.use(express.static(path.join(__dirname)));

// Parse incoming JSON data
app.use(express.json());

// Store users in an array (this should be replaced with a database later)
const users = [];

// Register a new user
app.post("/users", async (req, res) => {
  try {
    const { firstName, lastName, email, password, roles } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roles,
    };
    users.push(user);
    res.status(201).send("User created");
  } catch {
    res.status(500).send("Error creating user");
  }
});

// Login a user
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(password, user.password)) {
      res.send("Login successful");
    } else {
      res.status(401).send("Invalid password");
    }
  } catch {
    res.status(500).send("Error logging in");
  }
});

// For testing purposes, provide a route to get all users
app.get("/users", (req, res) => {
  res.json(users);
});

// Render the HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/signin", (req, res) => {
  res.sendFile(path.join(__dirname, "signIn.html"));
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
