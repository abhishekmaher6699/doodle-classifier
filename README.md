# Doodle Classification Web App

This web application allows users to draw doodles on a canvas and classify them using a CNN model.

![image](https://github.com/abhishekmaher6699/doodle-classifier/assets/159910557/b5377493-a52e-4da5-8f41-402cb4d328c9)

## Features

- **Canvas Drawing**: Users can draw doodles directly on the canvas.
- **Real-time Classification**: Predicts the class of the doodle using a TensorFlow/Keras model.
- **Visualization**: Displays predictions using a bar chart.
- **Clear Canvas**: Option to clear the canvas and start over.

## Technologies Used

- **Flask**: Python web framework for serving the application.
- **TensorFlow/Keras**: Deep learning library and model for image classification.
- **Chart.js**: JavaScript library for creating charts.
- **HTML/CSS**: Front-end design and interactivity.
- **PIL**: Python Imaging Library for image processing.

## How to Use

1. **Clone the Repository**:
   
   `git clone https://github.com/abhishekmaher6699/doodle-classifier.git
    cd doodle-classifier`

3. **Install Dependencies**:
   
   `pip install -r requirements.txt`

4. **Run the Flask application**:
   
   `python main.py`

 5. **Open Your Browser**:
Navigate to `http://localhost:5000` to use the application.

6. **Draw and Classify**:
- Use the canvas to draw a doodle.
- Click the "Clear" button to start over.
- The app will predict the class of the doodle in real-time and display it in a bar chart.

  ## Model Details

   The application uses a CNN model (`animal-doodle-classifier.h5`) for predicting doodle classes. The model was trained using the [Quick, Draw! Dataset](https://github.com/googlecreativelab/quickdraw-dataset) provided by Google.
   The code for training the model is available in the jupyter notebook.
