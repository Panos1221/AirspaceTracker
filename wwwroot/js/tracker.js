// Default and selected icons for aircraft
const planeIcon = L.icon({
    iconUrl: '/images/plane-icon.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

const planeSelectedIcon = L.icon({
    iconUrl: '/images/plane-selected.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
});

const markers = {}; 
let selectedMarker = null; 
let openFlightCallsign = null; 

function updateFlights() {
    fetch('/api/flight')
        .then(response => response.json())
        .then(data => {
            console.log('Updated flight data:', data);

            if (openFlightCallsign) {
                const flight = data.ac.find(f => f.flight === openFlightCallsign);
                if (flight) {
                    updateInfoPanel(flight); 
                }
            }

            if (data.ac && Array.isArray(data.ac)) {
                data.ac.forEach(flight => {
                    if (flight.lat && flight.lon) {
                        const flightId = flight.flight; // Unique ID

                        if (markers[flightId]) {
                            markers[flightId].setLatLng([flight.lat, flight.lon]);
                            markers[flightId].setRotationAngle(flight.track || 0); // Update rotation of image
                        } else {
                            const marker = L.marker([flight.lat, flight.lon], {
                                icon: planeIcon,
                                rotationAngle: flight.track || 0,
                            }).addTo(map);

                            if (flight.flight) {
                                marker.bindTooltip(flight.flight, {
                                    permanent: false,
                                    direction: 'top',
                                });
                                console.log(`Tooltip set for flight: ${flight.flight}`);
                            }

                            marker.on('click', () => {
                                selectMarker(marker, flight);
                            });

                            markers[flightId] = marker;
                        }
                    }
                });
            } else {
                console.error('No aircraft data available');
            }
        })
        .catch(error => console.error('Error fetching flight data:', error));
}

function openInfoPanel(flight) {
    openFlightCallsign = flight.flight;

    document.getElementById('info-flight').textContent = flight.flight || 'N/A';
    document.getElementById('info-desc').textContent = flight.desc || 'N/A';
    document.getElementById('info-altitude').textContent = flight.alt_baro || 'N/A';
    document.getElementById('info-speed').textContent = flight.gs || 'N/A';
    document.getElementById('info-squawk').textContent = flight.squawk || 'N/A';
    document.getElementById('info-track').textContent = flight.track || 'N/A';
    document.getElementById('info-registration').textContent = flight.r || 'N/A';

    const imageContainer = document.getElementById('info-image');
    imageContainer.innerHTML = ''; 

    fetchAircraftImage(flight.r).then((imageUrl) => {
        console.log(`Adding image to panel for registration ${flight.r}: ${imageUrl}`);
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = flight.r || 'Aircraft';
        img.style.width = '100%';
        img.style.borderRadius = '8px';
        img.onerror = () => {
            console.log(`Image failed to load for ${flight.r}, using fallback.`);
            img.src = '/images/aircraft/DEFAULT.png';
        };

        imageContainer.appendChild(img);
    });

    const infoPanel = document.getElementById('info-panel');
    infoPanel.classList.remove('hidden');
    infoPanel.style.display = 'block';
}


function selectMarker(marker, flight) {
    if (selectedMarker) {
        selectedMarker.setIcon(planeIcon);
    }
    marker.setIcon(planeSelectedIcon);
    selectedMarker = marker;
    openInfoPanel(flight);
}

function updateInfoPanel(flight) {
    document.getElementById('info-altitude').textContent = flight.alt_baro || 'N/A';
    document.getElementById('info-speed').textContent = flight.gs || 'N/A';
    document.getElementById('info-squawk').textContent = flight.squawk || 'N/A';
    document.getElementById('info-track').textContent = flight.track || 'N/A';
    console.log(`Updated info panel for flight: ${flight.flight}`);
}

function clearSelection() {
    if (selectedMarker) {
        selectedMarker.setIcon(planeIcon);
        selectedMarker = null;
    }
}

// Close Information Panel on map click
map.on('click', () => {
    clearSelection();
    closeInfoPanel();
});

function fetchAircraftImage(registration) {
    if (!registration) {
        console.error('No registration provided for fetching aircraft image.');
        return Promise.resolve('/images/aircraft/DEFAULT.png');
    }

    const apiUrl = `https://api.planespotters.net/pub/photos/reg/${encodeURIComponent(registration)}`;

    console.log(`Querying Planespotters API for: ${registration}`);

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Planespotters API responded with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.photos && data.photos.length > 0) {
                const photoObject = data.photos[0];
                const imageUrl = photoObject.thumbnail_large?.src || '/images/aircraft/DEFAULT.png';

                console.log(`Image URL fetched for ${registration}: ${imageUrl}`);
                return imageUrl;
            } else {
                console.log(`No photos found for registration: ${registration}`);
                return '/images/aircraft/DEFAULT.png';
            }
        })
        .catch(error => {
            console.error(`Error querying Planespotters API for ${registration}:`, error);
            return '/images/aircraft/DEFAULT.png';
        });
}

// Close info panel
function closeInfoPanel() {
    const infoPanel = document.getElementById('info-panel');
    if (infoPanel.classList.contains('hidden')) return;
    infoPanel.classList.add('hidden');
    setTimeout(() => {
        infoPanel.style.pointerEvents = 'none';
    }, 300);
}

// Add event listener for closing the info panel
document.getElementById('close-info-panel').addEventListener('click', () => {
    openFlightCallsign = null;
    clearSelection();
    closeInfoPanel();
});

// Initial data fetch and periodic updates every X seconds
updateFlights();
setInterval(updateFlights, 2500);