var Authority = new function (timeline, timeframe, buffer, binding, app) {
    this.segmentID = 350

    this.main = function () {
        timeframe.switchToTimeFrameThrusting(this.segmentID)
        timeline.revertFromTo(1040, this.segmentID)// 850 - 10 // lapse
        buffer.zeroOut('timeline', this.segmentID, timeline.length)
    }
    return this
}(this.ctx.timeline, this.ctx.timeline.addon.timeframe, this.ctx.timeline.addon.buffer, this.ctx.timeline.addon.binding, this.canvas.app)
