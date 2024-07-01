// Get the canvas element and its 2D rendering context
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// Set the initial canvas background to white
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height)

// Get the clear canvas button element
var clrCvs = document.getElementById('clrCvs');
var painting = false;  // A flag to indicate if painting is active
var paintingTimer = null;  // Timer for sending pixel data

// Add event listeners for mouse actions on the canvas
canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', stopPainting);
canvas.addEventListener('mousemove', draw);

// Function to start painting
function startPainting(e) {
    painting = true;
    draw(e);  // Start drawing immediately

    // Start the timer to send pixel data every second
    if (!paintingTimer) {
        paintingTimer = setInterval(sendPixels, 1000);
    }
}

// Function to stop painting
function stopPainting() {
    painting = false;
    ctx.beginPath();  // Reset the path to avoid unwanted lines
}

// Function to draw on the canvas
function draw(e) {
    if (!painting) return;

    // Get the mouse position relative to the canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.pageX - rect.left - window.scrollX;
    const mouseY = e.pageY - rect.top - window.scrollY;

    // Set drawing parameters
    ctx.lineWidth = 2;
    ctx.fillStyle = "white";
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    // Draw a line to the current mouse position
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();

    // Begin a new path and move to the current mouse position
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
}

// Function to clear the canvas
function clearCanvas() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stop the timer for sending pixel data
    clearInterval(paintingTimer);
    paintingTimer = null;
    
    // Reset the chart data
    myBarChart.data.datasets[0].data = [0, 0, 0, 0, 0];
    myBarChart.update();

    // Fill the canvas with white color
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


// List of classes for predictions
const classes = ['cat', 'dog', 'rabbit', 'elephant', 'bird']

// Function to send the canvas pixel data to the server
function sendPixels() {
    if (!painting) return;

    // Get the canvas image data as a base64 string
    var canvas = document.getElementById('canvas');
    var img = canvas.toDataURL();

    // Send the image data to the server
    fetch('/process_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageData: img })
    })
    .then(response => response.json())
    .then(data => {
        // Assuming data is an array of percentages
        updateChart(data.predictions);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Bar chart configuration
var barColors = ["red", "green", "blue", "orange", "brown"];
var chartData = {
    labels: classes,
    datasets: [{
        label: 'Values',
        backgroundColor: barColors,
        borderColor: barColors,
        borderWidth: 1,
        data: [0, 0, 0, 0, 0]
    }]
};

// Initialize the bar chart
var chart = document.getElementById('barChart').getContext('2d');
var myBarChart = new Chart(chart, {
    type: 'bar',
    data: chartData,
    options: {
        scales: {
            y: {
                beginAtZero: true,
                min: 0, 
                max: 1,
            }
        },
        barPercentage: 1.0, 
        barThickness: 'flex',
        plugins: {
            legend: {
                display: false,
            }
        }
    }
});

// Function to update the chart with new data
function updateChart(newData) {
    myBarChart.data.datasets[0].data = newData;
    myBarChart.update();
}
