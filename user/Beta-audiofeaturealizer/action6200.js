window.Authority = new function (app, canvas, ctx, bind, buffer) {
    this.actionID = 6200

    var stream = 'timeline'
    var startLength = this.actionID
    var endLength = 10200
    var timeframe = ctx.timeline.addon.timeframe

    timeframe.clearRuntimeAuthoritiesNear('segment', startLength, 200)

    timeframe.timeline.removeInsertsNear('segment', startLength, 200)
    // timeframe.timeline.removeInsertAt('segment', startLength)
    ctx['action' + startLength] = function (timeFrame) {
        // let spts = this['action' + 6200].prototype.spts
        if (timeFrame > 6200 && timeFrame < 10200) {
            var frequencyWidth = (canvas.app.width / 32)
            var frequencyHeight = 0
            var x = 0
            for (let increment = 0; increment < 32; increment++) {
                frequencyHeight = ctx.audio[0][2].frequency[increment] * (canvas.app.height * 0.002)
                this.fillStyle = 'rgba(106,90,205,0.5)'
                this.fillRect(x, canvas.app.height - frequencyHeight, frequencyWidth, frequencyHeight)

                x += frequencyWidth
            }
            spts.control = spts.length
        } else spts.control = 0
        for (let si = spts.control - 1; si > -1; si--) {
            let spt = spts[si]
            let scale = spt.scale.value + (spt.scaleUp || 0)
            this.scale(scale, scale)
            this.globalAlpha = spt.alpha.value
            let translateX = spt.position.x * app.width * (1 / scale)
            let translateY = spt.position.y * app.height * (1 / scale)
            this.translate(translateX, translateY)
            this.rotate(spt.rotate.value)
            this.translate(-spt.position.offset.left, -spt.position.offset.top)
            this.drawImage(spt, (spt.measure.width * spt.sprite.value), 0, spt.measure.width, spt.measure.height, 0, 0, spt.measure.width, spt.measure.height)
            this.translate(spt.position.offset.left, spt.position.offset.top)
            this.rotate(-spt.rotate.value)
            this.translate(-(translateX), -(translateY))
            this.globalAlpha = 1
            this.scale(1 / scale, 1 / scale)
        }
    }
    var spts = ctx['action' + startLength].prototype.spts = [
        ['1/bg.jpg', 0.5, 0.5, '1334px', '750px', 'center', 0, app.width / 1334, 0, 0, [['scaleUp', 0]], function () {
            this._resize = function () {
                this.scale.value = app.width / 1334
            }
            window.resizeCalls.push(this)

            bind.queue(stream, [
            [this]
            ],
                [
                ['alpha', this.alpha.value],
                ['scaleUp', this.scaleUp]
                ]
            )

            bind.queue(stream, [
            [this.position]
            ],
                [
                ['x', this.position.x],
                ['y', this.position.y]
                ]
            )

            // debugger
            buffer.queue('eval', stream,
                [
                    [
                    [this], [[['scaleUp', 0.50 - this.scaleUp]]], [['easeOutQuad', endLength - startLength]], startLength
                    ]
                ],
            false)

            buffer.queue('eval', stream,
                [
                    [
                    [this.position], [[['x', 0.7 - this.position.x]]], [['easeOutQuad', endLength - startLength]], startLength
                    ]
                ],
            false)
        }],
        ['1/text.png', 1.0, 0.0, '465px', '750px', 'TR', 0, app.height / 750, 0, 0, undefined, function () {
            this._resize = function () {
                this.scale.value = app.height / 750
            }
            window.resizeCalls.push(this)

            bind.queue(stream, [
            [this]
            ],
                [['alpha', this.alpha.value]]
            )

            // buffer.queue('execLerp', stream, [this], ['alpha'], ctx.audio[0][2].enhancement, '18', 1, 0.24, true, false, startLength, endLength, 'linear', 5)
        }]
    ]
    var genSprites = []
    for (let si = 0; si < spts.length; si++) {
        if (si > 9) {
            for (var gi = 0; gi < 125; gi++) {
                genSprites.push(ctx.sprite(
                    app.fileLocAssets + spts[si][0],
                    Math.randomFromTo(10, 90) / 100, // random x 0.1 to 0.9
                    Math.randomFromTo(60, 80) / 100, // random y 0.6 to 0.8
                    spts[si][3], // width
                    spts[si][4], // height
                    spts[si][5], // align
                    spts[si][6], // rotate
                    Math.randomFromTo(15, 30) / 100, // random scale 0.15 to 0.3
                    spts[si][8], // alpha
                    spts[si][9], // sprite
                    spts[si][10], // properties
                    spts[si][11], // onload callback
                    spts[si][12] // args
                    )
                )
            }
        } else {
            genSprites.push(ctx.sprite(
                app.fileLocAssets + spts[si][0],
                spts[si][1], // x
                spts[si][2], // y
                spts[si][3], // width
                spts[si][4], // height
                spts[si][5], // align
                spts[si][6], // rotate
                spts[si][7], // scale
                spts[si][8], // alpha
                spts[si][9], // sprite
                spts[si][10], // properties
                spts[si][11], // onload callback
                spts[si][12] // args
                )
            )
        }
    }
    spts = genSprites
    ctx['action' + startLength].prototype.spts = spts

    for (let si = 0; si < spts.length; si++) {
        buffer.queue('eval', stream,
            [
                [
                [spts[si]], [[['alpha', 1 - spts[si].alpha.value]]], [['easeOutQuad', 300]], startLength
                ]
            ],
        false)
        buffer.queue('valIn', stream, [spts[si]], ['alpha'], 1, 300 + startLength, endLength)
    }

    ctx.calc.prototype[startLength] = function (timeFrame) {
    }

    ctx.compute.prototype[startLength] = function () {

    }

    this.main = function () {
        timeframe.goTo((ctx.audio[0][0].currentTime * 100) + 1100 << 0)
        // used for reference, because it may get skipped over by mp3 syncing
        // ctx.calc = ctx.calc[startLength]
        // ctx.compute = ctx.compute[startLength]
        /* ctx.timeline.addon.timeframe.invoke = function () {
            ctx.calc(this.frame.duration, this.lapse, this.access)// before render
            ctx.gui(this.frame.duration)// gui render
            ctx['action' + 25400](this.frame.duration)
            ctx.rendering(this.frame.duration)
            ctx.background(this.frame.duration)// after render
            ctx.compute()// after render
        }
        ctx.timeline.addon.timeframe.update() */
    }
    return this
}(this.app, this.canvas, this.ctx, this.ctx.timeline.addon.binding, this.ctx.timeline.addon.buffer)
