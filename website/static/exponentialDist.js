

function exponentialDistribution(beta, x) {
    return jStat.exponential.pdf(x, 1/beta);
}

function generateSequenceExp(beta, numPoints) {
    const sequence = [];
    const lowerBound = 0;
    const upperBound = beta + 4 * Math.sqrt(beta**2);
    const step = (upperBound - lowerBound) / (numPoints - 1);

    for (let i = 0; i < numPoints; i++) {
        const value = lowerBound + i * step;
        sequence.push(value);
    }

    return sequence;
}

function updateChartExp() {
    const betaInput = document.getElementById('expBetaInput');


  let beta = parseFloat(betaInput.value) || 1;


  // Ensure that stdDev is not below 0.001
    beta = Math.max(beta, 0.001);

    const generatedSequenceExp = generateSequenceExp(beta, 100);
    const distributionValuesExp = generatedSequenceExp.map(x => exponentialDistribution(beta, x));

    const lowerPercentile = jStat.exponential.inv(0.025, 1/beta);
    const upperPercentile = jStat.exponential.inv(0.975, 1/beta);

    // Add points at 2.5th and 97.5th percentiles
    const confidenceIntervalPoints = [
        { x: lowerPercentile, y: exponentialDistribution(beta, lowerPercentile) },
        { x: upperPercentile, y: exponentialDistribution(beta, upperPercentile) }
    ];

    myChartExp.data.labels = generatedSequenceExp.map(x => x.toFixed(2));
    myChartExp.data.datasets[0].data = distributionValuesExp;
    myChartExp.data.datasets[0].pointRadius = [0];  // Hide default points
    myChartExp.data.datasets[0].pointBackgroundColor = ['red', 'red'];  // Color for confidence interval points
    myChartExp.data.datasets[0].pointBorderColor = ['red', 'red'];  // Border color for confidence interval points
    myChartExp.data.datasets[0].pointStyle = ['circle', 'circle'];  // Style for confidence interval points
    myChartExp.data.datasets[1] = {
        label: '95% Confidence Interval',
        data: confidenceIntervalPoints,
        pointRadius: [6, 6],  // Size of confidence interval points
        pointBackgroundColor: ['red', 'red'],
        pointBorderColor: ['red', 'red'],
        pointStyle: ['circle', 'circle'],
        showLine: false
    };

    myChartExp.update();
}

const betaInput = document.getElementById('expBetaInput');


betaInput.addEventListener('input', updateChartExp);


const generatedSequenceExp = generateSequenceExp(1, 100);
const distributionValuesExp = generatedSequenceExp.map(x => exponentialDistribution(1, x));

const ctxexp = document.getElementById('myChartExp').getContext('2d');
const myChartExp = new Chart(ctxexp, {
    type: 'line',
    data: {
        labels: generatedSequenceExp.map(x => x.toFixed(2)),
        datasets: [{
            label: 'Exponential Distribution',
            data: distributionValuesExp,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
            pointRadius: [0]  // Hide default points
        }]
    },
    options: {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom'
            },
            y: {
                type: 'linear',
                position: 'left'
            }
        }
    }
});

// Initial chart creation (using default values)
updateChartExp();

