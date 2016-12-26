var Authority = new function (timeline, timeframe, buffer, binding, nodes, ctx) {
    // segment
    this.segmentID = 978

    this.main = function (pos) {
        timeframe.switchToTimeFrameThrusting(this.segmentID)
        timeline.revertFromTo(1978, this.segmentID)// 1978 is the third segment

        // To-Do copy and assign binding values
        // var allkeys = binding.copy('timeline')
        buffer.zeroOut('timeline', this.segmentID, timeline.length)// zero out data from this segment till the end
                                                                  // to prepare for timeframe thrusting
        // binding.assign('timeline', allkeys)

        buffer.eval('timeline',
            [
                [
                    [nodes.earth.rotation], [[['y', 360]]], [['linear', 1000]]// buff from current frame this.segmentID
                ]
            ],
        true)

        buffer.eval('timeline',
            [
                [
                    [nodes.moon.rotation], [[['y', -360]]], [['linear', 1000]]
                ]
            ],
        true)
    }
    return this
}(this.ctx.timeline, this.ctx.timeline.addon.timeframe, this.ctx.timeline.addon.buffer, this.ctx.timeline.addon.binding, this.ctx.scene.nodes, this.ctx)
