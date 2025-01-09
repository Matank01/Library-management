# File: search_book_service.py
from flask import Flask, jsonify, request
from pymongo import MongoClient

# Initialize Flask app
app = Flask(__name__)

# Initialize MongoDB client
client = MongoClient("mongodb://mongodb:27017/")
db = client.library_management
books_collection = db.books

# Endpoint to search books
@app.route('/books', methods=['GET'])
def search_books():
    # Get query parameters
    query_params = request.args
    search_criteria = {}

    # Add search criteria based on available parameters
    if query_params.get("title"):
        search_criteria["title"] = {"$regex": query_params.get("title"), "$options": "i"}
    if query_params.get("author"):
        search_criteria["author"] = {"$regex": query_params.get("author"), "$options": "i"}
    if query_params.get("category"):
        search_criteria["category"] = {"$regex": query_params.get("category"), "$options": "i"}

    # Query the database
    books = list(books_collection.find(search_criteria, {"_id": 0}))

    if books:
        return jsonify({"books": books}), 200
    else:
        return jsonify({"message": "No books found matching the criteria"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=True)
