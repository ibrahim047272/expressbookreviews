const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username;
  });
  return userswithsamename.length > 0;
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1 & Task 10: Get all books using Promises/Async
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  });
  getBooks
    .then((bks) => res.status(200).send(JSON.stringify(bks, null, 4)))
    .catch((err) => res.status(404).json({message: err}));
});

// Task 2 & Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBook
    .then((book) => res.status(200).send(book))
    .catch((err) => res.status(404).json({message: err}));
});

// Task 3 & Task 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve, reject) => {
    let matchingBooks = [];
    for (let key in books) {
      if (books[key].author === author) {
        matchingBooks.push({"isbn": key, ...books[key]});
      }
    }
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found for this author");
    }
  });

  getBooksByAuthor
    .then((matchingBooks) => res.status(200).send({"booksbyauthor": matchingBooks}))
    .catch((err) => res.status(404).json({message: err}));
});

// Task 4 & Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    let matchingBooks = [];
    for (let key in books) {
      if (books[key].title === title) {
        matchingBooks.push({"isbn": key, ...books[key]});
      }
    }
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found with this title");
    }
  });

  getBooksByTitle
    .then((matchingBooks) => res.status(200).send({"booksbytitle": matchingBooks}))
    .catch((err) => res.status(404).json({message: err}));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).send(books[isbn].reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;

    

  