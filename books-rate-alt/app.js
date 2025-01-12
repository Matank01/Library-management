const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 5009;

// Middleware for JSON parsing
app.use(express.json());

// MongoDB Connection
const MONGO_URI =
  "mongodb+srv://matank222:ElzWhd3CUam4K8iw@library.l5ntd.mongodb.net/?retryWrites=true&w=majority";
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

// Add Rating Endpoint
app.post("/add-rating", async (req, res) => {
  /**
   * Add a rating to a book.
   *
   * Request Body:
   * {
   *   "book_id": "1",
   *   "rating": 5
   * }
   *
   * Responses:
   * - 200: Rating added successfully and average updated.
   * - 400: Missing fields or invalid rating.
   * - 404: Book not found.
   * - 500: Database connection error or unexpected error.
   */
  if (!booksCollection) {
    return res
      .status(500)
      .json({ error: "Database connection is not established" });
  }

  try {
    const { book_id, rating } = req.body;

    // Validate request body
    if (!book_id || rating === undefined) {
      return res
        .status(400)
        .json({ error: "'book_id' and 'rating' are required" });
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "Rating must be an integer between 1 and 5" });
    }

    // Find the book
    const book = await booksCollection.findOne({ _id: new ObjectId(book_id) });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Update ratings list and calculate the new average
    const updatedRatings = book.ratings ? [...book.ratings, rating] : [rating];
    const averageRating =
      updatedRatings.reduce((sum, r) => sum + r, 0) / updatedRatings.length;

    // Update the book in the database
    await booksCollection.updateOne(
      { _id: new ObjectId(book_id) },
      { $set: { ratings: updatedRatings, average_rating: averageRating } }
    );

    return res.status(200).json({
      message: "Rating added successfully",
      average_rating: averageRating,
      ratings: updatedRatings,
    });
  } catch (err) {
    console.error("Unexpected error occurred:", err);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
