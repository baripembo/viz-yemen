// generic window resize listener event
function handleResize() {
  // 1. update height of step elements
  var stepH = Math.floor(window.innerHeight);
  step.style("height", stepH + "px");

  //double height of last step
  $(".step[data-step='4']").css("height", stepH*1.5 + "px");

  var figureHeight = window.innerHeight;
  var figureMarginTop = (window.innerHeight - figureHeight) / 2;

  figure
    .style("height", figureHeight + "px")
    .style("top", figureMarginTop + "px");

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

function setMapBounds(points, paddingBottom, bearing, pitch) {
  let bbox = turf.extent(points);
  var padding = (viewportWidth<768) ? {top: 40, bottom: 40, left: 60, right: 60} : {top: 0, bottom: paddingBottom, left: 550, right: 150};
  map.fitBounds(bbox, {padding: padding, bearing: bearing, pitch: pitch});
}
