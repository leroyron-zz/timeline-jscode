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
        ctx.timeline.addon.timeframe.switchToTimeFrameThrusting()
        system = new System()// start new system and start the down-line
                        //   .Pointer()// the pointer such as a mouse or touch
                        //   .Knob()// the pointer moves the knob
                             .Subject()// node/object collection
                                    // .Marquee()// pointer, knob and/or subjects draw marquee
                                       .Grid()// the grid prepares the matrices to render textiles, boundaries, particles and collisions
                                              .Parallax()// exploits grid data and cuts out necessary data for optimization, rendering and other various uses
                                                    //   .Entity()// node/object collection optimized by parallax
                                                    //   .Physic()// chained physics optimized by parallax
                                                         .Bound()// utilizes the parallax exploits to resolve and utilize boundary matrices
                                                    //   .Collision()// utilizes the parallax exploits to resolve and utilize collision matrices
                                                                //   .Particle()// entitys could emit particles, particle generation and behaviors affected by physics, boundaries and collisions
                                                                //   .Rig()// rigging behaviors affected by entitys, physics, boundaries and collisions
    }

    ctx.timeline.addon.timeframe.process = function () {
        ctx.process(this.access, this.frame._duration, this._timeFrame, this.lapse)// before timeFrame process
    }

    ctx.process = function (access, duration, timeFrame, lapse) {

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

        var bind = ctx[stream].addon.binding
        var buffer = ctx.timeline.addon.buffer
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
