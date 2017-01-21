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

        ctx.camera.lookAt(ctx.camera.orbital.position)
        // calculations taken into action insert
        // Ref: action978.js
        /*

        */
    }

    ctx.compute = function () {
        // compute taken into action insert
        // Ref: action978.js
        /*

        */
    }

    ctx.rendering = function () {
        canvas.renderer.render(ctx.scene, ctx.camera)
    }

    this.SetupContextBindsForStreamAndBuildAfterLoad = function () {
        // DATA
        // make a stream for buffing
        app.codeLoc = 'user/' + app.codesetting
        app.fileLocAssets = app._fileLocal + app.codeLoc + '/assets/'
        createThumbControls()
        createGfxsAndBind('timeline')
        this.createParticles()
    }

    function createThumbControls () {
        ctx.controller = {
            joy: {
                left: {id: 0, x: 0, y: 0, pad: canvas.app.canvasSprite(0.43, 0.43, -0.66, -0.66, 0, true, ['LRevolvingLable.png']), knob: canvas.app.canvasSprite(0.25, 0.25, -0.66, -0.66, 0, true, ['knob.png'])},
                right: {id: 1, x: 0, y: 0, pad: canvas.app.canvasSprite(0.43, 0.43, 0.66, -0.66, 0, true, ['RShiftingLable.png']), knob: canvas.app.canvasSprite(0.25, 0.25, 0.66, -0.66, 0, true, ['knob.png'])}
            }
        }
        ctx.controller.joy.left.pad.material.uniforms.alpha.value =
        ctx.controller.joy.left.knob.material.uniforms.alpha.value =
        ctx.controller.joy.right.pad.material.uniforms.alpha.value =
        ctx.controller.joy.right.knob.material.uniforms.alpha.value = 0
    }

    init()

    function setupCameraPropertiesAndBindings (stream) {
        var craft = ctx.scene.nodes.craft1
        var camera = ctx.camera
        camera.orbital = canvas.app.sceneSprite(1, 0, 0, 0, 'sprites/orbital.png')
        camera.orbital.reticle = canvas.app.canvasSprite(0.2, 0.2, 0, 0, 0, false, ['sprites/reticle.png'])
        camera.orbital.reticle.material.uniforms.alpha.value = 0
        camera.orbital.reticle.tee = canvas.app.canvasSprite(0.2, 0.2, 0, 0, 0, false, ['sprites/tee.png', 'sprites/teedir.png'])
        camera.orbital.reticle.tee.material.uniforms.alpha.value = 0

        camera.direction = new THREE.Vector3(0, 0, -1).applyQuaternion(craft.quaternion)
        camera.orbital.offset = [-25, -25, -25]
        camera.offset = new THREE.Vector3().fromArray(camera.orbital.offset).multiply(camera.direction)
        // camera.direction.fromArray([0, 0, -1]).applyQuaternion(camera.quaternion)
        // camera.offset.fromArray(camera.orbital.offset).multiply(camera.direction)

        camera.move = new THREE.Vector3()
        camera.move.copy(camera.orbital.position)
        camera.move.add(camera.offset)
        camera.position.copy(camera.move)
        camera.lookAt(camera.orbital.position)

        ctx.timeline.addon.binding(stream, [
        [camera.position, 884] // unique key (position)
        ],
            [
            ['x', camera.move.x],
            ['y', camera.move.y],
            ['z', camera.move.z]
            ],
        [801, 802, 803],
        false)

        ctx.timeline.addon.binding(stream, [
        [camera.rotation, 885] // unique key (rotation)
        ],
            [
            ['x', Math.degrees(camera.rotation.x)],
            ['y', Math.degrees(camera.rotation.y)],
            ['z', Math.degrees(camera.rotation.z)]
            ],
        [804, 805, 806],
        false)

        ctx.timeline.addon.binding(stream, [
        [camera.orbital.position, 886] // unique key (position)
        ],
            [
            ['x', 0],
            ['y', 0],
            ['z', 0]
            ],
        [801, 802, 803],
        false)

        /*
        ctx.timeline.addon.binding(stream, [
        [camera.orbital.rotation, -1] // rotation - Dead Bind key (no rotation)
        ],
            [
            ['x', 0],
            ['y', 0],
            ['z', 0]
            ],
        [804, 805, 806],
        false)
        */

        // Buffing is done during runtime user/game1/segment0.js
    }

    function createGfxsAndBind (stream) {
        console.log('Binding objects to stream - Starting')
        // SCENE
        createSceneMeshNodeFromJSONForInit(ctx.scene, 'starwall',
            {x: 0, y: 0, z: 0},
            {x: 0, y: 0, z: 0},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'starwall.json',
            true,
            false,
            stream,
            undefined, // no position binding
            undefined // no rotation binding
            )

        createSceneMeshNodeFromJSONForInit(ctx.scene, 'earth',
            {x: -20, y: 25, z: -67},
            {x: 0, y: 0, z: 0},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'earth.json',
            true,
            false,
            stream,
            // -1, // position - Dead Bind key (no translation until change)
            undefined,
            891 // unique key (rotation)
            )

        createSceneMeshNodeFromJSONForInit(ctx.scene, 'moon',
            {x: 14, y: 45, z: 60},
            {x: 0, y: 0, z: 0},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'moon.json',
            true,
            false,
            stream,
            // -1, // position - Dead Bind key (no translation until change)
            undefined,
            893 // unique key (rotation)
            )

        createSceneMeshNodeFromJSONForInit(ctx.scene, 'craft1',
            {x: 0, y: 0, z: -10}, // don't buff position
            {x: random360(), y: random360(), z: random360()},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'craft1.json',
            true,
            true,
            stream,
            undefined,
            undefined,
            function (craft) {
                setupCameraPropertiesAndBindings(stream)
                var camera = ctx.camera

                craft.quaternion.copy(camera.quaternion)
                craft.direction = new THREE.Vector3(0, 0, -1).applyQuaternion(craft.quaternion)
                craft.orbital = {offset: [-15, -15, -15]}
                craft.offset = new THREE.Vector3().fromArray(craft.orbital.offset).multiply(craft.direction)
                // craft.direction.fromArray([0, 0, -1]).applyQuaternion(craft.quaternion)
                // craft.offset.fromArray(craft.orbital.offset).multiply(craft.direction)
                craft.move = new THREE.Vector3()
                craft.move.copy(camera.position)
                craft.move.sub(craft.offset)
                craft.position.copy(craft.move)

                // craft.lookAt(camera.orbital.position)

                ctx[stream].addon.binding(stream, [
                [craft.position, 894]
                ],
                    [
                    ['x', craft.move.x],
                    ['y', craft.move.y],
                    ['z', craft.move.z]
                    ],
                [801, 802, 803],
                false)

                ctx[stream].addon.binding(stream, [
                [craft.rotation, 895]
                ],
                    [
                    ['x', Math.degrees(craft.rotation.x)],
                    ['y', Math.degrees(craft.rotation.y)],
                    ['z', Math.degrees(craft.rotation.z)]
                    ],
                [804, 805, 806],
                false)

                createSceneMeshNodeFromJSONForInit(craft, 'CTorch',
                    {x: 0, y: 0, z: 0},
                    {x: 0, y: 0, z: 0},
                    {x: 1, y: 1, z: 0.01},
                    app.fileLocAssets + 'CTorch.json',
                    true,
                    true,
                    stream,
                    undefined,
                    undefined,
                    function (torch) {
                        torch.material.materials[0].blendDst = 206
                        torch.material.materials[0].blendSrc = 204
                        torch.material.materials[0].blendEquation = 100
                        torch.material.materials[0].blending = 5
                    }// assign material blend
                )

                createSceneMeshNodeFromJSONForInit(craft, 'LTorch',
                    {x: -4250, y: 460, z: 3760},
                    {x: 0, y: 0, z: 0},
                    {x: 0.01, y: 1, z: 1},
                    app.fileLocAssets + 'LTorch.json',
                    true,
                    true,
                    stream,
                    undefined,
                    undefined,
                    function (torch) {
                        torch.material.materials[0].blendDst = 206
                        torch.material.materials[0].blendSrc = 204
                        torch.material.materials[0].blendEquation = 100
                        torch.material.materials[0].blending = 5
                    }// assign material blend
                )

                createSceneMeshNodeFromJSONForInit(craft, 'RTorch',
                    {x: 4250, y: 460, z: 3760},
                    {x: 0, y: 0, z: 0},
                    {x: 0.01, y: 1, z: 1},
                    app.fileLocAssets + 'RTorch.json',
                    true,
                    true,
                    stream,
                    undefined,
                    undefined,
                    function (torch) {
                        torch.material.materials[0].blendDst = 206
                        torch.material.materials[0].blendSrc = 204
                        torch.material.materials[0].blendEquation = 100
                        torch.material.materials[0].blending = 5
                    }// assign material blend
                )

                // particle blasts
                ctx.scene.paperPieceSprites = storeTextures(['sprites/paperPiece1.png', 'sprites/paperPiece2.png', 'sprites/paperPiece3.png'])
                console.log('Binding particles to stream - Starting')
                for (let p = 0; p < 200; p++) {
                    let randSprites = Math.floor(random3())
                    createScenePointNode(ctx.scene, 'paper_particle' + p, Math.random() + 0.2,
                    {x: p, y: p, z: p},
                    ctx.scene.paperPieceSprites[randSprites],
                    stream,
                    900 + p // position
                    )
                }
                console.log('Finished Binding particles to stream')
            }// callback binding
            )

        createSceneMeshNodeFromJSONForInit(ctx.scene, 'craft2',
            {x: 10, y: -10, z: -10},
            {x: random360(), y: random360(), z: random360()},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'craft2.json',
            true,
            true,
            stream,
            896,
            897 // unique
            )

        createSceneMeshNodeFromJSONForInit(ctx.scene, 'craft3',
            {x: -10, y: -10, z: -10},
            {x: random360(), y: random360(), z: random360()},
            {x: 1, y: 1, z: 1},
            app.fileLocAssets + 'craft3.json',
            true,
            true,
            stream,
            898,
            899 // unique
            )

        function random360 () {
            return Math.random() * 360
        }
        function random3 () {
            return Math.random() * 3
        }
    }

    var nodeLoadCount = {entry: 0, finish: 0}
    function createSceneMeshNodeFromJSONForInit (addTo, node, position, rotation, scale, model, buff, doubleSide, stream, bindPositionID, bindRotationID, callback) {
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
                // object.position.divideScalar(Math.Type.precision('translation'))
                object.rotation.fromArray([
                    Math.radians(rotation.x),
                    Math.radians(rotation.y),
                    Math.radians(rotation.z)
                ])

                object.scale.copy(scale)

                addTo.add(object)

                if (!addTo.nodes) addTo.nodes = {}// put all scene object/nodes in here during loadtime

                addTo.nodes[node] = object

                if (callback) callback(object)

                bindNodeToStream(stream, node, addTo, position, bindPositionID, rotation, bindRotationID)

                nodeLoadCount.finish++
                if (nodeLoadCount.entry == nodeLoadCount.finish) {
                    // build stream and prebuff from the binding DATA
                    console.log('Finished Binding to stream - Building')
                    ctx.timeline.build(function () {
                        console.log('Finished Building - Initializing')
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

    function bindNodeToStream (stream, node, addTo, position, bindPositionID, rotation, bindRotationID) {
        if (bindPositionID) {
            ctx[stream].addon.binding(stream, [
            [addTo.nodes[node].position, bindPositionID]
            ],
                [
                ['x', position.x],
                ['y', position.y],
                ['z', position.z]
                ],
            [801, 802, 803],
            false)
        }

        if (bindRotationID) {
            ctx[stream].addon.binding(stream, [
            [addTo.nodes[node].rotation, bindRotationID]
            ],
                [
                ['x', rotation.x],
                ['y', rotation.y],
                ['z', rotation.z]
                ],
            [804, 805, 806],
            false)
        }

        // Optimize rotation callbacks for THREE - bindId releasing 806 (streaming.addon.runtime.timeframe.js)
        // perform the rotation callback only on z change only bindkey 806
        addTo.nodes[node].rotation.onChange(function () {
            if (!this.blockCallback) {
                this.blockCallback = true
                addTo.nodes[node].quaternion.setFromEuler(this, false)
            }
        })
    }

    var storeTextures = function (urls) {
        var textureLoader = new THREE.TextureLoader()

        var textures = []
        for (var u = 0, ulen = urls.length; u < ulen; u++) {
            textures.push(textureLoader.load(app.fileLocAssets + urls[u]))
        }

        return textures
    }

    var createScenePointNode = function (addTo, node, size, position, sprite, stream, bindPositionID, callback) {
        // instantiate a loader
        var geometry = new THREE.Geometry()
        var vertex = new THREE.Vector3().copy(position)
        vertex.divideScalar(Math.Type.precision('translation'))
        geometry.vertices.push(vertex)

        var src = [ 'ZeroFactor', 'OneFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor', 'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor' ]
        //          '200'         '201'        '204'             '205'                     '206'             '207'                     '208'             '209'                     '210'
        var dst = [ 'ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor' ]
        //          '200'         '201'        '208'             '203'                     '204'             '205'                     '206'             '207'
        var blending = 'CustomBlending'

        var object = new THREE.Points(geometry, new THREE.PointsMaterial({
            size: size,
            map: sprite,
            blending: THREE[blending],
            blendSrc: THREE[src[2]],
            blendDst: THREE[dst[6]],
            blendEquation: THREE.AddEquation,
            depthTest: true,
            depthWrite: false,
            transparent: true,
            opacity: 0.1
        }))

        ctx.scene.add(object)

        addTo.add(object)

        if (!addTo.nodes) addTo.nodes = {}// put all scene object/nodes in here during loadtime

        addTo.nodes[node] = object

        if (callback) callback(object)

        bindNodeToStream(stream, node, addTo, position, bindPositionID)
    }

    this.createParticles = function () {
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

        if (!ctx.scene.nodes) ctx.scene.nodes = {}// put all scene object/nodes in here during loadtime

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

    this.canvasSprite = function (width, height, x, y, z, aspect, urls) {
        aspect = aspect ? app.width / app.height : 1
        height = aspect * height

        var sprites = storeTextures(urls)

        var shader = {
            vertexToScreen: [
                'varying vec2 vUv;' +

            'void main() {' +
                'gl_Position = modelMatrix * vec4(position, 1.0);' +
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

        var object = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            new THREE.ShaderMaterial({
                uniforms: {texture: {type: 't', value: sprites[0]}, alpha: {type: 'f', value: 1.0}},
                vertexShader: shader.vertexToScreen,
                fragmentShader: shader.fragment,
                blending: THREE[blending],
                blendSrc: THREE[src[2]],
                blendDst: THREE[dst[6]],
                blendEquation: THREE.AddEquation,
                depthTest: false,
                depthWrite: true,
                transparent: true,
                clipIntersection: true

            })
        )
        object.position.copy({x: x, y: y, z: z})
        object.sprites = sprites
        object.frustumCulled = false
        object.doubleSided = true
        ctx.scene.add(object)

        object.clip = {}
        object.clip.onresizeCallBack = function () {
            this.normal = {x: x, y: y, width: width, height: height}
            x = (x + 1) / 2
            y = (y + 1) / 2
            this.width = app.width * width
            this.height = app.height * height
            this.x = app.width * x
            this.y = app.height - (app.height * y)
        }
        object.clip.onresizeCallBack()
        window.resizeCalls.push(object.clip.onresizeCallBack)

        return object
    }

    this.sceneSprite = function (size, x, y, z, url) {
        var textureLoader = new THREE.TextureLoader()

        var sprite = textureLoader.load(app.fileLocAssets + url)

        var geometry = new THREE.Geometry()
        var vertex = new THREE.Vector3(x, y, z)
        geometry.vertices.push(vertex)

        var src = [ 'ZeroFactor', 'OneFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor', 'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor' ]
        //          '200'         '201'        '204'             '205'                     '206'             '207'                     '208'             '209'                     '210'
        var dst = [ 'ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor' ]
        //          '200'         '201'        '208'             '203'                     '204'             '205'                     '206'             '207'
        var blending = 'CustomBlending'

        var object = new THREE.Points(geometry, new THREE.PointsMaterial({
            size: size,
            map: sprite,
            blending: THREE[blending],
            blendSrc: THREE[src[2]],
            blendDst: THREE[dst[6]],
            blendEquation: THREE.AddEquation,
            depthTest: true,
            depthWrite: false,
            transparent: true
        }))

        ctx.scene.add(object)

        return object
    }
}(this.app, this.THREE, this.canvas, this.ctx)
