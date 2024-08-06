const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
if (username in users) {
    return true;
} else {
    return false;
}
}

const authenticatedUser = (username,password)=>{
    // Check if the username exists
    if (isValid(username)) {
        // Access the user object directly using the username
        const user = users[username];
        // Check if the provided password matches the stored password
        if (user.password === password) {
            return true;
        }
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(users)
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; // Assuming review is passed as a query parameter
    const username = req.session.username;

    if (!review) {
        return res.status(400).json({ error: 'Review content is required' });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ error: 'Book not found' });
    }

    // Add or update the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: 'Review added/updated successfully' });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ error: 'Book not found' });
    }

    // Check if the review exists for the current user
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ error: 'Review not found for this user' });

    }
    delete books[isbn].reviews[username];

        return res.status(200).json({ message: 'Review deleted successfully' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
