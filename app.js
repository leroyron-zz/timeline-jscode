this.canvas.app = new function (app, THREE, canvas, ctx) {
    // Creates a new canvas module , and returns the reference to
    // the newly created canvas Mod

    // Public
    this.width = app.resolution.width
    this.height = app.resolution.height
    this.resolution = function (app) {
        // Screen resize adjustments
        this.width = app.resolution.width
        this.height = app.resolution.height
    }

    // Private
    var controls, zmesh

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
    }

    ctx.timeline.addon.timeframe.invoke = function () {
        calc()
        render()
        compute()
    }

    var calc = function () {
        if (ctx.scene.farlight) {
            ctx.scene.farlight.position.z = ctx.camera.position.z - 18360
        }

        if (zmesh) {
            if (ctx.camera.position.z - zmesh.position.z > 83379) {
                zmesh.position.z = ctx.camera.position.z
            }
            if (ctx.camera.position.z < zmesh.position.z + zmesh.geometry.boundingSphere.radius / 2) {
                controls.target = ctx.scene.farlight.position
                zmesh.position.z -= (zmesh.geometry.boundingSphere.radius + 8000)
            }
        }
    }

    var compute = function () {
        // controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    }

    function render () {
        canvas.renderer.render(ctx.scene, ctx.camera)
    }

    this.SetupContextBindsForStream = function () {
        // DATA
        // make a stream for buffing
        setupCameraBindings('timeline')
        setupUniformBindings('timeline')
    }

    function setupCameraBindings (stream) {
        ctx.timeline.addon.binding(stream, [
        [ctx.camera.position, 800]
        ],
            [
            ['x', -4200, 4200],
            ['y', 910, 1480],
            ['z', 81572, -297114]
            ],
        [801, 802, 803],
        false)

        ctx.timeline.addon.binding(stream, [
        [ctx.camera.rotation, 804]
        ],
            [
            ['x', 0],
            ['y', 0],
            ['z', 0]
            ],
        [805, 806, 807],
        false)

        // update precision for easing to 1000 (default:100 = choppy rotations :/)
        // Change all ease precision
        // ctx.timeline.addon.buffer.ease.precisions = 200
        // ctx.timeline.addon.buffer.ease.update()
        ctx.timeline.addon.buffer.eval(stream, [[ctx.camera.rotation], [['z', 70], ['z', -140], ['z', 70]], [['easeInSine', 166], ['easeOutSine', 166]]], false, 166)
                                                                    // To flood stream:
                                                                    // duration/precision formula ( stream.length / (displacements * eases ) )
                                                                    //                              1000 / (3 * 2) = 166
    }
    // All stream lengths have to match <> !!!ctx.timeline.length!!! because of parallel stream
    function setupUniformBindings (stream) {
        var loader = new THREE.TextureLoader()
        ctx.scene.farlight = new THREE.Group()
        ctx.scene.farlight.position.set(-110, 0, ctx.camera.position.z - 18360)
        ctx.scene.farlight.scale.set(100, 100, 100)
        ctx.scene.add(ctx.scene.farlight)

        ctx.scene.farlight.uniforms = {}
        ctx.scene.farlight.uniforms.red = {texture: { type: 't', value: loader.load(app._fileLocal + 'assets/red.png') }, alpha: {type: 'f', value: 1.0}}
        ctx.scene.farlight.uniforms.glare = {texture: { type: 't', value: loader.load(app._fileLocal + 'assets/glare.png') }, alpha: {type: 'f', value: 0.3}}
        ctx.scene.farlight.uniforms.green = {texture: { type: 't', value: loader.load(app._fileLocal + 'assets/green.png') }, alpha: {type: 'f', value: 1.0}}
        ctx.scene.farlight.uniforms.darklayer = {texture: { type: 't', value: loader.load(app._fileLocal + 'assets/darklayer.png') }, alpha: {type: 'f', value: 1.0}}
        ctx.scene.farlight.control = {}

        ctx.timeline.addon.binding(stream, [
        [ctx.scene.farlight.uniforms.darklayer.alpha, 808]
        ], // return all part/nodes
            [
            ['value', 1500],
            ['need', 0],
            ['to', 0]
            ],
        [809, 810, 811],
        false)

        ctx.timeline.addon.binding(stream, [
        [ctx.scene.farlight.uniforms.glare.alpha, 810],
        [ctx.scene.farlight.uniforms.red.alpha, 811],
        [ctx.scene.farlight.uniforms.green.alpha, 812]
        ], // return all part/nodes
            [
            ['value', 500],
            ['make', 0],
            ['dynamic', 0]
            ],
        [809, 810, 811],
        false)

        ctx.timeline.addon.buffer.eval(stream, [[ctx.scene.farlight.uniforms.darklayer.alpha], [['value', -700]], [['linear', 1000]]], false, 200)
    }

    this.createGfxs = function () {
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

        var loader = new THREE.TextureLoader()

        var geometry = new THREE.PlaneGeometry(200, 200)
        var red = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
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

        geometry = new THREE.PlaneGeometry(200, 200)
        ctx.scene.farlight.control.glare = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
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

        geometry = new THREE.PlaneGeometry(200, 200)
        var green = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
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
        geometry = new THREE.PlaneGeometry(2, 2)
        var darklayer = new THREE.Mesh(geometry, new THREE.ShaderMaterial({
            uniforms: ctx.scene.farlight.uniforms.darklayer,
            vertexShader: shader.vertexToScreen,
            fragmentShader: shader.fragment,
            transparent: true,
            depthTest: false
        })
            )
        ctx.scene.farlight.add(darklayer)

        // SCENE
        loader = new THREE.JSONLoader()
        var callbackKey = function (geometry) { createScene(geometry, 0, 0, 12000, 15, app._fileLocal + 'assets/memoryplane.png') }
        loader.load(app._fileLocal + 'assets/memoryplane.js', callbackKey)
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
                var material = new THREE.MeshLambertMaterial({
                    map: texture,
                    depthTest: false
                })

                zmesh = new THREE.Mesh(geometry, material)
                zmesh.position.set(x, y, z)
                zmesh.scale.set(25, scale, 25)
                ctx.scene.add(zmesh)

                zmesh.geometry.boundingSphere.radius *= 25
                window.addEventListener('keyup', function (e) {
                    ctx.timeline.addon.timeframe.keyPauseToggle(e)
                }
                )
                ctx.timeline.addon.timeframe.init() // timeframe ready has to be set to true for additional scripts to load
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
}(this.app, this.THREE, this.canvas, this.ctx)
