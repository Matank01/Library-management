from flask import Flask, jsonify, request
from pymongo import MongoClient, errors
from bson.objectid import ObjectId
import traceback


app = Flask(__name__)

# התחברות ל-MongoDB חיצוני דרך משתנה סביבה
try:
    MONGO_URI = "mongodb+srv://matank222:ElzWhd3CUam4K8iw@library.l5ntd.mongodb.net/?retryWrites=true&w=majority&appName=library"
    client = MongoClient(MONGO_URI)
    client.admin.command('ping')  # בדיקת חיבור
    print("Connected to MongoDB successfully")
except errors.ServerSelectionTimeoutError as e:
    print(f"Failed to connect to MongoDB: {e}")
    traceback.print_exc()
    client = None

# הגדרת מסד הנתונים והקולקשן
if client:
    db = client["library"]
    books_collection = db["books"]
else:
    db = None
    books_collection = None

@app.route('/return-book', methods=['POST'])
def return_book():
    """
    Return a borrowed book to the library.

    Request JSON:
        {
            "user_id": "12345",
            "book_id": "1"
        }

    Returns:
        - 200: If the book is returned successfully.
        - 400: If required fields are missing or invalid.
        - 404: If the book is not found or was not borrowed by the user.
        - 500: For database connection or unexpected errors.
    """
    if books_collection is None :
        return jsonify({"error": "Database connection is not established"}), 500

    try:
        # Parse request data
        data = request.json
        if not data or "user_id" not in data or "book_id" not in data:
            return jsonify({"error": "Invalid request. 'user_id' and 'book_id' are required."}), 400

        user_id = data["user_id"]
        book_id = data["book_id"]

        # Check if the book is currently borrowed by the user
        borrow_record = books_collection.find_one({"_id": ObjectId(book_id), "status": "borrowed","borrower_id": user_id})
        if not borrow_record:
            return jsonify({"error": "No active borrowing record found for this user and book"}), 404

        # Update book status to 'available'
        books_collection.update_one({"_id": ObjectId(book_id)}, {"$set": {"status": "available", "borrower_id": None}})

        return jsonify({"message": "Book returned successfully"}), 200

    except Exception as e:
        print(f"Unexpected error occurred: {e}")
        traceback.print_exc()
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005)