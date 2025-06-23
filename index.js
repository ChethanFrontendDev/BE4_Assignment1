const express = require("express");
const cors = require("cors");
const app = express();

const { initializeDatabse } = require("./db/db.connect");
const Book = require("./models/books.models");

app.use(cors());
app.use(express.json());
initializeDatabse();

// // data 1 to pass as req body from postman
// {
//   "title": "Lean In",
//   "author": "Sheryl Sandberg",
//   "publishedYear": 2012,
//   "genre": ["Non-fiction", "Business"],
//   "language": "English",
//   "country": "United States",
//   "rating": 4.1,
//   "summary": "A book about empowering women in the workplace and achieving leadership roles.",
//   "coverImageUrl": "https://example.com/lean_in.jpg"
// };

// // data 2 to pass as req body from postman
// {
//   "title": "Shoe Dog",
//   "author": "Phil Knight",
//   "publishedYear": 2016,
//   "genre": ["Autobiography", "Business"],
//   "language": "English",
//   "country": "United States",
//   "rating": 4.5,
//   "summary": "An inspiring memoir by the co-founder of Nike, detailing the journey of building a global athletic brand.",
//   "coverImageUrl": "https://example.com/shoe_dog.jpg"
// };

const createBook = async (newBook) => {
  try {
    const book = new Book(newBook);
    const saveBook = await book.save();
    return saveBook;
  } catch (error) {
    console.log("Failed to add Book", error);
  }
};

app.post("/books", async (req, res) => {
  try {
    const savedBook = await createBook(req.body);
    if (savedBook) {
      res
        .status(201)
        .json({ message: "Book added successfully.", book: savedBook });
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add book." });
  }
});

// read all books
const readAllBooks = async () => {
  try {
    const allBooks = await Book.find();
    return allBooks;
  } catch (error) {
    console.log("Error while fetching all books", error);
  }
};

app.get("/books", async (req, res) => {
  try {
    const books = await readAllBooks();
    if (books.length !== 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "No Books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// read book by title
const readBookByTitle = async (bookTitle) => {
  try {
    const readBooks = await Book.findOne({ title: bookTitle });
    return readBooks;
  } catch (error) {
    console.log("Error while fetching books by title", error);
  }
};

app.get("/books/:title", async (req, res) => {
  try {
    const books = await readBookByTitle(req.params.title);
    if (books.length !== 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "No Books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Books." });
  }
});

// read book by author
const readBookByAuthor = async (authorName) => {
  try {
    const readBooks = await Book.find({ author: authorName });
    return readBooks;
  } catch (error) {
    console.log("Error while fetching book by author name", error);
  }
};

app.get("/books/author/:authorName", async (req, res) => {
  try {
    const books = await readBookByAuthor(req.params.authorName);
    if (books.length !== 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "No Books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// read book by genre
const readBookByGenre = async (genreName) => {
  try {
    const readBooks = await Book.find({ genre: genreName });
    return readBooks;
  } catch (error) {
    console.log("Error while fetching book by genre", error);
  }
};

app.get("/books/genre/:genreName", async (req, res) => {
  try {
    const books = await readBookByGenre(req.params.genreName);
    if (books.length !== 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "No Books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Books." });
  }
});

// read book by released year
const readBookByReleasedYear = async (releasedYear) => {
  try {
    const readBooks = await Book.find({ publishedYear: releasedYear });
    return readBooks;
  } catch (error) {
    console.log("Error while fetching book by released year", error);
  }
};

app.get("/books/published/:releasedYear", async (req, res) => {
  try {
    const books = await readBookByReleasedYear(req.params.releasedYear);
    if (books.length !== 0) {
      res.json(books);
    } else {
      res.status(404).json({ error: "No Books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// update the book rating by id
const updateBookRating = async (bookId, dataToUpdate) => {
  try {
    const updateBook = await Book.findByIdAndUpdate(bookId, dataToUpdate, {
      new: true,
    });
    return updateBook;
  } catch (error) {
    console.log("Error while updating the book rating", error);
  }
};

app.post("/books/:bookId", async (req, res) => {
  try {
    const updatedBook = await updateBookRating(req.params.bookId, req.body);
    if (updatedBook) {
      res
        .status(200)
        .json({ message: "Book updated successfully", book: updatedBook });
    } else {
      res.status(404).json({ error: "Book does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update books." });
  }
});

// update the book rating by title
const updateBookDetailsByTitle = async (bookTitle, dataToUpdate) => {
  try {
    const updateBook = await Book.findOneAndUpdate(
      { title: bookTitle },
      dataToUpdate,
      {
        new: true,
      }
    );
    return updateBook;
  } catch (error) {
    console.log("Error while updating the book details by title", error);
  }
};

app.post("/books/details/:bookTitle", async (req, res) => {
  try {
    const updatedBook = await updateBookDetailsByTitle(
      req.params.bookTitle,
      req.body
    );
    if (updatedBook) {
      res
        .status(200)
        .json({ message: "Book updated successfully", book: updatedBook });
    } else {
      res.status(404).json({ error: "Book does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book." });
  }
});

// delete book by id
const deleteBook = async (bookId) => {
  try {
    const deleteBook = await Book.findByIdAndDelete(bookId);
    return deleteBook;
  } catch (error) {
    console.log("Error deleting an book", error);
  }
};

app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBook(req.params.bookId);
    if (deletedBook) {
      res.status(200).json({ message: "Book deleted successfully." });
    } else {
      res.status(404).json({ error: "Book does not exist." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete a book." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
