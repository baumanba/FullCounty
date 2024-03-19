// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Initialize the map
    var map = L.map('map').setView([40.041071, -76.302993], 13); // Initial coordinates and zoom level

    // Store loaded files
    var loadedFiles = {};

    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Include chunk_index.js file
    var script = document.createElement('script');
    script.src = 'chunk_data/output/chunk_index.js';
    document.head.appendChild(script);

    // Print the upper left and lower right coordinates of the map bounds to the console
    map.on('moveend', function() {
        var bounds = map.getBounds();
        var upperLeft = bounds.getNorthWest();
        var lowerRight = bounds.getSouthEast();
        console.log("Upper Left Coordinates:", upperLeft.lat.toFixed(6), ",", upperLeft.lng.toFixed(6));
        console.log("Lower Right Coordinates:", lowerRight.lat.toFixed(6), ",", lowerRight.lng.toFixed(6));

        // Check zoom level
        if (map.getZoom() >= 14) {
            // Check if each file in chunk_index.js intersects with the map bounds
            if (typeof fileIndex !== 'undefined') {
                fileIndex.forEach(function(file) {
                    // Check if the file is not already loaded
                    if (!loadedFiles[file.file]) {
                        var fileBounds = L.latLngBounds(
                            L.latLng(file.topLeft.y, file.topLeft.x),
                            L.latLng(file.bottomRight.y, file.bottomRight.x)
                        );
                        var intersects = bounds.intersects(fileBounds);
                        console.log("File:", file.file, "intersects with map bounds:", intersects);

                        // Create rectangle and add to map if it intersects with the map bounds
                        if (intersects) {
                            L.rectangle([
                                [file.topLeft.y, file.topLeft.x],
                                [file.bottomRight.y, file.bottomRight.x]
                            ], { color: 'red', weight: 2 }).addTo(map);

                            // Fetch GeoJSON data for files that intersect with the map bounds
                            fetch('chunk_data/output/' + file.file)
                                .then(response => response.json())
                                .then(data => {
                                    // Extract geometry features and add them to the map
                                    L.geoJSON(data, {
                                        filter: function(feature) {
                                            return feature.geometry; // Only include features with geometry
                                        }
                                    }).addTo(map);
                                    // Mark the file as loaded
                                    loadedFiles[file.file] = true;
                                })
                                .catch(error => {
                                    console.error('Error loading GeoJSON data:', error);
                                });
                        }
                    }
                });
            }
        }
    });
});
