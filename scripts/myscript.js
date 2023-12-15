// add your JavaScript/D3 to this file

// "https://raw.githubusercontent.com/poojadesur/Motor-Vehicle-Collisions/main/collisions.csv"

// https://github.com/poojadesur/Motor-Vehicle-Collisions/blob/main/collisions.csv

// https://github.com/poojadesur/Motor-Vehicle-Collisions/blob/main/subset_100_rows.csv

// Define the dimensions for the SVG container and margins for the chart
const margin = { top: 20, right: 20, bottom: 50, left: 50 };
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Append an SVG element to the body of the HTML
const svg = d3
  .select('div#plot')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

// Load the CSV data using promises
d3.csv('https://raw.githubusercontent.com/poojadesur/Motor-Vehicle-Collisions/main/subset_100_rows.csv')
  .then(function (data) {
    // Filter out rows with null values in 'collision_id', 'number_of_persons_killed', and 'borough' columns

    console.log("Total rows in data:", data.length);

    // Group data by 'borough' and calculate total number of persons killed in each borough
    const groupedData = d3.group(data, d => d.BOROUGH);
    const aggregatedData = Array.from(groupedData, ([key, value]) => ({
      BOROUGH: key,
      totalKilled: d3.sum(value, d => +d.number_of_persons_killed), // Calculate sum of persons killed
    }));

    // Define x and y scales
    const x = d3.scaleBand()
      .domain(aggregatedData.map(d => d.BOROUGH))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(aggregatedData, d => d.totalKilled)])
      .nice()
      .range([height, 0]);

    // Create x-axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Create y-axis
    svg.append('g')
      .call(d3.axisLeft(y));

    // Create bars for the bar chart
    svg.selectAll('.bar')
      .data(aggregatedData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.BOROUGH))
      .attr('y', d => y(d.totalKilled))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.totalKilled))
      .attr('fill', 'steelblue');
  })
  .catch(function (error) {
    // Handle any errors while loading the data
    console.log(error);
  });





