// // File: alt_search_service.js
// const express = require("express");
// const { MongoClient } = require("mongodb");

// // Initialize Express app
// const app = express();
// const PORT = 5008;

// // MongoDB connection
// const mongoUrl = "mongodb://mongodb:27017";
// const client = new MongoClient(mongoUrl);
// let booksCollection;

// async function connectToDatabase() {
//   try {
//     await client.connect();
//     const db = client.db("library_management");
//     booksCollection = db.collection("books");
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     process.exit(1);
//   }
// }

// // Endpoint to search books
// app.get("/alt-books", async (req, res) => {
//   const { title, author, category } = req.query;
//   const searchCriteria = {};

//   if (title) searchCriteria.title = { $regex: title, $options: "i" };
//   if (author) searchCriteria.author = { $regex: author, $options: "i" };
//   if (category) searchCriteria.category = { $regex: category, $options: "i" };

//   try {
//     const books = await booksCollection
//       .find(searchCriteria)
//       .project({ _id: 0 })
//       .toArray();
//     if (books.length > 0) {
//       res.status(200).json({ books });
//     } else {
//       res.status(404).json({ message: "No books found matching the criteria" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Error querying the database" });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(
//     `Alternative search service is running on http://localhost:${PORT}`
//   );
// });

// // Connect to the database when the server starts
// connectToDatabase();
