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

document.getElementById('reset').addEventListener('click', function() {
    // Reset input values
    document.getElementById('mu').value = 0;
    document.getElementById('sigma').value = 1;
    document.getElementById('n').value = 15;
    document.getElementById('confidence').value = 95;
    document.getElementById('n_sim').value = 100;

    // Reset intervals and plot
    intervals = [];
    intervalCount = 0;
    intervalsContainingMu = 0;
    intervalsNotContainingMu = 0;

    document.getElementById('interval-count').textContent = 0;
    document.getElementById('interval-not-count').textContent = 0;
    document.getElementById('percentage-containing-mu').textContent = "0.00";

    // Clear the plot
    g.selectAll(".interval").remove();
    g.selectAll(".x-axis").remove();
    g.selectAll(".y-axis").remove();
    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    

    // Update the vertical line position at mu
    
     muLine.style("display", "none");

    // Clear the time series plot
    svgTS.selectAll(".line-path").remove();
    
});

document.getElementById('simulate').addEventListener('click', async function() {
    const mu = parseFloat(document.getElementById('mu').value);
    const sigma = parseFloat(document.getElementById('sigma').value);
    const n = parseInt(document.getElementById('n').value);
    const confidence = parseFloat(document.getElementById('confidence').value);
    const n_sim = parseInt(document.getElementById('n_sim').value);

    if (isNaN(mu) || isNaN(sigma) || isNaN(n) || isNaN(confidence) || isNaN(n_sim)) {
        alert("Please enter valid numeric values.");
        return;
    }

    for (let i = 0; i < n_sim; i++) {
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
            break;
        }
    }
});

let intervals = [];
let intervalCount = 0;
let intervalsContainingMu = 0;
let intervalsNotContainingMu = 0;

const svg = d3.select("#plot")
    .append("svg")
    .attr("width", 800)
    .attr("height", 400);

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
    .attr("stroke-width", 2)
    .style("display","none");



// Set up dimensions and margins for the time series plot
const marginTS = { top: 20, right: 30, bottom: 30, left: 40 };
const widthTS = 600 - marginTS.left - marginTS.right;
const heightTS = 150 - marginTS.top - marginTS.bottom;

// Create the SVG container for the time series plot
const svgTS = d3.select("#time-series-plot")
    .append("svg")
    .attr("width", widthTS + marginTS.left + marginTS.right)
    .attr("height", heightTS + marginTS.top + marginTS.bottom)
    .append("g")
    .attr("transform", `translate(${marginTS.left},${marginTS.top})`);

// Set up scales for the time series plot
const xTS = d3.scaleLinear().range([0, widthTS]);
const yTS = d3.scaleLinear().range([heightTS, 0]);

// Define the line for the time series plot
const line = d3.line()
    .x((d, i) => xTS(i + 1))
    .y(d => yTS(d));

// Add x-axis and y-axis to the time series plot
svgTS.append("g")
    .attr("class", "x-axis-ts")
    .attr("transform", `translate(0,${heightTS})`);

svgTS.append("g")
    .attr("class", "y-axis-ts");

// Add a horizontal line for the confidence level
const confidenceLevelLine = svgTS.append("line")
    .attr("class", "confidence-level-line")
    .attr("stroke", "blue")
    .attr("stroke-dasharray", "4");

// Function to update the time series plot
function updateTimeSeriesPlot(confidenceLevel, percentageData) {
    // Update the domains of the scales
    xTS.domain([1, percentageData.length]);
    yTS.domain([Math.max(confidenceLevel-5,0), Math.min(confidenceLevel+5,100)]);

    // Update the x-axis and y-axis
    svgTS.select(".x-axis-ts").call(d3.axisBottom(xTS));
    svgTS.select(".y-axis-ts").call(d3.axisLeft(yTS));

    // Bind data and draw the line
    svgTS.selectAll(".line-path").remove();
    svgTS.append("path")
        .datum(percentageData)
        .attr("class", "line-path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Update the confidence level line
    confidenceLevelLine
        .attr("x1", 0)
        .attr("x2", widthTS)
        .attr("y1", yTS(confidenceLevel))
        .attr("y2", yTS(confidenceLevel));
}

function updatePlot(mu, sigma, lower, upper, containsMu) {
    intervals.push({ lower, upper, containsMu });

    intervalCount++;
    if (containsMu) {
        intervalsContainingMu++;
    } else {
        intervalsNotContainingMu++;
    }

    const percentageContainingMu = ((intervalsContainingMu / intervalCount) * 100).toFixed(2);
    const n = parseInt(document.getElementById('n').value);
    const confidenceLevel = parseFloat(document.getElementById('confidence').value);

    document.getElementById('interval-count').textContent = intervalCount;
    document.getElementById('interval-not-count').textContent = intervalsNotContainingMu;
    document.getElementById('percentage-containing-mu').textContent = percentageContainingMu;

    x.domain([mu - 5 * (sigma/Math.sqrt(n)), mu + 5 * (sigma/Math.sqrt(n))]);
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
    if (intervalCount === 0) {
        muLine.style("display", "none");
    } else {
            muLine.style("display", null);
        } 
    muLine.attr("x1", x(mu)).attr("x2", x(mu));

    g.selectAll(".x-axis").remove();
    g.selectAll(".y-axis").remove();

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).tickFormat("").tickSize(0)) // Set tickSize to 0 to remove tick marks
        .selectAll("path, line") // Select the axis path and tick lines
        .style("opacity", 0); // Set their opacity to 0 to hide them

    // Compute percentage data
    const percentageData = intervals.map((d, idx) => {
        const countContainingMu = intervals.slice(0, idx + 1).filter(d => d.containsMu).length;
        return (countContainingMu / (idx + 1)) * 100;
    });

    // Update the time series plot with the new percentage
    updateTimeSeriesPlot(confidenceLevel, percentageData);
}
