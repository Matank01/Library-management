from bson.objectid import ObjectId
from flask import Flask, jsonify
from pymongo import MongoClient

# יצירת אפליקציה
app = Flask(__name__)


# הגדרת חיבור ל-MongoDB
client = MongoClient("mongodb+srv://matank222:ElzWhd3CUam4K8iw@library.l5ntd.mongodb.net/?retryWrites=true&w=majority&appName=library")
db = client["library"]  # שם בסיס הנתונים
items_collection = db["users"]       # שם האוסף
@app.route('/user_delete/<userID>', methods=['DELETE'])
def delete_item(userID):
    print(items_collection)
    result = items_collection.delete_one({"_id": ObjectId(userID)})
    print(result)
    
    
    if result.deleted_count == 1:
        return jsonify({"message": f"user '{userID}' deleted successfully!"}), 200
    else:
        return jsonify({"error": f"user '{userID}' not found."}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)