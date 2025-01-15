from flask import Flask, request, jsonify
from flask_cors import CORS  # ייבוא Flask-CORS

from pymongo import MongoClient, errors


app = Flask(__name__)
CORS(app)  # הפעלת CORS עבור כל הבקשות

# התחברות ל-MongoDB חיצוני דרך משתנה סביבה
try:
    client = MongoClient("mongodb+srv://matank222:ElzWhd3CUam4K8iw@library.l5ntd.mongodb.net/?retryWrites=true&w=majority&appName=library")  
    # בדיקת חיבור
    client.admin.command('ping')
    print("Connected to MongoDB successfully")
except errors.ServerSelectionTimeoutError as e:
    print(f"Failed to connect to MongoDB: {e}")
    client = None

# מסד הנתונים והקולקציה
db = client["library"]  # שם מסד הנתונים
users_collection = db["users"]  # שם הקולקציה

@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    if not data or "username" not in data:
        return jsonify({"error": "Invalid data. 'username' is required."}), 400

    # שמירת שם המשתמש ב-MongoDB
    user_id = users_collection.insert_one({
        "username": data["username"]
    }).inserted_id

    return jsonify({
        "message": "User registered successfully",
        "user": {
            "id": str(user_id),
            "username": data["username"]
        }
    }), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
