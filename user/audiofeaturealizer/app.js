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
    var System = ctx.timeline.addon.runtime.system
    var timeframe = ctx.timeline.addon.timeframe
    var timelineLength = ctx.timeline.length
    var system
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    var audio, audioSrc, analyser, bufferLength, audioFreqData, audioUrls
    var inject = false

    var imgs = this.imgs = [['zipper.png', 0.5, 0.1, 0, 0.5, 0, 250, 250, 'zipperhi.png'], ['zipperhi.png', 0.5, 0.1, 0, 0.5, 0, 250, 250], ['sunflare.png', 0.5, 0.1, 0, 1, 0, 650, 650], ['lightstreak.png', 0.5, 0.1, 0, 1, 0, 1300, 650], ['orb.png', 0, 0, 0, 0, 0, 89, 89]]

    function init () {
        audioUrls = [[app.fileLocAssets + 'drop.mp3', 0], [app.fileLocAssets + 'features.mp3', 1100]]
        var div = document.getElementById('info')
        var divElem = document.createElement('div')
        var playBut = document.createElement('button')

        var playFeature = function (e) {
            divElem.style.display = 'none'

            audioUrls[0][0].play()

            audioUrls[1][2].send()// load feature right after

            timeframe.run()

            playBut.removeEventListener('click', playFeature)
        }
        for (let ai = 0; ai < audioUrls.length; ai++) {
            var audioRequest = audioUrls[ai][2] = new window.XMLHttpRequest()
            audioRequest.id = ai
            audioRequest.open('GET', audioUrls[ai][0], true)
            audioRequest.responseType = 'blob'

            audioRequest.onload = function () {
                audioUrls[this.id][0] = new window.Audio(window.URL.createObjectURL(this.response))
                audioUrls[this.id][0].paused = true
                if (this.id == 0) { // ////// Build Stream after feature mp3 loads:
                    buildStream(function () {
                        ctx.timeline.addon.timeframe.timeline.destroy()
                        var bar4th = 75
                        var barLength = (timelineLength - 1100) / bar4th

                        var segmentAuth = new function (timeframe) {
                            this.main = function () {
                                if (timeframe.duration > 1100 && timeframe.duration < timelineLength - barLength) timeframe.goTo((audioUrls[0][0].currentTime * 100) + 1100 << 0)
                            }
                            return this
                        }(ctx.timeline.addon.timeframe)

                        var data = {segment: {}}
                        var actionPositions = [1500, 6200, 10200, 14200, 19500, 25400]
                        for (let bi = 0; bi < timelineLength - 1100; bi += barLength) {
                            data.segment[bi + 1100 << 0] = {Authority: segmentAuth}
                        }
                        ctx.timeline.addon.timeframe.timeline.seek.insert.insertAuthorities(data)

                        playBut.style.width = '100%'
                        playBut.style.height = '100%'
                        playBut.style.position = 'fixed'
                        playBut.style.top = 0
                        playBut.style.left = 0
                        playBut.style.background = 'none'
                        playBut.style.border = 'none'
                        playBut.addEventListener('click', playFeature)
                        divElem.appendChild(playBut)
                        div.appendChild(divElem)
                    })
                }
                /*
                timeline: 30976
                drop.mp3 duration 1251.8
                feature.mp3 5:14 duration 29876.7792 >
                start 1100
                    0 JAHKOY - California Heaven - ft. ScHoolboy Q 0:00 - 0:50 1500
                    1 Nav - NAV 0:50 - 1:29 6200
                    2 Jay Whiss - Welcome To The Life 1:29 - 2:08 10200
                    3 Big Lean x Sick - Unforgettable 2:08 - 2:29 14200
                    4 Ebhoni - Killing Roses 2:29 - 4:00 19500
                    5 Pressa - Deadmihana 4:00 - 4:59 25400
                */
            }
            if (ai == 0) audioRequest.send()
        }
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
            // let translateX = img.xPos * app.width - img.w / 2 << 0
            // let translateY = img.yPos * app.height - img.h / 2 << 0
            img.spin = 0
            img.scaleUp = 0
            img.rotate = rotate
            img.scale = scale
            img.alpha = alpha
            img.sprite = 0
            img.secImg = sec ? app.fileLocAssets + sec : false
            img.offset = offset || 0
            img.onload = function () {
                this.sec = new window.Image()
                this.sec.src = this.secImg
                img.onload = undefined
            }
            img.fst = {}
            img.fst.src = img.src = app.fileLocAssets + src
            return img
        }

        imgs = genImgs

        system = new System()// start new system and start the down-line
                             .Pointer()// the pointer such as a mouse or touch moves the cursor
                        //   .Knob()// the pointer moves the knob, knob moves the cursor
                        //   .Subject()// node/object moves the cursor
                                    // .Marquee()// cursor draws the marquee
                                    // .Grid()// the grid prepares the matrices to render textiles, boundaries, particles and collisions depending on cursor location
                                           // .Parallax()// exploits grid data and cuts out necessary data for optimization, rendering and other various uses
                                                    //   .Entity()// node/object collection optimized by parallax
                                                    //   .Physic()// chained physics optimized by parallax
                                                    //   .Bound()// utilizes the parallax exploits to resolve and utilize boundary matrices
                                                    //   .Collision()// utilizes the parallax exploits to resolve and utilize collision matrices
                                                                //   .Particle()// entitys could emit particles, particle generation and behaviors affected by physics, boundaries and collisions
                                                                //   .Rig()// rigging behaviors affected by entitys, physics, boundaries and collisions

        system.Pointer
        .bind(app.pointers, canvas.node)
        .result(function (pointer) {
            if (pointer.type == 'mouseup' || pointer.type == 'touchend') {
                imgs[0].swap = imgs[0].fst.src
                imgs[0].scaleUpTo = 0.01
                imgs[0].hold = false
            } else if (Math.distance2(pointer.normal, imgs[0].normal) < 0.15 && !imgs[0].hold) {
                console.log('hovering')
                imgs[0].swap = imgs[0].sec.src
                imgs[0].scaleUpTo = 0.15
                canvas.node.style.cursor = 'pointer'
                imgs[0].hover = true
                if (pointer.type == 'mousedown' || pointer.type == 'touchstart') {
                    imgs[0].hold = true
                }
            } else if (imgs[0].hover && !imgs[0].hold) {
                console.log('hoverout')
                imgs[0].swap = imgs[0].fst.src
                imgs[0].scaleUpTo = 0.01
                canvas.node.style.cursor = ''
            } else if (imgs[0].hold) {
                let zipper = (pointer.normal.x + 1) / 2
                zipper = zipper < 0.1 ? 0.1 : zipper > 0.899 ? 0.899 : zipper
                let frame = (timelineLength - 1100) * ((zipper - 0.1) / 0.8) + 1100 << 0
                // audioUrls[0][0].play()
                audioUrls[0][0].currentTime = (frame - 1100) / 100 << 0
                timeframe.goTo(frame)
            } else { return }

            imgs[0].src = imgs[0].swap

            if (app.pointers.inUse) {

            }
        })
        .init()

        /* system.Subject
        .bind(imgs[0], app.pointers, 0.15)
        .hover(function (subject, pointer) {
            subject.src = subject.sec.src
            subject.scaleUpTo = 0.15
        })
        .down(function (subject, pointer) {

        })
        .drag(function (subject, pointer) {
            subject.xPos = 0
        })
        .drop(function (subject, pointer) {

        })
        .out(function (subject, pointer) {
            subject.src = subject.fst.src
            subject.scaleUpTo = 0.01
        })
        .init() */
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
    var frequencyHeight = 0
    var frequencyXPos = 0
    var frequencyYPos = 0

    var stage = 0

    var seeker = {
        show: false,
        xPos: 0.1,
        yPos: 0.837,
        width: 0.8,
        height: 1,
        alpha: 0,
        progress: {
            loaded: 0,
            show: false,
            xPos: 0.1,
            yPos: 0.837,
            width: 0.8,
            height: 3,
            alpha: 0
        }
    }
    ctx.rendering = function (frameDuration) {
        this.globalCompositeOperation = 'destination-over'
        this.save()
        this.clearRect(0, 0, canvas.app.width, canvas.app.height)
        this.scale(app.width / canvas.app.width, app.height / canvas.app.height)
        this.restore()

        if (frameDuration > 606 && frameDuration < 706) {
            let frame = frameDuration - 606
            let blast = soundBlast[frame]
            frequencyXPos = 0
            for (let i = 0; i < blast.length; i++) {
                // Streaming data
                frequencyHeight = (app.height * 0.15 * blast[i])
                this.fillStyle = 'rgba(255,' + (100 + (75 * 0.25 * blast[i]) << 0) + ',' + (255 * 0.25 * blast[i] << 0) + ',' + (blast[i] - (0.75 * (frame / 100))) + ')'
                this.fillRect(frequencyXPos, canvas.app.height - frequencyHeight, frequencyWidth, frequencyHeight)

                frequencyXPos += frequencyWidth + 2
            }
        }

        if (frameDuration > 900) {
            seeker.show = seeker.show == 0 ? 1 : seeker.show
            if (!audioUrls[1][0].play) {
                seeker.progress.show = 1
                audioUrls[1][0] = {play: 'halted'}
                imgs[0].spinTo = imgs[1].spinTo = 50
                audioUrls[1][2].onprogress = function (xhr) {
                    imgs[0].spinTo += imgs[1].spinTo += 50
                    seeker.progress.loaded = (xhr.loaded / (xhr.total || 7171451))
                }
            } else if (audioUrls[1][0].play != 'halted' && seeker.show == 1) {
                seeker.progress.show = 0
                seeker.show = 0.5
                if (audioUrls[1][0].paused && timeframe.duration > 1100) timeframe.goTo(1100)
                audioUrls[0][0].backupSrc = audioUrls[0][0].src
                audioUrls[0][0].src = audioUrls[1][0].src
                audioUrls[0][0].currentTime = 0
                audioUrls[0][0].play()
            }


            Math.lerpProp(seeker, 'alpha', seeker.show, 0.05)
            this.fillStyle = 'rgba(255, 100, 0,' + seeker.alpha + ')'
            this.fillRect(
                canvas.app.width * seeker.xPos,
                canvas.app.height * seeker.yPos,
                canvas.app.width * seeker.width,
                seeker.height
            )

            Math.lerpProp(seeker.progress, 'alpha', seeker.progress.show, 0.05)
            this.strokeStyle = 'rgba(255, 255, 255,' + seeker.progress.alpha + ')'
            this.strokeRect(
                canvas.app.width * seeker.progress.xPos,
                canvas.app.height * seeker.progress.yPos - (seeker.progress.height / 2),
                canvas.app.width * seeker.progress.width * seeker.progress.loaded,
                seeker.progress.height
            )
        } else {
            if (audioUrls[0][0].backupSrc) {
                audioUrls[0][0].src = audioUrls[0][0].backupSrc
                audioUrls[0][0].backupSrc = null
                delete audioUrls[0][0].backupSrc

                audioUrls[0][0].currentTime = 0
                audioUrls[0][0].play()
            }
            seeker.show = seeker.progress.show = seeker.alpha = seeker.progress.alpha = 0
        }

        var iLen = imgs.length
        if (frameDuration > 1100 && seeker.show != 1) {
            iLen = 1

            imgs[0].xPos = 0.8 * ((frameDuration - 1100) / (timelineLength - 1100)) + 0.1
            // frameDuration = (timelineLength - 1100) * ((imgs[0].xPos - 0.1) / 0.8) + 1100
            // console.log(frameDuration, imgs[0].xPos)
        }
        imgs[0].normal = {x: imgs[0].xPos * 2 - 1, y: 1 - imgs[0].yPos * 2}
        for (let ii = iLen - 1; ii > -1; ii--) {
            if (imgs[ii].scaleUpTo) Math.lerpProp(imgs[ii], 'scaleUp', imgs[ii].scaleUpTo, 0.15)
            let scale = imgs[ii].scale + imgs[ii].scaleUp
            this.scale(scale, scale)
            this.globalAlpha = imgs[ii].alpha
            let halfWidth = imgs[ii].w / 2
            let halfHeight = imgs[ii].h / 2
            let translateX = imgs[ii].xPos * app.width * (1 / scale)
            let translateY = imgs[ii].yPos * app.height * (1 / scale)
            this.translate(translateX, translateY)
            if (imgs[ii].spinTo) Math.lerpProp(imgs[ii], 'spin', imgs[ii].spinTo, 0.05)
            this.rotate((imgs[ii].rotate + imgs[ii].spin) * Math.PI / 180)
            this.translate(-halfWidth, -halfHeight)
            this.drawImage(imgs[ii], (imgs[ii].w * imgs[ii].sprite), 0, imgs[ii].w, imgs[ii].h, 0, 0, imgs[ii].w, imgs[ii].h)
            this.translate(halfWidth, halfHeight)
            this.rotate(-(imgs[ii].rotate + imgs[ii].spin) * Math.PI / 180)
            this.translate(-(translateX), -(translateY))
            this.globalAlpha = 1
            this.scale(1 / scale, 1 / scale)
        }

        if (frameDuration < 200) {
            this.fillStyle = 'rgba(0, 0, 0,' + ((frameDuration - 1) / 200) + ')'
            this.fillRect(0, 0, canvas.app.width, canvas.app.height)
        } else {
            this.fillStyle = 'black'
            this.fillRect(0, 0, canvas.app.width, canvas.app.height)
        }
    }

    ctx.compute = function () {

    }

    this.SetupContextBindsForStreamAndBuildAfterLoad = function () {
        app.codeLoc = 'user/' + app.codesetting
        app.fileLocAssets = app.vscode._fileLocal + app.codeLoc + '/assets/'
        init()
        createGFXBindNodesToStream('timeline')
        // buildStream()
    }

    function createGFXBindNodesToStream (stream) {
        console.log('Binding objects to stream - Starting')
        var addon = ctx[stream].addon
        var bind = addon.binding
        var buffer = addon.buffer

        // development staging
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
                    ['rotate', imgs[ii].rotate, 6002],
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
        }
    }
    function buildStream (callback) {
        // build stream and prebuff from the binding DATA
        console.log('Finished Binding to stream - Building')
        ctx.timeline.build(function () {
            console.log('Finished Building - Initializing')
            ctx.timeline.addon.timeframe._init(window) // timeframe init has to be set to true for additional scripts to load
            callback()
        })
    }
}(this.app, this.canvas, this.ctx)
