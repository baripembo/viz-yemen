$( document ).ready(function() {
  const DATA_URL = 'data/';
  let isMobile = $(window).width()<600? true : false;
  let dataUrls = ['geodata_locations.geojson'];
  var map;
  mapboxgl.accessToken = 'pk.eyJ1IjoiaHVtZGF0YSIsImEiOiJja2FvMW1wbDIwMzE2MnFwMW9teHQxOXhpIn0.Uri8IURftz3Jv5It51ISAA';
  

  function getData() {
    dataUrls.forEach(function (url, index) {
      loadData(url, function (responseText) {
        parseData(JSON.parse(responseText), index);
      })
    })
  }

  function loadData(dataPath, done) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () { return done(this.responseText) }
    xhr.open('GET', DATA_URL+dataPath, true);
    xhr.send();
  }

  function parseData(geoData, index) {
    //do something with the data
    //console.log(geoData, index)
  }

  function initMap() {
    console.log('Loading map...')
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/humdata/ckdhth3bq06af1hp9gayo0ywq',
      center: [47, 20],
      minZoom: 1,
      zoom: 4.7,
      attributionControl: false
    });

    //map.addControl(new mapboxgl.NavigationControl())
    map.addControl(new mapboxgl.AttributionControl(), 'bottom-right');

    map.on('load', function() {
      console.log('Map loaded')
    });

        // init
    // var controller = new ScrollMagic.Controller({
    //   globalSceneOptions: {
    //     triggerHook: 'onLeave',
    //     duration: '0' // this works just fine with duration 0 as well
    //     // However with large numbers (>20) of pinned sections display errors can occur so every section should be unpinned once it's covered by the next section.
    //     // Normally 100% would work for this, but here 200% is used, as Panel 3 is shown for more than 100% of scrollheight due to the pause.
    //   }
    // });

    // // get all slides
    // var slides = document.querySelectorAll("section.panel");

    // // create scene for every slide
    // for (var i=0; i<slides.length; i++) {
    //   new ScrollMagic.Scene({
    //       triggerElement: slides[i]
    //     })
    //     .setPin(slides[i], {pushFollowers: false})
    //     .addIndicators() // add indicators (requires plugin)
    //     .addTo(controller);
    // }

    // init controller
    var controller = new ScrollMagic.Controller();

    var scene = new ScrollMagic.Scene({triggerElement: "#trigger1", duration: 300})
        .setPin("#feature", {pushFollowers: false})
        .addIndicators({name: "1 (duration: 300)"}) // add indicators (requires plugin)
        .addTo(controller);
  }

  function initTracking() {
    //initialize mixpanel
    let MIXPANEL_TOKEN = '';
    mixpanel.init(MIXPANEL_TOKEN);
    mixpanel.track('page view', {
      'page title': document.title,
      'page type': 'datavis'
    });
  }

  //getData();
  initMap();
  //initTracking();
});