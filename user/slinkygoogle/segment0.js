var Authority = new function (camera, timeframe, buffer, binding, app) {
    this.segmentID = 0

    buffer.eval('timeline',
    [
        [
            [app.persp], [[['value', -0.6]]], [['easeInQuad', 100]]
        ]
    ],
    false)
    buffer.valIn('timeline', app.persp, 'value', 0.4, 100, 844)
    app.persp.elem.value = 0.5
    buffer.eval('timeline',
    [
        [
            [app.x], [[['value', 50]]], [['easeInQuad', 100]]
        ]
    ],
    false)
    buffer.valIn('timeline', app.x, 'value', 298, 100, 844)
    app.x.elem.value = 298
    buffer.eval('timeline',
    [
        [
            [app.freq], [[['value', -100]]], [['easeInQuad', 100]]
        ]
    ],
    false)
    buffer.valIn('timeline', app.freq, 'value', 0, 100, 150)
    buffer.valIn('timeline', app.freq, 'value', 0, 150, 844)
    app.freq.elem.value = 0
    buffer.eval('timeline',
    [
        [
            [app.spring.coil], [[['value', -2], ['value', -2.45]]], [['easeInQuad', 50]]
        ]
    ],
    false)
    buffer.valIn('timeline', app.spring.coil, 'value', 13.24, 100, 844)
    buffer.eval('timeline',
    [
        [
            [app.spring.stretch], [[['value', 2], ['value', 18]]], [['easeInQuad', 50]]
        ]
    ],
    false) 
    buffer.valIn('timeline', app.spring.stretch, 'value', 20.25, 100, 844)
    app.spring.stretch.elem.value = 20.25
    this.main = function () {
        timeframe.stop(0)
    }
    return this
}(this.ctx.camera, this.ctx.timeline.addon.timeframe, this.ctx.timeline.addon.buffer, this.ctx.timeline.addon.binding, this.canvas.app)
