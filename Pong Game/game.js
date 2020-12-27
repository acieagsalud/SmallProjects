const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const WINNING_SCORE = 3;

var canvas;
var canvasConext;
var ballX = 50;
var ballSpeedX = 5;
var ballY = 50;
var ballSpeedY = 3;

var paddle1Y = 250;
var paddle2Y = 250;
var player1Score = 0;
var player2Score = 0;

var showingWinScreen = false;

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasConext = canvas.getContext('2d');

	var framesPerSecond = 50;
	setInterval(() => {
		moveEverything();
		drawEverything();
		}, 1000/framesPerSecond);	

	canvas.addEventListener('mousedown', handleMouseClick);

	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			paddle2Y = mousePos.y - (PADDLE_HEIGHT/2);
	});	
}

function handleMouseClick(evt) {
	if (showingWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function drawNet() {
	for (var i=0; i<canvas.height; i+=40) {
		colourRect(canvas.width/2-1, i, 2, 20, 'white');
	}
}

function drawEverything() {
	// Black canvas background
	colourRect(0, 0, canvas.width, canvas.height, 'black');

	if (showingWinScreen) {
		canvasConext.fillStyle = 'white';
		if (player1Score >= player2Score) {
			canvasConext.fillText("Player 1 WINS!", (canvas.width/2) - 30, (canvas.height/2) - 20);
		} else {
			canvasConext.fillText("Player 2 WINS!",  (canvas.width/2) - 30, (canvas.height/2)- 20);
		}

		canvasConext.fillText("Click to continue", (canvas.width/2) - 30, canvas.height/2);
		return;
	}

	drawNet();

	// Left player paddle
	colourRect(PADDLE_WIDTH, paddle1Y,PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
	// Right player paddle
	colourRect(canvas.width-(PADDLE_WIDTH+10), paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
	// Ball
	colourCircle(ballX, ballY, 7, 'blue');
	// Track scores
	canvasConext.fillStyle = 'white';
	canvasConext.fillText(player1Score, 100, 100);
	canvasConext.fillText(player2Score, canvas.width - 100, 100);
}

function colourCircle(centerX, centerY, radius, drawColour) {
	canvasConext.fillStyle = drawColour;
	canvasConext.beginPath();
	canvasConext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasConext.fill();
}

function colourRect(leftX, topY, width, height, drawColour) {
	canvasConext.fillStyle = drawColour;
	canvasConext.fillRect(leftX,topY,width,height);
}

function ballReset() {
	if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = true;
	}

	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function AIPlayer() {
	var paddle1YCenter = paddle1Y + (PADDLE_HEIGHT/2)
	if (paddle1YCenter < ballY - 35) {
		paddle1Y += 6;
	} else if (paddle1YCenter > ballY - 35) {
		paddle1Y -= 6;
	}
}

function moveEverything() {
	if (showingWinScreen) {
		return;
	}

	AIPlayer();

	ballX = ballX + ballSpeedX;
	if (ballX < 30){
		if (ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT ) {
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player2Score++;
			ballReset();
		}
	}
	if (ballX > canvas.width - 30) {
		if (ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT ) {
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1Score++;
			ballReset();
		}
	}

	ballY = ballY + ballSpeedY;
	if (ballY > 600 || ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
}