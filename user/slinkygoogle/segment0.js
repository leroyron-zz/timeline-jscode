var Authority = new function (camera, timeframe, buffer, binding, app) {
    this.segmentID = 0

    buffer.eval('timeline',
        [
            [
            [app.x], [[['value', -150], ['value', 400], ['value', -550]]], [['easeInQuad', 74]]
            ]
        ],
    false)
    buffer.eval('timeline',
        [
            [
            [app.y], [[['value', -100], ['value', 200], ['value', -100]]], [['easeInOutQuad', 74]]
            ]
        ],
    false)
    buffer.eval('timeline',
        [
            [
            [app.freq], [[['value', -200], ['value', 200]]], [['easeInBounce', 74]]
            ]
        ],
    false)
    buffer.eval('timeline',
        [
            [
            [app.lineWidth], [[['value', 1], ['value', 4], ['value', -5]]], [['easeInBounce', 70]]
            ]
        ],
    false)
    buffer.eval('timeline',
        [
            [
            [app.size], [[['value', 0.25], ['value', 0.5], ['value', -0.75]]], [['easeInOutQuad', 74]]
            ]
        ],
    false)
    // buffer.valIn('timeline', [app.y], ['value'], 76, 200, 1044)
    // app.y.elem.value = 76

    // Slinky Staggers into play position
    buffer.eval('timeline',
        [
            [
            [app.size], [[['value', 0.3], ['value', -0.3]]], [['easeInQuad', 74]], 200
            ]
        ],
    false)
    buffer.valIn('timeline', [app.size], ['value'], 0.7, 350, 1044)
    app.size.elem.value = 0.7
    buffer.eval('timeline',
        [
            [
            [app.persp], [[['value', -0.6]]], [['easeInQuad', 100]], 200
            ]
        ],
    false)
    buffer.valIn('timeline', [app.persp], ['value'], 0.4, 300, 1044)
    app.persp.elem.value = 0.5
    buffer.eval('timeline',
        [
            [
            [app.x], [[['value', 62]]], [['easeInBounce', 150]], 200
            ]
        ],
    false)
    buffer.valIn('timeline', [app.x], ['value'], 248, 350, 1044)
    app.x.elem.value = 248
    buffer.eval('timeline',
        [
            [
            [app.freq], [[['value', -100], ['value', 25]]], [['easeInQuad', 74]], 200
            ]
        ],
    false)
    buffer.valIn('timeline', [app.freq], ['value'], 0, 300, 350)
    buffer.valIn('timeline', [app.freq], ['value'], 0, 350, 1044)
    app.freq.elem.value = 0
    buffer.eval('timeline',
        [
            [
            [app.spring.coil], [[['value', -2], ['value', -2.45]]], [['easeInQuad', 50]], 200
            ]
        ],
    false)
    buffer.valIn('timeline', [app.spring.coil], ['value'], 13.24, 300, 1044)
    buffer.eval('timeline',
        [
            [
            [app.spring.stretch], [[['value', 2], ['value', 26]]], [['easeInQuad', 50]], 200
            ]
        ],
    false)
    buffer.valIn('timeline', [app.spring.stretch], ['value'], 28.25, 300, 1044)
    app.spring.stretch.elem.value = 28.25
    this.main = function () {
        timeframe.stop(0)
    }
    return this
}(this.ctx.camera, this.ctx.timeline.addon.timeframe, this.ctx.timeline.addon.buffer, this.ctx.timeline.addon.binding, this.canvas.app)
