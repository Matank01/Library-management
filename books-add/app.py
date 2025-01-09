# File: add_book_service.py
from flask import Flask, jsonify, request
from pymongo import MongoClient

# Initialize Flask app
app = Flask(__name__)

# Initialize MongoDB client
client = MongoClient("mongodb://mongodb:27017/")
db = client.library_management
books_collection = db.books

# Endpoint to add a book
@app.route('/books', methods=['POST'])
def add_book():
    # Get book data from request
    book_data = request.json

    # Validate book data
    if not book_data.get("title") or not book_data.get("author") or not book_data.get("category"):
        return jsonify({"error": "Missing required fields (title, author, category)"}), 400

    # Insert book into the database
    result = books_collection.insert_one(book_data)

    # Return success response with book ID
    return jsonify({"message": "Book added successfully", "book_id": str(result.inserted_id)}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)
