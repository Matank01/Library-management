# File: report_service.py
from flask import Flask, jsonify
from pymongo import MongoClient

# Initialize Flask app
app = Flask(__name__)

# Initialize MongoDB client
client = MongoClient("mongodb://mongodb:27017/")
db = client.library_management
books_collection = db.books
borrows_collection = db.borrows
ratings_collection = db.ratings

# Endpoint to generate reports
@app.route('/reports', methods=['GET'])
def generate_report():
    # Total number of books
    total_books = books_collection.count_documents({})

    # Total number of borrows
    total_borrows = borrows_collection.count_documents({"status": "borrowed"})

    # Most popular books (by borrow count)
    popular_books = list(borrows_collection.aggregate([
        {"$group": {"_id": "$book_id", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]))

    # Average ratings per book
    average_ratings = list(ratings_collection.aggregate([
        {"$group": {"_id": "$book_id", "average_rating": {"$avg": "$rating"}}}
    ]))

    # Return the report
    return jsonify({
        "total_books": total_books,
        "total_borrows": total_borrows,
        "popular_books": popular_books,
        "average_ratings": average_ratings
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5007, debug=True)
