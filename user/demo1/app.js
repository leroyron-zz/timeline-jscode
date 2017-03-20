this.canvas.app = new function (app, canvas, ctx) {

    // Public
    this.width = app.resolution.width
    this.height = app.resolution.height
    this.resolution = function (app) {
        // Screen resize adjustments
        canvas.node.width = this.width = app.width
        canvas.node.height = this.height = app.height
    }

    // Private
    var sun = new Image();
    var moon = new Image();
    var earth = new Image();

    function init () {
        // preload during pageload
        sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
        moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
        earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
    }

    ctx.timeline.addon.timeframe.invoke = function () {
        ctx.calc()// before render
        ctx.rendering()
        ctx.compute()// after render
    }

    ctx.calc = function () {
        
    }

    ctx.rendering = function () {
        ctx.globalCompositeOperation = 'destination-over';
        ctx.clearRect(0, 0, 300, 300); // clear canvas

        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
        ctx.save();
        ctx.translate(150, 150);

        // Earth
        ctx.rotate(earth.nodes[0].rotation);
        ctx.translate(105, 0);
        ctx.fillRect(0, -12, 50, 24); // Shadow
        ctx.drawImage(earth, -12, -12);

        // Moon
        ctx.save();
        ctx.rotate(moon.nodes[0].rotation);
        ctx.translate(0, 28.5);
        ctx.drawImage(moon, -3.5, -3.5);
        ctx.restore();

        ctx.restore();
        
        ctx.beginPath();
        ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
        ctx.stroke();
        
        ctx.drawImage(sun, 0, 0, 300, 300);
    }

    ctx.compute = function () {

    }

    this.SetupContextBindsForStreamAndBuildAfterLoad = function () {
        app.codeLoc = 'user/' + app.codesetting
        app.fileLocAssets = app._fileLocal + app.codeLoc + '/assets/'
        createGFXBindNodesToStream('timeline')
        buildStream()
    }

    init()

    function createGFXBindNodesToStream(stream) {
        console.log('Binding objects to stream - Starting');

        earth.nodes = ctx[stream].addon.binding(stream, [
        [undefined, 804]
        ],
            [
            ['rotation', 0]
            ],
        [801],
        false)

        moon.nodes = ctx[stream].addon.binding(stream, [
        [undefined, 805]
        ],
            [
            ['rotation', 0]
            ],
        [802],
        false)

        var buffer = ctx.timeline.addon.buffer
        buffer.eval('timeline',
        [
            [
                [earth.nodes[0]], [[['rotation', 360]]], [['linear', 2200]]
            ]
        ],
        false)

        buffer.eval('timeline',
        [
            [
                [moon.nodes[0]], [[['rotation', 1080]]], [['linear', 2200]]
            ]
        ],
        false)
        
    }
    function buildStream(stream) {
        // build stream and prebuff from the binding DATA
        console.log('Finished Binding to stream - Building')
        ctx.timeline.build(function () {
            console.log('Finished Building - Initializing')
            ctx.timeline.addon.timeframe._init() // timeframe init has to be set to true for additional scripts to load
        })
    }
}(this.app, this.canvas, this.ctx)
