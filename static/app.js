document.getElementById('submit').addEventListener('click', async function() {
    const mu = parseFloat(document.getElementById('mu').value);
    const sigma = parseFloat(document.getElementById('sigma').value);
    const n = parseInt(document.getElementById('n').value);
    const confidence = parseFloat(document.getElementById('confidence').value);

    if (isNaN(mu) || isNaN(sigma) || isNaN(n) || isNaN(confidence)) {
        alert("Please enter valid numeric values.");
        return;
    }

    const response = await fetch('/generate_sample', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mu, sigma, n, confidence })
    });

    if (response.ok) {
        const result = await response.json();
        updatePlot(mu, sigma, result.lower, result.upper, result.containsMu);
    } else {
        const error = await response.json();
        alert("Error: " + error.error);
    }
});

let intervals = [];
let intervalCount = 0;
let intervalsContainingMu = 0;

const svg = d3.select("#plot")
    .append("svg")
    .attr("width", 800)
    .attr("height", 500);

const margin = {top: 20, right: 30, bottom: 30, left: 40};
const width = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;

const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleBand().range([height, 0]).padding(0.1);

const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Add the vertical line at mu
const muLine = g.append("line")
    .attr("class", "mu-line")
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "blue")
    .attr("stroke-width", 2);

function updatePlot(mu, sigma, lower, upper, containsMu) {
    intervals.push({ lower, upper, containsMu });

    intervalCount++;
    if (containsMu) {
        intervalsContainingMu++;
    }

    const percentageContainingMu = ((intervalsContainingMu / intervalCount) * 100).toFixed(2);

    document.getElementById('interval-count').textContent = intervalCount;
    document.getElementById('percentage-containing-mu').textContent = percentageContainingMu;

    x.domain([mu - 1.5 * sigma, mu + 1.5 * sigma]);
    y.domain(intervals.map((_, i) => i));

    g.selectAll(".interval").remove();

    g.selectAll(".interval")
        .data(intervals)
        .enter().append("line")
        .attr("class", "interval")
        .attr("x1", d => x(d.lower))
        .attr("x2", d => x(d.upper))
        .attr("y1", (d, i) => y(i) + y.bandwidth() / 2)
        .attr("y2", (d, i) => y(i) + y.bandwidth() / 2)
        .attr("stroke", d => d.containsMu ? "black" : "red");

    // Update the vertical line position at mu
    muLine.attr("x1", x(mu)).attr("x2", x(mu));

    g.selectAll(".x-axis").remove();
    g.selectAll(".y-axis").remove();

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).tickFormat(""));
}
