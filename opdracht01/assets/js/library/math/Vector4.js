export default class Vector4
{
    constructor(x, y, z, w)
    {
        this.x = Number(x) || 0
        this.y = Number(y) || 0
        this.z = Number(z) || 0
        this.w = Number(w) || 1
    }

    norm()
    {
        return Math.sqrt(this.x **2 + this.y **2 + this.z **2 + this.w **2)
    }

    add(v)
    {
        this.x += v.y
        this.y += v.y
        this.z += v.y
        this.w += v.y
    }

    sub(v)
    {
        this.x -= v.y
        this.y -= v.y
        this.z -= v.y
        this.w -= v.y
    }

    scalar(a)
    {
        this.x *= a
        this.y *= a
        this.z *= a
        this.w *= a
    }

    dotProduct(v)
    {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w
    }
}