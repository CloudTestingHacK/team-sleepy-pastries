# Implementation Plan: Sleepy Pastries Routing (Existing UI)

This document outlines the end-to-end implementation plan for the "pastry crawl" feature in the Sleepy Pastries web app. It uses OpenStreetMap (OSM) data via the Overpass API, Leaflet.js for mapping, and Postcodes.io for UK geocoding, all wired into your existing frontend.

---

## Phase 1: Hooking into Your Current Form

Instead of adding new HTML, you simply need to target the inputs you already have. Identify the `id`, `class`, or `name` attributes of your existing form and input fields.

**Goal:** Capture the three variables using your existing DOM elements.

```javascript
// Map these variables to the IDs or classes currently in your repo's HTML
const myForm = document.querySelector('form'); // Update if you have a specific ID like '#my-form'
const postcodeInput = document.querySelector('input[name="postcode"]'); // Update selector to match your HTML
const stopsInput = document.querySelector('input[name="stops"]'); // Update selector
const distanceInput = document.querySelector('input[name="distance"]'); // Update selector
Phase 2: Geocoding (Postcode to Coordinates)
The Overpass API requires latitude and longitude. Since the app uses UK postcodes, the free Postcodes.io API will convert the postcode from your existing input.

Goal: Convert the postcode into lat and lng.

JavaScript
async function getCoordinatesFromPostcode(postcode) {
    const url = `https://api.postcodes.io/postcodes/${postcode.trim()}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 200) {
        return { lat: data.result.latitude, lng: data.result.longitude };
    } else {
        throw new Error("Invalid postcode");
    }
}
Phase 3: Fetching Data (Radius Search)
With the starting coordinates and search radius, query the Overpass API using the around filter to find all bakeries within a perfect circle.

Goal: Find all bakeries within the user-defined radius.

JavaScript
async function fetchBakeriesInRadius(lat, lng, radiusInMeters) {
    const query = `
        [out:json][timeout:25];
        (
          node["shop"="bakery"](around:${radiusInMeters}, ${lat}, ${lng});
        );
        out body;
    `;
    
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return data.elements; // Array of all bakeries in the radius
}
Phase 4: Filtering the Stops
If the Overpass query returns more bakeries than requested, filter the results down to match the number of stops your user entered.

Goal: Slice the array to exactly N stops.

JavaScript
function selectStops(allBakeries, numStops) {
    // Basic approach: Take the first N results returned by the API
    return allBakeries.slice(0, numStops);
}
Phase 5: Tying It Together (The Controller)
Attach an event listener to your existing form. It pulls the values from your current inputs, runs the logic, and drops the pins on the map.

Goal: Execute the full flow on form submit without altering the HTML structure.

JavaScript
myForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Pull values from your existing inputs
    const postcode = postcodeInput.value;
    const stops = parseInt(stopsInput.value, 10);
    const distance = parseInt(distanceInput.value, 10);
    
    try {
        // 1. Get starting coordinates
        const startLocation = await getCoordinatesFromPostcode(postcode);
        
        // 2. Center map on the starting point
        map.setView([startLocation.lat, startLocation.lng], 14);
        L.marker([startLocation.lat, startLocation.lng])
            .addTo(map)
            .bindPopup("<b>Start Here</b>");
        
        // 3. Get all bakeries in the radius
        const allBakeries = await fetchBakeriesInRadius(startLocation.lat, startLocation.lng, distance);
        
        // 4. Filter down to the exact number of stops requested
        const selectedBakeries = selectStops(allBakeries, stops);
        
        // 5. Render them on the map (assumes renderBakeries function is defined)
        renderBakeries(selectedBakeries); 
        
    } catch (error) {
        alert("Error generating your pastry route: " + error.message);
    }
});