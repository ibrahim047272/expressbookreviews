const express = require('express');
const axios = require('axios');
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

// Task 10: Get all books using Promise / Axios / Async-Await
public_users.get('/', async function (req, res) {
  try {
    const response = await new Promise((resolve) => resolve(books));
    return res.status(200).send(JSON.stringify(response, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Task 11: Get book details based on ISBN using Promise / Axios / Async-Await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    });
    return res.status(200).send(book);
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

// Task 12: Get book details based on author using Axios / Async-Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const matchingBooks = await new Promise((resolve, reject) => {
      let result = [];
      for (let key in books) {
        if (books[key].author === author) {
          result.push({"isbn": key, ...books[key]});
        }
      }
      if (result.length > 0) resolve(result);
      else reject("No books found for this author");
    });
    return res.status(200).send({"booksbyauthor": matchingBooks});
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

// Task 13: Get book details based on title using Axios / Async-Await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const matchingBooks = await new Promise((resolve, reject) => {
      let result = [];
      for (let key in books) {
        if (books[key].title === title) {
          result.push({"isbn": key, ...books[key]});
        }
      }
      if (result.length > 0) resolve(result);
      else reject("No books found with this title");
    });
    return res.status(200).send({"booksbytitle": matchingBooks});
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
