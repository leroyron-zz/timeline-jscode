window.Authority = new function (app, timeline, timeframe, buffer, binding, ctx) {
    this.segmentID = 2000

    this.currentColor = [242, 114, 128]
    this.nextColor = [248, 177, 146]
    this.diffColor = Math.Poly.subtract(this.currentColor, this.nextColor)

    this.enterFrame = function (This, duration) {
        let change = ((duration - 2000) / (2190 - 2000))
        let changeColor = Math.Poly.subtract(This.currentColor, Math.Poly.multiplyScalar(This.diffColor, change))
        this.fillStyle = 'rgb(' + (changeColor[0] << 0) + ', ' + (changeColor[1] << 0) + ', ' + (changeColor[2] << 0) + ')'
        this.fillRect(0, 0, app.width, app.height)
        // console.log('Segment ' + this.segment.segmentID + '\'s context')
    }

    this.main = function () {
        // ASSIGN
        ctx.segment = this
        ctx.enterFrame = this.enterFrame

        timeframe.invoke = function () {
            ctx.calc(this.lapse, this.access)// before render
            ctx.enterFrame(ctx.segment, this.frame.duration) // this segment's renders
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
