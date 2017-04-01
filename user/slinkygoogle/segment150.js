var Authority = new function (timeline, timeframe, buffer, binding) {
    this.segmentID = 150

    this.main = function () {
        timeline.revertFromTo(840, this.segmentID)
    }
    return this
}(this.ctx.timeline, this.ctx.timeline.addon.timeframe, this.ctx.timeline.addon.buffer, this.ctx.timeline.addon.binding)
