$(function () {
  var svgCanvas = d3.select('#d3-canvas').append("svg")
                                         .attr("class", "the-main-svg")
                                         .attr("x",0)
                                         .attr("y",0)
                                         .attr("width", 600)
                                         .attr("height",600);

  var barUniformity = 100; // As a percentage
  var barMaxValue = 200;
  var barCount = 50;
  var appData = genDataArray (barCount, barMaxValue, barUniformity);
  
  var sunGraph = new SunDrawer(svgCanvas, appData);
  sunGraph.drawSun();                                       

  $('#unit-count-slider').slider({
    min: 4,
    max: 100,
    value: appData.length,
    animate: 'slow',
    orientation: 'horizontal',
    slide: function (event, ui) {
      barCount = ui.value;
      $('#unit-count-label').text(barCount);
      sunGraph.updateSun(genDataArray(barCount,barMaxValue,barUniformity));
    }
  });

  $('#uniformity-slider').slider({
    value: 100,
    animate: 'slow',
    orientation: 'horizontal',
    slide: function (event, ui) {
      barUniformity = ui.value;
      $('#uniformity-label').text(barUniformity);
      sunGraph.updateSun(genDataArray(barCount,barMaxValue,barUniformity));
    }
  });
});

function genDataArray (elementCount, maxLength, uniformity) {
  var resArray = [];

  for (var i = 0; i < elementCount; i++) {
    resArray.push(rndLength(maxLength, uniformity)); 
  }
  return resArray;
}

function rndLength (maxLength, uniformity) {
  return Math.floor(Math.random() * (maxLength - (maxLength * (uniformity * 0.01))));
}

function SunDrawer (svg, data, config) {

  this.presets = { width: 600, height: 600, innerCircleR: 100, barMaxSize : 200 };
  this.args = {};

  if (config !== undefined) {
    for (var key in this.presets) {
      this.args[key] = config[key] || this.presets[key];      
    }
  } else {
    this.args = this.presets;
  }
  
  this.svg = svg;
  this.data = data;
  this.dataLength = this.data.length;
  this.innerCircleR = this.args.innerCircleR;
  this.barMaxSize = this.args.barMaxSize;
  this.width = this.args.width;
  this.height = this.args.height;

  this.drawSun = function () {

      var innerCircleR = this.args.innerCircleR;
      var barWidth = Math.max(Math.min(2*Math.PI*innerCircleR/this.dataLength,80),3); 
      
      var theta = 2*Math.PI/this.dataLength;

      var thetaD = 360/this.dataLength;

      var barMaxSize = this.args.barMaxSize;
      var width = this.width;
      var height = this.height;

      this.svg.selectAll(".sun").remove();

      var sunGroup = this.svg.append("g")
        .attr('class', 'sun')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('transform-origin', width/2 + ',' + height/2)
        .attr('transform', 'rotate(0)');      

      var gradients = sunGroup.append('defs').selectAll('.bar-gradient')
        .data(this.data)
      .enter().append('linearGradient')
        .attr('id', function (d, i) { return 'gradient-' + i; })
        .attr('x1', '0')
        .attr('y1', '0')
        .attr('x2', '0')
        .attr('y2', '1');

      gradients.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', function (d, index) { return 'hsl(' +index*thetaD+ ', 100%, 85%)'; });

      gradients.append('stop')
        .attr('offset', '50%')
        .attr('stop-color', function (d, index) { return 'hsl(' +index*thetaD+ ', 100%, 50%)'; });

      gradients.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', function (d, index) { return 'hsl(' +index*thetaD+ ', 100%, 15%)'; });



      var bars = sunGroup.selectAll(".bar")
        .data(this.data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d,index) { return 'translate('+(width/2+innerCircleR*Math.cos(theta*index))+','+(height/2-innerCircleR*Math.sin(theta*index))+') rotate('+(90-index*thetaD)+')'; })
        .attr('x',0)
        .attr('y',innerCircleR*2)
        .attr("width", barWidth)
        .attr("height", function(d) { return barMaxSize-d; });

      bars.append("rect")
        .attr("class", ".bar-itself")
        .attr("width", barWidth-2)
        .attr('x',0)
        .attr('y',innerCircleR*2)
        .attr('fill', function (d, index) {
          return 'url(#gradient-' + index +')';
        })
        .attr("height", function(d) { return barMaxSize-d; });
  
  };

  this.updateSun = function (newData) {
    this.data = newData;
    this.dataLength = this.data.length;

    this.drawSun();
  };
    
} // End SunDrawer
