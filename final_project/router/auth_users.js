const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  if (users.find(user => user.username === username)) {
    return false; // Username already exists
  }
  return true; // Username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const user = users.find((user) => user.username === username && user.password === password);
  return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({data: username}, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken
    }
    return res.status(200).json({message: "User logged in successfully"});
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const {username} = req.user;
  const {review} = req.body;
  const book = books[req.params.isbn];
  if (book) {
    book.reviews[username] = review;
    return res.status(200).json({message: "Review added/updated successfully"});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const {username} = req.user;
  const book = books[req.params.isbn];
  if (book) {
    delete book.reviews[username];
    return res.status(200).json({message: "Review deleted successfully"});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
