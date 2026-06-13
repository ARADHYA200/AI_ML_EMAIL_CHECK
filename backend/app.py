from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)

model = pickle.load(open("spam_model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"error": "Empty input"}), 400

    vec = vectorizer.transform([text])
    pred = model.predict(vec)[0]
    probs = model.predict_proba(vec)[0]

    confidence = round((probs[1] if pred == 1 else probs[0]) * 100, 2)

    return jsonify({
        "prediction": "Spam" if pred == 1 else "Not Spam",
        "confidence": confidence
    })

@app.route("/predict-file", methods=["POST"])
def predict_file():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    text = file.read().decode("utf-8")

    vec = vectorizer.transform([text])
    pred = model.predict(vec)[0]
    probs = model.predict_proba(vec)[0]

    confidence = round((probs[1] if pred == 1 else probs[0]) * 100, 2)

    return jsonify({
        "prediction": "Spam" if pred == 1 else "Not Spam",
        "confidence": confidence
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)

