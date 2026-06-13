import pickle

model = pickle.load(open("spam_model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

msg = ["Congratulations you won a free lottery"]
msg_vec = vectorizer.transform(msg)

prediction = model.predict(msg_vec)

print("Spam" if prediction[0] == 1 else "Not Spam")
