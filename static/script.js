var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height)

var clrCvs = document.getElementById('clrCvs');
var painting = false;
var paintingTimer = null;

canvas.addEventListener('mousedown', startPainting);
canvas.addEventListener('mouseup', stopPainting);
canvas.addEventListener('mousemove', draw);

function startPainting(e) {
    painting = true;
    draw(e);

    if (!paintingTimer) {
        paintingTimer = setInterval(sendPixels, 1000);
    }
}

function stopPainting() {
    painting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!painting) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.pageX - rect.left - window.scrollX;
    const mouseY = e.pageY - rect.top - window.scrollY;

    ctx.lineWidth = 2;
    ctx.fillStyle = "white";
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clearInterval(paintingTimer);
    paintingTimer = null;
    
    myBarChart.data.datasets[0].data = [0,0,0,0,0];
    myBarChart.update();



    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

const classes = ['cat', 'dog', 'rabbit', 'elephant', 'bird']
function sendPixels() {
    if (!painting) return;
    var canvas = document.getElementById('canvas');
    var img = canvas.toDataURL()

    fetch('/process_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageData: img })
    }).then(response => response.json())
    .then(data => {
        // Assuming data is an array of percentages
        updateChart(data.predictions);
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Bar Chart
var barColors = ["red", "green","blue","orange","brown"]
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

function updateChart(newData) {
    myBarChart.data.datasets[0].data = newData;
    myBarChart.update();
}
