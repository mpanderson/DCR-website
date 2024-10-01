function createChartExp() {
  const ctxExp = document.getElementById('myChartExp').getContext('2d');
  const myChartExp = new Chart(ctxExp, {
    type: 'line',
    data: {
      labels: [], // Placeholder for x-axis values
      datasets: [{
        label: 'Exponential Distribution',
        data: [], // Placeholder for distribution values
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
  return myChartExp;
}

function exponentialDistribution(beta, x) {
  return jStat.exponential.pdf(x, beta); // Using jStat to compute the PDF
}

function generateSequenceExp(beta, numPoints) {
  const sequence = [];
  const lowerBound = 0; // Exponential distribution is non-negative
  const upperBound = 10; // You can adjust this range if necessary
  const step = (upperBound - lowerBound) / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const value = lowerBound + i * step;
    sequence.push(value);
  }

  return sequence;
}

function updateChartExp() {
  const betaInput = document.getElementById('expBetaInput');
  const beta = parseFloat(betaInput.value) || 1;

  const generatedSequenceExp = generateSequenceExp(beta, 100);
  const distributionValuesExp = generatedSequenceExp.map(x => exponentialDistribution(beta, x));

  // Update chart with new values
  myChartExp.data.labels = generatedSequenceExp.map(x => x.toFixed(2));
  myChartExp.data.datasets[0].data = distributionValuesExp;
  myChartExp.update();
}

// Initialize the chart and set up event listener for beta input changes
const myChartExp = createChartExp();
const betaInput = document.getElementById('expBetaInput');
betaInput.addEventListener('input', updateChartExp);
updateChartExp();
