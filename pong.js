$(document).ready(function() {
	var CANVAS = document.getElementById("canvas");	 
	var WIDTH = CANVAS.width;
	var HEIGHT = CANVAS.height;
	var FPS = 1000/60; // 1000ms (1s) per 60 frames
	var SPEED = 5; // speed in px per frame
	var context = CANVAS.getContext("2d");

	// define our entities...
	function Entity(posX, posY, image, width, height, points) {
		this.posX = posX-(width/2);
		this.posY = posY-(height/2);
		this.image = document.getElementById(image);
		this.width = width;
		this.height = height;
		this.points = 0;
	}
	var playerOne = new Entity(50, HEIGHT/2, "paddle", 10, 100);
	var playerTwo = new Entity(WIDTH-50, HEIGHT/2, "paddle", 10, 100);
	var ball = new Entity(WIDTH/2, HEIGHT/2, "ball", 10, 10);


	// start with ball going left and with game paused & grid off
	var changeX = -10; 
	var changeY = 0;
	var stopped = 1;
	var gridOn = 0;
	var ballOriginX = ball.posX;
	var ballOriginY = ball.posY;

	function resetEntities() {
		ball.posX = WIDTH/2-(ball.width/2);
		ball.posY = HEIGHT/2-(ball.height/2);
		playerOne.posX = 50-(playerOne.width/2);
		playerOne.posY = HEIGHT/2-(playerOne.height/2);
		playerTwo.posX = WIDTH-50-(playerTwo.width/2); 
		playerTwo.posY = HEIGHT/2-(playerTwo.height/2);
		changeX = -10;
		changeY = 0;
		console.log("player one: " + playerOne.points + " points");
		console.log("player two: " + playerTwo.points + " points");
	}

	function drawEntities() {
		context.drawImage(ball.image, ball.posX, ball.posY);
		context.drawImage(playerOne.image, playerOne.posX, playerOne.posY);
		context.drawImage(playerTwo.image, playerTwo.posX, playerTwo.posY);
	}

	function updateCanvas(changeX, changeY) {	
		ball.posX += changeX;
		ball.posY += changeY;
		context.clearRect(0, 0, WIDTH, HEIGHT);
		drawEntities();
	}

	function checkCollide() {
			// check paddle 1:
			var highBoundX = playerOne.posX + playerOne.width;
			var highBoundY = playerOne.posY + playerOne.height;
			var ballBoundX = ball.posX + ball.width;
			var ballBoundY = ball.posY + ball.height;

			if (ball.posX <= highBoundX) { // ball is to the left of paddle one's rightmost bound
				if (ball.posY <= highBoundY && ballBoundY >= playerOne.posY) {
					return 1; // collide with player 1
				}
			} 

			// switch over to player 2 paddle values to check collide with paddle 2
			highBoundX = playerTwo.posX + playerTwo.width;
			highBoundY = playerTwo.posY + playerTwo.height;

			if (ball.posX >= playerTwo.posX) {
				console.log("true");
				if (ball.posY <= highBoundY && ballBoundY >= playerTwo.posY) {
					return 2; // collide with player 2
				}
			} 

			// check walls
			if (ball.posX <= 0) {
				return 3; // collide with left wall
			}
			if (ball.posX >= WIDTH) {
				return 4; // collide with right wall
			}
			if (ball.posY <= 0) { // collide with top wall
				return 5;
			}
			if (ball.posY >= HEIGHT) {  // collide with bottom wall
				return 6;
			}

		return 0;
	}

	function moveBallAutonomous() {
		
		/* checkCollide() return values:
			0 : no collision detected
			1 : collided with player 1 paddle
			2 : collided with player 2 paddle
			3 : collided with left wall (award point to player 2 & pause!)
			4 : collided with right wall (award point to player 1 & pause!)
			5 : collided with top wall
			6 : collided with bottom wall
		*/
		if (!stopped) { 
			switch(checkCollide()) {
				case 1:
					// check where the ball is hitting the paddles
					console.log(ball.posY);
					console.log(playerOne.posY);
					changeX = SPEED; // move to the right
					changeY = -1 * SPEED;
					if (ball.posY > (playerOne.posY + (playerOne.height/2))) {
						changeY = SPEED;	
					}
					break;
				case 2:
					changeX = -1 * SPEED; // move to the left
					changeY = -1 * SPEED;
					if (ball.posY > (playerTwo.posY + (playerTwo.height/2))) {
						changeY = SPEED;
					}
					break;
				case 3:
					playerTwo.points++;
					stopped = 2;
					break;
				case 4:
					playerOne.points++;
					stopped = 2;
					break;
				case 5:
					//changeX = -1 * changeX;
					//if (ball.posX > WIDTH) { changeX = -1 * SPEED; }
					changeY = SPEED; // move down
					break;
				case 6:
					//changeX = -1 * changeX;
					//if (ball.posX > WIDTH) { changeX = -1 * SPEED; }
					changeY = -1 * SPEED; // move up
					break;
				default:
					break;	
			}
			updateCanvas(changeX, changeY);
		}
	}
	
	function toggleGrid() {
		stopped = 1;
		gridOn = !gridOn; // toggle
		if (gridOn) {
			for(g = 0; g < WIDTH; g+=10) {
				context.beginPath();
				context.moveTo(g, 0);
				context.lineTo(g, HEIGHT);
				context.stroke();
			}
			for(g = 0; g < HEIGHT; g+=10) {
				context.beginPath
				context.moveTo(0, g);
				context.lineTo(WIDTH, g);
				context.stroke();
			}
		}
	}

	// ~actual game~
	drawEntities();
	setInterval(moveBallAutonomous, FPS);

	
	// event handling
	// pause switch
	$(document).click(function() { 
		if (stopped < 2) {
			stopped = !stopped;
		}
		else { 
			resetEntities(); 
			stopped = 0;
		}
	});

	// for moving paddles & toggling grid
	$(document).keydown(function(event) {
		console.log(event.which);
		switch(event.which)
		{
			case 38: // up
				if (playerOne.posY > 0) {
					playerOne.posY -= 50;
				}
				break;
			case 40: // down
				if (playerOne.posY+(playerOne.height) < HEIGHT) {
					playerOne.posY += 50;
				}
				break;
			case 71: // toggle grid ('g')
				toggleGrid();
				break;
			// for debug:
			case 37:
				playerTwo.posY -= 50;
				break;
			case 39:
				playerTwo.posY += 50;
				break;
			default:
				break;
		}
	})
});