// Map initialize
var map = L.map('map').setView([20.5937, 78.9629], 5);

// Tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Store all memories
var memories = [];
var clickedLat, clickedLng;

// Map click event - select coordinates
map.on('click', function(e) {
    clickedLat = e.latlng.lat;
    clickedLng = e.latlng.lng;
    alert("Location selected: " + clickedLat.toFixed(4) + ", " + clickedLng.toFixed(4));
});

// Search function
function searchPlace() {
    var place = document.getElementById("searchBox").value;
    if (!place) {
        alert("Type a place name!");
        return;
    }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${place}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var lat = data[0].lat;
                var lon = data[0].lon;

                map.setView([lat, lon], 12);
                L.marker([lat, lon]).addTo(map)
                  .bindPopup(`<b>${place}</b>`).openPopup();
            } else {
                alert("Place not found!");
            }
        })
        .catch(err => console.error(err));
}

// Where Am I function
function findMe() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }
    navigator.geolocation.getCurrentPosition(
        function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            map.setView([lat, lon], 13);
            L.marker([lat, lon]).addTo(map)
              .bindPopup("You are here!").openPopup();
        },
        function() {
            alert("Unable to retrieve your location");
        }
    );
}

// Add Memory
function addMemory() {
    var place = document.getElementById("memoryPlace").value;
    var file = document.getElementById("memoryImage").files[0];
    var note = document.getElementById("memoryNote").value;

    if (!place || !file || !note) {
        alert("Please fill all fields!");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        var imgURL = e.target.result;

        var lat = clickedLat || 20 + Math.random() * 10;
        var lng = clickedLng || 70 + Math.random() * 10;

        memories.push({ place, imgURL, note, lat, lng });

        var marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(
            "<b>" + place + "</b><br>" +
            "<img src='" + imgURL + "' width='150'><br>" +
            note
        );

        alert("Memory added!");
    };

    reader.readAsDataURL(file);

    document.getElementById("memoryPlace").value = "";
    document.getElementById("memoryImage").value = "";
    document.getElementById("memoryNote").value = "";
}
