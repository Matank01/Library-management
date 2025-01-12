const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 5008;

// MongoDB Connection
const MONGO_URI = "mongodb+srv://matank222:ElzWhd3CUam4K8iw@library.l5ntd.mongodb.net/?retryWrites=true&w=majority";
let booksCollection;

MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to MongoDB successfully");
    const db = client.db("library");
    booksCollection = db.collection("books");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });

// Endpoint to search books
app.get("/search", async (req, res) => {
  /**
   * Search for books based on title, author, or category.
   *
   * Query Parameters:
   * - `title`: Optional, partial or full title of the book.
   * - `author`: Optional, partial or full author name.
   * - `category`: Optional, partial or full category name.
   *
   * Responses:
   * - 200: Books found matching the criteria.
   * - 404: No books found.
   * - 500: Unexpected server or database error.
   */
  if (!booksCollection) {
    return res.status(500).json({ error: "Database connection is not established" });
  }

  try {
    const { title, author, category } = req.query;
    const searchCriteria = {};

    // Build search criteria based on query parameters
    if (title) {
      searchCriteria.title = { $regex: title, $options: "i" };
    }
    if (author) {
      searchCriteria.author = { $regex: author, $options: "i" };
    }
    if (category) {
      searchCriteria.category = { $regex: category, $options: "i" };
    }

    // Query the database
    const books = await booksCollection.find(searchCriteria, { projection: { _id: 0 } }).toArray();

    if (books.length > 0) {
      res.status(200).json({ books });
    } else {
      res.status(404).json({ message: "No books found matching the criteria" });
    }
  } catch (err) {
    console.error("Unexpected error occurred:", err);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Search service is running on http://localhost:${PORT}`);
});
