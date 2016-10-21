window.canvas.app = new function (app, THREE, canvas, ctx, gui, Streaming, EaseingBuffer) {
    // Creates a new canvas module , and returns the reference to
    // the newly created canvas Mod

    // Public
    this.width = app.resolution.width
    this.height = app.resolution.height
    this.compositeScale = (app.width + app.height) / (app.resolution.width + app.resolution.height)
    this.resolution = function (app) {
        // Screen resize adjustments
        this.width = app.resolution.width
        this.height = app.resolution.height
        this.compositeScale = (app.resolution.width + app.resolution.height) / (app.width + app.height)
    }

    // Private
    var controls, zmesh

    var cinematic = {
        segments:
                [{length: 34400}]
    }

    // Get the streaming class
    var streams = new Streaming()

    init()

    function init () {
        // LIGHTS
        var ambient = new THREE.AmbientLight(0x666666)
        ctx.scene.add(ambient)
        var directionalLight = new THREE.DirectionalLight(0xffeedd)
        directionalLight.position.set(0, 70, 100).normalize()
        ctx.scene.add(directionalLight)

        // CONTROLS
        controls = new THREE.OrbitControls(ctx.camera, canvas.renderer.domElement)
        controls.addEventListener('change', render) // add this only if there is no animation loop (requestAnimationFrame)
        controls.enableDamping = true
        controls.dampingFactor = 0.25
        controls.enableZoom = true

        // DATA
        // make a stream for buffing
        // eslint-disable-next-line new-cap
        ctx.camera.streams = new streams.buffer()

        // Gather the easing buffers constructors
        ctx.camera.buffers = {}
        ctx.camera.buffers.easing = new EaseingBuffer()
        // prepare bindings first
        setupCameraBindings()
        setupUniformBindings()
        setupElementBindings()
        // setup bindings to stream
        ctx.camera.streams.setup(ctx.camera.streams.runtime.forward)
        window.app.stream.access = ctx.camera.streams.access(true, 0, 0, true, 0, -999, false)
        // bindings to stream

        // GRAPHICS
        createGfxs()

        // SCENE
        var loader = new THREE.JSONLoader()
        var callbackKey = function (geometry) {
            createScene(geometry, 0, 0, 12000, 15, 'assets/memoryplane.png')
        }
        loader.load('memoryplane2.js', callbackKey)
    }

    function setupCameraBindings () {
        ctx.camera.streams.bindings('forward', [
        [ctx.camera.position, 800]
        ], // return all part/nodes
            [
            ['x', -4200, 4200],
            ['y', 910, 1480],
            ['z', 81572, -297114]
            ], // < Production [[793,0],[794,50],[795,0]],
        [801, 802, 803], // < Production (Remove)
        cinematic.segments[0].length, // 24 seconds held in memory for chaining till allocation of input data,
        true)
    }
    // All stream lengths have to match <> !!!cinematic.segments[0].length!!! because of parallel stream
    function setupUniformBindings () {
        var loader = new THREE.TextureLoader()
        ctx.scene.farlight = new THREE.Group()
        ctx.scene.farlight.position.set(-110, 0, ctx.camera.position.z - 18360)
        ctx.scene.farlight.scale.set(100, 100, 100)
        ctx.scene.add(ctx.scene.farlight)

        ctx.scene.farlight.uniforms = {}
        ctx.scene.farlight.uniforms.red = {texture: { type: 't', value: loader.load('assets/red.png') }, alpha: {type: 'f', value: 1.0}}
        ctx.scene.farlight.uniforms.glare = {texture: { type: 't', value: loader.load('assets/glare.png') }, alpha: {type: 'f', value: 0.3}}
        ctx.scene.farlight.uniforms.green = {texture: { type: 't', value: loader.load('assets/green.png') }, alpha: {type: 'f', value: 1.0}}
        ctx.scene.farlight.uniforms.darklayer = {texture: { type: 't', value: loader.load('assets/darklayer.png') }, alpha: {type: 'f', value: 1.0}}
        ctx.scene.farlight.uniforms.bluelayer = {texture: { type: 't', value: loader.load('assets/bluelayer.png') }, alpha: {type: 'f', value: 1.0}}
        ctx.scene.farlight.control = {}
        ctx.scene.farlight.uniforms.alphas = ctx.camera.streams.bindings('forward', [
        [ctx.scene.farlight.uniforms.alphas, 804]
        ], // return all part/nodes
            [
            ['darklayer', 1500], // allow higher numbers for percision for longer durations
            ['glare', 1000],
            ['light', 1000]
            ], // < Production [[793,0],[794,50],[795,0]],
        [805, 806, 807], // < Production (Remove)
        cinematic.segments[0].length, // 24 seconds held in memory for chaining till allocation of input data,
        true)
        ctx.camera.buffers.easing.buff([ctx.scene.farlight.uniforms.alphas[0], ctx.camera.streams.runtime, 'forward', 'darklayer', 'linear', -700], 500, true)
    }

    function setupElementBindings () {
        ctx.scene.gui = {}
        ctx.scene.gui.slider = ctx.camera.streams.bindings('forward', [
        [document.getElementsByClassName('seek')[0], 808]
        ], // return all part/nodes
            [
            ['left', 0, cinematic.segments[0].length]
            ], // < Production [[793,0],[794,50],[795,0]],
        [809], // < Production (Remove)
        cinematic.segments[0].length, // 24 seconds held in memory for chaining till allocation of input data,
        true)
    }

    function createGfxs () {
        var shader = {
            vertexToScreen: [
                'varying vec2 vUv;' +

            'void main() {' +
                'gl_Position = vec4(position, 1.0);' +
                'vUv = uv;' +
            '}'].join('\n'),

            vertexToDistance: [
                'varying vec2 vUv;' +

            'void main() {' +
                'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);' +
                'vUv = uv;' +
            '}'].join('\n'),

            fragment: [
                'varying vec2 vUv;' +
            'uniform sampler2D texture;' +
            'uniform float alpha;' +

            'void main() {' +
                'gl_FragColor = texture2D(texture, vec2(vUv)) * alpha;' +
            '}'].join('\n')}
        var src = [ 'ZeroFactor', 'OneFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor', 'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor' ]
        //          '200'         '201'        '204'             '205'                     '206'             '207'                     '208'             '209'                     '210'
        var dst = [ 'ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor' ]
        //          '200'         '201'        '208'             '203'                     '204'             '205'                     '206'             '207'
        var blending = 'CustomBlending'

        var red = new THREE.Mesh(
            new THREE.PlaneGeometry(200, 200),
            new THREE.ShaderMaterial({
                uniforms: ctx.scene.farlight.uniforms.red,
                vertexShader: shader.vertexToDistance,
                fragmentShader: shader.fragment,
                transparent: true,
                blending: THREE[blending],
                blendSrc: THREE[src[2]],
                blendDst: THREE[dst[6]],
                blendEquation: THREE.AddEquation,
                depthTest: false
            })
        )
        ctx.scene.farlight.add(red)

        ctx.scene.farlight.control.glare = new THREE.Mesh(
            new THREE.PlaneGeometry(200, 200),
            new THREE.ShaderMaterial({
                uniforms: ctx.scene.farlight.uniforms.glare,
                vertexShader: shader.vertexToDistance,
                fragmentShader: shader.fragment,
                transparent: true,
                blending: THREE[blending],
                blendSrc: THREE[src[2]],
                blendDst: THREE[dst[3]],
                blendEquation: THREE.AddEquation,
                depthTest: false
            })
        )
        ctx.scene.farlight.control.glare.position.set(-25, 25, 0)
        ctx.scene.farlight.add(ctx.scene.farlight.control.glare)

        var green = new THREE.Mesh(
            new THREE.PlaneGeometry(200, 200),
            new THREE.ShaderMaterial({
                uniforms: ctx.scene.farlight.uniforms.green,
                vertexShader: shader.vertexToDistance,
                fragmentShader: shader.fragment,
                transparent: true,
                blending: THREE[blending],
                blendSrc: THREE[src[2]],
                blendDst: THREE[dst[6]],
                blendEquation: THREE.AddEquation,
                depthTest: false
            })
        )
        ctx.scene.farlight.add(green)

        // Dark Layer
        var darklayer = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            new THREE.ShaderMaterial({
                uniforms: ctx.scene.farlight.uniforms.darklayer,
                vertexShader: shader.vertexToScreen,
                fragmentShader: shader.fragment,
                transparent: true,
                depthTest: false
            })
        )
        ctx.scene.farlight.add(darklayer)
    }

    function createScene (geometry, x, y, z, scale, tmap) {
        var loader = new THREE.TextureLoader()
        // load a resource
        loader.load(
            // resource URL
            tmap,
            // Function when resource is loaded
            function (texture) {
                // do something with the texture
                // debugger;
                var material = new THREE.MeshLambertMaterial({
                    map: texture,
                    depthTest: false
                })

                zmesh = new THREE.Mesh(geometry, material)
                zmesh.position.set(x, y, z)
                zmesh.scale.set(25, scale, 25)
                ctx.scene.add(zmesh)

                zmesh.geometry.boundingSphere.radius *= 25
                streams.runtimeframes()
            },
            // Function called when download progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded')
            },
            // Function called when download errors
            function (xhr) {
                console.log('An error happened')
            }
        )
    }
    streams.update = function () {
        // Work values passed to the node properties
        // Work on the application process/calculate and make decision before next render
        calc()
        // render

        render()
        compute(arguments[0])
    }

    var calc = function () {
        if (ctx.scene.gui.slider[0].left) {
            ctx.scene.gui.slider[0].style.left = ctx.scene.gui.slider[0].left / cinematic.segments[0].length * 100 + '%'
        }
        if (ctx.scene.farlight.uniforms.alphas[0].darklayer) {
            ctx.scene.farlight.uniforms.darklayer.alpha.value = ctx.scene.farlight.uniforms.alphas[0].darklayer / 1000
        }
        if (ctx.scene.farlight) {
            ctx.scene.farlight.position.z = ctx.camera.position.z - 18360
        }

        if (zmesh) {
            if (ctx.camera.position.z < zmesh.position.z + zmesh.geometry.boundingSphere.radius / 2) {
                controls.target = ctx.scene.farlight.position
                zmesh.position.z -= (zmesh.geometry.boundingSphere.radius + 8000)
            }
        }
    }

    var compute = function () {
        this._duration = this._duration | 0
        this._duration += arguments[0]

        if (ctx.scene.farlight && streams.running) {
            // red.rotation.x += 0.1;
            gui.appSRuntimeThrust.setValue(arguments[0])
            gui.appSRuntimeMeasure.setValue(0)
            gui.appSBDuration.setValue(this._duration + 'sec/ms')
            if (
                (this._duration > 0 && this._duration < 600) ||
                (this._duration > 4500 && this._duration < 4910) ||
                (this._duration > 10000 && this._duration < 10400) ||
                (this._duration > 13000 && this._duration < 13300) ||
                (this._duration > 14300 && this._duration < 14670) ||
                (this._duration > 21000 && this._duration < 21350) ||
                (this._duration > 31900 && this._duration < 32200)
                ) {
                window.app.stream.buffer.evals += 48
                gui.appSBufferEvals.setValue(window.app.stream.buffer.evals)
            }
        }
    }

    function render () {
        canvas.renderer.render(ctx.scene, ctx.camera)
    }
}(window.app, window.THREE, window.canvas, window.ctx, window.gui, window.streaming, window.easeingBuffer)
