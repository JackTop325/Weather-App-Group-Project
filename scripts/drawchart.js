function drawTemperatureChart(data, unit) {
    const hourlyData = data.hourly.temperature_2m.slice(0, 24);
    if (unit === "F") {
        hourlyData.forEach((temp, i) => {
            hourlyData[i] = (temp * 9) / 5 + 32;
        });
    }
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

    // Update y-axis label according to the selected unit
    svg
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -(height / 2))
        .style("text-anchor", "middle")
        .text("Temperature (°" + (unit === "F" ? "F" : "C") + ")");

    // Add graph title
    svg
        .append("text")
        .attr("class", "graph-title")
        .attr("x", width / 2)
        .attr("y", -margin.top + 20)
        .style("text-anchor", "middle")
        .style("font-size", "1.2rem")
        .text("Temperature Change Across the Day");

    // Add tooltip for displaying x and y values
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Add the circle that will follow the mouse
    const mouseCircle = svg
        .append("circle")
        .attr("r", 5)
        .attr("fill", "white")
        .attr("stroke", "blue")
        .style("opacity", 0);

    // Add the rectangle to capture mouse events
    const mouseRect = svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all");

    const threshold = 20; // Define a threshold for the distance (you can adjust this value)

    mouseRect
        .on("mouseover", function (event, d) {
            // ... (the rest of the code remains unchanged)
        })
        .on("mousemove", function (event, d) {
            const xValue = Math.round(x.invert(d3.pointer(event, this)[0]));
            const yValue = hourlyData[xValue];
            const pointerY = d3.pointer(event, this)[1];
            const distance = Math.abs(y(yValue) - pointerY);

            if (distance <= threshold) {
                mouseCircle
                    .attr("cx", x(xValue))
                    .attr("cy", y(yValue))
                    .style("opacity", 1);

                // Get the SVG container's position
                const containerPosition = d3.select("#temperature-chart").node().getBoundingClientRect();

                // Update the tooltip's position and content according to the selected unit
                tooltip
                    .html("Time: " + xValue + "h<br>Temperature: " + yValue.toFixed(1) + "°" + (unit === "F" ? "F" : "C"))
                    .style("left", (containerPosition.left + x(xValue) + margin.left + 10) + "px")
                    .style("top", (containerPosition.top + y(yValue) - 10 + window.scrollY) + "px")
                    .style("opacity", 0.9);
            } else {
                mouseCircle.style("opacity", 0);
                tooltip.style("opacity", 0);
            }
        })
        .on("mouseout", function (event, d) {
            mouseCircle.style("opacity", 0);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    window.addEventListener("resize", () => { // Ensures that the graph rescales when the window is resized
        drawTemperatureChart(data);
    });
}
