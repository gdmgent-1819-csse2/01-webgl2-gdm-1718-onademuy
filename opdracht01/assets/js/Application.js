import Vector2 from "./library/math/Vector2.js";
import Vector3 from "./library/math/Vector3.js";
import Vector4 from "./library/math/Vector4.js";
import Matrix2 from "./library/math/Matrix2.js";
import Matrix3 from "./library/math/Matrix3.js";
import Matrix4 from "./library/math/Matrix4.js";

export default class Application
{
    constructor()
    {
        console.log('WebGL2 demo')

        //Vector:
        //Vector2
        const v1 = new Vector2(1,1)
        const v2 = new Vector2(2,2)

        //Vector3
        const v3 = new Vector3(2,2,3)
        const v4 = new Vector3(3,1,2)

        //Vector4
        const v5 = new Vector4(3,1,2,3)        
        
        //Matrix:
        //Matrix2
        const m1 = new Matrix2(
                1,2,
                2,1
            )

        const m2 = new Matrix2(
                2,3,
                2,2
            )

        //Matrix3
        const m3 = new Matrix3(
            2,3,3,
            3,2,1,
            3,2,2
        )

        //Matrix4
        const m4 = new Matrix4(
            2,3,1,2,
            3,4,2,1,
            1,3,2,1,
            3,4,2,1
        )

        //Vector
        v1.sub(v2)
        console.log('v1 - v2' , v1)

        const a = 10
        v1.scaler(a)
        console.log('a * v1' , a,v1)

        v3.sub(v4)
        console.log('v3 - v4' , v3)

        v5.dotProduct(2)
        console.log('Dotproduct(2)' , v5)

        //Matrix
        m1.add(m2)
        console.log('m1 + m2' , m1)

        m3.sub(m3)
        console.log('m3 - m3' , m3)

        m4.sub(m4)
        console.log('m4 * 2' , m4)
    }
}