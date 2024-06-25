from flask import Flask, render_template, request, jsonify
import json
import tensorflow as tf
import numpy as np
from PIL import Image
import base64
import io


app = Flask(__name__, static_folder='static')
model = tf.keras.models.load_model("C:/Users/Admin/OneDrive/Desktop/Python/doodle-classifier/model/animal-doodle-classifier.h5")


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@app.route('/process_data', methods=['POST'])
def process_pixel_data():
    data = request.json
    image_data = data['imageData'].split(',')[1]  

    img_pxs = process_image(image_data)
    predictions = get_preds(img_pxs)

    return jsonify({'predictions': predictions})



#Convert raw image data into model input
def process_image(image):

    img = base64.b64decode(image)
    image = Image.open(io.BytesIO(img)).convert('L')
    image.save('output_image.jpg', 'JPEG')

    input_data = np.array(image)
    modified_input_data = Image.fromarray(input_data).convert('L').resize((64,64))
    img_array = np.array(modified_input_data)/255.0

    modified_input_data.save('output_image1.jpg', 'JPEG')

    return np.reshape(img_array, (1,64,64,1))


def get_preds(input):
    pred = model.predict(input)
    return pred[0].tolist()

if __name__ == '__main__':
    app.run(debug=True)