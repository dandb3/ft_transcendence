/* enum for moving direction */
const MOVE = {
    LEFT: -1,
    RIGHT: 1,
    STOP: 0
};
Object.freeze(MOVE);

class Player
{
    constructor(widthX, widthY, posX, posY, diffX, diffY)
    {
        this._posX = posX;
        this._posY = posY;
        this._widthX = widthX;
        this._widthY = widthY;
        this._diffX = diffX;
        this._diffY = diffY;
        this._movingLeft = false;
        this._movingRight = false;
    }

    /* it doesn't move if left and right are pressed simultaneously. */
    moveLeft()
    {
        const afterX = this._posX - this._diffX;
        const afterY = this._posY - this._diffY;
        if (afterX - this._widthX / 2 >= 0 && afterX + this._widthX / 2 <= cnvs.width)
            this._posX = afterX;
        if (afterY - this._widthY / 2 >= 0 && afterY + this._widthY / 2 <= cnvs.height)
            this._posY = afterY;
    }

    moveRight()
    {
        const afterX = this._posX + this._diffX;
        const afterY = this._posY + this._diffY;
        if (afterX - this._widthX / 2 >= 0 && afterX + this._widthX / 2 <= cnvs.width)
            this._posX = afterX;
        if (afterY - this._widthY / 2 >= 0 && afterY + this._widthY / 2 <= cnvs.height)
            this._posY = afterY;
    }

    direction()
    {
        if (!(this._movingLeft ^ this._movingRight))
            return MOVE.STOP;
        if (this._movingLeft)
            return MOVE.LEFT;
        if (this._movingRight)
            return MOVE.RIGHT;
    }

    draw()
    {
        ctx.fillRect(this._posX - this._widthX / 2, this._posY - this._widthY / 2, this._widthX, this._widthY);
    }
};

export {MOVE, Player};