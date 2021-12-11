export const displayMap = (locations) => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoidGFydW5iaGFyYWR3YWoiLCJhIjoiY2t3MjV5bzE3MWM0ejJvbnRrc3E1azJ1aiJ9.d5nBMSVdprn7YVPWhZVP6Q';

    var map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/tarunbharadwaj/ckwf4acwo0wxc15mvyxzexq7c', // style URL
        scrollZoom: false
        // center: [-118.113491, 34.111745],
        // zoom: 4.
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
        // Create Marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add Marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add popup
        new mapboxgl.Popup({
            offset: 30
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};
