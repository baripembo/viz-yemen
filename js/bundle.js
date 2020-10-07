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
        center: [ 43.5815, 13.9194],
        zoom: 9,
        pitch: 60,
        bearing: 325
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
        center: [ 44.6, 13.0037],
        zoom: 8.9,
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
        center: [ 45.01073, 12.79255],
        zoom: 13.34,
        pitch: 30,
        bearing: 30
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

// function setMapBounds(points, padding) {
//   let bbox = turf.extent(points);
//   if (isMobile)
//     map.fitBounds(bbox, {padding: {top: 80, bottom: 80, left: 60, right: 60}});
//   else
//     map.fitBounds(bbox, {offset: [-100,0], padding: padding});
// }

function initSlideshow() {
  var slideshowController = new ScrollMagic.Controller();
  
  // var id = $(this).attr('id');
  // var containerHeight = $(this).find(' div').innerHeight();
  // var annotationHeight = $(this).find('.annotation').innerHeight();
  // var pinSceneTimeline = new TimelineMax();
  // var newY = containerHeight/2 + annotationHeight/2;
  // pinSceneTimeline.fromTo($(this).find('.annotation'), 0.2, {y: '+='+viewportHeight/2}, {y: -newY, autoAlpha: 1, ease:Power1.easeNone});
  var numSlides = $('.slideshow-inner').find('.img-container').length;
  var pinScene = new ScrollMagic.Scene({
    triggerElement: '#slideshow', 
    triggerHook: 0.5,
    duration: '300%', 
    offset: viewportHeight/2
  })
  //.addIndicators({name: '1'})
  .setPin('#slideshow')
  //.setTween(pinSceneTimeline)
  // .on('update', function(e) {
  //   console.log(e.target.controller().info('scrollDirection'));
  // })
  .on('progress', function (e) {
    var progress = parseFloat(e.progress.toFixed(2));
    if (e.target.controller().info('scrollDirection')=='FORWARD') {
      if (progress>=0.3 && progress<=0.6) {
        $('.slideshow-inner').find('.img-container[data-slide="3"').css('opacity', 0);
      }
      else if (progress>=0.6 && progress<=1) {
        $('.slideshow-inner').find('.img-container[data-slide="2"').css('opacity', 0);
      }
    }
    else {
      if (progress<0.6 && progress>=0.3) {
        $('.slideshow-inner').find('.img-container[data-slide="2"').css('opacity', 1);
      }
      else if (progress<0.3 && progress>=0) {
        $('.slideshow-inner').find('.img-container[data-slide="3"').css('opacity', 1);
      }
    }
  })
  .addTo(slideshowController);
}
var map, scroller, main, scrolly, figure, article, step, geoDataArray, viewportHeight;
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
    console.log('Loading map...')
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/humdata/ckfx2jgjd10qx1bnzkla9px41/draft',
      center: [47, 20],
      minZoom: 1,
      zoom: 4.7,
      attributionControl: false
    });

    //map.addControl(new mapboxgl.NavigationControl())
    //map.addControl(new mapboxgl.AttributionControl(), 'bottom-right');
    map.scrollZoom.disable();

    map.on('load', function() {
      console.log('Map loaded')
      getData();
      initJourney();
      initSections();
      initSlideshow();
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
        offset: 0.5,
        debug: false
      })
      .onStepEnter(handleStepEnter)
      .onStepExit(handleStepExit);

    // setup resize event
    window.addEventListener('resize', handleResize);
  }


  function initSections() {
    var controller = new ScrollMagic.Controller();
    
    $('.pin-container').each(function() {
      var id = $(this).attr('id');
      var containerHeight = $(this).find('div').innerHeight();
      var annotationHeight = $(this).find('.annotation').innerHeight();
      var pinSceneTimeline = new TimelineMax();
      var newY = containerHeight/2 + annotationHeight/2;
      pinSceneTimeline.fromTo($(this).find('.annotation'), 0.2, {y: '+='+viewportHeight/2}, {y: -newY, autoAlpha: 1, ease:Power1.easeNone});

      var pinScene = new ScrollMagic.Scene({
        triggerElement: ('#' + id), 
        triggerHook: 0.5,
        duration: '100%', 
        offset: containerHeight/2,
      })
      //.addIndicators({name: '1'})
      .setPin('#' + id)
      .setTween(pinSceneTimeline)
      .addTo(controller);
    });    
  }

  // scrollama event handlers
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