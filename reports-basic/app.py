from flask import Flask, jsonify
from pymongo import MongoClient

# Initialize Flask app
app = Flask(__name__)

# Initialize MongoDB client
try:
    client = MongoClient("mongodb+srv://matank222:ElzWhd3CUam4K8iw@library.l5ntd.mongodb.net/?retryWrites=true&w=majority&appName=library")
    db = client["library"]
    books_collection = db["books"]
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    db = None
    books_collection = None

# Endpoint to generate reports
@app.route('/reports', methods=['GET'])
def generate_report():
    if books_collection is None:
        return jsonify({"error": "Database connection failed"}), 500

    # Total number of books
    total_books = books_collection.count_documents({})

    # Total number of borrows (books currently borrowed)
    total_borrows = books_collection.count_documents({"status": "borrowed"})

    # Most popular books (by borrow count)
    popular_books = list(books_collection.aggregate([
        {"$group": {
            "_id": "$_id",  # Group by book ID
            "title": {"$first": "$title"},  # Include the title
            "total_borrows": {"$sum": "$count"}  # Sum borrow counts
        }},
        {"$sort": {"total_borrows": -1}},  # Sort by total borrows in descending order
        {"$limit": 5}  # Limit to top 5 books
    ]))

    # Convert ObjectId to string for JSON serialization
    for book in popular_books:
        book["_id"] = str(book["_id"])

    # Represent the average_rating field directly
    average_ratings = list(
    books_collection.find(
        {},  # No filter; fetch all books
        {"_id": 1, "title": 1, "average_rating": 1}  # Include only _id, title, and average_rating
    ).sort("average_rating", -1)  # Sort by average_rating in descending order
)


    # Convert ObjectId to string for JSON serialization
    for book in average_ratings:
        book["_id"] = str(book["_id"])

    # Return the report
    return jsonify({
        "total_books": total_books,
        "total_borrows": total_borrows,
        "popular_books": popular_books,
        "average_ratings": average_ratings
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5007, debug=True)
