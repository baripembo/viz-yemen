window.$ = window.jQuery = require('jquery');
function hxlProxyToJSON(input){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();                    
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}
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

    // $(window).scroll(function() {
    //   var top_of_element = $(".article").offset().top;
    //   var bottom_of_element = $(".article").offset().top + $(".article").outerHeight();
    //   var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
    //   var top_of_screen = $(window).scrollTop();

    //   if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)){
    //     console.log('article starts')
    //     $('.feature').css('position','absolute')
    //       // the element is visible, do something
    //   } else {
    //     $('.feature').css('position','fixed')
    //     console.log('nope')
    //       // the element is not visible, do something else
    //   }
    // });
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