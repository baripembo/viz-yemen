// generic window resize listener event
function handleResize() {
  //update height of step elements
  var stepH = (isMobile) ? Math.floor(window.innerHeight)*2 : Math.floor(window.innerHeight);
  step.style("height", stepH + "px");

  //double height of last step
  if (!isMobile) $(".step[data-step='4']").css("height", stepH*1.5 + "px");

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

function preload(arrayOfImages) {
  $(arrayOfImages).each(function(){
    (new Image()).src = this;
  });
}


function setMapBounds(points, paddingBottom, bearing, pitch) {
  let bbox = turf.extent(points);
  var padding = (viewportWidth<768) ? {top: 40, bottom: 40, left: 60, right: 60} : {top: 0, bottom: paddingBottom, left: 550, right: 150};
  map.fitBounds(bbox, {padding: padding, bearing: bearing, pitch: pitch});
}


function initFundingChart() {
  d3.csv('data/fts_requirements_funding_cluster_yem.csv').then(function(raw) {
    // skip the HXL tag row
    var data = raw.filter(function(d) { return d.year && !d.year.startsWith('#'); });

    // aggregate by year
    var nested = d3.nest()
      .key(function(d) { return d.year; })
      .rollup(function(values) {
        return {
          requirements: d3.sum(values, function(d) { return +d.requirements || 0; }),
          funding: d3.sum(values, function(d) { return +d.funding || 0; })
        };
      })
      .entries(data);

    // filter to 2014-2020 and sort descending
    var chartData = nested
      .filter(function(d) { return +d.key >= 2014 && +d.key <= 2020; })
      .sort(function(a, b) { return +b.key - +a.key; });

    drawFundingChart(chartData);
  });
}

function drawFundingChart(data) {
  var container = document.getElementById('funding-chart');
  if (!container) return;

  var margin = {top: 40, right: 20, bottom: 30, left: 55};
  var width = 550 - margin.left - margin.right;
  var barHeight = 18;
  var groupPadding = 12;
  var groupHeight = barHeight * 2 + 4;
  var height = data.length * (groupHeight + groupPadding) - groupPadding;

  var svg = d3.select('#funding-chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // title
  svg.append('text')
    .attr('x', 0)
    .attr('y', -18)
    .attr('font-family', 'Source Sans Pro, sans-serif')
    .attr('font-size', '16px')
    .attr('font-weight', '600')
    .attr('fill', '#3D3D3D')
    .text('Requirements and Funding by Year');

  var maxVal = d3.max(data, function(d) { return d.value.requirements; });
  var x = d3.scaleLinear().domain([0, maxVal]).range([0, width]);

  function formatVal(v) {
    if (v >= 1e9) return '$' + (v / 1e9).toFixed(1) + 'B';
    if (v >= 1e6) return '$' + (v / 1e6).toFixed(0) + 'M';
    return '$' + v;
  }

  data.forEach(function(d, i) {
    var yOffset = i * (groupHeight + groupPadding);

    // year label
    svg.append('text')
      .attr('x', -5)
      .attr('y', yOffset + groupHeight / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'central')
      .attr('font-family', 'Source Sans Pro, sans-serif')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', '#505050')
      .text(d.key);

    // requirements bar
    svg.append('rect')
      .attr('x', 0)
      .attr('y', yOffset)
      .attr('width', x(d.value.requirements))
      .attr('height', barHeight)
      .attr('fill', '#0077ce');

    // requirements label
    svg.append('text')
      .attr('x', x(d.value.requirements) + 5)
      .attr('y', yOffset + barHeight / 2)
      .attr('dominant-baseline', 'central')
      .attr('font-family', 'Source Sans Pro, sans-serif')
      .attr('font-size', '11px')
      .attr('fill', '#666')
      .text(formatVal(d.value.requirements));

    // funding bar
    svg.append('rect')
      .attr('x', 0)
      .attr('y', yOffset + barHeight + 4)
      .attr('width', x(d.value.funding))
      .attr('height', barHeight)
      .attr('fill', '#66b0ec');

    // funding label
    svg.append('text')
      .attr('x', x(d.value.funding) + 5)
      .attr('y', yOffset + barHeight + 4 + barHeight / 2)
      .attr('dominant-baseline', 'central')
      .attr('font-family', 'Source Sans Pro, sans-serif')
      .attr('font-size', '11px')
      .attr('fill', '#666')
      .text(formatVal(d.value.funding));
  });

  // legend
  var legend = svg.append('g').attr('transform', 'translate(0,' + (height + 15) + ')');
  legend.append('rect').attr('width', 12).attr('height', 12).attr('fill', '#0077ce');
  legend.append('text').attr('x', 16).attr('y', 10).attr('font-size', '12px').attr('fill', '#666').attr('font-family', 'Source Sans Pro, sans-serif').text('Requirements');
  legend.append('rect').attr('x', 110).attr('width', 12).attr('height', 12).attr('fill', '#66b0ec');
  legend.append('text').attr('x', 126).attr('y', 10).attr('font-size', '12px').attr('fill', '#666').attr('font-family', 'Source Sans Pro, sans-serif').text('Funding');
}


function initCommodityChart() {
  d3.csv('data/wfp_commodity_prices_agg.csv').then(function(data) {
    var parseDate = d3.timeParse('%Y-%m-%d');
    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.price_sum = +d.price_sum;
    });
    data = data.filter(function(d) { return d.date != null; });
    data.sort(function(a, b) { return a.date - b.date; });
    drawCommodityChart(data);

    // recalculate pin position now that chart has rendered
    var pinContainer = $('#commodity-chart').closest('.pin-container');
    var item = pinContainer.find('.pin-item')[0];
    if (item) {
      var pos = Math.round(viewportHeight / 2 - $(item).height() / 2);
      $(item).css('top', pos);
    }
  });
}

function drawCommodityChart(data) {
  var container = document.getElementById('commodity-chart');
  if (!container) return;

  var margin = {top: 45, right: 20, bottom: 40, left: 70};
  var width = 700 - margin.left - margin.right;
  var height = 350 - margin.top - margin.bottom;

  var svg = d3.select('#commodity-chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // title
  svg.append('text')
    .attr('x', 0)
    .attr('y', -22)
    .attr('font-family', 'Source Sans Pro, sans-serif')
    .attr('font-size', '16px')
    .attr('font-weight', '600')
    .attr('fill', '#3D3D3D')
    .text('Overall Commodity Price Trend since the outbreak of the conflict');

  // subtitle
  svg.append('text')
    .attr('x', 0)
    .attr('y', -6)
    .attr('font-family', 'Source Sans Pro, sans-serif')
    .attr('font-size', '11px')
    .attr('fill', '#888')
    .text('Sum of prices for all food commodities (YER). Values depend on units and selection of commodities.');

  var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date; }))
    .range([0, width]);

  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.price_sum; }) * 1.05])
    .range([height, 0]);

  // y axis grid lines
  svg.append('g')
    .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(''))
    .selectAll('.tick line')
    .attr('stroke', '#e0e0e0');
  svg.selectAll('.domain').remove();

  // x axis
  var xAxis = svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x).ticks(d3.timeYear.every(2)).tickFormat(d3.timeFormat('%Y')).tickSize(0));
  xAxis.selectAll('text')
    .attr('font-family', 'Source Sans Pro, sans-serif')
    .attr('font-size', '11px')
    .attr('fill', '#888')
    .attr('dy', '1em');
  xAxis.select('.domain').attr('stroke', '#e0e0e0');

  // y axis
  var yAxis = svg.append('g')
    .call(d3.axisLeft(y).ticks(5).tickSize(0).tickFormat(function(d) {
      if (d >= 1e6) return (d / 1e6).toFixed(1) + 'M';
      if (d >= 1e3) return (d / 1e3).toFixed(0) + 'K';
      return d;
    }));
  yAxis.selectAll('text')
    .attr('font-family', 'Source Sans Pro, sans-serif')
    .attr('font-size', '11px')
    .attr('fill', '#888');
  yAxis.select('.domain').remove();

  // y axis label
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -55)
    .attr('text-anchor', 'middle')
    .attr('font-family', 'Source Sans Pro, sans-serif')
    .attr('font-size', '12px')
    .attr('fill', '#888')
    .text('Price (YER)');

  // area fill
  var area = d3.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.price_sum); });

  svg.append('path')
    .datum(data)
    .attr('fill', 'rgba(0, 119, 206, 0.15)')
    .attr('d', area);

  // line
  var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price_sum); });

  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#0077ce')
    .attr('stroke-width', 2)
    .attr('d', line);
}
