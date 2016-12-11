var Authority = function (timeline = window.ctx.timeline || {}, timeframe = window.ctx.timeline.addon.timeframe || {}, buffer = window.ctx.timeline.addon.buffer || {}, binding = window.ctx.timeline.addon.binding || {}, ctx = window.ctx || {}) {
    this.segmentID = 978

    this.main = function () {
        timeframe.stop()
    }
    return this
}
