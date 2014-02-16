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
_tool = "move";

// pineapple array - draw the lines for the artwork
_pineapple = [];
_pineapple[0] = [[0,0],[1,1],[0,2],[0,1],[0,0]];
_pineapple[1] = [[0,0],[2,0],[2,1],[2,2],[1,1],[2,0]];
_pineapple[2] = [[2,0],[3,0],[2,1],[3,2],[4,1],[3,0],[4,0],[4,1],[4,2]];
_pineapple[3] = [[4,2],[3,2],[2,2],[0,2]];
_pineapple[4] = [[0,1],[1,1],[2,1],[4,1]];

//_pineapple[3] = [[2,0],[2,1],[2,2],[3,2],[2,1],[3,0],[4,1],[3,2],[4,2],[4,1],[4,0]];
//_pineapple[3] = [[4,2],[3,2]]; //,[4,1],[3,0]];

_width = $(window).width();
_height = $(window).height();
canvas.width = _width;
canvas.height = _height;

// recalculate the grid size based on the screen width
_size = parseInt((_width-300)/(_x+2));

console.debug(); //.attr("width"));

_circle_colours = {
	move: {
		strokeStyle: "rgba(122,201,67,0.8)", //'#7ac943',
		strokeWidth: 8,
	 	fillStyle: "rgba(255,255,255,0.5)", //'#7ac943',
	},
	minus: {
		strokeStyle: "rgba(255,123,172,0.8)", //'#7ac943',
		strokeWidth: 8,
	 	fillStyle: "rgba(255,255,255,0.5)", //'#7ac943',
	},
	plus: {
		strokeStyle: "rgba(63,169,245,0.8)", //'#7ac943',
		strokeWidth: 8,
	 	fillStyle: "rgba(255,255,255,0.5)", //'#7ac943',
	}
};
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
						method: 'drawArc',
						draggable: true,
						layer: true,
						data: {
							i: (x+ix),
							j: (y+iy),
						},
						update: function () {
							// console.debug(this.name);
 						   _grid[this.data.i][this.data.j].x = this.x;
 						   _grid[this.data.i][this.data.j].y = this.y;
						},
						groups: ["circles"],
						name: "g"+(x+ix)+"_"+(y+iy),
						visible: true,
						strokeStyle: "rgba(122,201,67,0.8)", //'#7ac943',
						strokeWidth: 8,
					 	fillStyle: "rgba(255,255,255,0.8)", //'#7ac943',
					  	x: _grid[x+ix][y+iy].x, 
						y: _grid[x+ix][y+iy].y,
					  	radius: _griddotsize,
						mousedown: function(layer) { 							
							gravity(layer.data.i,layer.data.j); 
						},
						drag: function(layer) {
						   // code to run as layer is being dragged
						   //console.debug(layer.data.i);
						   layer.update();
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
	$("path[stroke-width='1']").attr("stroke-width","5").attr("stroke-linejoin","round").attr("stroke","#CCC");
	// $("path[stroke='#000']").attr("stroke","#333");
	
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
	var now = $.now();
	var filename = $("#name").val()+"_"+now;
	
	store(filename,_grid);
	$.ajax({
		type: 		"POST",
		data: 		{
			name: 		$("#name").val(),
			datetime: 	now,
			svg: 		$("#svg").html()
		},
		url: 		"svg.php",
		
	}).done(function (response, textStatus, jqXHR) {
		console.debug(response);
		$("#download").html('<a target="_new" href="'+response+'" style="text-decoration:none;"><img src="images/download.png" style="vertical-align:text-middle;" alt="Download"> Download</a>');
	});
}

function reset()
{
	$('canvas').removeLayerGroup('circles');
	$('canvas').removeLayerGroup('cp');
	$('canvas').drawLayers();
	$('canvas').clearCanvas();
}

$( "#reset" ).click(function() {
	reset();
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
	showStorage();
});

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


function hide() {
	$('canvas').setLayerGroup('circles', {
	  visible: false
	})
	.drawLayers();	
	$("#hide").text("Show Dots");
	
}


// ------------------------------------------------------------------------
// STORAGE
// ------------------------------------------------------------------------
_storage=$.localStorage;
function store(stamp,data)
{
	// save a copy of the grid
	if (!_storage.isSet("pineapple_saves"))
	{
		_storage.set("pineapple_saves",[]);
	} 
	var saves = [];
	saves = _storage.get("pineapple_saves");
	console.log(saves);
	saves[saves.length] = stamp;
	
	// save the timestamp in an array
	_storage.set("pineapple_saves",saves);
	// save the data in a variable of the timestamp
	_storage.set(stamp,data);
	

}

function restore(key)
{
	reset();
	console.log("[restore]");
	console.log( key + " " + _storage.get(key) );
	_grid = _storage.get(key);
	drawPineapple();
	/*
	var keys = _storage.keys();
	console.log(keys);
	for(var k in keys)
	{
		console.log(keys[k]);
		console.log(_storage.get(keys[k]));
	}*/
}

function showStorage()
{
	var keys = _storage.get("pineapple_saves");
	console.log(keys);
	$("#old_files").html("<h5>Old Pineapples</h5><hr />");
	for(var k in keys)
	{
		if(_storage.isEmpty(keys[k]))
		{	
			console.log(keys[k] + " is empty!");
			//_storage.remove(keys[k]);
			//keys.splice(k, 1); //[k] = null;
			
		} else {
			console.log(keys[k]);
			console.log(_storage.get(keys[k]));
			
			$("#old_files").append(
			'<i class="fa fa-refresh" onClick="restore(\''+keys[k]+'\')" id="'+keys[k]+'"></i> '
			);
			$("#old_files").append(
			'<a target="_new" href="outputs/'+keys[k]+'.pdf" style="text-decoration:none;"><i class="fa fa-download"></i> '+keys[k]+'</a><br />'
			);
			
		}
			
	
	}
}

function deleteStorage(key)
{
	_storage.remove(key);
	// remove item from html dom
}


// ------------------------------------------------------------------------
// GRAVITY
// ------------------------------------------------------------------------
_gravity 		= 9; // how fast gravity will work smaller is faster
_gravity_range 	= 2; // times the initial grid size

function gravity (i, j) {
	
	if (_tool=="minus")
		gravityfield = _gravity;
	
	if (_tool=="plus")
		gravityfield = -_gravity;
		
	if (_tool=="move")
		return;
	
	var range = _gravity_range * _size;
	// affect each object in the vicinity
	for (var ii = i-_gravity_range; ii< i+_gravity_range; ii++)
	{
		for (var jj = j-_gravity_range; jj < j+_gravity_range; jj++)
		{
			// test for bounds of our grid or we will have out of range errors 
			if (ii>=0 && jj >=0 && ii < _x && jj < _y)
			{
				if (i == ii && j == jj)
				{
					console.debug("same same: g"+ii+"_"+jj);
				} else {
					var x1 =  _grid[i][j].x;
					var y1 =  _grid[i][j].y;
					var x2 =  _grid[ii][jj].x;
					var y2 =  _grid[ii][jj].y;
					var dx = (x2-x1);
					var dy = (y2-y1);
					
					if (dx == 0) 
					{
						var slope = 0;
						var x3 =  x1;
						var y3 =  y2 - ((dy)/gravityfield);
					} else 
					if (dy == 0)
					{
						var slope = 0;
						var x3 =  x2 - ((dx)/gravityfield);
						var y3 =  slope*(x3 - x1) + y1;
					} else 
					{
						var slope = (dy)/(dx);
						var x3 =  x2 - ((dx)/gravityfield);
						var y3 =  slope*(x3 - x1) + y1;
					}
					
				
			console.debug("g"+ii+"_"+jj + " x1: " + x1 + ": y1: "+ y1);
			console.debug("g"+ii+"_"+jj + " x2: " + x2 + ": y2: "+ y2);
			console.debug("g"+ii+"_"+jj + " slope: " + slope + ": x3: "+ x3 + " y3: "+ y3);
					$("canvas").animateLayer("g"+ii+"_"+jj, {
						x: x3,
						y: y3
					}, 
					500, 
						function (layer) {
							layer.update();
							updatePineapple();
						}
					);
				}
			}
		}
	}
}


// ------------------------------------------------------------------------
// INTERACTION
// ------------------------------------------------------------------------
function up(button)
{
	/*$(".tools").each( function (index) {
		var src = $(this).attr("src");
		src.replace("/dn/","/up/");
		$(this).attr("src", src);
		c/nsole.log(src);
	});*/
	
	$(".info").removeClass("show").addClass("hide");
	$("#info_"+button).removeClass("hide").addClass("show");
	
	$(".tools").removeClass("click");
	$("#"+button).addClass("click");
	
}

$("#about").click(function() {
	up("about");
	//$(this).attr( "src", $(this).attr("src").replace("/dn/","/up/") );
	//$(this).attr( "src", $(this).attr("src").replace("/up/","/dn/") );	
});

$("#move").click(function() {
	_tool = "move";
	$("canvas").setLayerGroup("circles",_circle_colours.move).drawLayers();
	up("move");
	// $(this).attr( "src", $(this).attr("src").replace("/up/","/dn/") );
});

$("#minus").click(function() {
	_tool = "minus";
	$("canvas").setLayerGroup("circles",_circle_colours.minus).drawLayers();
	up("minus");
	//$(this).attr( "src", $(this).attr("src").replace("/up/","/dn/") );
});

$("#plus").click(function() {
	_tool = "plus";
	$("canvas").setLayerGroup("circles",_circle_colours.plus).drawLayers();
	up("plus");
	// $(this).attr( "src", $(this).attr("src").replace("/up/","/dn/") );
});

$("#saveit").click(function() {

//	$("canvas").setLayerGroup("circles",_circle_colours.plus).drawLayers();
	up("saveit");
	showStorage()
	// $(this).attr( "src", $(this).attr("src").replace("/up/","/dn/") );
});

$(".fa-edit").click(function() {
	console.log($(this).attr("id"));
	
});









