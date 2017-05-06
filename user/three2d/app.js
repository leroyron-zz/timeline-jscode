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
    var variable

    function init () {

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
        var camera = ctx.camera
        camera.foreground = canvas.app.sceneTile('foreground.png', 3, 3, 1, 0, 0, 0)
        camera.ground = canvas.app.sceneTile('ground.png', 3, 3, 1, 0, 0, 0)
        camera.background = canvas.app.sceneTile('background.png', 3, 3, 1, 0, 0, 0)
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
