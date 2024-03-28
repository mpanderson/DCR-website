// Define global variable for chart to access it in update function
let myChartBeta;

// Function to calculate beta distribution values
function betaDistribution(alpha, beta, x) {
    return jStat.beta.pdf(x, alpha, beta);
}

// Function to generate a sequence of x values for the chart
function generateSequenceBeta(numPoints) {
    const sequence = [];
    for (let i = 0; i < numPoints; i++) {
        sequence.push(i / (numPoints - 1));
    }
    return sequence;
}

// Function to create the beta distribution chart
function createChartBeta() {
    const ctxBeta = document.getElementById('myChartBeta').getContext('2d');
    myChartBeta = new Chart(ctxBeta, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Beta Distribution',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                pointRadius: 0
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'x'
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Probability Density'
                    }
                }
            }
        }
    });
}

// Function to update the beta distribution chart based on user inputs
function updateChartBeta() {
    const alpha = parseFloat(document.getElementById('betaAlphaInput').value) || 1;
    const beta = parseFloat(document.getElementById('betaBetaInput').value) || 1;

    const numPoints = 100;
    const xValues = generateSequenceBeta(numPoints);
    const yValues = xValues.map(x => betaDistribution(alpha, beta, x));

    myChartBeta.data.labels = xValues;
    myChartBeta.data.datasets[0].data = yValues;
    myChartBeta.update();
}

// Event listeners for the input fields
document.addEventListener('DOMContentLoaded', function() {
    createChartBeta(); // First, create the chart

    // Then, attach event listeners
    document.getElementById('betaAlphaInput').addEventListener('input', updateChartBeta);
    document.getElementById('betaBetaInput').addEventListener('input', updateChartBeta);

    // Initial update
    updateChartBeta();
});
