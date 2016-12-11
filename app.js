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
    var controls

    function init () {
        // LIGHTS
        var ambient = new THREE.AmbientLight(0x666666)
        ctx.scene.add(ambient)
        var directionalLight = new THREE.DirectionalLight(0xFFEEDD)
        directionalLight.position.set(0, 70, 100).normalize()
        ctx.scene.add(directionalLight)

        directionalLight = new THREE.DirectionalLight(0xBFA475)
        directionalLight.position.set(0, -70, -100).normalize()
        ctx.scene.add(directionalLight)

        // CONTROLS
        controls = new THREE.OrbitControls(ctx.camera, canvas.renderer.domElement)
        controls.addEventListener('change', ctx.rendering) // add this only if there is no animation loop (requestAnimationFrame)
        controls.enableDamping = true
        controls.dampingFactor = 0.25
        controls.enableZoom = true
    }

    ctx.timeline.addon.timeframe.invoke = function () {
        ctx.calc()
        ctx.rendering()
        ctx.compute()
    }

    ctx.calc = function () {
        if (ctx.scene.nodes.craft1) {
            controls.target = ctx.scene.nodes.craft1.position
        }
        if (ctx.scene.nodes.starwall) {
            ctx.scene.nodes.starwall.material.materials[0].map.offset.x += 0.002
        }
    }

    ctx.compute = function () {
        controls.update() // required if controls.enableDamping = true, or if controls.autoRotate = true
    }

    ctx.rendering = function () {
        canvas.renderer.render(ctx.scene, ctx.camera)
    }

    this.SetupContextBindsForStream = function () {
        // DATA
        // make a stream for buffing
        app.codeLoc = 'user/' + app.codesetting
        app.fileLocAssets = app._fileLocal + app.codeLoc + '/assets/'
        setupCameraBindings('timeline')
        createParticles()
    }

    init()

    function setupCameraBindings (stream) {
        ctx.timeline.addon.binding(stream, [
        [ctx.camera.position, 800]
        ],
            [
            ['x', 0],
            ['y', 0],
            ['z', 10]
            ],
        [801, 802, 803],
        false)

        ctx.timeline.addon.buffer.eval(stream,
            [
                                                                    // even out formula ( stream.length / (displacements * eases ) )
                                                                    //                              1000 / (3 * 2) = 166
                [[ctx.camera.position], [['y', 140], ['y', -280], ['y', 140]], [['easeInSine', 166], ['easeOutSine', 166]]], // remainder 6 added to ['easeOutSine', 100 + 6 = 106] >
                [[ctx.camera.position], [['x', 200]], [['easeOutSine', 215]], -10]// *true/*1 will blend over ^ the last set (166) by offsetting
                                                                                  // otherwise offset of *x (10)
            ], false)
    }


    this.createGfxs = function () {
        // SCENE
        ctx.scene.nodes = {}
        createScene('starwall',
            {x: 0, y: 0, z: 0},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'starwall.json',
            true,
            false
            )

        createScene('earth',
            {x: 0, y: 0, z: 0},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'earth.json',
            true,
            false
            )

        createScene('moon',
            {x: 0, y: 0, z: 0},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'moon.json',
            true,
            false
            )

        createScene('craft1',
            {x: 0, y: 0, z: -1},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'craft1.json',
            false,
            true
            )

        createScene('craft2',
            {x: 1, y: -1, z: -1},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'craft2.json',
            true,
            true
            )

        createScene('craft3',
            {x: -1, y: -1, z: -1},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'craft3.json',
            true,
            true
            )
    }

    var nodeLoadCount = {entry: 0, finish: 0}
    function createScene (node, position, scale, model, buff, doubleSide) {
        // instantiate a loader
        var loader = new THREE.JSONLoader()

        var object

        nodeLoadCount.entry++
        // load a resource
        loader.load(
            // resource URL
            model,
            // Function when resource is loaded
            function (geometry, materials) {
                if (buff) {
                    geometry = new THREE.BufferGeometry().fromGeometry(geometry)
                }
                var material = new THREE.MultiMaterial(materials)
                object = new THREE.Mesh(geometry, material)
                object.doubleSided = doubleSide
                object.position.copy(position)
                object.scale.copy(scale)

                ctx.scene.add(object)

                ctx.scene.nodes[node] = object

                nodeLoadCount.finish++
                if (nodeLoadCount.entry == nodeLoadCount.finish) {
                    ctx.timeline.addon.timeframe._init() // timeframe init has to be set to true for additional scripts to load
                }
            },
            // Function called when download progresses
            function (xhr) {
                // console.log((xhr.loaded / xhr.total * 100) + '% loaded')
            },
            // Function called when download errors
            function (xhr) {
                // console.log('An error happened')
            }
        )
    }

    function createParticles () {
        var geometries = []
        var textureLoader = new THREE.TextureLoader()

        var sprite1 = textureLoader.load(app.fileLocAssets + 'sprites/star1.png')
        geometries.push(randomVerticies(24))
        var sprite2 = textureLoader.load(app.fileLocAssets + 'sprites/star2.png')
        geometries.push(randomVerticies(36))
        var sprite3 = textureLoader.load(app.fileLocAssets + 'sprites/star3.png')
        geometries.push(randomVerticies(48))
        var sprite4 = textureLoader.load(app.fileLocAssets + 'sprites/star4.png')
        geometries.push(randomVerticies(60))
        var sprite5 = textureLoader.load(app.fileLocAssets + 'sprites/star5.png')
        geometries.push(randomVerticies(72))

        function randomVerticies (reach) {
            var geometry = new THREE.Geometry()
            for (let i = 0; i < 100; i++) {
                var vertex = new THREE.Vector3()
                vertex.x = Math.random() * reach * 2 - reach
                vertex.y = Math.random() * reach * 2 - reach
                vertex.z = Math.random() * reach * 2 - reach

                geometry.vertices.push(vertex)
            }
            return geometry
        }

        var parameters = [
            [ [1.0, 0.2, 0.5], sprite2, Math.random() * 1 ],
            [ [0.95, 0.1, 0.5], sprite3, Math.random() * 1 ],
            [ [0.90, 0.05, 0.5], sprite1, Math.random() * 1 ],
            [ [0.85, 0, 0.5], sprite5, Math.random() * 1 ],
            [ [0.80, 0, 0.5], sprite4, Math.random() * 1 ]
        ]

        var src = [ 'ZeroFactor', 'OneFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor', 'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor' ]
        //          '200'         '201'        '204'             '205'                     '206'             '207'                     '208'             '209'                     '210'
        var dst = [ 'ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor' ]
        //          '200'         '201'        '208'             '203'                     '204'             '205'                     '206'             '207'
        var blending = 'CustomBlending'

        var materials = []
        for (let i = 0; i < parameters.length; i++) {
            let color = parameters[i][0]
            let sprite = parameters[i][1]
            let size = parameters[i][2]
            materials[i] = new THREE.PointsMaterial({
                size: size,
                map: sprite,
                blending: THREE[blending],
                blendSrc: THREE[src[2]],
                blendDst: THREE[dst[6]],
                blendEquation: THREE.AddEquation,
                depthTest: true,
                depthWrite: false,
                transparent: true
            })
            materials[i].color.setHSL(color[0], color[1], color[2])

            var particles = new THREE.Points(geometries[i], materials[i])
            particles.rotation.x = Math.random() * 6
            particles.rotation.y = Math.random() * 6
            particles.rotation.z = Math.random() * 6
            particles.sortParticles = true

            ctx.scene.add(particles)
        }
    }
}(this.app, this.THREE, this.canvas, this.ctx)
