// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function getcolor(depth) {
  switch (true) {
    case depth > 90:
      return "#EA2C2C"; // Red for depth greater than 90
    case depth > 60:
      return "#FFCC00"; // Yellow for depth greater than 60
    case depth > 30:
      return "#33CC33"; // Green for depth greater than 30
    default:
      return "#6699FF"; // Blue for all other depths
  }
}

function styleinfo(feature) {
  return {
    fillOpacity: 0.75,
    color: "white",
    fillColor: getcolor(feature.geometry.coordinates[2]),
    // Adjust the radius.
    radius: getradius(feature.properties.mag)
  };
}

function getradius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }

  return magnitude * 4;
}

function createFeatures(earthquakeData) {
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(
      "Magnitude: "
      + feature.properties.mag
      + "<br>Depth: "
      + feature.geometry.coordinates[2]
      + "<br>Location: "
      + feature.properties.place
    );;
  }
  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    onEachFeature: onEachFeature,
    style: styleinfo
  });

  // Send our earthquakes layer to the createMap function.
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// Define a label-color mapping object for the range labels globally
let labelColors = {
    '<30': '#33CC33',   // Green color for '<30'
    '30-60': '#FFCC00', // Yellow color for '30-60'
    '60-90': '#EA2C2C', // Red color for '60-90'
    '90<': '#6699FF'    // Blue color for '90<'
};

// Set up the legend.
let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    console.log(labelColors); // Debugging - Check if labelColors object is accessible

    let div = L.DomUtil.create("div", "info legend");
    let labels = ['<30', '30-60', '60-90', '90<']; // Example legend labels

    // Add title to the legend
    div.innerHTML = '<h4>Legend</h4>';

    // Loop through legend labels and create elements with colors
    labels.forEach((label) => {
        div.innerHTML += '<i style="background:' + labelColors[label] + '"></i> ' + label + '<br>';
    });

    return div;
};

// Adding the legend to the map
legend.addTo(myMap);
}


