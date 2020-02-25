function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(`/metadata/${sample}`).then((data) => {
      var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
      panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      panel.append("h6").text(`${key}:${value}`);
    })
    // BONUS: Build the Gauge Chart
      buildGauge(data.WFREQ);
})
};

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(`/samples/${sample}`).then(function(data){
    const otu_ids = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;
    var x_axis = otu_ids;
    var y_axis = sample_values;
    var size = sample_values;
    var color = otu_ids;
    var text = otu_labels;
  
    var bubble = {
      x: x_axis,
      y: y_axis,
      text: text,
      mode: `markers`,
      marker: {
        size: size,
        color: color
      }
    };

    var data = [bubble];
    var layout = {
      title: "Belly Button Bacteria Diversity",
      xaxis: {title: "OTU ID"}
    };
    Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieData = [
      {
        values: sample_values.slice(0, 9),
        labels: otu_ids.slice(0, 9),
        hovertext: otu_labels.slice(0, 9),
        hoverinfo: "hovertext",
        type: "pie"
      }
    ];
    
    var pieLayout = {
      margin: { t: 0, l: 0 }
    };

    Plotly.plot("pie", pieData, pieLayout);
})
};


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
