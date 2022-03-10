// fichier contenant la configuration de base de la map
var mouseOverDragZone = false;
$("html").click(function(){
    $.getScript("js/script.js", function(){
      displayBlock();
    });
});

$(function () {
  $(".draggable").draggable({
    containment: "document",
    scroll: false,
    stack: ".draggable",
    distance: 0
  });
  $("#map").droppable({
    drop: function (event, ui) {
      alert("DROP EN COURS");
      if (mouseOverDragZone) {
        $(this).addClass("ui-state-highlight").hide();
      }
    },
  });
});

const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [0, 0],
      },
    },
  ],
};

const maine = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        // These coordinates outline Maine.
        coordinates: [
          [
            [-67.13734, 45.13745],
            [-66.96466, 44.8097],
            [-68.03252, 44.3252],
            [-69.06, 43.98],
            [-70.11617, 43.68405],
            [-70.64573, 43.09008],
            [-70.75102, 43.08003],
            [-70.79761, 43.21973],
            [-70.98176, 43.36789],
            [-70.94416, 43.46633],
            [-71.08482, 45.30524],
            [-70.66002, 45.46022],
            [-70.30495, 45.91479],
            [-70.00014, 46.69317],
            [-69.23708, 47.44777],
            [-68.90478, 47.18479],
            [-68.2343, 47.35462],
            [-67.79035, 47.06624],
            [-67.79141, 45.70258],
            [-67.13734, 45.13745],
          ],
        ],
      },
    },
  ],
};

mapboxgl.accessToken =
  "pk.eyJ1IjoiYW50aG9ueWtwIiwiYSI6ImNrenNuaDF1djAzNmwyd280dTNpcm9lY2sifQ.HIbK50uFeTfJrQTL4Lizww";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/anthonykp/ckzsnjcmp001q14qmss8n4zc9/draft",
  center: [ 2.339, 48.854 ],
  zoom: 11.44
  ,
});

const canvas = map.getCanvasContainer();

const marker = new mapboxgl.Marker({
  color: 'blue' // color it red
  });

map.on("load", () => {
  map.addSource("point", {
    type: "geojson",
    data: geojson,
  });

  map.addLayer({
    id: "point",
    type: "circle",
    source: "point",
    paint: {
      "circle-radius": 10,
      "circle-color": "#F84C4C", // red color
    },
  });

  map.addSource("maine", {
    type: "geojson",
    data: maine,
  });

  // Add a new layer to visualize the polygon.
  map.addLayer({
    id: "maine",
    type: "fill",
    source: "maine", // reference the data source
    layout: {},
    paint: {
      "fill-color": "#0080ff", // blue color fill
      "fill-opacity": 0.5,
    },
  });
  
  // Add a black outline around the polygon.
  map.addLayer({
    id: "outline",
    type: "line",
    source: "maine",
    layout: {},
    paint: {
      "line-color": "#000",
      "line-width": 3,
    },
  });

  map.addSource("places", {
    // This GeoJSON contains features that include an "icon"
    // property. The value of the "icon" property corresponds
    // to an image in the Mapbox Streets style's sprite.
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            description:
              '<strong>Make it Mount Pleasant</strong><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
            icon: "theatre-15",
          },
          geometry: {
            type: "Point",
            coordinates: [-77.038659, 38.931567],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<strong>Mad Men Season Five Finale Watch Party</strong><p>Head to Lounge 201 (201 Massachusetts Avenue NE) Sunday for a <a href="http://madmens5finale.eventbrite.com/" target="_blank" title="Opens in a new window">Mad Men Season Five Finale Watch Party</a>, complete with 60s costume contest, Mad Men trivia, and retro food and drink. 8:00-11:00 p.m. $10 general admission, $20 admission and two hour open bar.</p>',
            icon: "theatre-15",
          },
          geometry: {
            type: "Point",
            coordinates: [-77.003168, 38.894651],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<strong>Big Backyard Beach Bash and Wine Fest</strong><p>EatBar (2761 Washington Boulevard Arlington VA) is throwing a <a href="http://tallulaeatbar.ticketleap.com/2012beachblanket/" target="_blank" title="Opens in a new window">Big Backyard Beach Bash and Wine Fest</a> on Saturday, serving up conch fritters, fish tacos and crab sliders, and Red Apron hot dogs. 12:00-3:00 p.m. $25.grill hot dogs.</p>',
            icon: "bar-15",
          },
          geometry: {
            type: "Point",
            coordinates: [-77.090372, 38.881189],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<strong>Ballston Arts & Crafts Market</strong><p>The <a href="http://ballstonarts-craftsmarket.blogspot.com/" target="_blank" title="Opens in a new window">Ballston Arts & Crafts Market</a> sets up shop next to the Ballston metro this Saturday for the first of five dates this summer. Nearly 35 artists and crafters will be on hand selling their wares. 10:00-4:00 p.m.</p>',
            icon: "art-gallery-15",
          },
          geometry: {
            type: "Point",
            coordinates: [-77.111561, 38.882342],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<strong>Seersucker Bike Ride and Social</strong><p>Feeling dandy? Get fancy, grab your bike, and take part in this year\'s <a href="http://dandiesandquaintrelles.com/2012/04/the-seersucker-social-is-set-for-june-9th-save-the-date-and-start-planning-your-look/" target="_blank" title="Opens in a new window">Seersucker Social</a> bike ride from Dandies and Quaintrelles. After the ride enjoy a lawn party at Hillwood with jazz, cocktails, paper hat-making, and more. 11:00-7:00 p.m.</p>',
            icon: "bicycle-15",
          },
          geometry: {
            type: "Point",
            coordinates: [-77.052477, 38.943951],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<strong>Capital Pride Parade</strong><p>The annual <a href="http://www.capitalpride.org/parade" target="_blank" title="Opens in a new window">Capital Pride Parade</a> makes its way through Dupont this Saturday. 4:30 p.m. Free.</p>',
            icon: "rocket-15",
          },
          geometry: {
            type: "Point",
            coordinates: [-77.043444, 38.909664],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<strong>Muhsinah</strong><p>Jazz-influenced hip hop artist <a href="http://www.muhsinah.com" target="_blank" title="Opens in a new window">Muhsinah</a> plays the <a href="http://www.blackcatdc.com">Black Cat</a> (1811 14th Street NW) tonight with <a href="http://www.exitclov.com" target="_blank" title="Opens in a new window">Exit Clov</a> and <a href="http://godsilla.bandcamp.com" target="_blank" title="Opens in a new window">Gods’illa</a>. 9:00 p.m. $12.</p>',
            icon: "music-15",
          },
          geometry: {
            type: "Point",
            coordinates: [-77.031706, 38.914581],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<strong>A Little Night Music</strong><p>The Arlington Players\' production of Stephen Sondheim\'s  <a href="http://www.thearlingtonplayers.org/drupal-6.20/node/4661/show" target="_blank" title="Opens in a new window"><em>A Little Night Music</em></a> comes to the Kogod Cradle at The Mead Center for American Theater (1101 6th Street SW) this weekend and next. 8:00 p.m.</p>',
            icon: "music-15",
          },
          geometry: {
            type: "Point",
            coordinates: [-77.020945, 38.878241],
          },
        },
        {
          type: "Feature",
          properties: {
            description:
              '<strong>Truckeroo</strong><p><a href="http://www.truckeroodc.com/www/" target="_blank">Truckeroo</a> brings dozens of food trucks, live music, and games to half and M Street SE (across from Navy Yard Metro Station) today from 11:00 a.m. to 11:00 p.m.</p>',
            icon: "music-15",
          },
          geometry: {
            type: "Point",
            coordinates: [-77.007481, 38.876516],
          },
        },
      ],
    },
  });
  // Add a layer showing the places.
  map.addLayer({
    id: "places",
    type: "symbol",
    source: "places",
    layout: {
      "icon-image": "{icon}",
      "icon-allow-overlap": true,
    },
  });

  map.addControl(
    new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    // When active the map will receive updates to the device's location as it changes.
    trackUserLocation: true,
    // Draw an arrow next to the location dot to indicate which direction the device is heading.
    showUserHeading: true
    })
    );

    map.addControl(new mapboxgl.NavigationControl());


  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  map.on("click", "places", (e) => {
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup().setLngLat(coordinates).setHTML(description).addTo(map);
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on("mouseenter", "places", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  map.on("mouseleave", "places", () => {
    map.getCanvas().style.cursor = "";
  });

  map.on("mouseenter", "maine", () => {
    mouseOverDragZone = true;
    console.log("Curseur entre dans MAINE");
  });

  map.on("mouseleave", "maine", () => {
    mouseOverDragZone = false;
    console.log("Curseur quitte MAINE");
  });

  function onMove(e) {
    const coords = e.lngLat;

    // Set a UI indicator for dragging.
    canvas.style.cursor = "grabbing";

    // Update the Point feature in `geojson` coordinates
    // and call setData to the source layer `point` on it.
    geojson.features[0].geometry.coordinates = [coords.lng, coords.lat];
    map.getSource("point").setData(geojson);

    var poly = maine.features[0];
    var point = geojson.features[0];
    if (turf.booleanContains(poly, point)) {
      console.log("hello");
    }
  }

  function onUp(e) {
    const coords = e.lngLat;

    // Print the coordinates of where the point had
    // finished being dragged to on the map.
    coordinates.style.display = "block";
    coordinates.innerHTML = `Longitude: ${coords.lng}<br />Latitude: ${coords.lat}`;
    canvas.style.cursor = "";

    // Unbind mouse/touch events
    map.off("mousemove", onMove);
    map.off("touchmove", onMove);
  }

  // When the cursor enters a feature in
  // the point layer, prepare for dragging.
  map.on("mouseenter", "point", () => {
    map.setPaintProperty("point", "circle-color", "#3bb2d0");
    canvas.style.cursor = "move";
  });

  map.on("mouseleave", "point", () => {
    map.setPaintProperty("point", "circle-color", "#3887be");
    canvas.style.cursor = "";
  });

  map.on("mousedown", "point", (e) => {
    // Prevent the default map drag behavior.
    e.preventDefault();

    canvas.style.cursor = "grab";

    map.on("mousemove", onMove);
    map.once("mouseup", onUp);
  });

  map.on("touchstart", "point", (e) => {
    if (e.points.length !== 1) return;

    // Prevent the default map drag behavior.
    e.preventDefault();

    map.on("touchmove", onMove);
    map.once("touchend", onUp);

  });

  function actualLatLgn(){
    var latlng = map.getCenter();
    $(".coordonnees").text(latlng.lat + ":" + latlng.lng);
  }

  function mapCenterMarker(){
    marker.setLngLat(map.getCenter());
    marker.addTo(map);
    
    actualLatLgn();

    requestAnimationFrame(mapCenterMarker);
  }

  requestAnimationFrame(() => mapCenterMarker());

});
