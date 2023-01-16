
from flask import Flask, request
from keras.models import load_model
import numpy as np
import json

model = load_model('toxicity.h5')

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    print("the request has been made:",request)
    data = request.get_json()
    input_data = vectorizer(data['input'])
    prediction = model.predict(np.expand_dims(input_data,0))
    return json.dumps({'output': prediction})


if __name__ == '__main__':
    app.run(debug=True)

