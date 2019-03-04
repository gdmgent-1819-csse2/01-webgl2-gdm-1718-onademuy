import Tests from './Tests/maths.js'
import Canvas from './Library/Canvas.js'

export default class Application
{
    constructor()
    {
        const tests = false
        if (tests) {
            new Tests()
        }
        console.log('WebGL2 demo')

        // object aanmaken met bronnen
        this.shaderSources = {
            fragment: null,
            vertex: null,
        }

        this.preloader()
    }

    // aantal bestanden vooraf inlezen voor je ze nodig hebt zodat ze er direct zijn als je ze nodig hebt
    async preloader() { // progr w uitgevoerd, preloader w gestart en we gaan wachten tot we de fetch hebben uitgevoerd
        console.log('Preloader')
        await fetch('assets/glsl/vertex-shader.glsl')
            .then(source => this.shaderSources.vertex = source) // tekst die in bestand staat
            .catch(error => console.error(error.message))
        await fetch('assets/glsl/fragment-shader.glsl')
            .then(source => this.shaderSources.fragment = source) // tekst die in bestand staat
            .catch(error => console.error(error.message))
    }

    run() {
        new Canvas(document.body.clientWidth, 
            document.body.clientHeight, 
            this.shaderSources)
    }
}