var Authority = function (timeframe = window.ctx.timeline.addon.timeframe || {}, buffer = window.ctx.timeline.addon.buffer || {}, binding = window.ctx.timeline.addon.binding || {}) {
    this.segmentID = 1978
    var camera = window.ctx.camera

    this.main = function () {
        var isGameDone = window.ctx.isGameDone
        if (isGameDone) {
            camera.controls.enabled = true
            timeframe.clearRuntimeAuthority('action', 978)
            buffer.eval('timeline',
                [
                    [
                        [camera.position], [['x', 200]], [['easeOutSine', 222]], this.segmentID// start from current frame
                    ]
                ],
            true)// true for relative values for timeframe thursting
        }
    }
    return this
}
