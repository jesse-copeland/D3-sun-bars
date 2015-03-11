$(function () {
  var appTitle = 'Demo App';
  var appArgs = { width: 600, height: 600, innerCircleR: 100, barMaxSize : 200, showText: 'false'};
  var svgCanvas = d3.select('#d3-canvas').append("svg")
                                         .attr("class", "the-main-svg")
                                         .attr("x",0)
                                         .attr("y",0)
                                         .attr("width", 1200)
                                         .attr("height",720);

  var appData = genDataArray (20, appArgs.innerCircleR, appArgs.barMaxSize);
  
  var sunGraph = window.sunGraph = new SunDrawer(appTitle,appData,svgCanvas,appArgs);                                       

  function SunDrawer(title,data,svg,args) {

    var _sddefaults = { width: 600, height: 600, innerCircleR: 100, barMaxSize : 200, showText: 'true'};
    _sdargs = {};
    
    for(key in _sddefaults) {
      _sdargs[key] = args[key] || _sddefaults[key];
    }

    var _sddata = data;
    var dataSize = data.length;
    var _sdsvg= svg;
    var innerCircleR = _sdargs.innerCircleR;   
    
    var drawTheSun = function() {

      var width = _sdargs.width;
      var height = _sdargs.height;


      var barWidth = Math.max(Math.min(2*Math.PI*innerCircleR/dataSize,80),3); 

      var theta = 2*Math.PI/dataSize;

      var thetaD = 360/dataSize;

      var barMaxSize = _sdargs.barMaxSize;
                
      _sdsvg.selectAll(".bar").remove();

      var bars = _sdsvg.selectAll(".bar")
        .data(_sddata)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d,index) {  return ' translate('+(width/2+innerCircleR*Math.cos(theta*index))+','+(height/2-innerCircleR*Math.sin(theta*index))+') rotate('+(90-index*thetaD)+')'; })
        .attr('x',0)
        .attr('y',innerCircleR*2)
        .attr("width", barWidth)
        .attr("height", function(d) { return barMaxSize-d; });
    
      bars.append("rect")
        .attr("class", ".bar-itself")
        .attr("width", barWidth-2)
        .attr('x',0)
        .attr('y',innerCircleR*2)
        .attr("height", function(d) { return barMaxSize-d; });
    };
      
    drawTheSun();

    var update = function (newData) {
      _sddata = newData;
      var width = _sdargs.width;
      var height = _sdargs.height;

      var barWidth = Math.max(Math.min(2*Math.PI*innerCircleR/dataSize,80),3); 

      var theta = 2*Math.PI/dataSize;

      var thetaD = 360/dataSize;

      var barMaxSize = _sdargs.barMaxSize;
                
      _sdsvg.selectAll(".bar").remove();

      var bars = _sdsvg.selectAll(".bar")
        .data(_sddata)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d,index) {  return ' translate('+(width/2+innerCircleR*Math.cos(theta*index))+','+(height/2-innerCircleR*Math.sin(theta*index))+') rotate('+(90-index*thetaD)+')'; })
        .attr('x',0)
        .attr('y',innerCircleR*2)
        .attr("width", barWidth)
        .attr("height", function(d) { return barMaxSize-d; });
    
      bars.append("rect")
        .attr("class", ".bar-itself")
        .attr("width", barWidth-2)
        .attr('x',0)
        .attr('y',innerCircleR*2)
        .attr("height", function(d) { return barMaxSize-d; });
    };

  }

  $('#unit-count-slider').slider({
    min: 4,
    max: 40,
    value: 20,
    animate: 'slow',
    orientation: 'horizontal',
    slide: function (event, ui) {
      $('#unit-count-label').text(ui.value);
    },
    stop: function (event, ui) {
      sunGraph.update(genDataArray(ui.value, 100, 200));
    }
  });
});


function genDataArray (elementCount, minLength, maxLength) {
  var resArray = [];

  for (var i = 0; i < elementCount; i++) {
    resArray.push(rndLength(minLength, maxLength)); 
  }
  return resArray;
}

function rndLength (minLength, maxLength) {
  var diff = maxLength - minLength;
  return Math.floor(Math.random() * diff) + minLength;
}