// ------------------------------------------------------------------------
// GLOBAL VARIABLES
// ------------------------------------------------------------------------

_x = 9;
_y = 9;
_size = 60;
_grid = [];
_pattern_x_offset = 4;
_pattern_y_offset = 2;
_offset = 80;
_griddotsize = 15;
_linewidth = 5;

// pineapple array - draw the lines for the artwork
_pineapple = [];
_pineapple[0] = [[0,0],[1,1],[0,2],[0,1],[0,0]];
_pineapple[1] = [[0,0],[2,0],[2,1],[2,2],[1,1],[2,0]];
_pineapple[2] = [[2,0],[3,0],[2,1],[3,2],[4,1],[3,0],[4,0],[4,1],[4,2]];
_pineapple[3] = [[4,2],[3,2],[2,2],[0,2]];
_pineapple[4] = [[0,1],[1,1],[2,1],[4,1]];

//_pineapple[3] = [[2,0],[2,1],[2,2],[3,2],[2,1],[3,0],[4,1],[3,2],[4,2],[4,1],[4,0]];
//_pineapple[3] = [[4,2],[3,2]]; //,[4,1],[3,0]];

_width = $("#canvas").parent().width();
_height = _width;
canvas.width = _width;
canvas.height = _height;

console.debug(); //.attr("width"));

// ------------------------------------------------------------------------
// SETUP & DRAWING
// ------------------------------------------------------------------------

function init() {
	_grid = [];
	makeGridArray();
	drawPineapple();
}

init();

function makeGridArray() {
	for(i=0;i<_x; i++)
	{
		_grid[i] = [];
		for(j=0;j<_x; j++)
		{
			_grid[i][j] = {x: _size*i + _offset, y: _size*j+_offset};
		}	
	}
}


function drawPineapple() {
	//$canvas.clearCanvas();
	var xIt = Math.floor(_x/_pattern_x_offset);
	var yIt = Math.floor(_y/_pattern_y_offset);
	var layernum = 0;
	for (var ix=0; ix<=_x-_pattern_x_offset-1; ix+=_pattern_x_offset)
	{
		for (var iy=0; iy<_y-_pattern_y_offset-1; iy+=_pattern_y_offset)
		{
			var n 	= "row"+layernum;
			var obj = {
			  strokeStyle: '#fcee21',
			  strokeWidth: _linewidth,
			  method: 'drawLine',
			  groups: ['cp'],
			  rounded: true,
			  layer: true,
			  name: n
			};
			var p=1;
		 	for (var row in _pineapple)
			{
				for(var point in _pineapple[row])
				{	
					var x = _pineapple[row][point][0];
					var y = _pineapple[row][point][1];
					obj['x'+p] = _grid[x+ix][y+iy].x;
					obj['y'+p] = _grid[x+ix][y+iy].y;
					gobj = {visible:true};
					gname = "g"+(x+ix)+"_"+(y+iy);
					//console.debug(gname);
					$('canvas').setLayer(gobj);
					p++;
					
					// draw the grid dots here
					$('canvas').addLayer({
						//layer: true,
						method: 'drawArc',
						draggable: true,
						data: {
							i: (x+ix),
							j: (y+iy)
						},
						groups: ["circles"],
						name: "g"+(x+ix)+"_"+(y+iy),
						visible: true,
					 	fillStyle: '#7ac943',
					  	x: _grid[x+ix][y+iy].x, 
						y: _grid[x+ix][y+iy].y,
					  	radius: _griddotsize,
						drag: function(layer) {
						   // code to run as layer is being dragged
						   //console.debug(layer.data.i);
						   _grid[layer.data.i][layer.data.j].x = layer.x;
						   _grid[layer.data.i][layer.data.j].y = layer.y;
						   updatePineapple();
						},
						dragstop: function (layer) {
							//drawPineapple();
							//console.debug(layer.name);
							updatePineapple();
							//makeSVG();
						},
				
						cursors: {
							mouseover: 'move'
						}
					});
					
					
					
				}
				// Draw the line
			}
			$('canvas').addLayer(obj);
			console.debug(n);
			layernum++;
		}
	}		
	var layers = $('canvas').getLayers();
	layers.reverse();
	$('canvas').drawLayers();
}



function updatePineapple ()
{
	var xIt = Math.floor(_x/_pattern_x_offset);
	var yIt = Math.floor(_y/_pattern_y_offset);
	var layernum = 0;
	for (var ix=0; ix<=_x-_pattern_x_offset-1; ix+=_pattern_x_offset)
	{
		for (var iy=0; iy<_y-_pattern_y_offset-1; iy+=_pattern_y_offset)
		{
			var n 	= "row"+layernum;
			var obj = {};
			var p	= 1;
		 	for (var row in _pineapple)
			{
				
				for(var point in _pineapple[row])
				{	
					var x = _pineapple[row][point][0];
					var y = _pineapple[row][point][1];
					obj['x'+p] = _grid[x+ix][y+iy].x;
					obj['y'+p] = _grid[x+ix][y+iy].y;
					p++;
				}
			}
			$('canvas').setLayer(n, obj);	
			layernum++;
		}
	}	
	
	
	
	$("canvas").drawLayers('cp');
	
}	


// ------------------------------------------------------------------------
// SAVING & STORAGE
// ------------------------------------------------------------------------



function makeSVG (func) {
	
	// switch of circles
	$('canvas').setLayerGroup('circles', {
	  visible: false
	})
	.drawLayers();	
    // setup
    var cs = new CanvasSVG.Deferred();
    var canvas = document.getElementById('canvas');
    cs.wrapCanvas(canvas);
    var ctx = canvas.getContext('2d');

   
	
	$("#svg").html(ctx.getSVG());
	// remove filled areas placed there by the svg convertor
	
	$("path[stroke='none']").remove();
	// remove bullshit placed there by the svg
	$("path[stroke='none']").remove();
	//stroke-linejoin="miter" > stroke-linejoin="round"
	//stroke-width="1"  > stroke-width="5"
	$("path[stroke-width='1']").attr("stroke-width","5").attr("stroke-linejoin","round");
	
	
	// make object for post
	
	$("#dumpSVG").text( $("#svg").html().split("><").join(">\n<") ); 
}

var ns = "http://www.w3.org/1999/xhtml";
function cleanCanvas (canvas) {
    var cel = document.createElementNS(ns, "canvas");
    cel.setAttributeNS(null, 'width', canvas.width);
    cel.setAttributeNS(null, 'height', canvas.height);
    cel.setAttributeNS(null, 'style', canvas.getAttributeNS(null, 'style'));
    canvas.parentNode.replaceChild(cel, canvas);
    cel.setAttributeNS(null, 'id', "canvas");
    $('svg').textContent = "";
    return cel;
}


function postform ()
{
	$.ajax({
		type: 		"POST",
		data: 		{
			name: 		$("#name").val(),
			datetime: 	$.now(),
			svg: 		$("#svg").html()
		},
		url: 		"svg.php",
		
	}).done(function (response, textStatus, jqXHR) {
		console.debug(response);
		$("#download").html('<a target="_new" href="'+response+'" style="text-decoration:none;"><img src="images/download.png" style="vertical-align:text-middle;" alt="Download"> Download</a>');
	});
}

$( "#reset" ).click(function() {
	$('canvas').removeLayerGroup('circles');
	$('canvas').removeLayerGroup('cp');
	$('canvas').drawLayers();
	$('canvas').clearCanvas();
	init();
});

_first = true;

$( "#save" ).click(function() {
	hide();
	if (_first)
	{
		makeSVG();
		_first = false;
	}
		
	makeSVG();
	postform();
});

function hide() {
	$('canvas').setLayerGroup('circles', {
	  visible: false
	})
	.drawLayers();	
	$("#hide").text("Show Dots");
	
}

$( "#hide" ).click(function() {
	if ($(this).text() == "Hide Dots")
	{
		$('canvas').setLayerGroup('circles', {
		  visible: false
		})
		.drawLayers();	
		$(this).text("Show Dots");
	} else {

		$('canvas').setLayerGroup('circles', {
		  visible: true
		})
		.drawLayers();
		$(this).text("Hide Dots");
		
	}
	
});

// ------------------------------------------------------------------------
// STORAGE
// ------------------------------------------------------------------------
_storage=$.localStorage;





