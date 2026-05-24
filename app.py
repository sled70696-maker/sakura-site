from flask import Flask, render_template, jsonify, send_from_directory
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PHOTOS_DIR = os.path.join(BASE_DIR, "photos")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/photos")
def photos():
    if not os.path.exists(PHOTOS_DIR):
        return jsonify([])

    files = [
        f for f in os.listdir(PHOTOS_DIR)
        if f.lower().endswith((".jpg", ".png", ".jpeg", ".webp"))
    ]

    return jsonify([f"/photos/{f}" for f in files])

@app.route("/photos/<path:filename>")
def get_photo(filename):
    return send_from_directory(PHOTOS_DIR, filename)

if __name__ == "__main__":
    app.run(debug=True)