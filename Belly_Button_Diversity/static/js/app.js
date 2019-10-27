function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var URL = '/metadata/ ${sample}';
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(URL).then(function(sample) {
    var sample_metadata = d3.select('#sample-metadata');
        // Use `.html("") to clear any existing metadata
    sample_metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sample).forEach(function([key, value]){
      var row = sampleData.append("p");
      row.text('${key}: ${value}');
    })
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
var url = '/samples/${sample}';

    // @TODO: Build a Bubble Chart using the sample data
    d3.json(url).then(function(data){
        var x_values = data.otu_ids;
        var y_values = data.sample_values;
        var m_size = data.sample_values;
        var m_colors = data.otu_ids;
        var t_values = data.otu_labels;

        var trace1 = {
          x: x_values,
          y: y_values,
          text: t-values,
          mode: `markers`,
          marker: {
            size: m_size,
            color: m_colors
          }
        };

        var data = [bubble];
        var layout = {
          title: "Belly Button Bacteria",
          xaxis: {title: "OTU ID"}
        };
        Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(url).then(function(data){
        var pie_values = data.sample_values.slice(0,10);
        var pie_labels = data.otu_ids.slice(0,10);
        var pie_hover = data.otu_labels.slice(0,10);

        var data = [{
          values: pie_values,
          lables: pie_labels,
          hovertext: pie_hover,
          type: 'pie'
        }];
        Plotly.newPlot('pie',data);
      });
    });
  }

function init() {

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
