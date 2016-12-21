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
        ctx.camera.controls = new THREE.OrbitControls(ctx.camera, canvas.renderer.domElement)
        ctx.camera.controls.addEventListener('change', ctx.rendering) // add this only if there is no animation loop (requestAnimationFrame)
        ctx.camera.controls.enableDamping = true
        ctx.camera.controls.dampingFactor = 0.25
        ctx.camera.controls.enableZoom = true
    }

    ctx.timeline.addon.timeframe.invoke = function () {
        ctx.calc()// before render
        ctx.rendering()
        ctx.compute()// after render
    }

    ctx.calc = function () {
        if (ctx.scene.nodes.starwall) {
            ctx.scene.nodes.starwall.material.materials[0].map.offset.x += 0.002
        }
        if (ctx.camera.controls.enabled) {
            ctx.camera.controls.target = ctx.scene.nodes.craft1.position
            ctx.camera.controls.update() // required if ctx.camera.controls.enableDamping = true, or if ctx.camera.controls.autoRotate = true
        } else {
            // Ref: action978.js

            /*

             */
            ctx.camera.lookAt(ctx.scene.nodes.craft1.position)
        }
    }

    ctx.compute = function () {
        
    }

    ctx.rendering = function () {
        canvas.renderer.render(ctx.scene, ctx.camera)
    }

    this.SetupContextBindsForStreamAndBuildAfterLoad = function () {
        // DATA
        // make a stream for buffing
        app.codeLoc = 'user/' + app.codesetting
        app.fileLocAssets = app._fileLocal + app.codeLoc + '/assets/'
        ctx.scene.nodes = {}// put all scene object/nodes in here during loadtime
        createParticlesAndBind()
        setupCameraBindings('timeline')
        createGfxsAndBind('timeline')
    }

    init()

    function setupCameraBindings (stream) {
        ctx.timeline.addon.binding(stream, [
        [ctx.camera.position, 884]// unique
        ],
            [
            ['x', 0],
            ['y', 0],
            ['z', 5]
            ],
        [801, 802, 803],
        false)

        /*ctx.timeline.addon.binding(stream, [
        [ctx.camera.rotation, 885]// unique
        ],
            [
            ['x', 0],
            ['y', 0],
            ['z', 0]
            ],
        [804, 805, 806],
        false)*/

        // Buffing is done during runtime user/game1/segment0.js
    }

    function createGfxsAndBind (stream) {
        // SCENE
        createScene('starwall',
            {x: 0, y: 0, z: 0},
            {x: 0, y: 0, z: 0},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'starwall.json',
            true,
            false,
            stream,
            886// unique
            )

        createScene('earth',
            {x: -20, y: 25, z: -67},
            {x: 0, y: 0, z: 0},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'earth.json',
            true,
            false,
            stream,
            887// unique
            )

        createScene('moon',
            {x: 14, y: 45, z: 60},
            {x: 0, y: 0, z: 0},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'moon.json',
            true,
            false,
            stream,
            888// unique
            )

        createScene('craft1',
            {x: 0, y: 0, z: -10},
            {x: 0, y: 0, z: 0},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'craft1.json',
            false,
            true,
            stream,
            889// unique
            )

        createScene('craft2',
            {x: 10, y: -10, z: -10},
            {x: 0, y: 0, z: 0},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'craft2.json',
            true,
            true,
            stream,
            890// unique
            )

        createScene('craft3',
            {x: -10, y: -10, z: -10},
            {x: 0, y: 0, z: 0},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'craft3.json',
            true,
            true,
            stream,
            891// unique
            )
    }

    var nodeLoadCount = {entry: 0, finish: 0}
    function createScene (node, position, rotation, scale, model, buff, doubleSide, stream, bindId) {
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
                object.scale.copy(scale)

                ctx.scene.add(object)

                ctx.scene.nodes[node] = object

                ctx.timeline.addon.binding(stream, [
                [ctx.scene.nodes[node].position, bindId]
                ],
                    [
                    ['x', position.x],
                    ['y', position.y],
                    ['z', position.z]
                    ],
                [801, 802, 803],
                false)

                ctx.timeline.addon.binding(stream, [
                [ctx.scene.nodes[node].rotation, bindId + nodeLoadCount.entry]
                ],
                    [
                    ['x', doubleSide ? Math.random() * 360 : rotation.x],
                    ['y', doubleSide ? Math.random() * 360 : rotation.y],
                    ['z', doubleSide ? Math.random() * 360 : rotation.z]
                    ],
                [804, 805, 806],
                false)

                // Optimize rotation callbacks for THREE - bindId releasing 806 (streaming.addon.runtime.timeframe.js)
                ctx.scene.nodes[node].rotation.onChange(function () {
                    if (!this.blockCallback) {
                        this.blockCallback = true
                        ctx.scene.nodes[node].quaternion.setFromEuler(this, false)
                    }
                })

                nodeLoadCount.finish++
                if (nodeLoadCount.entry == nodeLoadCount.finish) {
                    // build stream and prebuff from the binding data
                    ctx.timeline.build(function () {
                        ctx.timeline.addon.timeframe._init() // timeframe init has to be set to true for additional scripts to load
                    })
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

    function createParticlesAndBind () {
        var geometries = []
        var textureLoader = new THREE.TextureLoader()

        var sprite1 = textureLoader.load(app.fileLocAssets + 'sprites/star1.png')
        geometries.push(randomVerticies(240))
        var sprite2 = textureLoader.load(app.fileLocAssets + 'sprites/star2.png')
        geometries.push(randomVerticies(360))
        var sprite3 = textureLoader.load(app.fileLocAssets + 'sprites/star3.png')
        geometries.push(randomVerticies(480))
        var sprite4 = textureLoader.load(app.fileLocAssets + 'sprites/star4.png')
        geometries.push(randomVerticies(600))
        var sprite5 = textureLoader.load(app.fileLocAssets + 'sprites/star5.png')
        geometries.push(randomVerticies(720))

        ctx.scene.nodes['starcluster'] = geometries

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
            [ [1.0, 0.2, 0.5], sprite2, Math.random() * 10 ],
            [ [0.95, 0.1, 0.5], sprite3, Math.random() * 10 ],
            [ [0.90, 0.05, 0.5], sprite1, Math.random() * 10 ],
            [ [0.85, 0, 0.5], sprite5, Math.random() * 10 ],
            [ [0.80, 0, 0.5], sprite4, Math.random() * 10 ]
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
