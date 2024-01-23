
function gammaDistribution(alpha, beta, x) {
    return jStat.gamma.pdf(x, alpha, beta);
}

function generateSequenceGam(alpha, beta, numPoints) {
    const sequence = [];
    const lowerBound = Math.max(alpha*(beta) - 4 * Math.sqrt(alpha*(beta)**2),0);
    const upperBound = alpha*(beta) + 4 * Math.sqrt(alpha*(beta)**2);
    const step = (upperBound - lowerBound) / (numPoints - 1);

    for (let i = 0; i < numPoints; i++) {
        const value = lowerBound + i * step;
        sequence.push(value);
    }

    return sequence;
}

function updateChartGam() {
    const gamAlphaInput = document.getElementById('gamAlphaInput');
    const gamBetaInput = document.getElementById('gamBetaInput');

  let alpha = Math.max(parseFloat(gamAlphaInput.value), 0.001) || 0.001;
  let beta = Math.max(parseFloat(gamBetaInput.value), 0.001) || 0.001;

  // Ensure that stdDev is not below 0.001
    alpha = Math.max(alpha, 0.001);
    beta = Math.max(beta, 0.001);

    const generatedSequenceGam = generateSequenceGam(alpha, beta, 100);
    const distributionValuesGam = generatedSequenceGam.map(x => gammaDistribution(alpha, beta, x));

    const lowerPercentile = jStat.gamma.inv(0.025, alpha, beta);
    const upperPercentile = jStat.gamma.inv(0.975, alpha, beta);

    // Add points at 2.5th and 97.5th percentiles
    const confidenceIntervalPoints = [
        { x: lowerPercentile, y: gammaDistribution(alpha, beta, lowerPercentile) },
        { x: upperPercentile, y: gammaDistribution(alpha, beta, upperPercentile) }
    ];

    myChartGam.data.labels = generatedSequenceGam.map(x => x.toFixed(2));
    myChartGam.data.datasets[0].data = distributionValuesGam;
    myChartGam.data.datasets[0].pointRadius = [0];  // Hide default points
    myChartGam.data.datasets[0].pointBackgroundColor = ['red', 'red'];  // Color for confidence interval points
    myChartGam.data.datasets[0].pointBorderColor = ['red', 'red'];  // Border color for confidence interval points
    myChartGam.data.datasets[0].pointStyle = ['circle', 'circle'];  // Style for confidence interval points
    myChartGam.data.datasets[1] = {
        label: '95% Confidence Interval',
        data: confidenceIntervalPoints,
        pointRadius: [6, 6],  // Size of confidence interval points
        pointBackgroundColor: ['red', 'red'],
        pointBorderColor: ['red', 'red'],
        pointStyle: ['circle', 'circle'],
        showLine: false
    };

    myChartGam.update();
}

const gamAlphaInput = document.getElementById('gamAlphaInput');
const gamBetaInput = document.getElementById('gamBetaInput');

gamAlphaInput.addEventListener('input', updateChartGam);
gamBetaInput.addEventListener('input', updateChartGam);

const generatedSequenceGam = generateSequenceGam(1, 1, 100);
const distributionValuesGam = generatedSequenceGam.map(x => gammaDistribution(1, 1, x));

 console.log('sequence:',generatedSequenceGam)
 console.log('distVals:',distributionValuesGam)

function createChartGam() {
    const ctxGam = document.getElementById('myChartGam').getContext('2d');
    const myChartGam = new Chart(ctxGam, {
        type: 'line',
        data: {
            labels: generatedSequenceGam.map(x => x.toFixed(2)),
            datasets: [{
                label: 'Gamma Distribution',
                data: distributionValuesGam,
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
  return myChartGam;
  }
// Initial chart creation (using default values)
updateChartGam();

