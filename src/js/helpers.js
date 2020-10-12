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
