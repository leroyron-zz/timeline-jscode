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
    // !! All injections and enhancement done inside audioanalyser demo
    // var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    // var audio, audioSrc, analyser, bufferLength, audioFreqData,
    var audio
    // var inject = false

    var spts = ctx.spts = this.spts = [['zipper.png', 0.5, 0.1, '250px', '250px', 0, 0.5, 0], ['zipperhi.png', 0.5, 0.1, '250px', '250px', 0, 0.5, 0], ['sunflare.png', 0.5, 0.1, '650px', '650px', 0, 1, 0], ['lightstreak.png', 0.5, 0.1, '1300px', '650px', 0, 1, 0], ['orb.png', 0, 0, '89px', '89px', 0, 0, 0]]

    function init () {
        audio = [[app.fileLocAssets + 'drop.mp3', 0], [app.fileLocAssets + 'features.mp3', 1100]]
        var div = document.getElementById('info')
        var divElem = document.createElement('div')
        var playBut = document.createElement('button')

        var playFeature = function (e) {
            divElem.style.display = 'none'

            audio[0][0].play()

            audio[1][2].send()// load feature right after

            timeframe.run()

            playBut.removeEventListener('click', playFeature)

            timeframe.clearRuntimeAuthority('segment', 0)
        }
        for (let ai = 0; ai < audio.length; ai++) {
            var audioRequest = audio[ai][2] = new window.XMLHttpRequest()
            audioRequest.id = ai
            audioRequest.open('GET', audio[ai][0], true)
            audioRequest.responseType = 'blob'

            audioRequest.onload = function () {
                audio[this.id][0] = new window.Audio(window.URL.createObjectURL(this.response))
                audio[this.id][0].paused = true
                if (this.id == 0) { // ////// Build Stream after feature mp3 loads:
                    buildStream(function () {
                        // var actionPositions = [1500, 6200, 10200, 14200, 19500, 25400]
                        var bar4th = 75
                        var barLength = (timelineLength - 1100) / bar4th

                        var segmentAuth = new function (timeframe) {
                            this.main = function () {
                                if (timeframe.duration > 1100 && timeframe.duration < timelineLength - barLength) timeframe.goTo((audio[0][0].currentTime * 100) + 1100 << 0)
                            }
                            return this
                        }(ctx.timeline.addon.timeframe)

                        var data = {segment: {}}
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
        var genSprites = []
        ctx.globalAlpha = 0
        for (let si = 0; si < spts.length; si++) {
            if (si == 4) {
                for (var gi = 0; gi < 125; gi++) {
                    genSprites.push(ctx.sprite(
                        app.fileLocAssets + spts[si][0],
                        Math.randomFromTo(10, 90) / 100, // random x 0.1 - 0.9
                        Math.randomFromTo(60, 80) / 100, // random y 0.6 - 0.8
                        spts[si][3], // width
                        spts[si][4], // height
                        spts[si][5], // rotate
                        Math.randomFromTo(15, 30) / 100, // random scale 0.15 - 0.3
                        spts[si][7], // alpha
                        0,
                        [
                            ['spin', 0],
                            ['scaleUp', 0],
                            ['offset', Math.randomFromTo(gi * 5, 100)] // offset increment
                        ],
                        function () {
                            // debugger
                            // arguments
                        },
                        [1, 2, 3])
                    )
                }
            } else {
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
                    [
                        ['spin', 0],
                        ['scaleUp', 0],
                        ['offset', 300]
                    ],
                    function () {
                        // debugger
                        // arguments
                    },
                    [1, 2, 3])
                )
            }
        }

        spts = genSprites

        system = new System()// start new system and start the down-line
                             .Pointer()// the pointer such as a mouse or touch moves the cursor
                        //   .Knob()// the pointer moves the knob, knob moves the cursor
                        //   .Subject()// node/object moves the cursor
                                    // .Marquee()// cursor draws the marquee
                                    // .Grid()// the grid prepares the matrices to render textiles, boundaries, particles and collisions depending on cursor, knob or subject location
                                        //    .Parallax()// exploits grid data and cuts out necessary data for optimization, rendering and other various uses such as background movement
                                                    //   .Entity()// node/object collection optimized by parallax
                                                    //   .Physic()// chained physics optimized by parallax
                                                    //   .Bound()// utilizes the parallax exploits to resolve and utilize boundary matrices
                                                    //   .Collision()// utilizes the parallax exploits to resolve and utilize collision matrices
                                                                //   .Particle()// entities could emit particles, particle generation and behaviors affected by physics, boundaries and collisions
                                                                //   .Rig()// rigging behaviors affected by entities, physics, boundaries and collisions

        system.Pointer
        .bind(app.pointers, canvas.node)
        .result(function (pointer) {
            if (pointer.type == 'mouseup' || pointer.type == 'touchend') {
                spts[0].sprite = 0
                spts[0].scaleUpTo = 0.01
                spts[0].hold = false
            } else if (Math.distance2(pointer.normal, spts[0].normal) < 0.15 && !spts[0].hold) {
                spts[0].sprite = 1
                spts[0].scaleUpTo = 0.15
                canvas.node.style.cursor = 'pointer'
                spts[0].hover = true
                if (pointer.type == 'mousedown' || pointer.type == 'touchstart') {
                    spts[0].hold = true
                }
            } else if (spts[0].hover && !spts[0].hold) {
                spts[0].sprite = 0
                spts[0].scaleUpTo = 0.01
                canvas.node.style.cursor = ''
            } else if (spts[0].hold) {
                let zipper = pointer.normal.x
                zipper = zipper < 0.1 ? 0.1 : zipper > 0.899 ? 0.899 : zipper
                let frame = (timelineLength - 1100) * ((zipper - 0.1) / 0.8) + 1100 << 0
                // audio[0][0].play()
                audio[0][0].currentTime = (frame - 1100) / 100 << 0
                timeframe.goTo(frame)
            } else { return }

            if (app.pointers.inUse) {

            }
        })
        .init()

        /* system.Subject
        .bind(spts[0], app.pointers, 0.15)
        .hover(function (subject, pointer) {
            subject.src = subject.sec.src
            subject.scaleUpTo = 0.15
        })
        .down(function (subject, pointer) {

        })
        .drag(function (subject, pointer) {
            subject.position.x = 0
        })
        .drop(function (subject, pointer) {

        })
        .out(function (subject, pointer) {
            subject.src = subject.fst.src
            subject.scaleUpTo = 0.01
        })
        .init() */

        document.getElementsByTagName('link')[0].href = app.codeLoc + '/style.css?v=1.0'
    }

    ctx.timeline.addon.timeframe.process = function () {
        ctx.process(this.access, this.frame._duration, this._timeFrame, this.lapse)// before timeFrame process
    }

    ctx.process = function (access, duration, timeFrame, lapse) {
        
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
        position: {x: 0.1, y: 0.837},
        measure: {width: 0.8, height: 1},
        alpha: 0,
        progress: {
            loaded: 0,
            show: false,
            position: {x: 0.1, y: 0.837},
            measure: {width: 0.8, height: 1},
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
            if (!audio[1][0].play) {
                seeker.progress.show = 1
                audio[1][0] = {play: 'halted'}
                spts[0].spinTo = spts[1].spinTo = 50
                audio[1][2].onprogress = function (xhr) {
                    spts[0].spinTo += spts[1].spinTo += 50
                    seeker.progress.loaded = (xhr.loaded / (xhr.total || 7171451))
                }
            } else if (audio[1][0].play != 'halted' && seeker.show == 1) {
                seeker.progress.show = 0
                seeker.show = 0.5
                if (audio[1][0].paused && timeframe.duration > 1100) timeframe.goTo(1100)
                audio[0][0].backupSrc = audio[0][0].src
                audio[0][0].src = audio[1][0].src
                audio[0][0].currentTime = 0
                audio[0][0].play()
            }

            Math.lerpProp(seeker, 'alpha', seeker.show, 0.05)
            this.fillStyle = 'rgba(255, 100, 0,' + seeker.alpha + ')'
            this.fillRect(
                canvas.app.width * seeker.position.x,
                canvas.app.height * seeker.position.y,
                canvas.app.width * seeker.measure.width,
                seeker.measure.height
            )

            Math.lerpProp(seeker.progress, 'alpha', seeker.progress.show, 0.05)
            this.strokeStyle = 'rgba(255, 255, 255,' + seeker.progress.alpha + ')'
            this.strokeRect(
                canvas.app.width * seeker.progress.position.x,
                canvas.app.height * seeker.progress.position.y - (seeker.progress.measure.height / 2),
                canvas.app.width * seeker.progress.measure.width * seeker.progress.loaded,
                seeker.progress.measure.height
            )
        } else {
            if (audio[0][0].backupSrc) {
                audio[0][0].src = audio[0][0].backupSrc
                audio[0][0].backupSrc = null
                delete audio[0][0].backupSrc

                audio[0][0].currentTime = 0
                audio[0][0].play()
            }
            seeker.show = seeker.progress.show = seeker.alpha = seeker.progress.alpha = 0
        }

        var sLen = spts.length
        if (frameDuration > 1100 && seeker.show != 1) {
            sLen = 1

            spts[0].position.x = 0.8 * ((frameDuration - 1100) / (timelineLength - 1100)) + 0.1
            // frameDuration = (timelineLength - 1100) * ((spts[0].position.x - 0.1) / 0.8) + 1100
            // console.log(frameDuration, spts[0].position.x)
        }
        spts[0].normal = {x: spts[0].position.x, y: spts[0].position.y}
        for (let si = sLen - 1; si > -1; si--) {
            if (spts[si].scaleUpTo) Math.lerpProp(spts[si], 'scaleUp', spts[si].scaleUpTo, 0.15)
            let scale = spts[si].scale + spts[si].scaleUp
            this.scale(scale, scale)
            this.globalAlpha = spts[si].alpha
            let halfWidth = spts[si].measure.width / 2
            let halfHeight = spts[si].measure.height / 2
            let translateX = spts[si].position.x * app.width * (1 / scale)
            let translateY = spts[si].position.y * app.height * (1 / scale)
            this.translate(translateX, translateY)
            if (spts[si].spinTo) Math.lerpProp(spts[si], 'spin', spts[si].spinTo, 0.05)
            this.rotate((spts[si].rotate + spts[si].spin) * Math.PI / 180)
            this.translate(-halfWidth, -halfHeight)
            this.drawImage(spts[si], (spts[si].measure.width * spts[si].sprite), 0, spts[si].measure.width, spts[si].measure.height, 0, 0, spts[si].measure.width, spts[si].measure.height)
            this.translate(halfWidth, halfHeight)
            this.rotate(-(spts[si].rotate + spts[si].spin) * Math.PI / 180)
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

        let audioFreqData = new Array(32).fill(0)
        bind(stream, [
        [audio[0][0].frequency = {'poly': []}, 780]
        ],
            [
            ['poly', audioFreqData]
            ],
        [782],
        false,
        1) // 0 - 255

        bind(stream, [
        [audio[0][0].enhancement = {'poly': []}, 781]
        ],
            [
            ['poly', audioFreqData]
            ],
        [782],
        false,
        100) // 0 - 100
        // enhance precision

        // development staging
        for (let si = 0; si < spts.length; si++) {
            // Only zipper
            if (spts[si].name == 'zipper') {
                bind(stream, [
                [spts[si]]
                ],
                    [
                    ['alpha', spts[si].alpha],
                    ['rotate', spts[si].rotate, 6002],
                    ['scale', spts[si].scale]
                    ])
            } else {
                bind(stream, [
                [spts[si]]
                ],
                    [
                    ['alpha', spts[si].alpha],
                    ['rotate', spts[si].rotate],
                    ['scale', spts[si].scale]
                    ])
            }
        }
        for (let si = 0; si < spts.length; si++) {
            // Only zipper
            bind(stream, [
            [spts[si].position]
            ],
                [
                ['x', spts[si].position.x],
                ['y', spts[si].position.y]
                ])
        }
        for (let si = 0; si < spts.length; si++) {
            if (spts[si].name == 'zipper') {
                buffer.eval('timeline',
                    [
                        [
                        [spts[si]], [[['alpha', 1 - spts[si].alpha]]], [['easeOutQuad', 300]], 400
                        ]
                    ],
                false)
                buffer.valIn('timeline', [spts[si]], ['alpha'], 1, 300 + 200, timelineLength)

                buffer.eval('timeline',
                    [
                        [
                        [spts[si], spts[1]], [[['rotate', 12510 + spts[si].rotate]]], [['easeOutQuad', 1000]], 400
                        ]
                    ],
                false)

                buffer.eval('timeline',
                    [
                        [
                        [spts[si]], [[['scale', -0.1]]], [['easeOutQuad', 100]], 1000
                        ]
                    ],
                false)
                buffer.valIn('timeline', [spts[si]], ['scale'], 0.4, 1100, timelineLength)
            }

            if (spts[si].name == 'sunflare') {
                buffer.eval('timeline',
                    [
                        [
                        [spts[si], spts[1], spts[3]], [[['alpha', 1 - spts[si].alpha], ['alpha', 0], ['alpha', -2]]], [['easeOutQuad', 300]], 400
                        ]
                    ],
                false)

                buffer.valIn('timeline', [spts[si], spts[1], spts[3]], ['alpha'], 0.01, 900 + 175, timelineLength)

                // zipper, zipperhi, sunflare, lightstreak
                buffer.eval('timeline',
                    [
                        [
                        [spts[si].position, spts[0].position, spts[1].position, spts[3].position], [[['y', 0.05 - spts[0].position.y]]], [['easeOutBounce', 120]], 220
                        ]
                    ],
                false)

                // zipper, zipperhi, sunflare, lightstreak
                buffer.eval('timeline',
                    [
                        [
                        [spts[si].position, spts[0].position, spts[1].position, spts[3].position], [[['y', 1 - spts[0].position.y]]], [['easeOutBounce', 300]], 500
                        ]
                    ],
                false)

                buffer.eval('timeline',
                    [
                        [
                        [spts[si].position, spts[0].position, spts[1].position, spts[3].position], [[['x', 0.1 - spts[0].position.x]]], [['easeOutQuad', 100]], 700
                        ]
                    ],
                false)
                buffer.valIn('timeline', [spts[si].position, spts[0].position, spts[1].position, spts[3].position], ['y'], 0.937, 750, 150)
                buffer.valIn('timeline', [spts[si].position, spts[0].position, spts[1].position, spts[3].position], ['x'], 0.1, 800, timelineLength)
                buffer.exec('timeline',
                    [
                        [
                        [spts[si].position, spts[0].position, spts[1].position, spts[3].position], [[750, 'y', -0.1, 'easeOutQuad', 150, 0.937]]
                        ]
                    ],
                false)
                buffer.valIn('timeline', [spts[si].position, spts[0].position, spts[1].position, spts[3].position], ['y'], 0.837, 900, timelineLength)
            }

            if (spts[si].name == 'orb') {
                // Only orbs
                buffer.eval('timeline',
                    [
                        [
                        [spts[si]], [[['alpha', 0.15]]], [['easeOutQuad', 50]], spts[si].offset
                        ]
                    ],
                false)
                buffer.valIn('timeline', [spts[si]], ['alpha'], 0.16, 50 + spts[si].offset, timelineLength)

                buffer.eval('timeline',
                    [
                        [
                        [spts[si].position], [[['x', 0.5 - spts[si].position.x]]], [['easeOutQuint', 100]], spts[si].offset
                        ]
                    ],
                false)
                buffer.valIn('timeline', [spts[si].position], ['x'], 0.5, 100 + spts[si].offset, timelineLength)
                if (spts[si].offset > 225) buffer.execLerp('timeline', [spts[si].position], ['x'], spts[0].position, 'x', 1, 0.04, true, false, spts[si].offset, 1200, 'easeInQuint')

                buffer.eval('timeline',
                    [
                        [
                        [spts[si].position], [[['y', 0.1 - spts[si].position.y]]], [['easeOutQuad', 100]], spts[si].offset
                        ]
                    ],
                false)
                buffer.valIn('timeline', [spts[si].position], ['y'], 0.1, 100 + spts[si].offset, timelineLength)
                // stream, nodes, props, refnode, refprop, flux, parallel, reach, from, to, ease, leapCallback, reassign, dispose, zeroIn, skipLeap
                if (spts[si].offset > 225) buffer.execLerp('timeline', [spts[si].position], ['y'], spts[0].position, 'y', 1, 0.05, true, false, spts[si].offset, 1200, 'easeInQuint')

                let scaleRandom = Math.randomFromTo(100, (10 * si)) / 100 - spts[si].scale
                buffer.eval('timeline',
                    [
                        [
                        [spts[si]], [[['scale', 0.4], ['scale', -0.5]]], [['easeOutQuad', 50]], spts[si].offset
                        ]
                    ],
                false)

                buffer.eval('timeline',
                    [
                        [
                        [spts[si]], [[['scale', scaleRandom], ['scale', -scaleRandom - 2]]], [['easeOutQuint', 25]], 200 + spts[si].offset
                        ]
                    ],
                false)

                buffer.eval('timeline',
                    [
                        [
                        [spts[3]], [[['alpha', 0.005], ['alpha', -0.005]]], [['easeOutQuint', 10]], 200 + spts[si].offset
                        ]
                    ],
                true)// bring in alpha for lightstreak blasts, using relative blending values
                buffer.valIn('timeline', [spts[si]], ['scale'], 0.01, 200 + 200 + spts[si].offset, timelineLength)

                buffer.eval('timeline',
                    [
                        [
                        [spts[si]], [[['alpha', 0.01]]], [['easeOutQuad', 50]], 230 + spts[si].offset - (si / 4 << 0)
                        ]
                    ],
                false)
                buffer.valIn('timeline', [spts[si]], ['alpha'], 0.00, 50 + 230 + spts[si].offset - (si / 4 << 0), timelineLength)
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
