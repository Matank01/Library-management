from flask import Flask, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# התחברות ל-MongoDB
client = MongoClient("mongodb://mongo:27017/")  # הכתובת של קונטיינר MongoDB
db = client["library_system"]  # שם מסד הנתונים
users_collection = db["users"]  # שם הקולקציה

@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    if not data or "username" not in data or "email" not in data:
        return jsonify({"error": "Invalid data. 'username' and 'email' are required."}), 400

    # שמירת הנתונים ב-MongoDB
    user_id = users_collection.insert_one({
        "username": data["username"],
        "email": data["email"]
    }).inserted_id

    return jsonify({
        "message": "User registered successfully",
        "user": {
            "id": str(user_id),
            "username": data["username"],
            "email": data["email"]
        }
    }), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
