import Vector2 from './Math/Vector2.js'

export default class Canvas {
    constructor(width, height, shaderSources) {
        this.height = height
        this.shaderSources = shaderSources
        this.width = width

        this.colors = {
            black: [0, 0, 0, 0],
            blue: [0, 0, 255, 0],
            cyan: [0, 255, 255, 0],
            green: [0, 255, 0, 0],
            magenta: [255, 0, 255, 0],
            red: [255, 0, 0, 0],
            white: [255, 255, 255, 0],
            yellow: [255, 255, 0, 0],
        }

        this.data = {
            color: [],
            positions: [],
        }

        this.gl = null
        this.program = null
        this.run()

        window.addEventListener('updateCanvas', event => {
            this.updateCanvas(event)
        }, false);

        setInterval(() =>{
            this.updateCanvas(event)
        }, 500) //om de halve seconde updaten
    }

    updateCanvasHandler(event) {
        console.log('updateCanvas')
        this.clearData()

        // White point in the middle
        this.data.positions.push(0, 0)
        this.data.colors.push(...this.colors.white)

        const v = new Vector2(.5, 0)
        this.data.positions.push(v.x, v.y)
        this.data.colors.push(...this.colors.red)

        const s = new Vector2(0, 0.6)
        this.data.positions.push(s.x, s.y)
        this.data.colors.push(...this.colors.black)

        const m = new Vector2(0, 0.5)
        this.data.positions.push(m.x, m.y)
        this.data.colors.push(...this.colors.black)

        const h = new Vector2(0, 0.3)
        this.data.positions.push(h.x, h.y)
        this.data.colors.push(...this.colors.black)

        const date = new Date()
        const Seconds = date.getSeconds()
        const Minutes = date.getMinutes()
        const Hours = date.getHours()

        const colors = [
            'green',
            'blue',
            'cyan',
            'magenta',
            'yellow',
        ]

        colors.forEach(color => {
            v.rot(45)
            this.data.positions.push(v.x, v.y)
            this.data.colors.push(...this.colors[color])
        });

        this.drawScene()
    }

    // methode die canvas doet werken
    run() {
        try {
            this.createCanvas()
            this.createShaders()
            this.createProgram()
            this.createVertexArray()
            // Initial drawing on the canvas
            {
                // Random points
                for (let i = 0, max = 100000; i < max; i++) {
                    this.data.positions.push(Math.random() * 2 - 1, Math.random() * 2 - 1)
                    this.data.colors.push(Math.round(Math.random() * 255), Math.round(Math.random() * 255), Math.round(Math.random() * 255), 0)
                }
                // White point in the middle.
                this.data.positions.push(0, 0)
                this.data.colors.push(...this.colors.white)
            }
            this.drawScene()

        } catch (error){
        console.error(error)
        }
    }

    clearData() {
        this.data = {
            colors: [],
            positions: [],
        }
    }

    createBuffers() {
        this.createBuffer('COLOR')
        this.createBuffer('POSITION')
    }

    createBuffer(bufferType) {
        const gl = this.gl
        const program = this.program

        let name // Name of attribute used in GLSL.
        let normalized // Should it be normalized to a value between 0 and 1.
        let size // Number of components per vertex attribute, can be 1 through 4.
        let srcData
        let type // Datatype.
        const stride = 0 // 0 = move forward size * sizeof(type) each iteration to get the next position.
        const offset = 0 // Start at the beginning of the buffer.

        switch (bufferType) {
            case 'COLOR':
                name = 'a_VertexColor'
                normalized = true
                size = 4
                srcData = new Uint8Array(this.data.colors)
                type = gl.UNSIGNED_BYTE // Integer from 0 through 255.
                break
            case 'POSITION':
                name = 'a_VertexPosition'
                normalized = false
                size = 2
                srcData = new Float32Array(this.data.positions)
                type = gl.FLOAT
                break
            default:
                return null
        }
        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, srcData, gl.STATIC_DRAW)

        const index = gl.getAttribLocation(program, name)
        gl.enableVertexAttribArray(index)
        gl.vertexAttribPointer(index, size, type, normalized, stride, offset) // @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
    }

    createCanvas() {
        const canvas = document.createElement('canvas')
        document.body.appendChild(canvas)
        canvas.height = this.height
        canvas.width = this.width
        const gl = this.gl = canvas.getContext('webgl2')
        gl.clearColor(0, 0, 0, 0) // @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/clearColor
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height) // @see https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/viewport
    }
/*
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
    */

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

    createVertexArray(){
        const gl = this.gl

        const vertexArray = gl.createVertexArray()
        gl.bindVertexArray(vertexArray)
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
/*
    createBuffers(){
        const gl = this.gl
        const program = this.program

        // Raw data for buffers
        const colors = []
        const positions = []

        /* Position buffer 
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

        /* Color buffer 
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
    } */

    drawScene(){
        const gl = this.gl

        this.createBuffers()

        gl.clear(gl.COLOR_BUFFER_BIT) 

        const modes = [ 
            gl.POINTS,
            gl.LINES,
            gl.LINE_STRIP,
            gl.LINE_LOOP,
            gl.TRIANGLES,
            gl.TRIANGLE_STRIP,
            gl.TRIANGLE_FAN,
        ]

        const dimensions = 2
        const mode = modes[0]
        const first = 0
        const count = this.data.positions.length / dimensions
        gl.drawArrays(mode, first, count)        
    }
}
    

