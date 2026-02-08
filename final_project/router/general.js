const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (isValid(username)) {
    users.push({username, password});
    return res.status(200).json({message: "User registered successfully"});
  } else {
    return res.status(400).json({message: "Username already exists"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (book) {
    return res.send(JSON.stringify(book,null,4));
  } else {
    return res.status(500).json({message: "Error retrieving book details"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const booksByAuthor = Object.values(books).filter(book => book.author === req.params.author);
  if (booksByAuthor.length > 0) {
    return res.send(JSON.stringify(booksByAuthor,null,4));
  } else {
    return res.status(500).json({message: "Error retrieving book details"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const booksByTitle = Object.values(books).filter(book => book.title === req.params.title);
  if (booksByTitle.length > 0) {
    return res.send(JSON.stringify(booksByTitle,null,4));
  } else {
    return res.status(500).json({message: "Error retrieving book details"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if (book) {
    return res.send(JSON.stringify(book.reviews,null,4));
  } else {
    return res.status(500).json({message: "Error retrieving book reviews"});
  }
});

module.exports.general = public_users;
