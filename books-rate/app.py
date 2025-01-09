# File: rate_book_service.py
from flask import Flask, jsonify, request
from pymongo import MongoClient

# Initialize Flask app
app = Flask(__name__)

# Initialize MongoDB client
client = MongoClient("mongodb://mongodb:27017/")
db = client.library_management
ratings_collection = db.ratings
books_collection = db.books

# Endpoint to rate a book
@app.route('/rate', methods=['POST'])
def rate_book():
    # Get user ID, book ID, and rating from request
    data = request.json
    user_id = data.get("user_id")
    book_id = data.get("book_id")
    rating = data.get("rating")

    # Validate input data
    if not user_id or not book_id or not rating:
        return jsonify({"error": "Missing user_id, book_id, or rating"}), 400

    if not isinstance(rating, int) or rating < 1 or rating > 5:
        return jsonify({"error": "Rating must be an integer between 1 and 5"}), 400

    # Check if the book exists
    book = books_collection.find_one({"_id": book_id})
    if not book:
        return jsonify({"error": "Book not found"}), 404

    # Add rating to the database
    ratings_collection.insert_one({"user_id": user_id, "book_id": book_id, "rating": rating})

    # Calculate the new average rating
    ratings = ratings_collection.find({"book_id": book_id})
    avg_rating = sum([r["rating"] for r in ratings]) / ratings.count()

    # Update the book's average rating
    books_collection.update_one({"_id": book_id}, {"$set": {"average_rating": avg_rating}})

    return jsonify({"message": "Rating submitted successfully", "average_rating": avg_rating}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5006, debug=True)
