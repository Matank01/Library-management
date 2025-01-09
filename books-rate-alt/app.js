// // File: alt_rating_service.js
// const express = require("express");
// const { MongoClient } = require("mongodb");
// const bodyParser = require("body-parser");

// // Initialize Express app
// const app = express();
// const PORT = 5009;

// // Middleware to parse JSON requests
// app.use(bodyParser.json());

// // MongoDB connection
// const mongoUrl = "mongodb://mongodb:27017";
// const client = new MongoClient(mongoUrl);
// let ratingsCollection;
// let booksCollection;

// async function connectToDatabase() {
//   try {
//     await client.connect();
//     const db = client.db("library_management");
//     ratingsCollection = db.collection("ratings");
//     booksCollection = db.collection("books");
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     process.exit(1);
//   }
// }

// // Endpoint to rate a book
// app.post("/alt-rate", async (req, res) => {
//   const { user_id, book_id, rating } = req.body;

//   // Validate input data
//   if (!user_id || !book_id || !rating) {
//     return res
//       .status(400)
//       .json({ error: "Missing user_id, book_id, or rating" });
//   }

//   if (typeof rating !== "number" || rating < 1 || rating > 5) {
//     return res
//       .status(400)
//       .json({ error: "Rating must be a number between 1 and 5" });
//   }

//   try {
//     // Check if the book exists
//     const book = await booksCollection.findOne({ _id: book_id });
//     if (!book) {
//       return res.status(404).json({ error: "Book not found" });
//     }

//     // Add rating to the database
//     await ratingsCollection.insertOne({ user_id, book_id, rating });

//     // Calculate the new average rating
//     const ratings = await ratingsCollection.find({ book_id }).toArray();
//     const avgRating =
//       ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

//     // Update the book's average rating
//     await booksCollection.updateOne(
//       { _id: book_id },
//       { $set: { average_rating: avgRating } }
//     );

//     res
//       .status(200)
//       .json({
//         message: "Rating submitted successfully",
//         average_rating: avgRating,
//       });
//   } catch (error) {
//     console.error("Error processing rating:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(
//     `Alternative rating service is running on http://localhost:${PORT}`
//   );
// });

// // Connect to the database when the server starts
// connectToDatabase();
