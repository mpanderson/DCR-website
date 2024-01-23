
function createChartNorm() {
   const ctxNorm = document.getElementById('myChartNorm').getContext('2d');
   const myChartNorm = new Chart(ctxNorm, {
       type: 'line',
       data: {
           labels: generatedSequenceNorm.map(x => x.toFixed(2)),
           datasets: [{
               label: 'Normal Distribution',
               data: distributionValuesNorm,
               borderColor: 'rgba(75, 192, 192, 1)',
               fill: false,
               pointRadius: [0]  // Hide default points
           },{
              label: '95% Interval',
              data: valuesInRange,
              borderColor: 'rgba(75, 192, 192, 1)',
              fill: true,
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
  return myChartNorm;
}
 
function normalDistribution(mu, sd, x) {
     return jStat.normal.pdf(x, mu, sd);
 }

 function generateSequenceNorm(mu, sd, numPoints) {
     const sequence = [];
     const lowerBound = mu - 4 * sd;
     const upperBound = mu + 4 * sd;
     const step = (upperBound - lowerBound) / (numPoints - 1);

     for (let i = 0; i < numPoints; i++) {
         const value = lowerBound + i * step;
         sequence.push(value);
     }

     return sequence;
 }

 function updateChartNorm() {
     const meanInput = document.getElementById('meanInput');
     const stdDevInput = document.getElementById('stdDevInput');

   let mean = parseFloat(meanInput.value) || 0;
   let standardDeviation = Math.max(parseFloat(stdDevInput.value), 0.001) || 0.001;

   // Ensure that stdDev is not below 0.001
     standardDeviation = Math.max(standardDeviation, 0.001);

     const generatedSequenceNorm = generateSequenceNorm(mean, standardDeviation, 100);
     const distributionValuesNorm = generatedSequenceNorm.map(x => normalDistribution(mean, standardDeviation, x));

     const lowerPercentile = jStat.normal.inv(0.025, mean, standardDeviation);
     const upperPercentile = jStat.normal.inv(0.975, mean, standardDeviation);

     // Add points at 2.5th and 97.5th percentiles
     const confidenceIntervalPoints = [
         { x: lowerPercentile, y: normalDistribution(mean, standardDeviation, lowerPercentile) },
         { x: upperPercentile, y: normalDistribution(mean, standardDeviation, upperPercentile) }
     ];

     // Filter values between lowerPercentile and upperPercentile
     const valuesInRange = distributionValuesNorm.filter(value => value >= lowerPercentile && value <= upperPercentile);

     myChartNorm.data.labels = generatedSequenceNorm.map(x => x.toFixed(2));
     myChartNorm.data.datasets[0].data = distributionValuesNorm;
     myChartNorm.data.datasets[0].pointRadius = [0];  // Hide default points
     myChartNorm.data.datasets[0].pointBackgroundColor = ['red', 'red'];  // Color for confidence interval points
     myChartNorm.data.datasets[0].pointBorderColor = ['red', 'red'];  // Border color for confidence interval points
     myChartNorm.data.datasets[0].pointStyle = ['circle', 'circle'];  // Style for confidence interval points
     myChartNorm.data.datasets[1] = {
         label: '95% Confidence Interval',
         data: confidenceIntervalPoints,
         pointRadius: [6, 6],  // Size of confidence interval points
         pointBackgroundColor: ['red', 'red'],
         pointBorderColor: ['red', 'red'],
         pointStyle: ['circle', 'circle'],
         showLine: false
     };

     myChartNorm.update();
 }

 const meanInput = document.getElementById('meanInput');
 const stdDevInput = document.getElementById('stdDevInput');

 meanInput.addEventListener('input', updateChartNorm);
 stdDevInput.addEventListener('input', updateChartNorm);

 const generatedSequenceNorm = generateSequenceNorm(0, 1, 100);
 const distributionValuesNorm = generatedSequenceNorm.map(x => normalDistribution(0, 1, x));

 const lowerPercentile = jStat.normal.inv(0.025, 0, 1);
 const upperPercentile = jStat.normal.inv(0.975, 0, 1);

 // Add points at 2.5th and 97.5th percentiles
 const confidenceIntervalPoints = [
     { x: lowerPercentile, y: normalDistribution(0, 1, lowerPercentile) },
     { x: upperPercentile, y: normalDistribution(0, 1, upperPercentile) }
 ];

 // Filter values between lowerPercentile and upperPercentile
 const valuesInRange = distributionValuesNorm.filter(value => value >= lowerPercentile && value <= upperPercentile);

 
 // Initial chart creation (using default values)
 updateChartNorm();




