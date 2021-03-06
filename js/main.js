
//load data
var url = 'https://www.rideindego.com/stations/json/';

map.on('load', function() {
  // Insert the layer beneath any symbol layer.
 var layers = map.getStyle().layers;

 var labelLayerId;
 for (var i = 0; i < layers.length; i++) {
     if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
         labelLayerId = layers[i].id;
         break;
     }
 }
  // Insert the 3-D Building layer
 map.addLayer({
     'id': '3d-buildings',
     'source': 'composite',
     'source-layer': 'building',
     'filter': ['==', 'extrude', 'true'],
     'type': 'fill-extrusion',
     'minzoom': 12,
     'paint': {
         'fill-extrusion-color': '#aaa',

         'fill-extrusion-height': [
             "interpolate", ["linear"], ["zoom"],
             12, 0,
             12.05, ["get", "height"]
         ],
         'fill-extrusion-base': [
             "interpolate", ["linear"], ["zoom"],
             12, 0,
             12.05, ["get", "min_height"]
         ],
         'fill-extrusion-opacity': .6
     }
 }, labelLayerId);

    map.addSource('rideindego', { type: 'geojson', data: url });
    map.getSource('rideindego').setData(url);
    map.addLayer({
        "id": "test",
        "type": "circle",
        "source": "rideindego",
        "paint":{
          "circle-color": "#40BFBF",
          "circle-opacity": 0.4,
          "circle-radius":10,
        },
        "layout": {
        }
    });

    map.on('click', function(e) {
        var features = map.queryRenderedFeatures(e.point, {
           layers: ['test']
         });

        if (!features.length) {
        return;
      }
      var feature = features[0];
      console.log(feature);
      var popup = new mapboxgl.Popup({ offset: [0, -15] })
      .setLngLat(feature.geometry.coordinates)
      .setHTML('<h3>' + feature.properties.name + '</h3><p>' +
      feature.properties.addressStreet + '</p><h4><strong>' +
       feature.properties.bikesAvailable + '</strong> Bikes</h4><h4><strong>' +
       feature.properties.docksAvailable + '</strong> Docks </h4>'
)
      .setLngLat(feature.geometry.coordinates)
      .addTo(map);
    });
});


map.addControl(new mapboxgl.NavigationControl());
