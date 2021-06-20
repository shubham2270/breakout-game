const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreP = document.getElementById("score");

const canvasH = canvas.height;
const canvasW = canvas.width;

let rightPressed = false;
let leftPressed = false;

// Navigate paddle left & right
const paddleNavigation = () => {
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

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
};

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

// draws the score
const drawScore = () => {
  ctx.beginPath();
  ctx.fillStyle = "#000";
  ctx.font = `15px Verdana`;
  ctx.fill();
  ctx.fillText(`Score: ${score}`, canvasW - 60, 20);
  ctx.closePath();
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

  // Detect collision with paddle
  if (y + dy >= canvasH - radius) {
    if (paddleStart && paddleEnd) {
      dy = -dy;
      //   dx = dx + (x + dx - paddleX) / 100;
    }
  }

  // Detect if ball collision with ceiling of box;
  if (y + dy < 0) {
    dy = -dy;
  }

  // loop over bricks array & get x & y values
  for (let b = 0; b < bricks.length; b++) {
    for (let i = 0; i < bricks[b].length; i++) {
      const brick = bricks[b][i];

      // Detect collision with bricks
      if (brick.isVisible) {
        if (
          x > brick.x &&
          x < brick.x + brickW &&
          y > brick.y &&
          y < brick.y + brickH
        ) {
          bricks[b][i].isVisible = false;
          score += 1;
          scoreP.innerText = `Your score is: ${score}`;
          dy = -dy;
        }
      }
    }
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
      drawBricks();
      drawScore();
    }, 20);
  }
};

let brickW = 50;
let brickH = 10;
let brickOffset = 10; // gap between bricks
let brickCount = 9;

// stores positions of bricks
let bricks = [];

// holds the state of bricks
const createBrickArray = () => {
  // Draw brick vertically
  for (let j = 0; j < 3; j++) {
    bricks[j] = [];
    // Draw brick horizontally
    for (let i = 0; i < brickCount; i++) {
      bricks[j][i] = { x: 0, y: 0, isVisible: true };
    }
  }
};

// Draw bricks
const drawBricks = () => {
  // Draw brick vertically
  for (let j = 0; j < 3; j++) {
    // Draw brick horizontally
    for (let i = 0; i < brickCount; i++) {
      // only draw is isVisible is true
      if (bricks[j][i].isVisible) {
        const brickX = 10 + i * (brickW + brickOffset);
        const brickY = (brickOffset + 10) * (j + 1);
        // Stores the position of bricks into array
        bricks[j][i].x = brickX;
        bricks[j][i].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickW, brickH);
        ctx.fillStyle = "#00ead3";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

let x, y, dy, dx, interval, radius, paddleW, paddleX, paddleY;
let score = 0;
setVariables();
drawPaddle();
createBrickArray();
drawBricks();
drawScore();
drawBall();
paddleNavigation();
// startGame();
