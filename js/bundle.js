window.$ = window.jQuery = require('jquery');
//import "intersection-observer";
//import scrollama from "scrollama"; // or...
require("intersection-observer");
const scrollama = require("scrollama");
const config = {
  chapters: [
    {
      id: 'step1',
      distance: '63.5',
      location: {
        center: [42.97983, 14.73442],
        zoom: 9,
        pitch: 0,
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
        center: [ 43.32446, 14.51635],
        zoom: 12,
        pitch: 10,
        bearing: 20
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
        center: [ 43.82152, 13.23558],
        zoom: 8.39,
        pitch: 30,
        bearing: 30
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
        pitch: 0,
        bearing: 0
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


$( document ).ready(function() {
  const DATA_URL = 'data/';
  let isMobile = $(window).width()<600? true : false;
  let dataUrls = ['geodata_locations.geojson'];
  var map, scroller, main, scrolly, figure, article, step;
  var layerTypes = {
    'fill': ['fill-opacity'],
    'line': ['line-opacity'],
    'circle': ['circle-opacity', 'circle-stroke-opacity'],
    'symbol': ['icon-opacity', 'text-opacity'],
    'raster': ['raster-opacity'],
    'fill-extrusion': ['fill-extrusion-opacity']
  }
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
      style: 'mapbox://styles/humdata/ckdhth3bq06af1hp9gayo0ywq/draft',
      center: [47, 20],
      minZoom: 1,
      zoom: 4.7,
      attributionControl: false
    });

    //map.addControl(new mapboxgl.NavigationControl())
    map.addControl(new mapboxgl.AttributionControl(), 'bottom-right');

    // disable map zoom when using scroll
    map.scrollZoom.disable();

    map.on('load', function() {
      console.log('Map loaded')
    });

    // using d3 for convenience
    main = d3.select("main");
    scrolly = main.select("#scrolly");
    figure = scrolly.select("figure");
    article = scrolly.select("article");
    step = article.selectAll(".step");

    // initialize the scrollama
    scroller = scrollama();

    // kick things off
    init();
  }

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

  // scrollama event handlers
  function handleStepEnter(response) {
    console.log('handleStepEnter',response)


    $('.ticker').addClass('active');
    $('.arrow-down').hide();

    // response = { element, direction, index }

    // add color to current step only
    step.classed('is-active', function(d, i) {
      return i === response.index;
    });

    // update graphic based on step
    //figure.select("p").text(response.index + 1);

    var chapter = config.chapters[response.index];
    var location = chapter.location;

    if (location!=undefined) {
      map.flyTo(location);
    }

    if (chapter.onChapterEnter!=undefined && chapter.onChapterEnter.length > 0) {
      chapter.onChapterEnter.forEach(setLayerOpacity);
    }

    if (response.index<config.chapters.length-1)
      updateTicker(chapter.distance);
  }

  function handleStepExit(response) {
    if (response.index==config.chapters.length-1)
      $('.ticker').removeClass('active');
  }

  function setupStickyfill() {
    d3.selectAll(".sticky").each(function() {
      Stickyfill.add(this);
    });
  }

  function getLayerPaintType(layer) {
    console.log('getLayerPaintType',layer)
    var layerType = map.getLayer(layer).type;
    return layerTypes[layerType];
  }

  function setLayerOpacity(layer) {
    var paintProps = getLayerPaintType(layer.layer);
    paintProps.forEach(function(prop) {
      map.setPaintProperty(layer.layer, prop, layer.opacity);
    });
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

  function init() {
    setupStickyfill();

    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    handleResize();

    // 2. setup the scroller passing options
    //    this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller
      .setup({
        step: '#scrolly article .step',
        offset: 0.5,
        debug: false
      })
      .onStepEnter(handleStepEnter)
      .onStepExit(handleStepExit);

    // setup resize event
    window.addEventListener('resize', handleResize);
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