from flask import Flask, jsonify, request
from pymongo import MongoClient, errors
from bson.objectid import ObjectId
import traceback

app = Flask(__name__)

# MongoDB Connection
try:
    MONGO_URI = "mongodb+srv://matank222:ElzWhd3CUam4K8iw@library.l5ntd.mongodb.net/?retryWrites=true&w=majority&appName=library"
    client = MongoClient(MONGO_URI)
    client.admin.command('ping')  # Check connection
    print("Connected to MongoDB successfully")
except errors.ServerSelectionTimeoutError as e:
    print(f"Failed to connect to MongoDB: {e}")
    traceback.print_exc()
    client = None

# Database and Collections
if client:
    db = client["library"]
    books_collection = db["books"]
else:
    db = None
    books_collection = None

@app.route('/add-rating', methods=['POST'])
def add_rating():
    """
    Add a rating to a book.

    Request JSON:
        {
            "book_id": "1",
            "rating": 5
        }

    Returns:
        - 200: If the rating is added successfully and the average is updated.
        - 400: If required fields are missing or invalid.
        - 404: If the book is not found.
        - 500: For database connection or unexpected errors.
    """
    if books_collection is None:
        return jsonify({"error": "Database connection is not established"}), 500

    try:
        # Parse request data
        data = request.json
        if not data or "book_id" not in data or "rating" not in data:
            return jsonify({"error": "Invalid request. 'book_id' and 'rating' are required."}), 400

        book_id = data["book_id"]
        rating = data["rating"]

        # Validate rating
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({"error": "Rating must be an integer between 1 and 5"}), 400

        # Find the book
        book = books_collection.find_one({"_id": ObjectId(book_id)})
        if not book:
            return jsonify({"error": "Book not found"}), 404

        # Append the rating to the `ratings` list
        updated_ratings = book.get("ratings", [])
        updated_ratings.append(rating)

        # Calculate the new average rating
        average_rating = sum(updated_ratings) / len(updated_ratings)

        # Update the book's ratings and average rating in the database
        books_collection.update_one(
            {"_id": ObjectId(book_id)},
            {"$set": {"ratings": updated_ratings, "average_rating": average_rating}}
        )

        return jsonify({
            "message": "Rating added successfully",
            "average_rating": average_rating,
            "ratings": updated_ratings
        }), 200

    except Exception as e:
        print(f"Unexpected error occurred: {e}")
        traceback.print_exc()
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5006)
