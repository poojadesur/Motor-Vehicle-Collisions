// add your JavaScript/D3 to this file

// "https://raw.githubusercontent.com/poojadesur/Motor-Vehicle-Collisions/main/collisions.csv"

function zTestForProportions(p1, p2, n1, n2) {
  const pCombined = (p1 * n1 + p2 * n2) / (n1 + n2);
  const standardError = Math.sqrt((pCombined * (1 - pCombined)) * ((1 / n1) + (1 / n2)));
  const zScore = (p1 - p2) / standardError;
  return zScore;
}

let borough1 = "";
let borough2 = "";

function computeSignificance(p1, p2, n1, n2)
{
  // Perform Z-test for proportions
  const zScore = zTestForProportions(p1, p2, n1, n2);

  // Calculate significance level
  const alpha = 0.05; // Set a significance level (e.g., 0.05)

  // Determine if the difference is statistically significant
  if (Math.abs(zScore) > 1.96) { // For a two-tailed test and alpha = 0.05
    isSig = "True";
    console.log("There is a statistically significant difference between the populations.");
  } else {
    isSig = "False";
    console.log("There is no statistically significant difference between the populations.");
  }

  printTextOnPage(isSig);

}

let year1 = ''; // Default selected year
let year2 = ''; // Default selected year
let isSig = ''

function printTextOnPage(isSig) {
  let displayText = '';

  if (isSig === 'True') {
    displayText = "There is a statistically significant difference between the populations. This means one is much more dangerous than the other.";
  } else if (isSig === 'False') {
    displayText = "There is no statistically significant difference between the populations. This means the boroughs and the timeframes provided are not that different from each other.";
  } else {
    displayText = "Are these two sets statistically significantly different from the other?";
  }

  // Update the content of the <p> element with id 'displayText'
  document.getElementById('displayText').innerHTML = displayText;
}

// Call the function with a specific value
printTextOnPage('something'); // Change the value here

// Function to handle click on year radio buttons
function handleClickSet1Year(value) {
  year1 = value;
  console.log("Selected Year 1:", year1);
}

// Function to handle click on year radio buttons
function handleClickSet2Year(value) {
  year2 = value;
  console.log("Selected Year 2:", year2);
}


function handleClickSet1(borough) {
      borough1 = borough;
      console.log("Selected borough from Set 1: " + borough);
    }

function handleClickSet2(borough) {
  borough2 = borough;
  console.log("Selected borough from Set 2: " + borough);
}

function printKilledOutput(){

    let key1 = `${borough1}_${year1}`;
    let key2 = `${borough2}_${year2}`;

    if (isSig === 'True') {
      if (aggregatedDatawKey[key1].killed > aggregatedDatawKey[key2].killed)
      {
        displayText = "There is a statistically significant difference between the populations. This means one is much more dangerous than the other." + borough1 + " in " + year1  + "had much more deaths."}
      else
      {
         displayText = "There is a statistically significant difference between the populations. This means one is much more dangerous than the other." + borough2 + " in " + year2  + "had much more deaths."}
      }
    else{
      displayText = "There is no statistically significant difference between the populations. This means the boroughs and the timeframes provided are not that different from each other.";
    }

    }


function printInjuredOutput(){

    let key1 = `${borough1}_${year1}`;
    let key2 = `${borough2}_${year2}`;

    if (isSig === 'True') {
      if (aggregatedDatawKey[key1].injured > aggregatedDatawKey[key2].injured)
      {
        displayText = "There is a statistically significant difference between the populations. This means one is much more dangerous than the other." + borough1 + " in " + year1  + "had much more deaths."}
      else
      {
         displayText = "There is a statistically significant difference between the populations. This means one is much more dangerous than the other." + borough2 + " in " + year2  + "had much more deaths."}
      }
    else{
      displayText = "There is no statistically significant difference between the populations. This means the boroughs and the timeframes provided are not that different from each other.";
    }

    }


function getKilledSignificance() {
  let key1 = `${borough1}_${year1}`;
  let key2 = `${borough2}_${year2}`;
  console.log(key1, key2)
  console.log(aggregatedDatawKey)
  let deadliness1 = aggregatedDatawKey[key1].killed / aggregatedDatawKey[key1].total
  let deadliness2 = aggregatedDatawKey[key2].killed / aggregatedDatawKey[key2].total

  computeSignificance(deadliness1, deadliness2, aggregatedDatawKey[key1].total, aggregatedDatawKey[key2].total)
  printKilledOutput();
}

function getInjuredSignificance() {
  let key1 = `${borough1}_${year1}`;
  let key2 = `${borough2}_${year2}`;
  console.log(key1, key2)
  console.log(aggregatedDatawKey)
  let deadliness1 = aggregatedDatawKey[key1].injured / aggregatedDatawKey[key1].total
  let deadliness2 = aggregatedDatawKey[key2].injured / aggregatedDatawKey[key2].total

  computeSignificance(deadliness1, deadliness2, aggregatedDatawKey[key1].total, aggregatedDatawKey[key2].total)
  printInjuredOutput();
}

// Array to store fetched data from CSVs
let allData = [];
const fileRowCount = [];
let curFileNameIndex = 0;
let curFilerow = 0;
let aggregatedDatawKey = {}

// List of file names to fetch
const files = [
  'BRONX_2021.csv',
  'BROOKLYN_2021.csv',
  'MANHATTAN_2021.csv',
  'QUEENS_2021.csv',
  'STATENISLAND_2021.csv',
  'BRONX_2022.csv',
  'BROOKLYN_2022.csv',
  'MANHATTAN_2022.csv',
  'QUEENS_2022.csv',
  'STATENISLAND_2022.csv'
];

// Fetch data from each file
const promises = files.map(file => {
  return d3.csv(`https://raw.githubusercontent.com/poojadesur/Motor-Vehicle-Collisions/d3data/${file}`)
    .then(data => {
      allData = allData.concat(data);
      if(fileRowCount.length == 0)
      {
        fileRowCount.push(data.length)
        return data;
      }
      fileRowCount.push(data.length + fileRowCount[fileRowCount.length - 1]); // Store the number of rows for this file
      return data;
    });
});

Promise.all(promises)
  .then(dataArray => {
    // Aggregate data from all files into a single array
    allData = dataArray.flat();

    console.log(fileRowCount)

    // Process and aggregate data
    const aggregatedData = processData(allData, fileRowCount);
    console.log(aggregatedDatawKey['STATENISLAND_2021'].killed)

    createBarChartForKilled(aggregatedData); // For killed count
    createBarChartForInjured(aggregatedData); // For injured count


  })
  .catch(error => {
    // Handle error
    console.error('Error fetching data:', error);
  });

function processData(data) {

  // Extracting borough and year from filenames
  data.forEach((fileData, index) => {
    if (index > fileRowCount[curFileNameIndex])
    {
      curFileNameIndex += 1;
      console.log(curFileNameIndex)
      console.log(index)
    }
    const fileName = files[curFileNameIndex]; // Assuming 'files' array holds the filenames
    const [borough, year] = fileName.replace('.csv', '').split('_');

    // Aggregate counts for each borough and year
    const key = `${borough}_${year}`;
    if (!aggregatedDatawKey[key]) {
      console.log(key)
      aggregatedDatawKey[key] = {
        borough,
        year,
        killed: 0,
        injured: 0,
        total: 0,
      };
    }

    aggregatedDatawKey[key].killed += +fileData['NUMBER.OF.PERSONS.KILLED'] || 0;
    aggregatedDatawKey[key].injured += +fileData['NUMBER.OF.PERSONS.INJURED'] || 0;
    aggregatedDatawKey[key].total += 1;
  });

  return Object.values(aggregatedDatawKey);
}


// Function to create a bar chart for number of people killed
function createBarChartForKilled(data) {
  const margin = { top: 30, right: 30, bottom: 80, left: 60 };
  const width = 300 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svgKilled = d3.select("div#plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScaleKilled = d3.scaleBand()
    .domain(data.map(d => `${d.borough}_${d.year}`))
    .range([0, width])
    .padding(0.1);

  const yScaleKilled = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.killed)])
    .nice()
    .range([height, 0]);

  svgKilled.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => xScaleKilled(`${d.borough}_${d.year}`))
    .attr("width", xScaleKilled.bandwidth())
    .attr("y", d => yScaleKilled(d.killed))
    .attr("height", d => height - yScaleKilled(d.killed))
    .attr("fill", "red");

  svgKilled.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScaleKilled))
    .selectAll("text") // Selects all the text elements of x-axis
    .attr("transform", "rotate(-45)") // Rotates the text by -45 degrees
    .style("text-anchor", "end"); // Adjusts text anchor

  svgKilled.append("text")
    .attr("x", width / 2)
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("People Killed in 2021 and 2022");


  svgKilled.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of People Killed");

  svgKilled.append("g")
    .call(d3.axisLeft(yScaleKilled));
}

// Function to create a bar chart for number of people injured
function createBarChartForInjured(data) {
  const margin = { top: 30, right: 30, bottom: 80, left: 60 };
  const width = 300 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svgInjured = d3.select("div#plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScaleInjured = d3.scaleBand()
    .domain(data.map(d => `${d.borough}_${d.year}`))
    .range([0, width])
    .padding(0.1);

  const yScaleInjured = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.injured)])
    .nice()
    .range([height, 0]);

  svgInjured.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => xScaleInjured(`${d.borough}_${d.year}`))
    .attr("width", xScaleInjured.bandwidth())
    .attr("y", d => yScaleInjured(d.injured))
    .attr("height", d => height - yScaleInjured(d.injured))
    .attr("fill", "blue");

  svgInjured.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScaleInjured))
    .selectAll("text") // Selects all the text elements of x-axis
    .attr("transform", "rotate(-45)") // Rotates the text by -45 degrees
    .style("text-anchor", "end"); // Adjusts text anchor


    svgInjured.append("text")
    .attr("x", width / 2)
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("People Injured in 2021 and 2022");

  // Add Y-axis label
  svgInjured.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of People Injured");

  svgInjured.append("g")
    .call(d3.axisLeft(yScaleInjured));
}


