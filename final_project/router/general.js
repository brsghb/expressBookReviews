const express = require('express');
const axios = require('axios');
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

function getBooks() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getBooks().then((books) => {
    return res.send(JSON.stringify(books,null,4));
  }).catch((error) => {
    return res.status(500).json({message: "Error retrieving book list"});
  });
});

// Use axios to fetch book details from API
function getBookByISBN(isbn) {
  return axios.get(`http://localhost:5000/`)
    .then(response => {
      const book = response.data[isbn];
      if (book) {
        return book;
      } else {
        throw new Error("Book not found");
      }
    })
    .catch(error => {
      throw new Error("Error retrieving book details");
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  getBookByISBN(req.params.isbn).then((book) => {
    return res.send(JSON.stringify(book,null,4));
  }).catch((error) => {
    return res.status(500).json({message: error});
  });
});

function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("No books found for the given author");
    }
  });
}

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  getBooksByAuthor(req.params.author).then((booksByAuthor) => {
    return res.send(JSON.stringify(booksByAuthor,null,4));
  }).catch((error) => {
    return res.status(500).json({message: error});
  });
});

function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject("No books found for the given title");
    }
  });
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  getBooksByTitle(req.params.title).then((booksByTitle) => {
    return res.send(JSON.stringify(booksByTitle,null,4));
  }).catch((error) => {
    return res.status(500).json({message: error});
  });
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
