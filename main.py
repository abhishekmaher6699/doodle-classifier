from flask import Flask, render_template, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import base64
import io

app = Flask(__name__, static_folder='static')

# Load the pre-trained model
model = tf.keras.models.load_model("C:/Users/Admin/OneDrive/Desktop/Python/doodle-classifier/model/animal-doodle-classifier.h5")

@app.route('/', methods=['GET', 'POST'])
def index():
    # Render the main page
    return render_template('index.html')

@app.route('/process_data', methods=['POST'])
def process_pixel_data():
    # Process the received pixel data
    data = request.json
    image_data = data['imageData'].split(',')[1]  # Extract the base64-encoded image data

    img_pxs = process_image(image_data)
    predictions = get_preds(img_pxs)

    return jsonify({'predictions': predictions})

def process_image(image):
    # Convert raw image data into model input
    img = base64.b64decode(image)
    image = Image.open(io.BytesIO(img)).convert('L')  # Convert to grayscale
    # image.save('output_image.jpg', 'JPEG')  # Save the original image for debugging

    input_data = np.array(image)
    modified_input_data = Image.fromarray(input_data).convert('L').resize((64, 64))  # Resize the image to 64x64
    img_array = np.array(modified_input_data) / 255.0  # Normalize the pixel values

    # modified_input_data.save('output_image1.jpg', 'JPEG')  # Save the resized image for debugging

    return np.reshape(img_array, (1, 64, 64, 1))  # Reshape the array to match the model input shape

def get_preds(input):
    # Get predictions from the model
    pred = model.predict(input)
    return pred[0].tolist()  # Convert the prediction to a list

if __name__ == '__main__':
    app.run(debug=True)
