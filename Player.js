import {MOVE, Player} from "Player.js";

const cnvs = document.querySelector(".pong canvas");
let ctx = cnvs.getContext("2d");

const paddleInfo = {
    width: 70,
    height: 10,
    space: 10
}

const player1 = new Player(paddleInfo.height, paddleInfo.width, paddleInfo.space + paddleInfo.height / 2, cnvs.height / 2, 0, 10);

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
        player1._movingLeft = true;
    }
    else if (event.key === "ArrowDown") {
        player1._movingRight = true;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowUp") {
        player1._movingLeft = false;
    }
    else if (event.key === "ArrowDown") {
        player1._movingRight = false;
    }
});

function move()
{
    if (player1.direction() === MOVE.LEFT) {
        player1.moveLeft();
    }
    else if (player1.direction() === MOVE.RIGHT) {
        player1.moveRight();
    }
}

function show()
{
    ctx.clearRect(0, 0, cnvs.width, cnvs.height);
    move();
    player1.draw();
}

setInterval(show, 50);
