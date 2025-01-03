const map = L.map('map', {
    minZoom: 5,
    maxZoom: 18,
    maxBounds: [
        [34.0, 19.0], // Southwest corner
        [42.0, 30.0]  // Northeast corner
    ]
}).setView([38.583812060352464, 24.899841779112172], 8); 

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    maxZoom: 18
}).addTo(map);

fetch('https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries/GRC.geojson')
    .then(response => response.json())
    .then(data => {
        const greeceLayer = L.geoJSON(data, {
            style: {
                color: '#FF5733', 
                weight: 3,        
                fillColor: '#FFD700', 
                fillOpacity: 0.2  
            }
        }).addTo(map);

        map.fitBounds(greeceLayer.getBounds());

        map.setMinZoom(map.getZoom());
    })
    .catch(error => console.error('Error loading GeoJSON:', error));