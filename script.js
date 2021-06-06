const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// draws the ball
const drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, 2 * Math.PI, false);
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
  if (x + dx >= canvas.width || x + dx < 0) {
    dx = -dx;
  }

  // Detect if ball is crossing ceiling of box;
  if (y + dy < 0) {
    dy = -dy;
  }
};

// Set the starting position of ball & default distance it will travel
const setVariables = () => {
  x = canvasH / 2;
  y = canvasW - 25;

  dx = 5; //small increment in pixels
  dy = -5;
};

// check if ball touches bottom of box & give alert of game over
const checkGameOver = () => {
  if (y + dy === canvas.height) {
    alert("Game Over!");
    clearInterval(interval);

    setVariables();
  }
};

const startGame = () => {
  interval = setInterval(() => {
    detectCollision();
    x = x + dx;
    y = y + dy;

    checkGameOver();

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);
    drawBall();
    drawPaddle();
  }, 10);
};

const canvasH = canvas.height;
const canvasW = canvas.width;

let x, y, dy, dx, interval;
let paddleW = 40;
let paddleX = canvasW / 2 - paddleW / 2;
let paddleY = canvasH - 10;
setVariables();
drawBall();
drawPaddle();
startGame();
