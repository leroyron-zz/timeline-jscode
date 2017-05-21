this.canvas.app = new function (app, canvas, ctx) {
    // Public
    this.width = app.width
    this.height = app.height
    this.aspect = Math.aspectRatio(this.height, this.width)
    this.resolution = function (app) {
        // Screen resize adjustments
        canvas.node.width = this.width = app.width
        canvas.node.height = this.height = app.height
        canvas.node.style.width = canvas.node.width + 'px'
        canvas.node.style.height = canvas.node.height + 'px'

        this.resX = app.width / this.width
        this.resY = app.height / this.height

        frequencyWidth = soundBlast ? (this.width / soundBlast[0].length) - 2 : 0
    }
    this.resolution(app)

    // Private
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    var audio, audioSrc, analyser, bufferLength, audioFreqData, audioUrl
    var inject = false

    var imgs = this.imgs = [['zipper.png', 0.5, 0.1, 0, 0.5, 0, 250, 250, 'zipperhi.png'], ['zipperhi.png', 0.5, 0.1, 0, 0.5, 0, 250, 250], ['sunflare.png', 0.5, 0.1, 0, 1, 0, 650, 650], ['lightstreak.png', 0.5, 0.1, 0, 1, 0, 1300, 650], ['orb.png', 0, 0, 0, 0, 0, 89, 89]]

    function init () {
        var genImgs = []
        ctx.globalAlpha = 0
        for (let ii = 0; ii < imgs.length; ii++) {
            if (ii == 4) {
                for (var gi = 0; gi < 125; gi++) {
                    genImgs.push(createImgs(ii, ii + gi, Math.randomFromTo(10, 90) / 100, Math.randomFromTo(60, 80) / 100, Math.randomFromTo(15, 30) / 100, Math.randomFromTo(gi * 5, 100)))
                }
            } else {
                genImgs.push(createImgs(ii, gi, imgs[ii][1], imgs[ii][2], imgs[ii][4], 300))
            }
        }
        function createImgs (ii, gi, x, y, scale, offset) {
            let name = /(.*)\.[^.]+$/.exec(imgs[ii][0])[1]
            let src = imgs[ii][0]
            let w = imgs[ii][6]
            let h = imgs[ii][7]
            let rotate = imgs[ii][3]
            let alpha = imgs[ii][5]
            let sec = imgs[ii][8]
            let img = new window.Image()
            img.name = name
            img.xPos = x
            img.yPos = y
            img.w = w
            img.h = h
            let translateX = img.xPos * app.width - img.w / 2 << 0
            let translateY = img.yPos * app.height - img.h / 2 << 0
            img.rotate = rotate
            img.scale = scale
            img.alpha = alpha
            img.sprite = 0
            img.secImg = sec ? app.fileLocAssets + sec : false
            img.offset = offset || 0
            img.onload = function () {
                ctx.drawImage(this, translateX, translateY)
                this.sec = new window.Image()
                this.sec.src = this.secImg
            }
            img.src = app.fileLocAssets + src
            return img
        }

        imgs = genImgs
    }

    ctx.timeline.addon.timeframe.process = function () {
        ctx.process(this.access, this._timeFrame, this.lapse)// before timeFrame process
    }

    ctx.process = function (access, timeFrame, lapse) {

    }

    ctx.timeline.addon.timeframe.invoke = function () {
        ctx.calc(this.lapse, this.access)// before render
        ctx.rendering(this.frame.duration)
        ctx.compute()// after render
    }

    ctx.calc = function (lapse, access) {

    }

    var soundBlast = Math.Poly.Medium.midDisperse(100, 100, 0.85)
    var frequencyWidth = (this.width / soundBlast[0].length) - 2

    ctx.rendering = function (frameDuration) {
        // this.globalCompositeOperation = 'destination-over'
        this.save()
        this.clearRect(0, 0, canvas.app.width, canvas.app.height)
        this.scale(canvas.app.width / app.width, (canvas.app.height / app.height))
        /* if (!frameDuration || frameDuration < 60) {
            this.globalAlpha = 1 - (frameDuration / 60)
            this.drawImage(imgs[1], (imgs[1].wSrc * imgs[1].sprite) + 1, imgs[1].yPos, imgs[1].wSrc, imgs[1].hSrc, imgs[1].xDes, imgs[1].yDes, imgs[1].wDes, imgs[1].hDes)
            this.globalAlpha = 1
        } */
        var iLen = frameDuration > 1100 ? 4 : imgs.length
        for (let ii = 0; ii < iLen; ii++) {
            this.scale(imgs[ii].scale, imgs[ii].scale)
            this.globalAlpha = imgs[ii].alpha
            let halfWidth = imgs[ii].w / 2
            let halfHeight = imgs[ii].h / 2
            let translateX = imgs[ii].xPos * app.width * (1 / imgs[ii].scale)
            let translateY = imgs[ii].yPos * app.height * (1 / imgs[ii].scale)
            this.translate(translateX, translateY)
            this.rotate(imgs[ii].rotate * Math.PI / 180)
            this.translate(-halfWidth, -halfHeight)
            this.drawImage(imgs[ii], (imgs[ii].w * imgs[ii].sprite), 0, imgs[ii].w, imgs[ii].h, 0, 0, imgs[ii].w, imgs[ii].h)
            this.translate(halfWidth, halfHeight)
            this.rotate(-imgs[ii].rotate * Math.PI / 180)
            this.translate(-(translateX), -(translateY))
            this.globalAlpha = 1
            this.scale(1 / imgs[ii].scale, 1 / imgs[ii].scale)
        }

        var frequencyHeight = 0
        var frequencyXPos = 0
        var frequencyYPos = 0
        if (frameDuration > 606 && frameDuration < 706) {
            let frame = frameDuration - 606
            let blast = soundBlast[frame]
            for (let i = 0; i < blast.length; i++) {
                // Streaming data
                frequencyHeight = (app.height * 0.15 * blast[i])
                this.fillStyle = 'rgba(255,' + (100 + (75 * 0.25 * blast[i]) << 0) + ',' + (255 * 0.25 * blast[i] << 0) + ',' + (blast[i] - (0.75 * (frame / 100))) + ')'
                this.fillRect(frequencyXPos, canvas.app.height - frequencyHeight, frequencyWidth, frequencyHeight)

                frequencyXPos += frequencyWidth + 2
            }
        }

        this.scale(app.width / canvas.app.width, app.height / canvas.app.height)
        this.restore()
    }

    ctx.compute = function () {

    }

    this.SetupContextBindsForStreamAndBuildAfterLoad = function () {
        app.codeLoc = 'user/' + app.codesetting
        app.fileLocAssets = app.vscode._fileLocal + app.codeLoc + '/assets/'
        init()
        createGFXBindNodesToStream('timeline')
        buildStream()
    }

    function createGFXBindNodesToStream (stream) {
        console.log('Binding objects to stream - Starting')

        var bind = ctx[stream].addon.binding
        var buffer = ctx.timeline.addon.buffer

        for (let ii = 0; ii < imgs.length; ii++) {
            // Only zipper
            if (imgs[ii].name == 'zipper') {
                bind(stream, [
                [imgs[ii]]
                ],
                    [
                    ['xPos', imgs[ii].xPos],
                    ['yPos', imgs[ii].yPos],
                    ['alpha', imgs[ii].alpha],
                    ['rotate', imgs[ii].rotate, 2160],
                    ['scale', imgs[ii].scale]
                    ])
            } else {
                bind(stream, [
                [imgs[ii]]
                ],
                    [
                    ['xPos', imgs[ii].xPos],
                    ['yPos', imgs[ii].yPos],
                    ['alpha', imgs[ii].alpha],
                    ['rotate', imgs[ii].rotate],
                    ['scale', imgs[ii].scale]
                    ])
            }
        }
        for (let ii = 0; ii < imgs.length; ii++) {
            if (imgs[ii].name == 'zipper') {
                buffer.eval('timeline',
                    [
                        [
                        [imgs[ii]], [[['alpha', 1 - imgs[ii].alpha]]], [['easeOutQuad', 300]], 400
                        ]
                    ],
                false)
                buffer.valIn('timeline', [imgs[ii]], ['alpha'], 1, 300 + 200, 12000)

                buffer.eval('timeline',
                    [
                        [
                        [imgs[ii], imgs[1]], [[['rotate', 6730 + imgs[ii].rotate]]], [['easeOutQuad', 1000]], 400
                        ]
                    ],
                false)
            }

            if (imgs[ii].name == 'sunflare') {
                buffer.eval('timeline',
                    [
                        [
                        [imgs[ii], imgs[1], imgs[3]], [[['alpha', 1 - imgs[ii].alpha], ['alpha', 0], ['alpha', -2]]], [['easeOutQuad', 300]], 400
                        ]
                    ],
                false)
                buffer.valIn('timeline', [imgs[ii], imgs[1], imgs[3]], ['alpha'], 0.01, 900 + 175, 12000)

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
                buffer.valIn('timeline', [imgs[ii], imgs[0], imgs[1], imgs[3]], ['xPos'], 0.1, 800, 12000)
                buffer.exec('timeline',
                    [
                        [
                        [imgs[ii], imgs[0], imgs[1], imgs[3]], [[750, 'yPos', -0.1, 'easeOutQuad', 150, 0.937]]
                        ]
                    ],
                false)
                buffer.valIn('timeline', [imgs[ii], imgs[0], imgs[1], imgs[3]], ['yPos'], 0.837, 900, 12000)
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
                buffer.valIn('timeline', [imgs[ii]], ['alpha'], 0.16, 50 + imgs[ii].offset, 12000)

                buffer.eval('timeline',
                    [
                        [
                        [imgs[ii]], [[['xPos', 0.5 - imgs[ii].xPos]]], [['easeOutQuint', 100]], imgs[ii].offset
                        ]
                    ],
                false)
                buffer.valIn('timeline', [imgs[ii]], ['xPos'], 0.5, 100 + imgs[ii].offset, 12000)
                if (imgs[ii].offset > 225) buffer.execLerp('timeline', [imgs[ii]], ['xPos'], imgs[0], 'xPos', 1, 0.04, true, false, imgs[ii].offset, 1200, 'easeInQuint')

                buffer.eval('timeline',
                    [
                        [
                        [imgs[ii]], [[['yPos', 0.1 - imgs[ii].yPos]]], [['easeOutQuad', 100]], imgs[ii].offset
                        ]
                    ],
                false)
                buffer.valIn('timeline', [imgs[ii]], ['yPos'], 0.1, 100 + imgs[ii].offset, 12000)
                // stream, nodes, props, refnode, refprop, flux, parallel, reach, from, to, ease, leapCallback, reassign, dispose, zeroIn, skipLeap
                if (imgs[ii].offset > 225) buffer.execLerp('timeline', [imgs[ii]], ['yPos'], imgs[0], 'yPos', 1, 0.04, true, false, imgs[ii].offset, 1200, 'easeInQuint')

                let scaleRandom = Math.randomFromTo(100, (10 * ii)) / 100 - imgs[ii].scale
                buffer.eval('timeline',
                    [
                        [
                        [imgs[ii]], [[['scale', 0.2], ['scale', -0.3]]], [['easeOutQuad', 50]], imgs[ii].offset
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
                buffer.valIn('timeline', [imgs[ii]], ['scale'], 0.01, 200 + 200 + imgs[ii].offset, 12000)

                buffer.eval('timeline',
                    [
                        [
                        [imgs[ii]], [[['alpha', 0.01]]], [['easeOutQuad', 50]], 230 + imgs[ii].offset - (ii / 4 << 0)
                        ]
                    ],
                false)
                buffer.valIn('timeline', [imgs[ii]], ['alpha'], 0.00, 50 + 230 + imgs[ii].offset - (ii / 4 << 0), 12000)
            }
        }
        var div = document.getElementById('info')
        div.style.width = '100%'
        var divInfoStyle = document.createElement('style')
        divInfoStyle.id = 'infoStyle'
        divInfoStyle.innerHTML = 'body { background: #000; } #info input, #info lable { float: right; } #info lable { color: #000; padding: 2px 0 0 0; }'
        div.appendChild(divInfoStyle)
    }
    function buildStream (stream) {
        // build stream and prebuff from the binding DATA
        console.log('Finished Binding to stream - Building')
        ctx.timeline.build(function () {
            console.log('Finished Building - Initializing')
            ctx.timeline.addon.timeframe._init(window) // timeframe init has to be set to true for additional scripts to load
        })
    }
}(this.app, this.canvas, this.ctx)
