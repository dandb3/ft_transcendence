const cnvs = document.querySelector(".pong canvas");
let ctx = cnvs.getContext("2d");

const paddleInfo = {
    width: 70,
    height: 10,
    space: 10
}

const CONFLICT = {
    NONE: 0,
    HORIZONTAL: 1,
    VERTICAL: 2
};
Object.freeze(CONFLICT);

const GAME = {
    LOSE_PLAYER1: 0,
    LOSE_PLAYER2: 1,
    LOSE_PLAYER3: 2,
    LOSE_PLAYER4: 3,
    CONTINUE: 4
}
Object.freeze(GAME);

class AObject
{
    constructor(posX, posY, diffX, diffY)
    {
        this._posX = posX;
        this._posY = posY;
        this._diffX = diffX;
        this._diffY = diffY;
    }

    move() {}
    draw() {}
};

class Paddle extends AObject
{
    constructor(widthX, widthY, posX, posY, diffX, diffY)
    {
        super(posX, posY, diffX, diffY);
        this._widthX = widthX;
        this._widthY = widthY;
        this._movingLeft = false;
        this._movingRight = false;
    }

    reset(obj)
    {
        this._posX = obj._posX;
        this._posY = obj._posY;
        this._diffX = obj._diffX;
        this._diffY = obj._diffY;
        this._widthX = obj._widthX;
        this._widthY = obj._widthY;
        this._movingLeft = false;
        this._movingRight = false;
    }

    /* it doesn't move if left and right are pressed simultaneously. */
    _moveLeft()
    {
        const afterX = this._posX - this._diffX;
        const afterY = this._posY - this._diffY;

        if (afterX - this._widthX / 2 >= 0 && afterX + this._widthX / 2 <= cnvs.width)
            this._posX = afterX;
        if (afterY - this._widthY / 2 >= 0 && afterY + this._widthY / 2 <= cnvs.height)
            this._posY = afterY;
    }

    _moveRight()
    {
        const afterX = this._posX + this._diffX;
        const afterY = this._posY + this._diffY;

        if (afterX - this._widthX / 2 >= 0 && afterX + this._widthX / 2 <= cnvs.width)
            this._posX = afterX;
        if (afterY - this._widthY / 2 >= 0 && afterY + this._widthY / 2 <= cnvs.height)
            this._posY = afterY;
    }

    inside(posX, posY)
    {
        if (posX > this._posX - this._widthX / 2 && posX < this._posX + this._widthX / 2
            && posY > this._posY - this._widthY / 2 && posY < this._posY + this._widthY / 2) {
            return true;
        }
        else {
            return false;
        }
    }

    move()
    {
        if (!(this._movingLeft ^ this._movingRight))
            return;
        if (this._movingLeft) {
            this._moveLeft();
        }
        else if (this._movingRight) {
            this._moveRight();
        }
    }

    draw()
    {
        ctx.fillRect(this._posX - this._widthX / 2, this._posY - this._widthY / 2, this._widthX, this._widthY);
    }
};

class Ball extends AObject
{
    constructor(posX, posY, diffX, diffY, radius)
    {
        super(posX, posY, diffX, diffY);
        this._radius = radius;
    }
    
    reset(obj)
    {
        this._posX = obj._posX;
        this._posY = obj._posY;
        this._diffX = obj._diffX;
        this._diffY = obj._diffY;
        this._radius = obj._radius;
    }

    /* X방향, Y방향 중 어느쪽에서 충돌했는지 알려주는 함수 */
    _conflict(players)
    {
        let conflictResult = CONFLICT.NONE;

        for (i = 0; i < players.length; ++i) {
            if (players[i]._paddle.inside(this._posX + this._radius, this._posY)
                || players[i]._paddle.inside(this._posX - this._radius, this._posY)) {
                conflictResult |= CONFLICT.HORIZONTAL;
            }
            if (players[i]._paddle.inside(this._posX, this._posY + this._radius)
                || players[i]._paddle.inside(this._posX, this._posY - this._radius)) {
                conflictResult |= CONFLICT.VERTICAL;
            }
        }
        return conflictResult;
    }

    move(players)
    {
        const afterX = this._posX + this._diffX;
        const afterY = this._posY + this._diffY;
        const conflictResult = this._conflict(players);

        if (conflictResult & CONFLICT.HORIZONTAL) {
            this._diffX *= -1;
        }
        else if (afterX + this._radius > cnvs.width) {
            this._diffX *= -1;
            return GAME.LOSE_PLAYER1;
        }
        else if (afterX - this._radius < 0) {
            this._diffX *= -1;
            return GAME.LOSE_PLAYER2;
        }
        if (conflictResult & CONFLICT.VERTICAL) {
            this._diffY *= -1;
        }
        else if (afterY + this._radius > cnvs.width) {
            this._diffY *= -1;
            if (players.length >= 3) {
                return GAME.LOSE_PLAYER3;
            }
        }
        else if (afterY - this._radius < 0) {
            this._diffY *= -1;
            if (players.length >= 4) {
                return GAME.LOSE_PLAYER4;
            }
        }
        this._posX += this._diffX;
        this._posY += this._diffY;
        return GAME.CONTINUE;
    }

    draw()
    {
        ctx.beginPath();
        ctx.arc(this._posX, this._posY, this._radius, 0, Math.PI * 2, true);
        ctx.fill();
    }
};

const initPaddles = [
    new Paddle(paddleInfo.height, paddleInfo.width, paddleInfo.space + paddleInfo.height / 2, cnvs.height / 2, 0, 10),
    new Paddle(paddleInfo.height, paddleInfo.width, cnvs.width - paddleInfo.space - paddleInfo.height / 2, cnvs.height / 2, 0, -10),
    new Paddle(paddleInfo.width, paddleInfo.height, cnvs.width / 2, cnvs.height - paddleInfo.space - paddleInfo.height / 2, 10, 0),
    new Paddle(paddleInfo.width, paddleInfo.height, cnvs.width / 2, paddleInfo.space + paddleInfo.height / 2, -10, 0)
]

const initKeys = [
    { leftKey: "w", rightKey: "s" },
    { leftKey: "ArrowDown", rightKey: "ArrowUp" },
    { leftKey: "c", rightKey: "v" },
    { leftKey: ".", rightKey: "," }
]

const initBalls = [
    new Ball(new Ball(cnvs.width / 2, cnvs.height / 2, 10, 10, 10))
]

class Player
{
    constructor(paddle, leftKey, rightKey)
    {
        this._paddle = new Paddle(paddle._widthX, paddle._widthY, paddle._posX, paddle._posY, paddle._diffX, paddle._diffY);
        this._keydownHandler = this._makeKeyEventHandler(this._paddle, leftKey, rightKey, true);
        this._keyupHandler = this._makeKeyEventHandler(this._paddle, leftKey, rightKey, false);
        this._score = 0;
        document.addEventListener("keydown", this._keydownHandler);
        document.addEventListener("keyup", this._keyupHandler);
    }

    _makeKeyEventHandler(leftKey, rightKey, value)
    {
        return ((event) => {
            if (event.key === leftKey) {
                this._paddle._movingLeft = value;
            }
            else if (event.key === rightKey) {
                this._paddle._movingRight = value;
            }
        });
    }

    move()
    {
        this._paddle.move();
    }

    draw()
    {
        this._paddle.draw();
    }
};

function scoreCalc(players, idx)
{
    for (i = 0; i < players.length; ++i) {
        if (i != idx) {
            ++players[i]._score;
            console.log(`Player${i + 1}: ${players[i]._score}`);
        }
    }
}

function resetGame(players, balls)
{
    for (i = 0; i < players.length; ++i) {
        players[i]._paddle.reset(initPaddles[i]);
    }
    for (i = 0; i < balls.length; ++i) {
        balls[i].reset(initBalls[i]);
    }
}

/* player가 움직인 후 그 다음에 공이 움직여야 공이 끼는 상태를 막을 수 있다. */
function moveAll(players, balls)
{
    players.forEach((instance) => {
        instance.move();
    })
    balls.forEach((instance) => {
        const moveResult = instance.move(players);

        if (moveResult !== GAME.NOCHANGE) {
            scoreCalc(players, moveResult);
            resetGame(players, balls);
        }
    })
}

function drawAll(players, balls)
{
    players.forEach((instance) => {
        instance.draw();
    })
    balls.forEach((instance) => {
        instance.draw();
    })
}

function show(players, balls)
{
    ctx.clearRect(0, 0, cnvs.width, cnvs.height);
    moveAll(players, balls);
    drawAll(players, balls);
}

function startGame(playerNum)
{
    const players = [];
    const balls = [new Ball(initBalls[0]._posX, initBalls[0]._posY, initBalls[0]._diffX, initBalls[0]._diffY, initBalls[0]._radius)];

    for (i = 0; i < playerNum; ++i) {
        players.push(new Player(initPaddles[i], initKeys[i].leftKey, initKeys[i].rightKey));
    }

    setInterval(show, 50, players, balls);
}

startGame(4);
