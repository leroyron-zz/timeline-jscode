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
        if (timeFrame > 6200 && timeFrame < 10200) spts.control = spts.length; else spts.control = 0
        for (let si = spts.control - 1; si > -1; si--) {
            let spt = spts[si]
            let scale = spt.scale.value + spt.scaleUp || 0
            this.scale(scale, scale)
            this.globalAlpha = spt.alpha.value
            let halfWidth = spt.measure.width / 2
            let halfHeight = spt.measure.height / 2
            let translateX = spt.position.x * app.width * (1 / scale)
            let translateY = spt.position.y * app.height * (1 / scale)
            this.translate(translateX, translateY)
            this.rotate(spt.rotate.value)
            this.translate(-halfWidth, -halfHeight)
            this.drawImage(spt, (spt.measure.width * spt.sprite.value), 0, spt.measure.width, spt.measure.height, 0, 0, spt.measure.width, spt.measure.height)
            this.translate(halfWidth, halfHeight)
            this.rotate(-spt.rotate.value)
            this.translate(-(translateX), -(translateY))
            this.globalAlpha = 1
            this.scale(1 / scale, 1 / scale)
        }
    }
    var spts = ctx['action' + startLength].prototype.spts = [['1/bg.jpg', 0.5, 0.5, '1334px', '750px', 0, app.width / 1334, 0]/*, ['0/palm1.png', 0.9, 0.8, '390px', '540px', 0, 0.8, 0], ['0/palm1glow.png', 0.9, 0.8, '390px', '540px', 0, 0.8, 0]  , ['zipperhi.png', 0.5, 0.1, '250px', '250px', 0, 0.5, 0], ['sunflare.png', 0.5, 0.1, '650px', '650px', 0, 1, 0], ['lightstreak.png', 0.5, 0.1, '1300px', '650px', 0, 1, 0], ['orb.png', 0, 0, '89px', '89px', 0, 0, 0.0] */]
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
                    spts[si][5], // rotate
                    Math.randomFromTo(15, 30) / 100, // random scale 0.15 to 0.3
                    spts[si][7], // alpha
                    0,
                    [
                        // increment
                    ],
                    function () {
                        // debugger
                        // arguments
                    },
                    [1, 2, 3])
                )
            }
        } else {
            let modProps = spts[si].name == 'bg' ? [['scaleUp', 0]] : [undefined]
            genSprites.push(ctx.sprite(
                app.fileLocAssets + spts[si][0],
                spts[si][1], // x
                spts[si][2], // y
                spts[si][3], // width
                spts[si][4], // height
                spts[si][5], // rotate
                spts[si][6], // scale
                spts[si][7], // alpha
                0,
                [['scaleUp', 0]],
                function () {
                    if (this.name == 'bg') {
                        this._resize = function () {
                            this.scale.value = app.width / 1334
                        }
                        window.resizeCalls.push(this)
                    }
                },
                [1, 2, 3])
            )
        }
    }
    spts = genSprites
    ctx['action' + startLength].prototype.spts = spts

    // binding
    for (let si = 0; si < spts.length; si++) {
        let modProps = spts[si].name == 'bg'
        ? [['alpha', spts[si].alpha.value], ['scaleUp', spts[si].scaleUp]]
        : [['alpha', spts[si].alpha.value], ['scale', spts[si].scale.value]]
        bind.queue(stream, [
        [spts[si]]
        ],
            modProps
        )
    }
    for (let si = 0; si < spts.length; si++) {
        //if (spts[si].name != 'bg') {
            bind.queue(stream, [
            [spts[si].position]
            ],
                [
                ['x', spts[si].position.x],
                ['y', spts[si].position.y]
                ])
        //}
    }
    for (let si = 0; si < spts.length; si++) {
        // debugger
        if (spts[si].name != 'bg') {
            bind.queue(stream, [
            [spts[si].rotate]
            ],
                [
                ['value', spts[si].rotate.value]
                ])
        }
    }

    for (let si = 0; si < spts.length; si++) {
        buffer.queue('eval', stream,
            [
                [
                [spts[si]], [[['alpha', 1 - spts[si].alpha.value]]], [['easeOutQuad', 300]], startLength
                ]
            ],
        false)
        buffer.queue('valIn', stream, [spts[si]], ['alpha'], 1, 300 + startLength, endLength)

        if (spts[si].name == 'bg') {
            buffer.queue('eval', stream,
                [
                    [
                    [spts[si]], [[['scaleUp', 0.50 - spts[si].scaleUp]]], [['easeOutQuad', endLength - startLength]], startLength
                    ]
                ],
            false)

            buffer.queue('eval', stream,
                [
                    [
                    [spts[si].position], [[['x', 0.7 - spts[si].position.x]]], [['easeOutQuad', endLength - startLength]], startLength
                    ]
                ],
            false)
            // buffer.queue('valIn', stream, [spts[si]], ['alpha'], 1, 300 + startLength, endLength)
        }
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
