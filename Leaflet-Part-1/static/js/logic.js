// Earthquake data for the past month
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Fetch the earthquake data and process it
d3.json(earthquakeUrl).then(function(data) {
    console.log(data); // Inspect the data structure in the browser console

    // Call a function to plot the data
    plotEarthquakeData(data.features);
});

// Function to plot earthquake data
function plotEarthquakeData(earthquakeData) {
    // Define a map object with initial parameters
    var map = L.map('map').setView([37.09, -95.71], 5); // Initial coordinates and zoom level
    
    // Add a tile layer (background map) to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Define a function to set marker size based on earthquake magnitude
    function markerSize(magnitude) {
        return magnitude * 4;
    }

    // Define a function to set marker color based on earthquake depth
    function markerColor(depth) {
        if (depth > 90) return "#ea2c2c";
        else if (depth > 70) return "#ea822c";
        else if (depth > 50) return "#ee9c00";
        else if (depth > 30) return "#eecc00";
        else if (depth > 10) return "#d4ee00";
        else return "#98ee00";
    }

    // Loop through earthquake data and create markers
    earthquakeData.forEach(function(feature) {
        var location = feature.geometry.coordinates;
        var properties = feature.properties;
        var magnitude = properties.mag;
        var depth = location[2]; // Depth is the third value in the coordinates array

        // Create a circle marker for each earthquake
        L.circleMarker([location[1], location[0]], {
            radius: markerSize(magnitude),
            fillColor: markerColor(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(`<h3>Location: ${properties.place}</h3><hr><p>Magnitude: ${magnitude}</p><p>Depth: ${depth} km</p>`)
        .addTo(map);
    });

    // Add a legend to the map
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend');
        var depths = [-10, 10, 30, 50, 70, 90];
        var labels = [];

        // Loop through the depth intervals and generate a label with a colored square for each interval
        depths.forEach(function(depth, index) {
            div.innerHTML +=
                '<i style="background:' + markerColor(depth + 1) + '"></i> ' +
                depth + (depths[index + 1] ? '&ndash;' + depths[index + 1] + '<br>' : '+');
        });

        return div;
    };
    legend.addTo(map);
}
