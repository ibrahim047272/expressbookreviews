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

// Task 10: Get all books using Promise / async-await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve, reject) => {
      if (books) resolve(books);
      else reject("No books found");
    });
    const bookList = await getBooks;
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

// Task 11: Get book details based on ISBN using Promise / async-await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const getBookByISBN = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });
    const book = await getBookByISBN;
    return res.status(200).send(book);
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

// Task 12: Get book details based on author using Promise / async-await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
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
    const matchingBooks = await getBooksByAuthor;
    return res.status(200).send({"booksbyauthor": matchingBooks});
  } catch (error) {
    return res.status(404).json({message: error});
  }
});

// Task 13: Get book details based on title using Promise / async-await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
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
    const matchingBooks = await getBooksByTitle;
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
