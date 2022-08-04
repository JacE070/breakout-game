const rulesBtn = document.getElementById('rules-btn');
const rulesCloseBtn = document.getElementById('rules-close-btn');
const settingsBtn = document.getElementById('settings-btn')
const settingApplyBtn = document.getElementById('settings-apply-btn');
const settingsCloseBtn = document.getElementById('settings-close-btn');
const resetBtn = document.getElementById('reset-btn');
const rules = document.getElementById('rules');
const settings = document.getElementById('settings')
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let color = "#0095dd";

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;
const delay = 500; //delay to reset the game

// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 3,
  dx: 3,
  dy: -3,
  visible: true
};

// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
  dy: 0,
  visible: true
};

// Create brick props
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
};

// Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = ball.visible ? color : 'transparent';
  ctx.fill();
  ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = paddle.visible ? color : 'transparent';
  ctx.fill();
  ctx.closePath();
}

// Draw score on canvas
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Draw bricks on canvas
function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? color : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
}

function doGravity(){
  const bottom = canvas.height - 20;
  if (paddle.y < bottom){
    paddle.dy += 0.2;
  }
  else{
    paddle.y = bottom;
  }
}

// Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx;
  paddle.y += paddle.dy

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
    }
}

// Move ball on canvas
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // ball.dx = ball.dx * -1
  }

  // Wall collision (top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // console.log(ball.x, ball.y);

  // Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
    ball.dy += paddle.dy/2
    paddle.dy = 0
  }

  // Brick collision
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  // Hit bottom wall - Lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

// Increase score
function increaseScore() {
  score++;

  if (score % (brickRowCount * brickColumnCount) === 0) {

      ball.visible = false;
      paddle.visible = false;

      //After 0.5 sec restart the game
      setTimeout(function () {
          showAllBricks();
          score = 0;
          paddle.x = canvas.width / 2 - 40;
          paddle.y = canvas.height - 20;
          ball.x = canvas.width / 2;
          ball.y = canvas.height / 2;
          ball.visible = true;
          paddle.visible = true;
      },delay)
  }
}

// Make all bricks appear
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
}

// Draw everything
function draw() {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// Update canvas drawing and animation
function update() {
  movePaddle();
  moveBall();
  doGravity();

  // Draw everything
  draw();

  requestAnimationFrame(update);
}

function settingsInit(){
  document.getElementById("speed").value = "3";
  document.getElementById("blue").checked = 1;
}
settingsInit();
update();

// Keydown event
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
  else if(e.key === 'Up' || e.key === 'ArrowUp'){
    if (paddle.y === canvas.height - 20)
    paddle.dy = -paddle.speed/1.3;
  }
  console.log(e.key)
}

// Keyup event
function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0;
  }
}

function applySettings(){
  const [red, blue, green] = [document.getElementById("red").checked,
  document.getElementById("blue").checked,
  document.getElementById("green").checked];
  let new_color = null;
  if (red){
    new_color = "#cf3422";
    document.body.style.backgroundColor = "#cf3422";
    // document.getElementsByClassName("")
    
  }
  else if (blue){
    new_color = "#0095dd";
    document.body.style.backgroundColor = "#0095dd";
  }
  else if (green){
    new_color = "#40c95b";
    document.body.style.backgroundColor = "#40c95b";
  }
  if (color !== new_color){
    color = new_color
    // console.log(color, new_color);
    draw();
  }
  const s = document.getElementById('speed').value;
  if(s){
    const sp = parseFloat(s);
    ball.speed = sp;
    ball.dx = sp;
    ball.dy = -sp;
  }

}

function reset(){
  bricks.forEach(column => {
    column.forEach(brick => {
      brick.visible = true;
    });
  });
  applySettings();
  ball.x =  canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 3;
  ball.dx = 3;
  ball.dy = -3;
  // settingsInit(); 
  draw()
}

// Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
rulesCloseBtn.addEventListener('click', () => rules.classList.remove('show'));
settingsBtn.addEventListener('click', () => settings.classList.add('show'));
settingApplyBtn.addEventListener('click', applySettings);
settingsCloseBtn.addEventListener('click', () => settings.classList.remove('show'));
resetBtn.addEventListener('click', reset);