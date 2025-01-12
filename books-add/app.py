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

@app.route('/add_book', methods=['POST'])
def add_book():
    '''
    Flask API to add books to the library database.

    This service connects to a MongoDB instance and handles book addition requests.
    The `/add_book` endpoint accepts a JSON payload with the required fields: 
    `title`, `author`, and `category`. Additional fields such as `status`, 
    `average_rating`, and `borrower_id` are set with default values.

    '''
    if books_collection is None:
        return jsonify({"error": "Database connection is not established"}), 500

    try:
        # קבלת נתוני הספר מהבקשה
        data = request.json
        required_fields = ["title", "author", "category"]

        # בדיקת שדות חובה
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # יצירת הספר החדש
        new_book = {
            "title": data["title"],
            "author": data["author"],
            "category": data["category"],
            "status": "available",
            "average_rating": 0,
            "ratings": [],
            "borrower_id": None  ,
            "count": 0
        }

        # הוספת הספר ל- MongoDB
        result = books_collection.insert_one(new_book)

        # החזרת תשובה ללקוח
        return jsonify({
            "message": "Book added successfully",
            "book_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        print(f"Unexpected error occurred: {e}")
        traceback.print_exc()
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
