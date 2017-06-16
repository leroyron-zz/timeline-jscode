window.Authority = new function (timeline, timeframe, buffer, binding, ctx) {
    this.segmentID = 500

    this.enterFrame = function (duration) {
        console.log('Segment ' + this.segment + '\'s context')
    }

    this.main = function () {
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
}(this.ctx.timeline, this.ctx.timeline.addon.timeframe, this.ctx.timeline.addon.buffer, this.ctx.timeline.addon.binding, this.ctx)
