document.getElementById('submit').addEventListener('click', async function() {
  const mu = parseFloat(document.getElementById('mu').value);
  const sigma = parseFloat(document.getElementById('sigma').value);
  const n = parseInt(document.getElementById('n').value);
  const confidence = parseFloat(document.getElementById('confidence').value);

  const response = await fetch('/generate_sample', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mu, sigma, n, confidence })
  });

  const result = await response.json();

  updatePlot(mu, sigma, result.lower, result.upper, result.containsMu);
});

let intervals = [];
function updatePlot(mu, sigma, lower, upper, containsMu) {
  const plot = d3.select('#plot');
  intervals.push({ lower, upper, containsMu });

  const margin = { top: 20, right: 30, bottom: 40, left: 40 },
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  const x = d3.scaleLinear()
      .domain([mu - 4 * sigma, mu + 4 * sigma])
      .range([0, width]);

  plot.selectAll('*').remove();
  const svg = plot.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  svg.append('line')
      .attr('x1', x(mu))
      .attr('x2', x(mu))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', 'black');

  intervals.forEach((interval, index) => {
      svg.append('line')
          .attr('x1', x(interval.lower))
          .attr('x2', x(interval.upper))
          .attr('y1', index * 5)
          .attr('y2', index * 5)
          .attr('stroke', interval.containsMu ? 'black' : 'red');
  });
}
