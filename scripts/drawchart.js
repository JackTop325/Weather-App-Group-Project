function make_x_gridlines() {
    return d3.axisBottom(x).ticks(24);
}

function make_y_gridlines() {
    return d3.axisLeft(y).ticks(10);
} // THEY DONT WORK AAA

function drawTemperatureChart(data) {
    const hourlyData = data.hourly.temperature_2m.slice(0, 24);
    const margin = { top: 40, right: 20, bottom: 70, left: 70 };
    const containerWidth = d3.select("#temperature-chart").node().clientWidth;
    const width = containerWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const x = d3.scaleLinear().domain([0, 23]).range([0, width]);
    const y = d3.scaleLinear().domain([Math.min(...hourlyData), Math.max(...hourlyData)]).range([height, 0]);

    const line = d3
        .line()
        .x((d, i) => x(i))
        .y((d) => y(d));

    d3.select("#temperature-chart").selectAll("*").remove();

    const svg = d3
        .select("#temperature-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const path = svg
        .append("path")
        .datum(hourlyData)
        .attr("class", "line")
        .attr("d", line);

    const totalLength = path.node().getTotalLength();

    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength);

    path
        .transition()
        .duration(1000) // Animation duration in milliseconds
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

    svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(24).tickFormat(d => (d % 12 || 12) + (d < 12 ? ' AM' : ' PM')));

    svg.append("g").call(d3.axisLeft(y));

    // Add x-axis label
    svg
        .append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 20)
        .style("text-anchor", "middle")
        .text("Time (Hours)");

    // Add y-axis label
    svg
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -(height / 2))
        .style("text-anchor", "middle")
        .text("Temperature (°C)");

    // Add graph title
    svg
        .append("text")
        .attr("class", "graph-title")
        .attr("x", width / 2)
        .attr("y", -margin.top + 20)
        .style("text-anchor", "middle")
        .style("font-size", "1.2rem")
        .text("Temperature Change Across the Day");
}
