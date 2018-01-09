window.Authority = new function (app, timeline, timeframe, buffer, binding, ctx) {
    this.segmentID = 461

    this.enterFrame = function (duration) {
        // context
    }

    this.main = function () {
        debugger
        timeframe.stop()
        // ASSIGN
        ctx.segment = this.segmentID
        ctx.enterFrame = this.enterFrame

        timeframe.invoke = function () {
            ctx.calc(this.lapse, this.access)// before render
            ctx.enterFrame(this.frame.duration) // this segment's renders
            ctx.rendering(this._timeFrame)
            ctx.compute()// after render
        }

        // OVERRIDES
        // ctx.calc = function (lapse, access) {}
        // ctx.rendering = function (timeFrame) {}
        // ctx.compute = function () {}

        /*
        timeframe.process = function () {
            ctx.process(this.access, this.frame._duration, this._timeFrame, this.lapse)// before timeFrame process
        }
        // ctx.process = function (access, duration, timeFrame, lapse) {} * override
        */

        // UPDATE
        timeframe.update()
    }
    return this
}(this.app, this.ctx.timeline, this.ctx.timeline.addon.timeframe, this.ctx.timeline.addon.buffer, this.ctx.timeline.addon.binding, this.ctx)
