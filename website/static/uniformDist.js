
function uniformDistribution(a, b, x) {
    return jStat.uniform.pdf(x, a, b);
}

function generateSequenceUnif(a, b, numPoints) {
    const sequence = [];
    const lowerBound = a;
    const upperBound = b;
    const step = (upperBound - lowerBound) / (numPoints - 1);

    for (let i = 0; i < numPoints; i++) {
        const value = lowerBound + i * step;
        sequence.push(value);
    }

    return sequence;
}

function updateChartUnif() {
    const unifLowerInput = document.getElementById('unifLowerInput');
    const unifUpperInput = document.getElementById('unifUpperInput');

  let unifLower = parseFloat(unifLowerInput.value) || 0;
  let unifUpper = parseFloat(unifUpperInput.value) || 1;

    const generatedSequenceUnif = generateSequenceUnif(unifLower, unifUpper, 100);
    const distributionValuesUnif = generatedSequenceUnif.map(x => uniformDistribution(unifLower, unifUpper, x));

    const lowerPercentile = jStat.uniform.inv(0.025, unifLower, unifUpper);
    const upperPercentile = jStat.uniform.inv(0.975, unifLower, unifUpper);

    // Add points at 2.5th and 97.5th percentiles
    const confidenceIntervalPoints = [
        { x: lowerPercentile, y: uniformDistribution(unifLower, unifUpper, lowerPercentile) },
        { x: upperPercentile, y: uniformDistribution(unifLower, unifUpper, upperPercentile) }
    ];

    myChartUnif.data.labels = generatedSequenceUnif.map(x => x.toFixed(2));
    myChartUnif.data.datasets[0].data = distributionValuesUnif;
    myChartUnif.data.datasets[0].pointRadius = [0];  // Hide default points
    myChartUnif.data.datasets[0].pointBackgroundColor = ['red', 'red'];  // Color for confidence interval points
    myChartUnif.data.datasets[0].pointBorderColor = ['red', 'red'];  // Border color for confidence interval points
    myChartUnif.data.datasets[0].pointStyle = ['circle', 'circle'];  // Style for confidence interval points
    myChartUnif.data.datasets[1] = {
        label: '95% Confidence Interval',
        data: confidenceIntervalPoints,
        pointRadius: [6, 6],  // Size of confidence interval points
        pointBackgroundColor: ['red', 'red'],
        pointBorderColor: ['red', 'red'],
        pointStyle: ['circle', 'circle'],
        showLine: false
    };

    myChartUnif.update();
}

const unifLowerInput = document.getElementById('unifLowerInput');
const unifUpperInput = document.getElementById('unifUpperInput');

unifLowerInput.addEventListener('input', updateChartUnif);
unifUpperInput.addEventListener('input', updateChartUnif);

const generatedSequenceUnif = generateSequenceUnif(0, 1, 100);
const distributionValuesUnif = generatedSequenceUnif.map(x => uniformDistribution(0, 1, x));

 console.log('sequence:',generatedSequenceUnif)
 console.log('distVals:',distributionValuesUnif)

function createChartUnif() {
    const ctxUnif = document.getElementById('myChartUnif').getContext('2d');
    const myChartUnif = new Chart(ctxUnif, {
        type: 'line',
        data: {
            labels: generatedSequenceUnif.map(x => x.toFixed(2)),
            datasets: [{
                label: 'Uniform Distribution',
                data: distributionValuesUnif,
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
  return myChartUnif;
  }
// Initial chart creation (using default values)
updateChartUnif();

