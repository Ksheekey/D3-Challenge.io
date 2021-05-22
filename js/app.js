//function to make responsive
function makeResponsive() {

  var svgArea = d3.select(".container").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  //seting boundaries
  var svgWidth = 960;
  var svgHeight = 500;
  
  var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };
  
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;
  
  // SVG group to hold the chart.
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Data
  d3.csv("./js/data.csv").then(function(censusData) {
  
      // converting to integers
      censusData.forEach(function(d) {
        d.income = +d.income;
        d.obesity = +d.obesity;
      });
  
      // Scale functions
      var xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(censusData, d => d.income)])
        .range([0, width]);
  
      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.obesity)])
        .range([height, 0]);
  
      // Axis functions
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      chartGroup.append("g")
        .call(leftAxis);
  
      // Circles
      var circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .classed("stateCircle stateText", true)
      .attr("cx", d => xLinearScale(d.income))
      .attr("cy", d => yLinearScale(d.obesity))
      .attr("r", "15")
      //.attr("fill", "pink")
      .attr("opacity", ".5");

      //appending the abbreviation into the circles
      var circleLabels = chartGroup.selectAll(null).data(censusData).enter().append("text");

      circleLabels
        .attr("x", function(d) {return xLinearScale(d.income);})
        .attr("y", function(d) {return yLinearScale(d.obesity);})
        .text(function(d) {return d.abbr;})
        .attr("font-size", "7px")
        .attr("text-anchor", "middle")
        .attr("fill", "black");
  
      // Tool tip
      var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>Income: ${d.income}<br>Obesity: ${d.obesity}`);
        });
  
      chartGroup.call(toolTip);
  
      // Event listeners
      circlesGroup.on("mouseover", function(d) {
        
        toolTip.show(d, this);
      })
        // onmouseout event
        .on("mouseout", function(d, i) {
          toolTip.hide(d);
        });
  
      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obesity");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Income");
    }).catch(function(error) {
      console.log(error);
    });
}

makeResponsive()

d3.select(window).on("resize", makeResponsive);
  
