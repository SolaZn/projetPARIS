$("#listeFavori").click(showFavori);
var moment;
var globaltimeZone = "Europe/Paris";
var globalCoordinates = { 'lng' : 2.352, 'lat' : 48.856 };

function favHide() {
  $("#favori").css("display", "none");
}

function placeHide() {
  $("#messageAdresse").text("Ici s'affichera votre dernier point posé");
  $("#adresse").css("display", "none");
}

function flyToMarker(value) {
  var coordinates = value;
  var latlng = coordinates.split(",");
  globalCoordinates = { lng: latlng[1], lat: latlng[0] };

  map.flyTo({
    center: latlng,
    essential: true,
    zoom: 16,
  });

  map.once("moveend", () => {
    var latlng = map.getCenter();

    $.ajax({
      type: "GET",
      url:
        "https://nominatim.openstreetmap.org/reverse?lat=" +
        latlng.lat +
        "&lon=" +
        latlng.lng,
      success: function (xml) {
        adresse = $(xml).find("result").text();
        $("#messageAdresse").text("Localisation du point recherché");
        $("#adresse").text(adresse);
        $(".adresse").css("display", "block");
      },
    });
  });
}

function bigMapChange() {
  var latlng = map.getCenter();
  var diffLat = Math.abs(globalCoordinates.lat - latlng.lat);
  var diffLng = Math.abs(globalCoordinates.lng - latlng.lng);

  return diffLat > 0.5 || diffLng > 0.2;
}

function showFavori() {
  $("#listeMarqueurs").dialog({ width: 600, height: 500 });
}

var mouseOverDragZone = false;

function getTime(timeZone) {
  var latlng = map.getCenter();
  if (bigMapChange()) {
    $.ajax({
      type: "GET",
      url:
        "https://nominatim.openstreetmap.org/reverse?lat=" +
        latlng.lat +
        "&lon=" +
        latlng.lng,
      success: function (xml) {
        var country = $(xml).find("addressparts").find("country").text();
        globalCoordinates = latlng;
        if (country != null) {
          $("#paysLocal").html(country + "<br/>");
        } else {
          $("#paysLocal").html("Ici<br/>");
        }
      },
    });
  }

  globaltimeZone = timeZone;

  var d = new Date().toUTCString();
  moment.locale("fr");
  var time = moment.utc(d).tz(globaltimeZone);
  var date = time.format("DD/MM/YYYY");
  var heure = time.format("HH:mm:ss");

  // return time as a string
  $("#heureLocale").html(heure);
  $("#dateLocale").html(date);
}

function getTimeNow() {
  var d = new Date().toUTCString();
  moment.locale("fr");
  var time = moment.utc(d).tz(globaltimeZone);
  var date = time.format("DD/MM/YYYY");
  var heure = time.format("HH:mm:ss");

  // return time as a string
  $("#heureLocale").html(heure);
  $("#dateLocale").html(date);
}

function actualLatLgn() {
  var latlng = map.getCenter();
  $(".coordonnees").text(latlng.lat.toFixed(3) + ":" + latlng.lng.toFixed(3));
  return latlng;
}

function updateTimeOffset() {
  var location = actualLatLgn();

  if (bigMapChange()) {
    placeHide();
    favHide();
    $.ajax({
      type: "GET",
      url:
        "https://api.mapbox.com/v4/examples.4ze9z6tv/tilequery/" +
        location.lng +
        "," +
        location.lat +
        ".json?access_token=pk.eyJ1IjoiYW50aG9ueWtwIiwiYSI6ImNrenNuaDF1djAzNmwyd280dTNpcm9lY2sifQ.HIbK50uFeTfJrQTL4Lizww",
      success: function (json) {
        try {
          const userTimezone = json.features[0].properties.TZID;
          getTime(userTimezone);
        } catch (error) {
          console.log(
            "Could not retrieve timezone; maybe try being over the land instead of the sea ?"
          );
        }
      },
    });
  }
}

$(function () {
  getTime("Europe/Paris");

  $(".draggable").draggable({
    revert: true,
    containment: "document",
    scroll: false,
    stack: ".draggable",
    distance: 0,
    helper: function () {
      var helper = $(this).clone(); // Untested - I create my helper using other means...
      // jquery.ui.sortable will override width of class unless we set the style explicitly.
      helper.css({ width: "inherit", height: "inherit" });
      return helper;
    },
    start: function (event, ui) {
      $(this).hide();
    },
    stop: function (event, ui) {
      $(this).show();
    },
  });

  $("#map").droppable({
    greedy: false,
    tolerance: "fit",
    accept: ".draggable",
    drop: function (event, ui) {
      $(this).find("").append(ui.draggable);
      var coordinates = ui.draggable.attr("value");
      var latlng = coordinates.split(",");
      map.flyTo({
        center: latlng,
        essential: true,
        zoom: 11.2,
      });
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
mapboxgl.setRTLTextPlugin(
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js"
);
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/anthonykp/ckzsnjcmp001q14qmss8n4zc9/draft",
  center: [2.352, 48.856],
  zoom: 11.44,
});

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
});

const canvas = map.getCanvasContainer();

const marker = new mapboxgl.Marker({
  color: "blue",
});

function createRoute(value, mode) {
  var coordinates = value;
  var latlng = coordinates.split(",");
  var start_lat;
  var start_lng;

  function localization(pos) {
    var crd = pos.coords;
    start_lat = crd.latitude;
    start_lng = crd.longitude;
    getRoute(start_lat, start_lng, latlng, mode);
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function error(err) {
    console.warn(`ERREUR (${err.code}): ${err.message}`);
  }

  navigator.geolocation.getCurrentPosition(localization, error, options);
}

// create a function to make a directions request
async function getRoute(start_lat, start_lng, end, mode) {
  // make a directions request using cycling profile
  // an arbitrary start will always be the same
  // only the end or destination will change
  console.log("début :" + start_lat + "," + start_lng);
  console.log("fin :" + end);
  console.log("mode :" + mode);

  var arr = [start_lng, start_lat];
  var start = mapboxgl.LngLat.convert(arr);

  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/${mode}/${start_lng},${start_lat};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}&language=fr-FR`,
    { method: "GET" }
  );
  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;

  const geojson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: route,
    },
  }
  // if the route already exists on the map, we'll reset it using setData
  if (map.getSource("route")) {
    map.getSource("route").setData(geojson);
  }
  // otherwise, we'll make a new request
  else {
    map.addLayer({
      id: "route",
      type: "line",
      source: {
        type: "geojson",
        data: geojson,
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#3887be",
        "line-width": 5,
        "line-opacity": 0.75,
      },
    });
  }

  const startPt = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: start,
        },
      },
    ],
  }
  if (map.getLayer("start")) {
    map.getSource("start").setData(startPt);
  } else {
    map.addLayer({
      id: "start",
      type: "circle",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: start,
              },
            },
          ],
        },
      },
      paint: {
        "circle-radius": 10,
        "circle-color": "#f31",
      },
    });
  }

  const arrival = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: end,
        },
      },
    ],
  }
  if (map.getLayer("arrival")) {
    map.getSource("arrival").setData(arrival);
  } else {
    map.addLayer({
      id: "arrival",
      type: "circle",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: end,
              },
            },
          ],
        },
      },
      paint: {
        "circle-radius": 10,
        "circle-color": "#f30",
      },
    });
  }

  const steps = data.legs[0].steps;
  var buttonDrive =
    `<button class="button" value="${start.lng},${start.lat}"onclick=createRoute(this.value, "driving")><i class="fa-solid fa-car"></i></button>`;

  var buttonCycle =
    `<button class="button" value="${start.lng},${start.lat}"onclick=createRoute(this.value, "cycle")><i class="fa-solid fa-bicycle"></i></button>`;

  var buttonWalk =
    `<button class="button" value="${start.lng},${start.lat}"onclick=createRoute(this.value, "walking")><i class="fa-solid fa-person-walking"></i></button>`;

  var buttonTraffic =
    `<button class="button" value="${start.lng},${start.lat}"onclick=createRoute(this.value, "driving-traffic")><i class="fa-solid fa-traffic-light"></i></button>`;

  $("#itineraire-buttons").append(buttonCycle);
  $("#itineraire-buttons").append(buttonWalk);
  $("#itineraire-buttons").append(buttonDrive);
  $("#itineraire-buttons").append(buttonTraffic);

  $("#itineraire-body").html("");

  let tripInstructions = "";
  var index = 1;

  for (const step of steps) {
    tripInstructions += "<tr><th>" + index + "</th>";
    tripInstructions += `<td>${step.maneuver.instruction}</td></tr>`;
    $("#itineraire-body").append(tripInstructions);
    index++;
    tripInstructions = "";
  }

  index = 0;

  $("#directions").dialog({ width: 600, height: 500 });
}

let registeredMarkers = [];

$(document).ready(function () {
  moment = window.moment;
});
// la configuration de base de la map
map.on("load", () => {
  globalCoordinates = map.getCenter();

  map.setLayoutProperty("country-label", "text-field", [
    "format",
    ["get", "name_fr"],
    { "font-scale": 1.2 },
    "\n",
    {},
    ["get", "name"],
    {
      "font-scale": 0.8,
      "text-font": [
        "literal",
        ["DIN Offc Pro Italic", "Arial Unicode MS Regular"],
      ],
    },
  ]);

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
        enableHighAccuracy: false,
      },
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true,
    })
  );

  map.addControl(new mapboxgl.NavigationControl());

  document.getElementById("geocoder").appendChild(geocoder.onAdd(map));

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

  function mapCenterMarker() {
    if (marker.getLngLat != map.getCenter()) {
      marker.setLngLat(map.getCenter());
      marker.addTo(map);

      actualLatLgn();

      requestAnimationFrame(mapCenterMarker);
    }
  }

  requestAnimationFrame(() => mapCenterMarker());

  function location() {
    var latlng = map.getCenter();
    $("#favori").css("display", "flex");

    $.ajax({
      type: "GET",
      url:
        "https://nominatim.openstreetmap.org/reverse?lat=" +
        latlng.lat +
        "&lon=" +
        latlng.lng,
      success: function (xml) {
        adresse = $(xml).find("result").text();
        $("#messageAdresse").text("Dernier point posé :");
        $("#adresse").text(adresse);
        $(".adresse").css("display", "block");
      },
    });
  }

  function addFavori() {
    var latlng = map.getCenter();

    const newMarker = new mapboxgl.Marker({
      color: "yellow",
    });

    newMarker.setLngLat(latlng);
    newMarker.addTo(map);

    registeredMarkers.push(newMarker);

    $("#favori").css("display", "none");

    $.ajax({
      type: "GET",
      url:
        "https://nominatim.openstreetmap.org/reverse?lat=" +
        latlng.lat +
        "&lon=" +
        latlng.lng,
      success: function (xml) {
        adresse = $(xml).find("result").text();
        $("#adresse").text(adresse);
        $(".adresse").css("display", "block");
        updateMarkerList(xml);
      },
    });
  }

  $("#location").click(location);
  $("#favori").click(addFavori);

  $(document).on("click", ".mapboxgl-marker", function () {
    map.flyTo({
      center: $(this).features[0].geometry.coordinates,
    });
  });

  $(document).on("mouseenter", ".mapboxgl-marker", function () {
    map.getCanvas().style.cursor = "pointer";
  });

  $(document).on("mouseleave", ".mapboxgl-marker", function () {
    map.getCanvas().style.cursor = "";
  });

  function on() {
    document.getElementById("overlay").style.display = "block";
  }

  function off() {
    document.getElementById("overlay").style.display = "none";
  }

  // Bouton pour lancer la géolocalisation
  /*var button = document.getElementById("locate-position");
  button.addEventListener("click", function () {
    map
      .locate({
        setView: true,
        watch: true,
      })  This will return map so you can do chaining 
      // Si localisation trouvée, nous renvoie au lieu situé
      .on("locationfound", function (e) {
        latitude = e.latitude;
        longitude = e.longitude;
        var marker = L.marker([e.latitude, e.longitude])
          .addTo(map)
          .bindPopup("Vous êtes ici :D");
        marker.on("mouseover", function (e) {
          this.openPopup();
        });
        marker.on("mouseout", function (e) {
          this.closePopup();
        });
        map.addLayer(marker);
      })
      // Si localisation mauvaise, renvoie un message d'erreur dans la console
      .on("locationerror", function (e) {
        alert("Location access denied.");
      });
    //Pour le bouton centrez votre position, vous renvoie à votre position
    var buttonLocalisation = document.getElementById("localisation");
    buttonLocalisation.addEventListener("click", function () {
      var mark = [latitude, longitude];
      map.setView(mark, 20);
    });
  });*/

  function timerTimeZone() {
    updateTimeOffset();
    setTimeout(timerTimeZone, 3000);
  }
  function timerTime() {
    getTimeNow();
    setTimeout(timerTime, 1000);
  }
  setTimeout(timerTime, 1000);
  setTimeout(timerTimeZone, 3000);
});

function adresseParser(xml) {
  var adresse = "";

  const leisure = $(xml).find("addressparts").find("leisure").text();
  const amenity = $(xml).find("addressparts").find("amenity").text();
  const building = $(xml).find("addressparts").find("building").text();

  if (leisure != "") {
    adresse += leisure;
  } else if (amenity != "") {
    adresse += amenity;
  } else if (building != "") {
    adresse += building;
  }

  const house_number = $(xml).find("addressparts").find("house_number").text();
  if (house_number != "") {
    if (adresse != "") {
      adresse += ", ";
    }
    adresse += house_number;
  }

  const road = $(xml).find("addressparts").find("road").text();
  if (road != "") {
    if (adresse != "") {
      adresse += ", ";
    }
    adresse += road;
  }

  const suburb = $(xml).find("addressparts").find("suburb").text();
  const town = $(xml).find("addressparts").find("town").text();
  const municipality = $(xml).find("addressparts").find("municipality").text();
  const city = $(xml).find("addressparts").find("city").text();
  const postcode = $(xml).find("addressparts").find("postcode").text();

  if (postcode != "") {
    if (adresse != "") {
      adresse += " ";
    }
    adresse += postcode;
  }

  if (suburb != "") {
    if (adresse != "") {
      adresse += ", ";
    }
    adresse += suburb;
  }

  if (town != "") {
    if (adresse != "") {
      adresse += ", ";
    }
    adresse += town;
  }

  if (municipality != "" && city == "" && town == "" && suburb == "") {
    if (adresse != "") {
      adresse += ", ";
    }
    adresse += municipality;
  }

  if (city != "" && municipality != "") {
    if (adresse != "") {
      adresse += ", ";
    }
    adresse += city;
  }

  const county = $(xml).find("addressparts").find("county").text();
  if (county != "") {
    if (adresse != "") {
      adresse += ", ";
    }
    adresse += county;
  }

  const country = $(xml).find("addressparts").find("country").text();
  if (country != "") {
    if (adresse != "") {
      adresse += ", ";
    }
    adresse += country;
  }

  return adresse;
}

function updateMarkerList(xml) {
  var length = registeredMarkers.length;
  var marker = registeredMarkers[length - 1];
  var latlng = marker.getLngLat();
  var adresse = adresseParser(xml);

  var html =
    "<tr><th>" +
    length +
    "</th>" +
    '<td><button class="button" value="' +
    latlng.lng +
    "," +
    latlng.lat +
    '" onclick=flyToMarker(this.value, "cycling")><i class="fa-solid fa-map-location-dot"></i></button></td>' +
    '<td><button class="button" value="' +
    latlng.lng +
    "," +
    latlng.lat +
    '"onclick=createRoute(this.value, "cycling")><i class="fa-solid fa-route"></i></button></td><td>' +
    adresse +
    "</td></tr>";
  $("#messageAucun").text("");
  $("#table-body").append(html);
}
