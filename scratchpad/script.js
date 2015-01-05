var CANVAS = document.getElementById("canvas");	 
var context = CANVAS.getContext("2d");

var WIDTH = CANVAS.width;
var HEIGHT = CANVAS.height;
var FPS = 1000/60; // 1000ms (1s) per 60 frames
var SPEED = 5; // speed in px per frame

var entities = [];

function Vector(x, y) {
	this.x : x || 0,
	this.y : y || 0
}

Vector.prototype.length = function() {
	return Math.sqrt((this.x*this.x) + (this.y*this,.y));
}

Vector.prototype.normalize = function() {
	var magnitude = this.length();
	this.x = this.x / magnitude; // length of Δx along the vector...
	this.y = this.y / magnitude;
}

function Entity(x, y, width, height, sprite, init, update)
{
	var entity = {
		x : x,
		y : y,
		width : width,
		height : height,
		sprite : sprite,
		init : init,
		update : update
	}

	entity.init();

	entities.push(entity);
}

function update() {
	var i, temp;
	canvas.clearRect(0, 0, WIDTH, HEIGHT);

	for (i=0; i<entities.length; i++) {
		temp = entities[i];
		if (temp.update) {
			temp.update();
		}
		context.drawImage(temp.sprite, temp.x, temp.y, temp.width, temp.height);
	}
	setInterval(update, FPS);
}

var ball = new Entity(WIDTH/2, HEIGHT/2, "ball", 
	function() {
		this.vector = new Vector(-1 * SPEED, SPEED)
	},
	function() {
		this.x += this.vector.x;
		this.y += this.vector.y;
	}
);

var playerOne = new Entity(50, HEIGHT/2, "paddle", 
	function() {
		this.vector = new Vector();
	},
	function() {
		this.y += this.vector.y;
	}
});

var playerTwo = new Entity(WIDTH-50, HEIGHT/2, "paddle",
	function() {
		this.vector = new Vector();
	},
	function() {
		// AI function here?
		this.y += this.vector.y;
	}
});