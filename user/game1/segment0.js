var Authority = function (timeframe = window.ctx.timeline.addon.timeframe || {}, buffer = window.ctx.timeline.addon.buffer || {}, binding = window.ctx.timeline.addon.binding || {}, nodes = window.ctx.scene.nodes || {}) {
    this.segmentID = 0
    var camera = window.ctx.camera

    buffer.eval('timeline',
        [
                                                                // even out formula ( stream.length / (displacements * eases ) )
            [                                                   //                                 1000 / (3 * 2) = 166
                [camera.position], [[['y', 140], ['y', -280], ['y', 140]]], [['easeInSine', 1000 / (3 * 2)], ['easeOutSine', 1000 / (3 * 2)]]//, *offset
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
        camera.controls.enabled = true
        timeframe.stop(0)// stop at frame 0
    }
    return this
}
