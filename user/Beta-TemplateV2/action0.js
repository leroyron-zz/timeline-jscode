window.Authority = new function (app, canvas, ctx, System, THREE) {
    this.actionID = 0

    this.main = function () {
        debugger
        ctx.timeline.addon.timeframe.stop()
    }
    return this
}(this.app, this.canvas, this.ctx, this.ctx.timeline.addon.runtime.system, this.THREE)
