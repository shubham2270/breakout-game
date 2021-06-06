const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasH = canvas.height;
const canvasW = canvas.width;

let rightPressed = false;
let leftPressed = false;

const handleKeyDown = (e) => {
  if (e.key === "ArrowRight") {
    rightPressed = true;
  }

  if (e.key === "ArrowLeft") {
    leftPressed = true;
  }
};

const handleKeyUp = (e) => {
  if (e.key === "ArrowRight") {
    rightPressed = false;
  }

  if (e.key === "ArrowLeft") {
    leftPressed = false;
  }
};

// draws the ball
const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = "#ff449f";
  ctx.fill();
  ctx.closePath();
};

// Draws the paddle
const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleW, 10);
  ctx.fillStyle = "#00ead3";
  ctx.fill();
  ctx.closePath();
};

const detectCollision = () => {
  // Detect if ball is crossing left or right side of box;
  if (x + dx >= canvasW || x + dx < 0) {
    dx = -dx;
  }

  const paddleStart = x + dx > paddleX; // checks starting of paddle
  const paddleEnd = x + dx < paddleX + paddleW; // checks end of paddle

  if (y + dy >= canvasH - radius) {
    if (paddleStart && paddleEnd) {
      dy = -dy;
      //   dx = dx + (x + dx - paddleX) / 100;
    }
  }

  // Detect if ball is crossing ceiling of box;
  if (y + dy < 0) {
    dy = -dy;
  }
};

// Set the starting position of ball & default distance it will travel
const setVariables = () => {
  x = canvasW / 2;
  y = canvasH - 20;
  radius = 10;
  paddleW = 50;
  paddleX = canvasW / 2 - 40;
  paddleY = canvasH - 10;
  dx = 5; //small increment in pixels
  dy = -5;
  rightPressed = false;
  leftPressed = false;
};

// check if ball touches bottom of box & give alert of game over
const checkGameOver = () => {
  if (y === canvasH) {
    alert("Game Over!");
    clearInterval(interval);
    interval = null;
    setVariables();
  }
};

const startGame = () => {
  if (!interval) {
    interval = setInterval(() => {
      if (rightPressed) {
        paddleX = paddleX + 5;
      }
      if (leftPressed) {
        paddleX = paddleX - 5;
      }
      detectCollision();
      x = x + dx;
      y = y + dy;

      checkGameOver();

      ctx.clearRect(0, 0, canvasW, canvasH);
      drawBall();
      drawPaddle();
    }, 20);
  }
};

let x, y, dy, dx, interval, radius, paddleW, paddleX, paddleY;
setVariables();
drawBall();
drawPaddle();
// startGame();

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
