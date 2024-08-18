// URL of the GeoJSON data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Use d3.json() to fetch the GeoJSON data
d3.json(url)
  .then(function(data) {
    // Once the data is loaded successfully, you can work with it here
    console.log(data); // Output the retrieved GeoJSON data to the console

    // Create a Leaflet GeoJSON layer and add it to the map
    L.geoJSON(data).addTo(myMap); // Assuming myMap is your Leaflet map object
  })
  .catch(function(error) {
    // Handle any errors that occur during data loading
    console.error('Error loading GeoJSON data:', error);
  });