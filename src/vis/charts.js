import * as d3 from 'https://unpkg.com/d3?module'

function LineChart(data, {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    defined, // for gaps in data
    curve = d3.curveLinear, // method of interpolation between points
    marginTop = 50, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 50, // left margin, in pixels
    width = 1100, // outer width, in pixels
    height = 750, // outer height, in pixels
    xType = d3.scaleUtc, // the x-scale type
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // the y-scale type
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    color = "currentColor", // stroke color of line
    strokeLinecap = "round", // stroke line cap of the line
    strokeLinejoin = "round", // stroke line join of the line
    strokeWidth = 1.5, // stroke width of line, in pixels
    strokeOpacity = 1, // stroke opacity of line
} = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const I = d3.range(X.length);
    if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
    const D = d3.map(data, defined);

    // Compute default domains.
    if (xDomain === undefined) xDomain = d3.extent(X);
    if (yDomain === undefined) yDomain = [0, d3.max(Y)];

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    // Construct a line generator.
    const line = d3.line()
        .defined(i => D[i])
        .curve(curve)
        .x(i => xScale(X[i]))
        .y(i => yScale(Y[i]));

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));

    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-opacity", strokeOpacity)
        .attr("d", line(I));

    return svg.node();
}


// function LineChart(data, {
//     x = ([x]) => x,
//     y = ([, y]) => y,
//     width = 1100,
//     height = 700,
//     color = 'black',
//     curve = d3.curveLinear,
//     title = 'Line Chart',
//     axesLabels = ['X', 'Y']
// }) {

//     const X = d3.map(data, x);
//     const Y = d3.map(data, y);

//     console.log(d3.min(X))


//     var svg = d3.select("#chart_place").append('svg')
//         .attr('width', width)
//         .attr('height', height)

//     console.log(svg.attr('height'))
//     var width = width - 150,
//         height = height - 150

//     var xScale = d3.scaleLinear().domain([d3.min(X), d3.max(X)]).range([0, width]),
//         yScale = d3.scaleLinear().domain([d3.min(Y), d3.max(Y)]).range([height, 0]);

//     var g = svg.append("g")
//         .attr("transform", "translate(" + 100 + "," + 100 + ")");

//     // Title
//     svg.append('text')
//         .attr('x', width / 2 + 100)
//         .attr('y', 100)
//         .attr('text-anchor', 'middle')
//         .style('font-family', 'Helvetica')
//         .style('font-size', 20)
//         .text(title);

//     // X label
//     svg.append('text')
//         .attr('x', width / 2 + 100)
//         .attr('y', height - 15 + 150)
//         .attr('text-anchor', 'middle')
//         .style('font-family', 'Helvetica')
//         .style('font-size', 12)
//         .text(axesLabels[0]);

//     // Y label
//     svg.append('text')
//         .attr('text-anchor', 'middle')
//         .attr('transform', 'translate(60,' + height + ')rotate(-90)')
//         .style('font-family', 'Helvetica')
//         .style('font-size', 12)
//         .text(axesLabels[1]);

//     g.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(xScale));

//     g.append("g")
//         .call(d3.axisLeft(yScale));
//     svg.append('g')
//         .selectAll("dot")
//         .data(data)
//         .enter()
//         .append("circle")
//         .attr("cx", function(d) { return xScale(X[d]); })
//         .attr("cy", function(d) { return yScale(Y[d]); })
//         .attr("r", 2)
//         .attr("transform", "translate(" + 100 + "," + 100 + ")")
//         .style("fill", "#CC0000");

//     var line = d3.line()
//         .x(function(d) { return xScale(X[d]); })
//         .y(function(d) { return yScale(Y[d]); })
//         .curve(d3.curveMonotoneX)

//     svg.append("path")
//         .datum(data)
//         .attr("class", "line")
//         .attr("transform", "translate(" + 100 + "," + 100 + ")")
//         .attr("d", line)
//         .style("fill", "none")
//         .style("stroke", "#CC0000")
//         .style("stroke-width", "2");
// }

export { LineChart }