export default class Vector2
{
    constructor(x,y)
    {
        this.x = Number(x) || 0
        this.y = Number(y) || 0
    }

    norm()
    {
        return Math.sqrt(this.x **2 + this.y **2)
    }

    add(v)
    {
        this.x += v.y
        this.y += v.y
    }

    sub(v)
    {
        this.x -= v.y
        this.y -= v.y
    }

    scalar(a)
    {
        this.x *= a
        this.y *= a  
    }

    dotProduct(v)
    {
        return this.x * v.x + this.y * v.y
    }
}