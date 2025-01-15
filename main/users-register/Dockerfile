# שימוש בתמונה של Python
FROM python:3.9-slim

# הגדרת תיקיית העבודה
WORKDIR /app

# העתקת כל הקבצים לתוך הקונטיינר
COPY . .

# התקנת הספריות הנדרשות
RUN pip install --no-cache-dir -r requirements.txt

# חשיפת הפורט
EXPOSE 5000

# פקודת ההפעלה של השירות
CMD ["python", "app.py"]
