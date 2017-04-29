window.Authority = new function (camera, timeframe, buffer, binding, nodes) {
    this.segmentID = 1978

    this.main = function () {
        var isGameDone = window.ctx.isGameDone
        if (isGameDone) {
            timeframe.clearRuntimeAuthority('action', 978)
            buffer.eval('timeline',
                [
                    [
                        [camera.position], [[['x', 200]]], [['easeOutSine', 222]], this.segmentID// start from current frame
                    ]
                ],
            true)// true for relative values for timeframe thursting
        }
    }
    return this
}(this.ctx.camera, this.ctx.timeline.addon.timeframe, this.ctx.timeline.addon.buffer, this.ctx.timeline.addon.binding, this.ctx.scene.nodes)
