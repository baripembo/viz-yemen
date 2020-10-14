window.$ = window.jQuery = require('jquery');
const config = {
  chapters: [
    {
      id: 'step1',
      distance: '63.5',
      location: {
        center: [42.97983, 14.73442],
        zoom: 9.7,
        pitch: 40,
        bearing: 0
      },
      onChapterEnter: [
        {
          layer: 'route-1',
          opacity: 1
        }
      ],
      onChapterExit: [
        {
          layer: 'route-1',
          opacity: 0
        }
      ]
    },
    {
      id: 'step2',
      distance: '275.5',
      location: {
        center: [ 43.6011, 13.7187],
        zoom: 9.3,
        pitch: 60,
        bearing: 320
      },
      onChapterEnter: [
        {
          layer: 'route-2',
          opacity: 1
        }
      ],
      onChapterExit: [
        {
          layer: 'route-2',
          opacity: 0
        }
      ]
    },
    {
      id: 'step3',
      distance: '462',
      location: {
        center: [ 44.5155, 13.0651],
        zoom: 8.6,
        pitch: 40,
        bearing: 314
      },
      onChapterEnter: [
        {
          layer: 'route-3',
          opacity: 1
        }
      ],
      onChapterExit: [
        {
          layer: 'route-3',
          opacity: 0
        }
      ]
    },
    {
      id: 'step4',
      distance: '462',
      location: {
        center: [ 45.0208, 12.7864],
        zoom: 14.5,
        pitch: 30,
        bearing: 40
      },
      // onChapterEnter: [
      //   {
      //     layer: 'route-4',
      //     opacity: 1
      //   }
      // ],
      // onChapterExit: [
      //   {
      //     layer: 'route-4',
      //     opacity: 0
      //   }
      // ]
    }
  ]
};

// generic window resize listener event
function handleResize() {
  // 1. update height of step elements
  var stepH = Math.floor(window.innerHeight);
  step.style("height", stepH + "px");

  var figureHeight = window.innerHeight;
  var figureMarginTop = (window.innerHeight - figureHeight) / 2;

  figure
    .style("height", figureHeight + "px")
    .style("top", figureMarginTop + "px");

  // 3. tell scrollama to update new element dimensions
  scroller.resize();
}

function setupStickyfill() {
  d3.selectAll(".sticky").each(function() {
    Stickyfill.add(this);
  });
}

// function getLayerPaintType(layer) {
//   if (map.getLayer(layer)!=undefined) {
//     var layerType = map.getLayer(layer).type;
//     return layerTypes[layerType];
//   }
// }

// function setLayerOpacity(layer) {
//   var paintProps = getLayerPaintType(layer.layer);
//   if (paintProps!=undefined) {
//     paintProps.forEach(function(prop) {
//       map.setPaintProperty(layer.layer, prop, layer.opacity);
//     });
//   }
// }

function setMapBounds(points, padding) {
  let bbox = turf.extent(points);
  if (isMobile)
    map.fitBounds(bbox, {padding: {top: 80, bottom: 80, left: 60, right: 60}});
  else
    map.fitBounds(bbox, {offset: [-100,0], padding: padding});
}

function initSlideshow() {
  var controller = new ScrollMagic.Controller();
  var captions = document.querySelectorAll('.caption');
  for (var i=0; i<captions.length; i++) {
    new ScrollMagic.Scene({
        triggerElement: captions[i],
        triggerHook: 0.9
      })
      .on('enter', function(e) {
        var id = Number($(e.target.triggerElement()).data('caption'));
        $('img[data-img="'+(id-1)+'"]').css('opacity', 0);
      })
      .on('leave', function(e) {
        var id = Number($(e.target.triggerElement()).data('caption'));
        $('img[data-img="'+(id-1)+'"]').css('opacity', 1);
      })
      .addTo(controller);
  }
}
var map, scroller, main, scrolly, figure, article, step, geoDataArray, viewportWidth, viewportHeight;
var currentIndex = 1;
// var layerTypes = {
//   'fill': ['fill-opacity'],
//   'line': ['line-opacity'],
//   'circle': ['circle-opacity', 'circle-stroke-opacity'],
//   'symbol': ['icon-opacity', 'text-opacity'],
//   'raster': ['raster-opacity'],
//   'fill-extrusion': ['fill-extrusion-opacity']
// }


$( document ).ready(function() {
  const DATA_URL = 'data/';
  var isMobile = $(window).width()<600? true : false;
  var dataUrls = ['route1.geojson', 'route2.geojson', 'route3.geojson'];
  geoDataArray = new Array(dataUrls.length);
  mapboxgl.accessToken = 'pk.eyJ1IjoiaHVtZGF0YSIsImEiOiJja2FvMW1wbDIwMzE2MnFwMW9teHQxOXhpIn0.Uri8IURftz3Jv5It51ISAA';
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;
  
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

  var countArray = new Array(dataUrls.length);
  function parseData(geoData, index) {
    //create map routes
    countArray[index] = 0;
    geoDataArray[index] = geoData;
    var layer = 'layer'+index;
    var geo = {
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [geoData.features[0].geometry.coordinates[0]]
        }
      }]
    };

    map.addLayer({
      'id': layer,
      'type': 'line',
      'source': {
        'type': 'geojson',
        'data': geo
      },
      'layout': {
        'line-join': 'miter',
        'line-cap': 'butt'
      },
      'paint': {
        'line-color': '#FFF',
        'line-width': 3
      }
    })
  }


  var animation; 
  var animationIndex = 0;
  var animationDone = true;
  function animateLine() {
    var geoData = geoDataArray[animationIndex];
    var layer = 'layer'+animationIndex;
    var count = countArray[animationIndex]++;
    if (geoData!=undefined && count<geoData.features[0].geometry.coordinates.length) {
      var newGeo = map.getSource(layer)._data;
      newGeo.features[0].geometry.coordinates.push(geoData.features[0].geometry.coordinates[count]);
      map.getSource(layer).setData(newGeo);

      animation = requestAnimationFrame(function() {
        animateLine();
      });
    }
    else {
      animationDone = true;
      animationIndex++;
      if (currentIndex>=animationIndex) animateLine();
    }
  }


  function initMap() {
    console.log('Loading map...');

    var zoomLevel = 4.7;
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/humdata/ckfx2jgjd10qx1bnzkla9px41/draft',
      center: [47, 20],
      minZoom: 1,
      zoom: zoomLevel,
      attributionControl: false
    });

    //map.addControl(new mapboxgl.NavigationControl())
    //map.addControl(new mapboxgl.AttributionControl(), 'bottom-right');
    map.scrollZoom.disable();

    //add icon images
    var iconArray = ['icon_marker'];
    iconArray.forEach(function(imageName) {
      map.loadImage('assets/icons/'+imageName+'.png', function(error, image) {
        map.addImage(imageName, image);
      });
    });

    map.on('load', function() {
      console.log('Map loaded')
      $('.loader').remove();
      $('body').css('backgroundColor', '#FFF');
      $('main').css('opacity', 1);
      getData();
      locationData();
      initJourney();
      initPins();
      initSlideshow();
    });
  }

  function locationData() {
    map.addSource('locationSource', {
      type: 'geojson',
      data: DATA_URL+'geodata_locations.geojson'
    });

    map.addLayer({
      'id': 'locationPoints',
      'type': 'symbol',
      'source': 'locationSource',
      'layout': {
        'icon-image': '{icon}',
        'icon-size': { 'type': 'identity', 'property': 'iconSize' },
        'text-field': '{name}',
        'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 16,
        'text-max-width': { 'type': 'identity', 'property': 'textMaxWidth' },
        'text-justify': 'left',
        'text-offset': { 'type': 'identity', 'property': 'textOffset' },
        'text-anchor': { 'type': 'identity', 'property': 'textAnchor' },
        'icon-allow-overlap': false,
        'text-allow-overlap': false
      },
      paint: {
        'text-color': '#FFF',
        'text-halo-color': '#000',
        'text-halo-width': 1
      }
    });
  }


  function initJourney() {
    scroller = scrollama();
    main = d3.select('main');
    scrolly = main.select('#scrolly');
    figure = scrolly.select('figure');
    article = scrolly.select('article');
    step = article.selectAll('.step');

    setupStickyfill();
    handleResize();

    scroller
      .setup({
        step: '.step',
        offset: 0.7,
        debug: false
      })
      .onStepEnter(handleStepEnter)
      .onStepExit(handleStepExit);

    // setup resize event
    window.addEventListener('resize', handleResize);
  }

  function initPins() {
    $('.pin-container').each(function() {
      var item = $(this).find('.pin-item')[0];
      var pos = Math.round(viewportHeight/2 - $(item).height()/2);
      $(item).css('top', pos);
      //$(this).find('.annotation').each(function() {
        //$(this).find('> div').css('bottom', $(item).height()/2);
      //});
    });

    //img switch for food security graphic
    var controller = new ScrollMagic.Controller();
    var pinScene = new ScrollMagic.Scene({
      triggerElement: "#slide2",
      triggerHook: 0.6
    })
    .setClassToggle("#pinFoodInsecurity", "showSlide2")
    .addTo(controller);
  }


  function handleStepEnter(response) {
    //response = { element, direction, index }
    currentIndex = response.index;
    var chapter = config.chapters[currentIndex];
    var location = chapter.location;

    $('.ticker').addClass('active');
    $('.arrow-down').hide();

    // set active step
    step.classed('is-active', function(d, i) {
      return i === response.index;
    });

    if (location!=undefined) {
      map.flyTo(location);
    }

    // if (chapter.onChapterEnter!=undefined && chapter.onChapterEnter.length > 0) {
    //   chapter.onChapterEnter.forEach(setLayerOpacity);
    // }

    if (geoDataArray[response.index]!==undefined) {
      //var padding = 100;
      //setMapBounds(geoDataArray[response.index], padding);
      if (animationDone) {
        animateLine();
        animationDone = false;
      }
    }

    if (response.index<config.chapters.length-1)
      updateTicker(chapter.distance);
  }

  function handleStepExit(response) {
    if (response.index==0 || response.index==config.chapters.length-1) {
      $('.ticker').removeClass('active');

      if (response.index==0) {
        var location = {
          center: [48.21908, 15.53492],
          zoom: 6.13,
          pitch: 0,
          bearing: 0
        };
        map.flyTo(location);
      }
    }
  }

  function updateTicker(value) {
    $('.ticker p').animate({
      opacity: 0,
      marginTop: '50px',
    }, 400, function() {
      $(this).text(value + ' km. XXX days.');
      $(this).css('marginTop', '-50px').animate({
        opacity: 1,
        marginTop: '0'
      }, 400);
    });
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

  initMap();
  //initTracking();
});