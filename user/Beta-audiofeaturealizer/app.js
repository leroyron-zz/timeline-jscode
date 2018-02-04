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
    // var audioSrc, analyser, bufferLength, audioFreqData,
    window.Array.prototype.control = 0// Array control sprites
    // var inject = false

    var spts = ctx.spts = this.spts = [['zipper.png', 0.5, 0.1, '250px', '250px', 'center', 0, 0.5, 0], ['zipperhi.png', 0.5, 0.1, '250px', '250px', 'center', 0, 0.5, 0], ['sunflare.png', 0.5, 0.1, '650px', '650px', 'center', 0, 1, 0], ['lightstreak.png', 0.5, 0.1, '1300px', '650px', 'center', 0, 1, 0], ['orb.png', 0, 0, '89px', '89px', 'center', 0, 0, 0.0]]

    function init () {
        ctx.audio = [[app.fileLocAssets + 'drop.mp3', 0], [app.fileLocAssets + 'features.mp3', 1100]]
        var appDiv = document.getElementById('app')
        var infoDiv = document.getElementById('info')
        var loadingElem = document.createElement('div')
        loadingElem.id = 'loading'
        loadingElem.style.display = 'none'
        var lineupElem = document.createElement('div')
        lineupElem.id = 'lineup'
        appDiv.insertBefore(lineupElem, appDiv.childNodes[0])
        appDiv.insertBefore(loadingElem, appDiv.childNodes[0])
        var divElem = document.createElement('div')
        var playBut = document.createElement('button')
        var launched = false
        var playFeature = function (e) {
            if (launched) return

            loadingElem.className = 'show'
            launched = true
            playBut.addEventListener('click', function () {
                window.launchFullscreen(document.documentElement)
                divElem.style.display = 'none'
            })
            setTimeout(function () {
                ctx.audio[0][0].pause()

                var addon = ctx.timeline.addon
                addon.buffer.loadData('timeline', app.fileLocAssets + 'mp3Data956097_29876.js', 1100 /* , 956097, 29876 */)// nodeDataLength(956097) propDataLength(29876) also duration of audio analyser demo which produces the file,
                addon.binding.run(function () {
                    // addon.buffer.loadData('timeline', app.fileLocAssets + 'enhancementData956097_29876.js', 1100, function () {
                    addon.buffer.run(function () {
                        // return
                        window.onresize()
                        buildStream(function () {
                            ctx.audio[1][2].send()// load feature right after
                            ctx.audio[0][0].currentTime = 0
                            ctx.play = function () {
                                setTimeout(function () {
                                    if (timeframe.duration > 1100) {
                                        ctx.audio[0][0].currentTime = 0
                                        timeframe.goTo(1100)
                                    } else {
                                        ctx.play()
                                    }
                                }, 500)
                            }
                            timeframe.run()
                            ctx.audio[0][0].play()
                            ctx.play()
                            setTimeout(function () { loadingElem.className = 'clear' }, 3000)

                            divElem.style.display = 'none'
                            playBut.removeEventListener('click')

                            timeframe.clearRuntimeAuthority('segment', 0)
                        })
                    })
                    // } /* , 956097, 29876 */)
                })
            }, 1000)
        }
        for (let ai = 0; ai < ctx.audio.length; ai++) {
            var audioRequest = ctx.audio[ai][2] = new window.XMLHttpRequest()
            audioRequest.id = ai
            audioRequest.open('GET', ctx.audio[ai][0], true)
            audioRequest.responseType = 'blob'

            audioRequest.onload = function () {
                ctx.audio[this.id][0] = new window.Audio(window.URL.createObjectURL(this.response))
                ctx.audio[this.id][0].paused = true
                if (this.id == 0) { // ////// Build Stream after feature mp3 loads:
                    // var actionPositions = [1500, 6200, 10200, 14200, 19500, 25400]
                    var bar4th = 75
                    var barLength = (timelineLength - 1100) / bar4th

                    var segmentAuth = new function (timeframe) {
                        this.main = function () {
                            if (timeframe.duration > 1100 && timeframe.duration < timelineLength - barLength) syncTimelineWithAudio()
                        }
                        return this
                    }(timeframe)

                    var data = {segment: {}}
                    for (let bi = 0; bi < timelineLength - 1100; bi += barLength) {
                        data.segment[bi + 1100 << 0] = {Authority: segmentAuth, position: (bi + 1100 << 0) / timelineLength * 100}
                    }
                    timeframe._forceInit(window) // force initialization so inserts could be added early
                    timeframe.ready = false // set ready back to false to start the app
                    timeframe.timeline.seek.insert.insertAuthorities(data)

                    var autoRefresh = setTimeout(function () { window.location.reload() }, 8000)
                    window.onload = function () {
                        loadingElem.style.display = ''
                        playBut.style.width = '100%'
                        playBut.style.height = '100%'
                        playBut.style.position = 'fixed'
                        playBut.style.top = 0
                        playBut.style.left = 0
                        playBut.style.background = 'none'
                        playBut.style.border = 'none'
                        playBut.style.cursor = 'pointer'
                        playBut.addEventListener('click', function () {
                            ctx.audio[0][0].play()
                            playFeature()
                            clearTimeout(autoRefresh)
                        })
                    }
                    divElem.appendChild(playBut)
                    infoDiv.appendChild(divElem)
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
                for (let gi = 0; gi < 125; gi++) {
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
                        0,
                        [
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
                    spts[si][5], // align
                    spts[si][6], // rotate
                    spts[si][7], // scale
                    spts[si][8], // alpha
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
                        //     .Knob()// the pointer moves the knob, knob moves the cursor
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
                spts[0].sprite.value = 0
                spts[0].scaleUpTo = 0.01
                spts[0].hold = false
            } else if (Math.distance2(pointer.normal, spts[0].normal) < 0.15 && !spts[0].hold) {
                spts[0].sprite.value = 1
                spts[0].scaleUpTo = 0.15
                canvas.node.style.cursor = 'pointer'
                spts[0].hover = true
                if (pointer.type == 'mousedown' || pointer.type == 'touchstart') {
                    spts[0].hold = true
                }
            } else if (spts[0].hover && !spts[0].hold) {
                spts[0].sprite.value = 0
                spts[0].scaleUpTo = 0.01
                canvas.node.style.cursor = ''
            } else if (spts[0].hold) {
                let zipper = pointer.normal.x
                zipper = zipper < 0.1 ? 0.1 : zipper > 0.899 ? 0.899 : zipper
                let frame = (timelineLength - 1100) * ((zipper - 0.1) / 0.8) + 1100 << 0
                // ctx.audio[0][0].play()
                ctx.audio[0][0].currentTime = (frame - 1100) / 100 << 0
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

        var syncTimelineWithAudio = function () {
            timeframe.goTo((ctx.audio[0][0].currentTime * 100) + 1100 << 0)
        }

        document.getElementsByTagName('link')[0].href = app.codeLoc + '/style.css?v=1.0'
    }

    timeframe.process = function () {
        ctx.process(this.access, this.frame._duration, this._timeFrame, this.lapse)// before timeFrame process
    }

    ctx.process = function (access, duration, timeFrame, lapse) {

    }

    timeframe.invoke = function () {
        ctx.calc(this.frame.duration, this.lapse, this.access)// before render
        ctx.rendering(this.frame.duration)
        ctx.gui(this.frame.duration)// gui render
        ctx.background(this.frame.duration)// after render
        ctx.compute()// after render
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
        alpha: {value: 0},
        progress: {
            loaded: 0,
            show: false,
            position: {x: 0.1, y: 0.837},
            measure: {width: 0.8, height: 1},
            alpha: {value: 0}
        }
    }

    ctx.calc = function (frameDuration, lapse, access) {
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
    }

    ctx.gui = function (frameDuration) {
        if (frameDuration > 1100) {
            let time = frameDuration - 1100
            let sec = (time / 100) % 60 << 0 // sec
            let min = ((time / (100 * 60)) % 60) << 0 // minute
            sec = sec < 10 ? '0' + sec : sec
            min = min < 10 ? '0' + min : min
            this.font = '12px Arial'
            this.textAlign = 'center'
            this.fillStyle = 'white'
            this.fillText(min + ':' + sec, spts[0].normal.x * app.width - spts[0].position.x, 0.9 * app.height)
            seeker.show = seeker.show == 0 ? 1 : seeker.show
            if (!this.audio[1][0].play) {
                seeker.progress.show = 1
                this.audio[1][0] = {play: 'halted'}
                spts[0].spinTo = spts[1].spinTo = 50
                this.audio[1][2].onprogress = function (xhr) {
                    spts[0].spinTo += spts[1].spinTo += 50
                    seeker.progress.loaded = (xhr.loaded / (xhr.total || 7171451))
                }
            } else if (this.audio[1][0].play != 'halted' && seeker.show == 1) {
                seeker.progress.show = 0
                seeker.show = 0.5
                if (this.audio[1][0].paused && timeframe.duration > 1100) timeframe.goTo(1100)
                this.audio[0][0].backupSrc = this.audio[0][0].src
                this.audio[0][0].src = this.audio[1][0].src
                // this.audio[0][0].currentTime = this.audio[0][0].currentTime > 0 ? 0 : this.audio[0][0].currentTime
                this.audio[0][0].play()
            }
            Math.lerpProp(seeker.alpha, 'value', seeker.show, 0.05)
            this.fillStyle = 'rgba(255, 100, 0,' + seeker.alpha.value + ')'
            this.fillRect(
                canvas.app.width * seeker.position.x,
                canvas.app.height * seeker.position.y,
                canvas.app.width * seeker.measure.width,
                seeker.measure.height
            )

            Math.lerpProp(seeker.progress.alpha, 'value', seeker.progress.show, 0.05)
            this.strokeStyle = 'rgba(255, 255, 255,' + seeker.progress.alpha.value + ')'
            this.strokeRect(
                canvas.app.width * seeker.progress.position.x,
                canvas.app.height * seeker.progress.position.y - (seeker.progress.measure.height / 2),
                canvas.app.width * seeker.progress.measure.width * seeker.progress.loaded,
                seeker.progress.measure.height
            )
        } else {
            if (this.audio[0][0].backupSrc) {
                this.audio[0][0].src = this.audio[0][0].backupSrc
                this.audio[0][0].backupSrc = null
                delete this.audio[0][0].backupSrc

                this.audio[0][0].currentTime = 0
                this.audio[0][0].play()
            }
            seeker.show = seeker.progress.show = seeker.alpha.value = seeker.progress.alpha.value = 0
        }

        this.spts.control = spts.length// expect seeker gui (-1)
        if (frameDuration > 1100 && seeker.show != 1) {
            this.spts.control = 0// prevent rendering of sprites

            spts[0].position.x = 0.8 * ((frameDuration - 1100) / (timelineLength - 1100)) + 0.1
            // frameDuration = (timelineLength - 1100) * ((spts[0].position.x - 0.1) / 0.8) + 1100
            // console.log(frameDuration, spts[0].position.x)
        }
        spts[0].normal = {x: spts[0].position.x, y: spts[0].position.y}

        let spt = spts[0]
        if (spt.scaleUpTo) Math.lerpProp(spt, 'scaleUp', spt.scaleUpTo, 0.15)
        let scale = spt.scale.value + spt.scaleUp
        this.scale(scale, scale)
        this.globalAlpha = spt.alpha.value
        let translateX = spt.position.x * app.width * (1 / scale)
        let translateY = spt.position.y * app.height * (1 / scale)
        this.translate(translateX, translateY)
        if (spt.spinTo) Math.lerpProp(spt, 'spin', spt.spinTo, 0.05)
        this.rotate(spt.rotate.value + (spt.spin * Math.PI / 180))
        this.translate(-spt.position.offset.left, -spt.position.offset.top)
        this.drawImage(spt, (spt.measure.width * spt.sprite.value), 0, spt.measure.width, spt.measure.height, 0, 0, spt.measure.width, spt.measure.height)
        this.translate(spt.position.offset.left, spt.position.offset.top)
        this.rotate(-(spt.rotate.value + (spt.spin * Math.PI / 180)))
        this.translate(-(translateX), -(translateY))
        this.globalAlpha = 1
        this.scale(1 / scale, 1 / scale)
    }

    ctx.rendering = function (frameDuration) {
        for (let si = this.spts.control - 1; si > 0/* expect seeker gui (0) otherwise (-1) */; si--) {
            let spt = spts[si]
            let scale = spt.scale.value
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

    ctx.background = function (frameDuration) {
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
        queueBindingsNodesToStream('timeline')
        queueBufferGFXBindNodesToStream('timeline')
        // buildStream()
    }

    function queueBindingsNodesToStream (stream) {
        console.log('Objects being queued for Binding - Collecting')
        var addon = ctx[stream].addon
        var bind = addon.binding

        let audioFreqData = new Array(32).fill(0)
        bind.queue(stream, [
        [ctx.audio[0][2].frequency = {'poly': []}, 800]
        ],
            [
            ['poly', audioFreqData]
            ],
        [802],
        false,
        1) // 0 - 255

        /* bind.queue(stream, [
        [ctx.audio[0][2].enhancement = {'poly': []}, 801]
        ],
            [
            ['poly', audioFreqData]
            ],
        [802],
        false,
        100) // 0 - 100
        // enhance precision */

        // binding staging
        for (let si = 0; si < spts.length; si++) {
            bind.queue(stream, [
            [spts[si]]
            ],
                [
                ['alpha', spts[si].alpha.value],
                ['scale', spts[si].scale.value]
                ])
        }
        for (let si = 0; si < spts.length; si++) {
            bind.queue(stream, [
            [spts[si].position]
            ],
                [
                ['x', spts[si].position.x],
                ['y', spts[si].position.y]
                ])
        }
        for (let si = 0; si < spts.length; si++) {
            // debugger
            bind.queue(stream, [
            [spts[si].rotate]
            ],
                [
                    spts[si].name == 'zipper' ? ['value', spts[si].rotate.value, 6002] : ['value', spts[si].rotate.value]
                ])
        }
    }

    function queueBufferGFXBindNodesToStream (stream) {
        console.log('Objects being queued for Buffing - Collecting')
        var addon = ctx[stream].addon
        var buffer = addon.buffer

        for (let si = 0; si < spts.length; si++) {
            if (spts[si].name == 'zipper') {
                buffer.queue('eval', stream,
                    [
                        [
                        [spts[si]], [[['alpha', 1 - spts[si].alpha.value]]], [['easeOutQuad', 300]], 400
                        ]
                    ],
                false)
                buffer.queue('valIn', stream, [spts[si]], ['alpha'], 1, 300 + 200, timelineLength)

                buffer.queue('eval', stream,
                    [
                        [
                        [spts[si].rotate, spts[1].rotate], [[['value', 12510 + spts[si].rotate.value]]], [['easeOutQuad', 1000]], 400
                        ]
                    ],
                false)

                buffer.queue('eval', stream,
                    [
                        [
                        [spts[si]], [[['scale', -0.1]]], [['easeOutQuad', 100]], 1000
                        ]
                    ],
                false)
                buffer.queue('valIn', stream, [spts[si]], ['scale'], 0.4, 1100, timelineLength)
            }

            if (spts[si].name == 'sunflare') {
                buffer.queue('eval', stream,
                    [
                        [
                        [spts[si], spts[1], spts[3]], [[['alpha', 1 - spts[si].alpha.value], ['alpha', 0], ['alpha', -2]]], [['easeOutQuad', 300]], 400
                        ]
                    ],
                false)

                buffer.queue('valIn', stream, [spts[si], spts[1], spts[3]], ['alpha'], 0.01, 900 + 175, timelineLength)

                // zipper, zipperhi, sunflare, lightstreak
                buffer.queue('eval', stream,
                    [
                        [
                        [spts[si].position, spts[0].position, spts[1].position, spts[3].position], [[['y', 0.05 - spts[0].position.y]]], [['easeOutBounce', 120]], 220
                        ]
                    ],
                false)

                // zipper, zipperhi, sunflare, lightstreak
                buffer.queue('eval', stream,
                    [
                        [
                        [spts[si].position, spts[0].position, spts[1].position, spts[3].position], [[['y', 1 - spts[0].position.y]]], [['easeOutBounce', 300]], 500
                        ]
                    ],
                false)

                buffer.queue('eval', stream,
                    [
                        [
                        [spts[si].position, spts[0].position, spts[1].position, spts[3].position], [[['x', 0.1 - spts[0].position.x]]], [['easeOutQuad', 100]], 700
                        ]
                    ],
                false)
                buffer.queue('valIn', stream, [spts[si].position, spts[0].position, spts[1].position, spts[3].position], ['y'], 0.937, 750, 150)
                buffer.queue('valIn', stream, [spts[si].position, spts[0].position, spts[1].position, spts[3].position], ['x'], 0.1, 800, timelineLength)
                buffer.queue('exec', stream, [[[spts[si].position, spts[0].position, spts[1].position, spts[3].position], [[750, 'y', -0.1, 0.937, 'easeOutQuad', 150]]]],
                false)
                buffer.queue('valIn', stream, [spts[si].position, spts[0].position, spts[1].position, spts[3].position], ['y'], 0.837, 900, timelineLength)
            }

            if (spts[si].name == 'orb') {
                // Only orbs
                buffer.queue('eval', stream,
                    [
                        [
                        [spts[si]], [[['alpha', 0.15]]], [['easeOutQuad', 50]], spts[si].offset
                        ]
                    ],
                false)
                buffer.queue('valIn', stream, [spts[si]], ['alpha'], 0.16, 50 + spts[si].offset, timelineLength)

                buffer.queue('eval', stream,
                    [
                        [
                        [spts[si].position], [[['x', 0.5 - spts[si].position.x]]], [['easeOutQuint', 100]], spts[si].offset
                        ]
                    ],
                false)
                buffer.queue('valIn', stream, [spts[si].position], ['x'], 0.5, 100 + spts[si].offset, timelineLength)
                if (spts[si].offset > 225) buffer.queue('execLerp', stream, [spts[si].position], ['x'], spts[0].position, 'x', 1, 0.04, true, false, spts[si].offset, 1200, 'easeInQuint')

                buffer.queue('eval', stream,
                    [
                        [
                        [spts[si].position], [[['y', 0.1 - spts[si].position.y]]], [['easeOutQuad', 100]], spts[si].offset
                        ]
                    ],
                false)
                buffer.queue('valIn', stream, [spts[si].position], ['y'], 0.1, 100 + spts[si].offset, timelineLength)
                // stream, nodes, props, refnode, refprop, flux, parallel, reach, from, to, ease, leapCallback, reassign, dispose, zeroIn, skipLeap
                if (spts[si].offset > 225) buffer.queue('execLerp', stream, [spts[si].position], ['y'], spts[0].position, 'y', 1, 0.05, true, false, spts[si].offset, 1200, 'easeInQuint')

                let scaleRandom = Math.randomFromTo(100, (10 * si)) / 100 - spts[si].scale.value
                buffer.queue('eval', stream,
                    [
                        [
                        [spts[si]], [[['scale', 0.4], ['scale', -0.5]]], [['easeOutQuad', 50]], spts[si].offset
                        ]
                    ],
                false)

                buffer.queue('eval', stream,
                    [
                        [
                        [spts[si]], [[['scale', scaleRandom], ['scale', -scaleRandom - 2]]], [['easeOutQuint', 25]], 200 + spts[si].offset
                        ]
                    ],
                false)

                buffer.queue('eval', stream,
                    [
                        [
                        [spts[3]], [[['alpha', 0.005], ['alpha', -0.005]]], [['easeOutQuint', 10]], 200 + spts[si].offset
                        ]
                    ],
                true)// bring in alpha for lightstreak blasts, using relative blending values
                buffer.queue('valIn', stream, [spts[si]], ['scale'], 0.01, 200 + 200 + spts[si].offset, timelineLength)

                buffer.queue('eval', stream,
                    [
                        [
                        [spts[si]], [[['alpha', 0.01]]], [['easeOutQuad', 50]], 230 + spts[si].offset - (si / 4 << 0)
                        ]
                    ],
                false)
                buffer.queue('valIn', stream, [spts[si]], ['alpha'], 0.00, 50 + 230 + spts[si].offset - (si / 4 << 0), timelineLength)
            }
        }
    }
    function buildStream (callback) {
        // build stream and prebuff from the binding DATA
        console.log('Starting Build')
        ctx.timeline.build(function () {
            console.log('Finished Build - Initializing')
            // already forced init after load
            // timeframe._init(window) // timeframe init has to be set to true for additional scripts to load
            callback()
        })
    }
}(this.app, this.canvas, this.ctx)
