window.Authority = new function (app, canvas, ctx, buffer) {
    this.actionID = 1500

    var timelineLength = ctx.timeline.length
    var imgs = ctx.imgs
    var timeframe = ctx.timeline.addon.timeframe

    timeframe.clearRuntimeAuthoritiesNear('segment', this.actionID, 200)

    timeframe.timeline.removeInsertsNear('segment', this.actionID, 200)
    //timeframe.timeline.removeInsertAt('segment', this.actionID)

    /* for (let ii = 0; ii < imgs.length; ii++) {
        if (imgs[ii].name == 'zipper') {
            buffer.eval('timeline',
                [
                    [
                    [imgs[ii]], [[['alpha', 1 - imgs[ii].alpha]]], [['easeOutQuad', 300]], 400
                    ]
                ],
            false)
            buffer.valIn('timeline', [imgs[ii]], ['alpha'], 1, 300 + 200, timelineLength)

            buffer.eval('timeline',
                [
                    [
                    [imgs[ii], imgs[1]], [[['rotate', 12510 + imgs[ii].rotate]]], [['easeOutQuad', 1000]], 400
                    ]
                ],
            false)

            buffer.eval('timeline',
                [
                    [
                    [imgs[ii]], [[['scale', -0.1]]], [['easeOutQuad', 100]], 1000
                    ]
                ],
            false)
            buffer.valIn('timeline', [imgs[ii]], ['scale'], 0.4, 1100, timelineLength)
        }

        if (imgs[ii].name == 'sunflare') {
            buffer.eval('timeline',
                [
                    [
                    [imgs[ii], imgs[1], imgs[3]], [[['alpha', 1 - imgs[ii].alpha], ['alpha', 0], ['alpha', -2]]], [['easeOutQuad', 300]], 400
                    ]
                ],
            false)

            buffer.valIn('timeline', [imgs[ii], imgs[1], imgs[3]], ['alpha'], 0.01, 900 + 175, timelineLength)

            // zipper, zipperhi, sunflare, lightstreak
            buffer.eval('timeline',
                [
                    [
                    [imgs[ii], imgs[0], imgs[1], imgs[3]], [[['yPos', 0.05 - imgs[0].yPos]]], [['easeOutBounce', 120]], 220
                    ]
                ],
            false)

            // zipper, zipperhi, sunflare, lightstreak
            buffer.eval('timeline',
                [
                    [
                    [imgs[ii], imgs[0], imgs[1], imgs[3]], [[['yPos', 1 - imgs[0].yPos]]], [['easeOutBounce', 300]], 500
                    ]
                ],
            false)

            buffer.eval('timeline',
                [
                    [
                    [imgs[ii], imgs[0], imgs[1], imgs[3]], [[['xPos', 0.1 - imgs[0].xPos]]], [['easeOutQuad', 100]], 700
                    ]
                ],
            false)
            buffer.valIn('timeline', [imgs[ii], imgs[0], imgs[1], imgs[3]], ['yPos'], 0.937, 750, 150)
            buffer.valIn('timeline', [imgs[ii], imgs[0], imgs[1], imgs[3]], ['xPos'], 0.1, 800, timelineLength)
            buffer.exec('timeline',
                [
                    [
                    [imgs[ii], imgs[0], imgs[1], imgs[3]], [[750, 'yPos', -0.1, 'easeOutQuad', 150, 0.937]]
                    ]
                ],
            false)
            buffer.valIn('timeline', [imgs[ii], imgs[0], imgs[1], imgs[3]], ['yPos'], 0.837, 900, timelineLength)
        }

        if (imgs[ii].name == 'orb') {
            // Only orbs
            buffer.eval('timeline',
                [
                    [
                    [imgs[ii]], [[['alpha', 0.15]]], [['easeOutQuad', 50]], imgs[ii].offset
                    ]
                ],
            false)
            buffer.valIn('timeline', [imgs[ii]], ['alpha'], 0.16, 50 + imgs[ii].offset, timelineLength)

            buffer.eval('timeline',
                [
                    [
                    [imgs[ii]], [[['xPos', 0.5 - imgs[ii].xPos]]], [['easeOutQuint', 100]], imgs[ii].offset
                    ]
                ],
            false)
            buffer.valIn('timeline', [imgs[ii]], ['xPos'], 0.5, 100 + imgs[ii].offset, timelineLength)
            if (imgs[ii].offset > 225) buffer.execLerp('timeline', [imgs[ii]], ['xPos'], imgs[0], 'xPos', 1, 0.04, true, false, imgs[ii].offset, 1200, 'easeInQuint')

            buffer.eval('timeline',
                [
                    [
                    [imgs[ii]], [[['yPos', 0.1 - imgs[ii].yPos]]], [['easeOutQuad', 100]], imgs[ii].offset
                    ]
                ],
            false)
            buffer.valIn('timeline', [imgs[ii]], ['yPos'], 0.1, 100 + imgs[ii].offset, timelineLength)
            // stream, nodes, props, refnode, refprop, flux, parallel, reach, from, to, ease, leapCallback, reassign, dispose, zeroIn, skipLeap
            if (imgs[ii].offset > 225) buffer.execLerp('timeline', [imgs[ii]], ['yPos'], imgs[0], 'yPos', 1, 0.05, true, false, imgs[ii].offset, 1200, 'easeInQuint')

            let scaleRandom = Math.randomFromTo(100, (10 * ii)) / 100 - imgs[ii].scale
            buffer.eval('timeline',
                [
                    [
                    [imgs[ii]], [[['scale', 0.4], ['scale', -0.5]]], [['easeOutQuad', 50]], imgs[ii].offset
                    ]
                ],
            false)

            buffer.eval('timeline',
                [
                    [
                    [imgs[ii]], [[['scale', scaleRandom], ['scale', -scaleRandom - 2]]], [['easeOutQuint', 25]], 200 + imgs[ii].offset
                    ]
                ],
            false)

            buffer.eval('timeline',
                [
                    [
                    [imgs[3]], [[['alpha', 0.005], ['alpha', -0.005]]], [['easeOutQuint', 10]], 200 + imgs[ii].offset
                    ]
                ],
            true)// bring in alpha for lightstreak blasts, using relative blending values
            buffer.valIn('timeline', [imgs[ii]], ['scale'], 0.01, 200 + 200 + imgs[ii].offset, timelineLength)

            buffer.eval('timeline',
                [
                    [
                    [imgs[ii]], [[['alpha', 0.01]]], [['easeOutQuad', 50]], 230 + imgs[ii].offset - (ii / 4 << 0)
                    ]
                ],
            false)
            buffer.valIn('timeline', [imgs[ii]], ['alpha'], 0.00, 50 + 230 + imgs[ii].offset - (ii / 4 << 0), timelineLength)
        }
    } */

    this.main = function () {
        // used for reference, because it may get skipped over by mp3 syncing
        ctx.timeline.addon.timeframe.process = function () {
            ctx.process(this.access, this.frame._duration, this._timeFrame, this.lapse)// before timeFrame process
        }

        ctx.process = function (access, duration, timeFrame, lapse) {

        }

        ctx.calc = function (lapse, access) {

        }

        ctx.rendering = function (timeFrame) {

        }

        ctx.compute = function () {

        }
    }
    return this
}(this.app, this.canvas, this.ctx, this.ctx.timeline.addon.buffer)
