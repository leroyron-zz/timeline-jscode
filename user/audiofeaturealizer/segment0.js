window.Authority = new function (camera, timeframe, buffer, binding) {
    this.segmentID = 0

    this.main = function () {
        timeframe.stop(0)// stop at frame 0
    }
    return this
}(this.ctx.camera, this.ctx.timeline.addon.timeframe, this.ctx.timeline.addon.buffer, this.ctx.timeline.addon.binding)
