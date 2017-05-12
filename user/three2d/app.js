this.canvas.app = new function (app, THREE, canvas, ctx) {
    // Public
    this.width = app.resolution.width
    this.height = app.resolution.height
    this.resolution = function (app) {
        // Screen resize adjustments
        this.width = app.resolution.width
        this.height = app.resolution.height
    }
    this.resolution(app)

    // Private
    var System = ctx.timeline.addon.runtime.system
    var system

    function init () {
        // ctx.timeline.addon.timeframe.switchToTimeFrameThrusting()
        system = new System()// start new system and start the down-line
                             .Pointer()// the pointer such as a mouse or touch moves the cursor
                        //   .Knob()// the pointer moves the knob, knob moves the cursor
                        //   .Subject()// node/object moves the cursor
                                    // .Marquee()// cursor draws the marquee
                                       .Grid()// the grid prepares the matrices to render textiles, boundaries, particles and collisions depending on cursor location
                                              .Parallax()// exploits grid data and cuts out necessary data for optimization, rendering and other various uses
                                                         .Entity()// node/object collection optimized by parallax
                                                    //   .Physic()// chained physics optimized by parallax
                                                    //   .Bound()// utilizes the parallax exploits to resolve and utilize boundary matrices
                                                    //   .Collision()// utilizes the parallax exploits to resolve and utilize collision matrices
                                                                //   .Particle()// entitys could emit particles, particle generation and behaviors affected by physics, boundaries and collisions
                                                                //   .Rig()// rigging behaviors affected by entitys, physics, boundaries and collisions

        system.Pointer
        .bind(app.pointers, canvas.node)
        .result(function (pointer) {
            console.log(JSON.stringify(pointer))
        })
        .init()

        var textureLoader = new THREE.TextureLoader()
        var jsonLoader = new THREE.JSONLoader()
        canvas.app.layers = // could store grid layers
        system.Grid
        .mode('2d')
        .dir(app.fileLocAssets + 'optimal/')
        .batches('foreground', 'ground', 'nearground', 'background')
        .offsets({x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0})
        .properties({name: 'tile', count: 9, columns: 3, width: 2048, height: 1024})
        .syntax(function (i) {
            var output = {
                image: this.dir + this.batch.name + '/' + this.name + i + '.png',
                model: this.dir + 'plane' + 0 + '.json'
            }
            return output
        })
        .assign(function (output, i, batch, column, row, properties, tile) {
            var textile = textureLoader.load(
            output.image, function (texture) {
                jsonLoader.load(
                output.model, function (geometry) {
                    geometry = new THREE.BufferGeometry().fromGeometry(geometry)
                    Math.Poly.multiplyScalarVector(geometry.attributes.position.array, {x: texture.tile.width / 2, y: texture.tile.height / 2})
                    var material = new THREE.MeshBasicMaterial({map: texture,
                        // uniforms: {texture: {type: 't', value: sprites[0]}, alpha: {type: 'f', value: 1.0}},
                        // vertexShader: shader.vertex,
                        // fragmentShader: shader.fragment,
                        // blending: THREE[Utils.Blend.blending],
                        // blendSrc: THREE[Utils.Blend.src[2]],
                        // blendDst: THREE[Utils.Blend.dst[6]],
                        // blendEquation: THREE.AddEquation,
                        // depthTest: false,
                        // depthWrite: true,
                        // side: THREE.DoubleSide,
                        transparent: true
                    })
                    var mesh = new THREE.Mesh(geometry, material)

                    texture.tile.position = {
                        x: texture.tile.column * texture.tile.width,
                        y: -texture.tile.row * texture.tile.height,
                        z: -texture.tile.batch.index * 200}
                    mesh.position.copy(texture.tile.position)

                    ctx.scene.add(mesh)
                    texture.tile = mesh
                },
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded')
                },
                // Function called when download errors
                function (xhr) {
                    console.log('An error happened')
                })
            },
            // Function called when download progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded')
            },
            function (xhr) {
                console.log('An error happened')
            })

            var scale = batch.index / 3 + 0.66
            scale = scale < 1 ? 1 : scale * scale
            tile.width = properties.width * scale
            tile.height = properties.height * scale
            tile.name = 'tile' + i
            tile.row = row
            tile.column = column
            tile.batch = batch

            textile.tile = tile
            return textile
        })
        .init()

        // all ready 3D no need for parallax
        // system.Parallax
        // .subject(canvas.app.pointer)
        // .constrain('XY')
        // .fields(layers)
        // .separation(1.25, 1, 0.75, 0.50)
        // .init()
    }

    ctx.timeline.addon.timeframe.process = function () {
        ctx.process(this.access, this._timeFrame, this.lapse)// before timeFrame process
    }

    ctx.process = function (access, timeFrame, lapse) {

    }

    ctx.timeline.addon.timeframe.invoke = function () {
        ctx.calc(this.lapse, this.access)// before render
        ctx.rendering(this._timeFrame)
        ctx.compute()// after render
    }

    ctx.calc = function (lapse, access) {

    }

    ctx.rendering = function (timeFrame) {
        canvas.renderer.render(ctx.scene, ctx.camera)
    }

    ctx.compute = function () {

    }

    this.SetupContextBindsForStreamAndBuildAfterLoad = function () {
        app.codeLoc = 'user/' + app.codesetting
        app.fileLocAssets = app.vscode._fileLocal + app.codeLoc + '/assets/'
        init()
        createGFXBindNodesToStream('timeline')
        buildStream()
    }

    function createGFXBindNodesToStream (stream) {
        console.log('Binding objects to stream - Starting')

        var bind = ctx[stream].addon.binding

        // LIGHTS
        var ambient = new THREE.AmbientLight(0x666666)
        ctx.scene.add(ambient)
        var directionalLight = new THREE.DirectionalLight(0xFFEEDD)
        directionalLight.position.set(0, 70, 100).normalize()
        ctx.scene.add(directionalLight)

        directionalLight = new THREE.DirectionalLight(0xBFA475)
        directionalLight.position.set(0, -70, -100).normalize()
        ctx.scene.add(directionalLight)

        var camera = ctx.camera

        bind(stream, [
        [camera.position, 800]
        ],
            [
            ['x', 0, 8500],
            ['y', -1400, 100],
            ['z', 600]
            ],
        [801, 802, 803]/*,
         false * streaming has default */)
    }

    this.sceneTile = function (url, size, x, y, z) {
        var textureLoader = new THREE.TextureLoader()

        var sprite = textureLoader.load(app.fileLocAssets + url,
            function () {}, // Function called when download progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded')
            },
            // Function called when download errors
            function (xhr) {
                console.log('An error happened')
            })

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
    function buildStream (stream) {
        // build stream and prebuff from the binding DATA
        console.log('Finished Binding to stream - Building')
        ctx.timeline.build(function () {
            console.log('Finished Building - Initializing')
            ctx.timeline.addon.timeframe._init(window) // timeframe init has to be set to true for additional scripts to load
        })
    }
}(this.app, this.THREE, this.canvas, this.ctx)
