# File: return_book_service.py
from flask import Flask, jsonify, request
from pymongo import MongoClient

# Initialize Flask app
app = Flask(__name__)

# Initialize MongoDB client
client = MongoClient("mongodb://mongodb:27017/")
db = client.library_management
books_collection = db.books
borrows_collection = db.borrows

# Endpoint to return a book
@app.route('/return', methods=['POST'])
def return_book():
    # Get user ID and book ID from request
    data = request.json
    user_id = data.get("user_id")
    book_id = data.get("book_id")

    # Validate input data
    if not user_id or not book_id:
        return jsonify({"error": "Missing user_id or book_id"}), 400

    # Check if the book is currently borrowed by the user
    borrow_entry = borrows_collection.find_one({"user_id": user_id, "book_id": book_id, "status": "borrowed"})
    if not borrow_entry:
        return jsonify({"error": "No active borrowing found for this user and book"}), 404

    # Update book status to "available"
    books_collection.update_one({"_id": book_id}, {"$set": {"status": "available"}})

    # Update borrow record to "returned"
    borrows_collection.update_one({"user_id": user_id, "book_id": book_id, "status": "borrowed"}, {"$set": {"status": "returned"}})

    return jsonify({"message": "Book returned successfully"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)
