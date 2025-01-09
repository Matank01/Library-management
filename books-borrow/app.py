# File: borrow_book_service.py
from flask import Flask, jsonify, request
from pymongo import MongoClient

# Initialize Flask app
app = Flask(__name__)

# Initialize MongoDB client
client = MongoClient("mongodb://mongodb:27017/")
db = client.library_management
books_collection = db.books
borrows_collection = db.borrows

# Endpoint to borrow a book
@app.route('/borrow', methods=['POST'])
def borrow_book():
    # Get user ID and book ID from request
    data = request.json
    user_id = data.get("user_id")
    book_id = data.get("book_id")

    # Validate input data
    if not user_id or not book_id:
        return jsonify({"error": "Missing user_id or book_id"}), 400

    # Check if the book is available
    book = books_collection.find_one({"_id": book_id})
    if not book:
        return jsonify({"error": "Book not found"}), 404
    if book.get("status") == "borrowed":
        return jsonify({"error": "Book is already borrowed"}), 409

    # Update book status to "borrowed"
    books_collection.update_one({"_id": book_id}, {"$set": {"status": "borrowed"}})

    # Log the borrowing information
    borrows_collection.insert_one({"user_id": user_id, "book_id": book_id, "status": "borrowed"})

    return jsonify({"message": "Book borrowed successfully"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004, debug=True)
