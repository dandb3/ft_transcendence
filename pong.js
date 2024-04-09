const cnvs = document.querySelector(".pong canvas");
let ctx = cnvs.getContext("2d");

const paddleInfo = {
    width: 70,
    height: 10,
    space: 10
}

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

    move()
    {
        const afterX = this._posX + this._diffX;
        const afterY = this._posY + this._diffY;

        if (afterX - this._radius >= 0 && afterX + this._radius <= cnvs.width
            && afterY - this._radius >= 0 && afterY + this._radius <= cnvs.height) {
            this._posX = afterX;
            this._posY = afterY;
            return;
        }
        if (afterX - this._radius < 0 || afterX + this._radius > cnvs.width) {
            this._diffX *= -1;
        }
        if (afterY - this._radius < 0 || afterY + this._radius > cnvs.width) {
            this._diffY *= -1;
        }
        this._posX += this._diffX;
        this._posY += this._diffY;
    }

    draw()
    {
        ctx.beginPath();
        ctx.arc(this._posX, this._posY, this._radius, 0, Math.PI * 2, true);
        ctx.fill();
    }
};

class Player
{
    constructor(playerNum)
    {
        switch (playerNum) {
        case 1:
            this._paddle = new Paddle(paddleInfo.height, paddleInfo.width, paddleInfo.space + paddleInfo.height / 2, cnvs.height / 2, 0, 10);
            this._keydownHandler = this._makeKeyEventHandler(this._paddle, "w", "s", true);
            this._keyupHandler = this._makeKeyEventHandler(this._paddle, "w", "s", false);
            break;
        case 2:
            this._paddle = new Paddle(paddleInfo.height, paddleInfo.width, cnvs.width - paddleInfo.space - paddleInfo.height / 2, cnvs.height / 2, 0, -10);
            this._keydownHandler = this._makeKeyEventHandler(this._paddle, "ArrowDown", "ArrowUp", true);
            this._keyupHandler = this._makeKeyEventHandler(this._paddle, "ArrowDown", "ArrowUp", false);
            break;
        case 3:
            this._paddle = new Paddle(paddleInfo.width, paddleInfo.height, cnvs.width / 2, cnvs.height - paddleInfo.space - paddleInfo.height / 2, 10, 0);
            this._keydownHandler = this._makeKeyEventHandler(this._paddle, "c", "v", true);
            this._keyupHandler = this._makeKeyEventHandler(this._paddle, "c", "v", false);
            break;
        case 4:
            this._paddle = new Paddle(paddleInfo.width, paddleInfo.height, cnvs.width / 2, paddleInfo.space + paddleInfo.height / 2, -10, 0);
            this._keydownHandler = this._makeKeyEventHandler(this._paddle, ".", ",", true);
            this._keyupHandler = this._makeKeyEventHandler(this._paddle, ".", ",", false);
            break;
        }
        document.addEventListener("keydown", this._keydownHandler);
        document.addEventListener("keyup", this._keyupHandler);
        this._score = 0;
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

function moveAll(players, balls)
{
    players.forEach((instance) => {
        instance.move();
    })
    balls.forEach((instance) => {
        instance.move();
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
    const balls = [new Ball(cnvs.width / 2, cnvs.height / 2, 10, 10, 10)];

    for (i = 0; i < playerNum; ++i) {
        players.push(new Player(i));
    }

    setInterval(show, 50, players, balls);
}

startGame(4);
