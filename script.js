let canvas = document.getElementById("canvas");

let context = canvas.getContext("2d");

let currentScore = document.querySelector(".current-score");
let startButton = document.querySelector(".start-button");
let rules = document.querySelector(".rules");

let score = 0;
let highScore = 0;

function Ball(x, y, dx, dy, radius, color, id, life) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.color = color;
  this.id = id;
  this.life = life;

  this.draw = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.strokeStyle = "white";
    context.stroke();
  };

  this.update = function() {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  };
}

let ballArray = [];

function createBall() {
  for (let i = 0; i < 7; i++) {
    let colorType = ["green", "green", "blue", "purple", "red", "red", "yellow"];

    let radius = 70;
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * (canvas.height - radius * 2) + radius;
    let dx = Math.random() * 3;
    let dy = Math.random() * 3;
    let color = colorType[Math.floor(Math.random() * colorType.length)];
    let id = Math.random() * 80;
    let life;

    if (color === "green" || color === "yellow") {
      life = 1;
    } else if (color === "blue") {
      life = 2;
    } else if (color === "purple") {
      life = 3;
    } else if (color === "red") {
      life = 1;
    }

    ballArray.push(new Ball(x, y, dx, dy, radius, color, id, life));
  }
}

function animate() {
  requestAnimationFrame(animate);
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < ballArray.length; i++) {
    ballArray[i].update();
  }
}

//click handler
canvas.onclick = function(e) {
  let x = e.pageX - canvas.offsetLeft;
  let y = e.pageY - canvas.offsetTop;
  let p;
  let distance;

  for (let i = ballArray.length - 1; i >= 0; i--) {
    p = ballArray[i];

    distance = Math.sqrt((p.x - x) * (p.x - x) + (p.y - y) * (p.y - y));
    if (distance < p.radius) {
      // console.log(
      //   `you clicked a circle: color: ${p.color} id:${p.id} life:${p.life}`
      // );
      if (p.life === 1) {
        ballArray.splice(i, 1);
        if (p.color === "green") {
          score += 100;
        }
        if (p.color === "yellow") {
          score += 30
          gameCounter += 5
        }
        if (p.color === "blue") {
          score += 200;
        }
        if (p.color === "purple") {
          score += 400;
        }
        if (p.color === "red") {
          score += 10;
          gameCounter -= 8;
        }
        currentScore.innerHTML = score;
      } else {
        p.life--;
        p.radius -= 15;
        // console.log(`life:${p.life}`);
      }

      if (ballArray.length < 3) {
        createBall();
      }

      break;
    }
  }
};

let startCounter = 2;
let gameCounter = 20;

let startTimer = document.querySelector(".start-counter");

let startMenu = document.querySelector(".start-menu");

let gameTimer = document.querySelector(".time");
let resultPage = document.querySelector(".result-page");

let startOver = document.querySelector(".start-over-button");

startButton.onclick = function(e) {
  rules.style.display = "none";
  document.querySelector(".start-counter").style.display = "block";

  let startCntDownFunc = setInterval(countDown, 1000);

  function countDown() {
    startCounter--;
    startTimer.innerHTML = startCounter;

    // console.log(startCounter);
    if (startCounter == 0) {
      startMenu.style.display = "none";
      startTimer.innerHTML = "";
      clearInterval(startCntDownFunc);
      createBall();

      let gameTimerCountDown = setInterval(gameCountDown, 1000);
      function gameCountDown() {
        gameCounter--;

        gameTimer.innerHTML = gameCounter;
        if (gameCounter < 0) {
          gameTimer.innerHTML = 0;
          clearInterval(gameTimerCountDown);
          // console.log(`${score} ${highScore}`);
          resultPage.style.display = "block";
          if (score > highScore) {
            highScore = score;
            document.querySelector(".score-title").style.display = "none"
            document.querySelector(".new-high").style.display = "block";
            document.querySelector(".high-score").innerHTML = score;
          } else {
            document.querySelector(".new-high").style.display = "none";
          }
          document.querySelector(".final-score").innerHTML = score;
          ballArray = [];
        }
      }
    }
  }
};

startOver.onclick = function(e) {
  gameCounter = 20;
  score = 0;
  currentScore.innerHTML = 0;
  startCounter = 3;

  resultPage.style.display = "none";
  startMenu.style.display = "block";
  rules.style.display = "block";
  // console.log(score)
};

// createBall();
animate();

//purple blue red green
