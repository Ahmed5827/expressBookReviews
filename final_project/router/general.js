const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
   if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
}

if (users[username]) {
    return res.status(400).json({ error: 'Username already exists' });
}

users[username] = { password };
console.log(users)
return res.status(201).json({ message: 'User registered successfully' });
  
});



// Get the book list available in the shop
public_users.get('/', (req, res) => {
    getBooks()
        .then(books => {
            res.status(200).json(books);
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});
const getBooks = () => {
    // Simulate async operation (e.g., database query)
    return new Promise((resolve, reject) => {
        // Replace this with actual async operation
        setTimeout(() => {
            resolve(books);
        }, 1000); // Simulate a delay
    });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  getBooks()
  .then(books => {
      res.status(200).json(books[isbn]);
  })
  .catch(error => {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  });
 });
  


 function getBookByAuthor(author) {
    return new Promise((resolve, reject) => {
      let book = null;
      for (let id in books) {
        if (books[id].author === author) {
          book = books[id];
          break;
        }
      }
      if (book) {
        resolve(book);
      } else {
        reject('Book not found');
      }
    });
  }
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
      const book = await getBookByAuthor(author);
      res.send(JSON.stringify(book, null, 4));
    } catch (error) {
      res.status(404).send(error);
    }
  });




// Get all books based on title
function getBookByTitle(title) {
  return new Promise((resolve, reject) => {
    let book = null;
    for (let id in books) {
      if (books[id].title === title) {
        book = books[id];
        break;
      }
    }
    if (book) {
      resolve(book);
    } else {
      reject('Book not found');
    }
  });
}

// Get book details based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const book = await getBookByTitle(title);
    res.send(JSON.stringify(book, null, 4));
  } catch (error) {
    res.status(404).send(error);
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews,null,4));
});

module.exports.general = public_users;
