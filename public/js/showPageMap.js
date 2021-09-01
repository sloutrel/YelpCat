mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/light-v10', // style URL
  center: center.geometry.coordinates, // starting position [lng, lat]
  zoom: 12, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()

  .setLngLat(center.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${center.name}</h3>`)
  )
  .addTo(map);
