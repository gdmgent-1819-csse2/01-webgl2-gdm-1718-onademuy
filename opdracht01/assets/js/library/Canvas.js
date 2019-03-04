export default class Canvas {
    constructor(width, height, shaderSources) {
        this.height = height
        this.shaderSources = shaderSources
        this.width = width

        this.gl = null
        this.program = null
        this.run()
    }

    // methode die canvas doet werken
    run() {
        try {
            this.createCanvas()
            this.createShaders()
            this.createProgram()
            this.createBuffers()
        } catch (error){
        console.error(error)
        }
    }

    createCanvas() {
        const canvas = document.createElement('canvas')
        // aan het body element een nieuw element toevoegen --> canvas element
        document.body.appendChild(canvas)
        canvas.height = this.height
        canvas.width = this.width
        // context gemaakt 
        this.gl = canvas.getContext('webgl2')
        // fall back normaal gezien ook maken --> anders webgl --> anders 2d (gebruik framework)
    }

        // shaders zie map glsl
        createShaders() {
            const gl = this.gl
            this.vertexShader = this.createShader(gl.VERTEX_SHADER)
            this.fragmentShader = this.createShader(gl.FRAGMENT_SHADER)
        }

        createShader(type) {
            const gl = this.gl
            let source 
            switch (type) {
                case gl.VERTEX_SHADER:
                    source = this.shaderSources.vertex
                    break
                case gl.FRAGMENT_SHADER:
                    source = this.shaderSources.fragment
                    break
                default: 
                    console.error("Shader type does not exist")
            }

            const shader = gl.createShader(type)
            gl.shaderSource(shader, source)
            gl.compileShader(shader)

            const succes = gl.getShaderParameters(shader, gl.COMPILE_STATUS)
            if (success){
                console.log('success')
                return shader
            }
            console.error(type, gl.getShaderInfoLog(shader))
            gl.deleteShader(shader)
        }

        createProgram() {
            const gl = this.gl

            const program = gl.createProgram()
            gl.attachShader(program, this.vertexShader)
            gl.attachShader(program, this.fragmentShader)
            gl.linkProgram(program)

            // controleren als het gelukt is
            const success = gl.getProgramParameter(program, gl.LINK_STATUS)
            if (success) {
                this.program = program
            } else {
                console.error(gl.getProgramInfoLog) 
                gl.deleteProgram(program)
            }
        }

            createBuffers(){
                const gl = this.gl
                const program = this.program

                // Raw data for buffers
                const colors = []
                const positions = []

                /* Position buffer */
                const positionBuffer = gl.createBuffer()
                // tussen haakjes moet => (type, buffer_zelf)
                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
                // buffer opgevuld met ruwe data
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW) // float meegeven en array van maken

                // zie vertex-shader.glsl
                const positionAttributeLocation = gl.getAttribLocation(program, 'a_VertexPosition')

                gl.enableVertexAttribArray(positionsAttributeLocation)
                {
                    const size = 2
                    const type = gl.FLOAT
                    const normalized = false
                    const stride = 0
                    const offset = 0
                    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalized, stride, offset)
                }

                /* Color buffer */
                const colorBuffer = gl.createBuffer()
                // tussen haakjes moet => (type, buffer_zelf)
                gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
                // buffer opgevuld met ruwe data
                gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW) // int meegeven en array van maken

                const colorAttributeLocation = gl.getAttribLocation(program, 'a_VertexColor')
                gl.enableVertexAttribArray(positionsAttributeLocation)
                {
                    const size = 4
                    const type = gl.INT
                    const normalized = true
                    const stride = 0
                    const offset = 0
                    gl.vertexAttribPointer(colorAttributeLocation, size, type, normalized, stride, offset)
                }

                // virtuele wereld zien
                gl.view(0,0, gl.canvas.width, gl.canvas.height)
                gl.clearColor(0, 0, 0, 0)
                gl.clear(gl.COLOR_BUFFER_BIT)
                gl.useProgram(program)

                const vertexArray = gl.createVertexArray()
                gl.bindVertexArray(vertexArray)
                {
                    const mode = gl.POINTS
                    const first = 0
                    const count = position.length / 2
                    gl.drawArrays(mode, first, count)
                }
            }
}
    

