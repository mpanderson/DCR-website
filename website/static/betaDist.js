
function betaDistribution(alpha, beta, x) {
    return jStat.beta.pdf(x, alpha, beta);
}

function generateSequenceBeta(alpha, beta, numPoints) {
    const sequence = [];
    const lowerBound = 0;
    const upperBound = 1;
    const step = (upperBound - lowerBound) / (numPoints - 1);

    for (let i = 0; i < numPoints; i++) {
        const value = lowerBound + i * step;
        sequence.push(value);
    }

    return sequence;
}

function updateChartBeta() {
    const betaAlphaInput = document.getElementById('betaAlphaInput');
    const betaBetaInput = document.getElementById('betaBetaInput');

  let alpha = Math.max(parseFloat(betaAlphaInput.value), 0.001) || 0.001;
  let beta = Math.max(parseFloat(betaBetaInput.value), 0.001) || 0.001;

  // Ensure that stdDev is not below 0.001
    alpha = Math.max(alpha, 0.001);
    beta = Math.max(beta, 0.001);

    const generatedSequenceBeta = generateSequenceBeta(alpha, beta, 100);
    const distributionValuesBeta = generatedSequenceBeta.map(x => betaDistribution(alpha, beta, x));

    const lowerPercentile = jStat.beta.inv(0.025, alpha, beta);
    const upperPercentile = jStat.beta.inv(0.975, alpha, beta);

    // Add points at 2.5th and 97.5th percentiles
    const confidenceIntervalPoints = [
        { x: lowerPercentile, y: betaDistribution(alpha, beta, lowerPercentile) },
        { x: upperPercentile, y: betaDistribution(alpha, beta, upperPercentile) }
    ];

    myChartBeta.data.labels = generatedSequenceBeta.map(x => x.toFixed(2));
    myChartBeta.data.datasets[0].data = distributionValuesBeta;
    myChartBeta.data.datasets[0].pointRadius = [0];  // Hide default points
    myChartBeta.data.datasets[0].pointBackgroundColor = ['red', 'red'];  // Color for confidence interval points
    myChartBeta.data.datasets[0].pointBorderColor = ['red', 'red'];  // Border color for confidence interval points
    myChartBeta.data.datasets[0].pointStyle = ['circle', 'circle'];  // Style for confidence interval points
    myChartBeta.data.datasets[1] = {
        label: '95% Confidence Interval',
        data: confidenceIntervalPoints,
        pointRadius: [6, 6],  // Size of confidence interval points
        pointBackgroundColor: ['red', 'red'],
        pointBorderColor: ['red', 'red'],
        pointStyle: ['circle', 'circle'],
        showLine: false
    };

    myChartBeta.update();
}

const betaAlphaInput = document.getElementById('betaAlphaInput');
const betaBetaInput = document.getElementById('betaBetaInput');

betaAlphaInput.addEventListener('input', updateChartBeta);
betaBetaInput.addEventListener('input', updateChartBeta);

const generatedSequenceBeta = generateSequenceBeta(1, 1, 100);
const distributionValuesBeta = generatedSequenceBeta.map(x => betaDistribution(1, 1, x));

 console.log('sequence:',generatedSequenceBeta)
 console.log('distVals:',distributionValuesBeta)

function createChartBeta() {
    const ctxBeta = document.getElementById('myChartBeta').getContext('2d');
    const myChartBeta = new Chart(ctxBeta, {
        type: 'line',
        data: {
            labels: generatedSequenceBeta.map(x => x.toFixed(2)),
            datasets: [{
                label: 'Beta Distribution',
                data: distributionValuesBeta,
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
  return myChartBeta;
  }
// Initial chart creation (using default values)
updateChartBeta();

