var Authority = new function (camera, timeframe, buffer, binding, nodes) {
    this.segmentID = 0
    var last = camera.position.y + 140 - 280
    buffer.eval('timeline',
        [
                                                                // even out formula ( stream.length / (displacements * eases ) )
            [                                                   //                                 1000 / (3 * 2) = 166
                [camera.position], [[['y', 140], ['y', -280], ['y', camera.position.y - last]]], [['easeInSine', 1000 / (3 * 2)], ['easeOutSine', 1000 / (3 * 2)]]//, *offset
            ]
        ],
    false)// false for non-relative values for timeframe reading

    buffer.eval('timeline',
        [
            [
                [nodes.earth.rotation], [[['y', 360]]], [['linear', 978]]
            ]
        ],
    false)

    buffer.eval('timeline',
        [
            [
                [nodes.moon.rotation], [[['y', 360]]], [['linear', 978]]
            ]
        ],
    false)

    this.main = function () {
        timeframe.stop(0)// stop at frame 0
    }
    return this
}(this.ctx.camera, this.ctx.timeline.addon.timeframe, this.ctx.timeline.addon.buffer, this.ctx.timeline.addon.binding, this.ctx.scene.nodes)
