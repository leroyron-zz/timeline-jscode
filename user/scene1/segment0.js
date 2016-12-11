var Authority = function (Streaming = window.gui.addon.Streaming || {}, timeframe = window.ctx.timeline.addon.timeframe || {}, buffer = window.ctx.timeline.addon.buffer || {}, binding = window.ctx.timeline.addon.binding || {}) {
    this.segmentID = 0

    this.main = function () {
        // Streaming.runtime.access
        timeframe.stop(1)
    }
    return this
}
