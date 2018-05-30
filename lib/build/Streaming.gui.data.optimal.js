/**
 * Streaming gui timeline theme (Optimal - no charts, inserting, dialogs and vscode authority, only settings gui)
 * Utilizing:
 * dat.gui prototypes for 0.6.2
 * @dataarts / dat.GUI / https://github.com/dataarts/dat.gui
 * @author leroyron / http://leroy.ron@gmail.com
 * //customize dat.gui / bind/handle callbacks
 */
(function (dat, Addon) {
    this.gui = new dat.GUI({
        load: JSON,
        preset: 'Chrome'
    })
    this.gui.close()
    /**
     * dat.gui AddOn
     * @author leroyron / http://leroy.ron@gmail.com
     * //bind / handle callbacks
     */
    this.gui.addon = {bind: {}}
    this.gui.addon.bind.onchange = function (controller, func) {
        controller.onChange(function (val) {
        // ToDo - !!do val check!!
            func(this)
        })
    }
    var _createBindCallBack = function (obj, unique, uni) {
        if (!obj[unique]) {
            obj[unique] = function () {
                this[unique + 'Callbacks']()
            }
        }
        obj[unique + 'Calls'] = []
        obj[uni] = 0
        obj[unique + 'Callbacks'] = function () {
            for (let c = 0; c < this[uni]; c++) {
                this[unique + 'Calls'][c][1](this[unique + 'Calls'][c][0])
            }
        }
    }
    this.gui.addon.bind.oninit = function (controller, init, func) {
        if (!init.initCalls) {
            _createBindCallBack(init, 'init', 'inclen')
        }
        init.initCalls.push([controller, func])
        init.inclen++
    }
    this.gui.addon.bind.onready = function (controller, ready, func) {
        if (!ready.readyCalls) {
            _createBindCallBack(ready, 'ready', 'rdclen')
        }
        ready.readyCalls.push([controller, func])
        ready.rdclen++
    }
    this.gui.addon.bind.onupdate = function (controller, update, func) {
        if (!update.updateCalls) {
            _createBindCallBack(update, 'update', 'upclen')
        }
        update.updateCalls.push([controller, func])
        update.upclen++
    }
    this.gui.addon.bind.onruntime = function (controller, runtime, func) {
        if (!runtime.runtimeCalls) {
            _createBindCallBack(runtime, 'runtime', 'ruclen')
        }
        runtime.runtimeCalls.push([controller, func])
        runtime.ruclen++
    }
    this.gui.addon.bind.onrevert = function (controller, revert, func) {
        if (!revert.revertCalls) {
            _createBindCallBack(revert, 'revert', 'rrclen')
        }
        revert.revertCalls.push([controller, func])
        revert.rrclen++
    }
    this.gui.addon.bind.onpass = function (controller, pass, func) {
        if (!pass.passCalls) {
            _createBindCallBack(pass, 'pass', 'paclen')
        }
        pass.passCalls.push([controller, func])
        pass.paclen++
    }

    Addon(this.gui, this.Streaming, this.app)
})(this.dat, /* Buildup - Start */
function (gui, Streaming, app) {
    /**
     * dat.gui AddOn: window.app
     * @author leroyron / http://leroy.ron@gmail.com
     */
    gui.addon.app = (function (gui) {
        var that = {}
        var _onupdate = function () {
        }
        _onupdate()

        gui.fullScreenHandler =
        typeof document.fullscreenElement != 'undefined'
        ? {event: 'fullscreenChange', state: 'fullscreen'}
        : typeof document.msFullscreenElement != 'undefined'
        ? {event: 'MSFullscreenChange', state: 'fullscreen'}
        : typeof document.mozFullScreenElement != 'undefined'
        ? {event: 'mozfullscreenchange', state: 'mozFullScreen'}
        : typeof document.webkitFullscreenElement != 'undefined'
        ? {event: 'webkitfullscreenchange', state: 'webkitIsFullScreen'}
        : {event: 'fullscreenchange', state: 'fullscreen'}

        document.addEventListener(gui.fullScreenHandler.event, function (e) {
            e.preventDefault()
            gui.fullscreenEnabled = document[gui.fullScreenHandler.state]
            that.fullscreen.setValue(gui.fullscreenEnabled)
            window.setTimeout(window.onresize(), 1000)
        }, false)

        gui.controls =
        {
            settings: gui.addFolder('Settings')
        }

        // Resolutions

        that.resolution = gui.controls.settings.add(window.app, 'resolution',
            {
                r2160p: [3840, 2160],
                r1440p: [2560, 1440],
                r1080p: [1920, 1080],
                r720p: [1280, 720],
                r480p: [854, 480],
                r360p: [640, 360],
                r240p: [426, 240]
            })
        that.resolution.onFinishChange(function (value) {
            var widthHeight = value.split(',')
            this.object[this.property] = {width: parseInt(widthHeight[0]), height: parseInt(widthHeight[1])}
            window.setTimeout(window.onresize(), 1000)
        })
        that.resolution.setValue(window.app.resolution)// Set default
        gui.remember(that.resolution)

        // FullScreen
        that.fullscreen = gui.controls.settings.add(window.app, 'fullscreen')
        that.fullscreen.onFinishChange(function (value) {
            window.toggleFullscreen(value, document.documentElement)
        })
        that.fullscreen.setValue(window.app.fullscreen)// Set default

        // Touch
        that.touch = gui.controls.settings.add(window.app, 'touch')
        that.touch.onFinishChange(function (value) {

        })
        that.touch.setValue(window.app.touch)// Set default

        // Sound
        that.sound = gui.controls.settings.add(window.app, 'sound')
        that.sound.onFinishChange(function (value) {

        })
        that.sound.setValue(window.app.sound)// Set default

        // Popup
        that.popup = gui.controls.settings.add(window.app, 'popup')
        that.popup.onFinishChange(function () {
            if (window.app.popup) window.popup()
        })
        that.popup.setValue(window.app.popup)// Set default

        return that
    })(gui)

    /**
     * dat.gui AddOn: Streaming arguments
     * @author leroyron / http://leroy.ron@gmail.com
     */
    gui.addon.Streaming = (function (gui, Streaming) {
        var _attach = gui.addon.Streaming = Streaming.prototype.addon
        var _onupdate = function (controller) {
        }
        _onupdate()


        return _attach
    })(gui, Streaming)

    /**
     * dat.gui.Streaming AddOn: timeframe
     * @author leroyron / http://leroy.ron@gmail.com
     */
    var _timeframe = (function (gui) {
        var that = gui.addon.Streaming.timeframe
        var _onupdate = function (controller) {
            controller.updateDisplay()
        }
        var _onchange = function (controller, change) {
            that.update()
        }



        return that
    })(gui)

    /**
     * dat.gui.Streaming.timeframe AddOn: timeline
     * @author leroyron / http://leroy.ron@gmail.com
     */
    var _timeline = gui.addon.Streaming.timeframe.timeline = (function (gui, app) {
        var that = {}
        that.segment = 0
        that.init = undefined // propose for callback
        that.ready = undefined // propose for callback

        that.update = function (controller) {
            that.updateCallbacks()
        }
        that.updateCalls = []
        that.upclen = 0
        that.updateCallbacks = function () {
            for (let c = 0; c < this.upclen; c++) {
                this.updateCalls[c][1](this.updateCalls[c][0])
            }
        }
        that.pass = function (controller) {
            that.passCallbacks()
        }
        that.passCalls = []
        that.paclen = 0
        that.passCallbacks = function () {
            for (let p = 0; p < this.paclen; p++) {
                this.passCalls[p][1](this.passCalls[p][0])
            }
        }
        var _onchange = function (controller, change) {
        }
        _onchange()
        var _onruntime = function (controller) {
            if (_timeframe.duration > _timeframe.length) {
                _timeframe.duration += _timeframe.length - _timeframe.duration
            }

            that.seek.position = _timeframe.duration / _timeframe.length * 100
            controller.style.left = that.seek.position + '%'

            if ((that.seek.position - that.prevSegmentPos) > (that.segmentPos - that.prevSegmentPos)) {
                that.checkPassSegment()
            }

            that.update()
        }
        var _onrevert = function (controller, revertPos) {
            _timeframe.duration = revertPos
            _onruntime(controller)
            _timeframe.syncing()
            that.checkPassSegment()
        }
        var _resize = function () {
            divTimeline.style.width = (app.width - 395) + 'px'
            that.seek.width = that.seek.span.element.clientWidth
        }

        var divApp = app.element

        // //TimeLine
        var divTimelineStyle = document.createElement('style')
        divTimelineStyle.id = 'timelineStyle'
        divTimelineStyle.innerHTML = '#timeline, .TL div {position: absolute;}\n                #timeline {width: 75%; height: 65px; top: 17px; left: 100px; z-index: 22;}\n                .info.dg {display:none}\n                .info.dg, .info.dg div {height: 15px; width: 150px;}\n                .info.top {top: -14px;}\n                .info.bottom {top: 68px;}\n                .info .text {text-align: center; left: -75px;}\n                .info .bg {background: black; opacity: 0.5; left: -75px;}\n                .TL .left, .TL .right, .TL .span {width: 5px; height: 29px; top: 0px;}\n                .TL .left {left: 0px; background: transparent url(' + app.vscode._fileLocal + 'assets/left-slide.png) no-repeat left top;}\n                .TL .right {right: -10px; background: transparent url(' + app.vscode._fileLocal + 'assets/right-slide.png) no-repeat right top;}\n                .TL .span {width: 100%; left: 5px; background: transparent url(' + app.vscode._fileLocal + 'assets/center-slide.png) repeat-x left top;}\n                .TL .comment {width: 15px; height: 14px; top: 25px; left: 5%; background: transparent url(' + app.vscode._fileLocal + 'assets/comment.png) no-repeat left top; cursor: pointer}\n                .TL .segment {width: 1px; height: 17px; top: 27px; left: 10%; border:#666 solid 1px; background: #fff; opacity: 0.50; cursor: pointer}\n                .TL .seek {background: #666; top: 4px; width: 1px; left: 0%; height: 21px;}\n                .TL .bar {background: #bbb none repeat scroll 0 0; border-radius: 10px; border-top: 1px solid #fff; height: 23px; opacity: 0.1; top: 44px; width: 100%;}\n                .TL .slider {background: transparent url(' + app.vscode._fileLocal + 'assets/slider.png) no-repeat center bottom; bottom: -43px; width: 40px; left: -20px; height: 36px;}\n                .TL .action {border:#666 solid 1px; background: #ff0000; top: 4px; width: 5px; height: 7px; cursor: pointer}\n                .TL .sound {border:#666 solid 1px; background: #fff; top: 17px; width: 5px; height: 7px; cursor: pointer}\n                .TL .dialog {display:none; background: #3f3f3f; width: 350px; height: 350px; border-radius: 10px; border: #555 1px solid; top: 115px; margin: auto; position: relative; color: #dadada; font-family: verdana; font-size: 11px; font-weight: bold;}\n                .TL .dialog div {position: unset;}\n                .TL .dialog .title {width: 340px; height: 27px; float: left; font-size: 15px;padding: 22px 0px 3px 10px;}\n                .TL .dialog .description {width: 340px; height: 24px; border-bottom: #222 1px solid; float: left;padding: 0px 0px 0px 10px;font-size: 9px;}\n                .TL .dialog .option {height: 40px; width: 340px; border-top: #555 1px solid; float: left;padding: 10px 0px 3px 10px;}\n                .dialog label {width: 340px; float: left; height: 20px;}\n                .dialog input {width: 30px; background: #333; border: none; color: #fff; border-radius: 5px; padding: 0px 0px 0px 6px;}'
        divApp.appendChild(divTimelineStyle)

        var divTimeline = document.createElement('div')
        divTimeline.id = 'timeline'
        divTimeline.setAttribute('class', 'TL')

        var divInfo = document.createElement('div')
        divInfo.setAttribute('class', 'info top dg')

        var divInfoBg = document.createElement('div')
        divInfoBg.setAttribute('class', 'bg')
        divInfo.appendChild(divInfoBg)

        var divInfoText = document.createElement('div')
        divInfoText.setAttribute('class', 'text')
        divInfo.appendChild(divInfoText)

        divTimeline.appendChild(divInfo)

        var divLeft = document.createElement('div')
        divLeft.setAttribute('class', 'left')

        var divRight = document.createElement('div')
        divRight.setAttribute('class', 'right')

        var divSpan = document.createElement('div')
        divSpan.setAttribute('class', 'span')

        var divBar = document.createElement('div')
        divBar.setAttribute('class', 'bar')
        divSpan.appendChild(divBar)

        var divSlider = document.createElement('div')
        divSlider.setAttribute('class', 'slider')

        var divSeek = document.createElement('div')
        divSeek.style.left = '0%'
        divSeek.setAttribute('class', 'seek')
        divSeek.appendChild(divSlider)
        divSpan.appendChild(divSeek)

        divTimeline.appendChild(divLeft)
        divTimeline.appendChild(divSpan)
        divTimeline.appendChild(divRight)

        divApp.appendChild(divTimeline)
        // //

        that.element = divTimeline

        that.seek = {
            element: divSeek,
            position: undefined,
            width: divSpan.clientWidth,
            slider: {element: divSlider},
            span: {element: divSpan},
            bar: {element: divBar},
            info: {element: divInfo, text: divInfoText}
        }

        that.prevSegmentPos = undefined
        that.segmentPos = undefined
        that.nextSegmentPos = undefined
        that.passSegment = undefined
        that.callbackPass = {list: [], count: 0}

        var actions, actionJson, actionScripts, alen, actionsPos,
            sounds, soundJson, soundScripts, sdlen,
            comments, commentJson, commentScripts, clen,
            segments, segmentJson, segmentScripts, slen, segmentsPos
        that.refresh = function () {
            actions = document.getElementsByClassName('action')
            actionJson = document.getElementById('actionjson')
            actionScripts = document.getElementsByClassName('actionscript')
            alen = actions.length
            actionsPos = new Int32Array(new ArrayBuffer(alen * 4))
            for (let a = 0; a < alen; a++) {
                actionsPos[a] = parseInt(actions[a].style.left)
            }

            sounds = document.getElementsByClassName('sound')
            soundJson = document.getElementById('soundjson')
            soundScripts = document.getElementsByClassName('soundscript')
            sdlen = sounds.length

            comments = document.getElementsByClassName('comment')
            commentJson = document.getElementById('commentjson')
            commentScripts = document.getElementsByClassName('commentscript')
            clen = comments.length

            segments = document.getElementsByClassName('segment')
            segmentJson = document.getElementById('segmentjson')
            segmentScripts = document.getElementsByClassName('segmentscript')
            slen = segments.length
            segmentsPos = new Int32Array(new ArrayBuffer(slen * 4))
            for (let s = 0; s < slen; s++) {
                segmentsPos[s] = parseInt(segments[s].style.left) || 1
            }
            this.checkPassSegment()
        }
        that.checkPassSegment = function () {
            this.passSegment = 0
            for (let s = 0; s < slen; s++) {
                if (this.seek.position >= segmentsPos[s]) {
                    this.passSegment++
                }
            }

            this.prevSegmentPos = segmentsPos[this.segment - 1] || 0
            this.segmentPos = segmentsPos[this.segment] || 100
            this.nextSegmentPos = segmentsPos[this.segment + 1] || 100

            this.pass()
        }

        that.removeInsertsNear = function (insert, at, near) {
            let from = at - near
            let to = at + near
            for (let ni = from; ni < to; ni++) {
                this.removeInsertAt(insert, ni)
            }
        }

        that.removeInsertAt = function (insert, at) {
            let elements = this.seek.span.element.getElementsByClassName(insert)

            for (let ri = 0; ri < elements.length; ri++) {
                if (elements[ri].id == at) elements[ri].parentNode.removeChild(elements[ri])
            }
        }

        that.destroy = function (inserts, refresh) {
            inserts = inserts || ['action', 'sound', 'comment', 'segment']
            inserts = inserts.constructor === Array ? inserts : [inserts]
            for (let ii = 0; ii < inserts.length; ii++) {
                _timeframe.clearRuntimeAuthority(inserts[ii])
                let elements = this.seek.span.element.getElementsByClassName(inserts[ii])
                while (elements.length > 0) {
                    elements[0].parentNode.removeChild(elements[0])
                }

                if (inserts[ii] == 'action') {
                    for (let ei = alen - 1; ei > -1; ei--) if (actionScripts[ei]) document.getElementsByTagName('body')[0].removeChild(actionScripts[ei])

                    if (actionJson) document.getElementsByTagName('body')[0].removeChild(actionJson)
                } else if (inserts[ii] == 'sound') {
                    for (let ei = sdlen - 1; ei > -1; ei--) if (soundScripts[ei]) document.getElementsByTagName('body')[0].removeChild(soundScripts[ei])

                    if (soundJson) document.getElementsByTagName('body')[0].removeChild(soundJson)
                } else if (inserts[ii] == 'comment') {
                    for (let ei = clen - 1; ei > -1; ei--) if (commentScripts[ei]) document.getElementsByTagName('body')[0].removeChild(commentScripts[ei])

                    if (commentJson) document.getElementsByTagName('body')[0].removeChild(commentJson)
                } else if (inserts[ii] == 'segment') {
                    for (let ei = slen - 1; ei > -1; ei--) if (segmentScripts[ei]) document.getElementsByTagName('body')[0].removeChild(segmentScripts[ei])

                    if (segmentJson) document.getElementsByTagName('body')[0].removeChild(segmentJson)
                }
            }

            refresh = typeof refresh == 'undefined' ? true : refresh
            if (refresh) this.refresh()
        }
        that.destroy()

        var rec = document.getElementsByClassName('rec')
        window.clearInterval(window.interval)
        window.interval = window.setInterval(function () {
            for (let r = 0; r < rec.length; r++) {
                if (rec[r].className == 'rec on') {
                    rec[r].className = 'rec off'
                } else if (rec[r].className == 'rec off') {
                    rec[r].className = 'rec on'
                } else if (rec[r].className == 'rec seg') {
                    rec[r].innerHTML = that.segment
                }
            }
        }
        , 1000)

        var _performInit = function () {
            setTimeout(function () {
                if (_timeframe.init && that.init) {
                    if (that.initCalls.length != 4) _performInit()
                    that.init()
                    var _performReady = function () {
                        setTimeout(function () {
                            if (_timeframe.ready && that.ready) {
                                this.app.ready = true
                                that.ready()
                            } else {
                                _performReady()
                            }
                        }, 0)
                    }
                    _performReady()
                } else {
                    _performInit()
                }
            }, 0)
        }
        _performInit()

        gui.addon.bind.onrevert(divSeek, _timeframe, _onrevert)
        gui.addon.bind.onruntime(divSeek, _timeframe, _onruntime)

        _resize()
        window.resizeCalls.push(_resize)

        return that
    })(gui, app)

    /**
     * dat.gui.Streaming.timeframe.timeline AddOn: seek
     * @author leroyron / http://leroy.ron@gmail.com
     */
    var _seek = (function (gui) {
        var that = gui.addon.Streaming.timeframe.timeline.seek
        that.start = false

        var mouseX = 0
        var deltaX = 0

        var _onmousedown = function (e) {
            e.preventDefault()
            if (that.start) {
                return
            }
            that.start = true

            _timeframe.stop()

            var sliderElement = this
            deltaX = e.pageX - sliderElement.offsetLeft + document.body.scrollLeft

            that.info.text.innerHTML = 'Playback: drag/release'
            that.info.element.setAttribute('class', 'info bottom dg')
            that.info.element.style.display = 'inline'
            that.info.element.style.left = that.position + '%'

            var _onmousemove = function (e) {
                e.preventDefault()

                mouseX = e.pageX - sliderElement.offsetLeft + document.body.scrollLeft

                if (Math.abs(mouseX - deltaX) > 4) {
                    // pass event control for dragging within seek
                    _timeline.element.removeEventListener('mouseup', _onmouseup)
                    _timeline.element.removeEventListener('mousemove', _onmousemove)

                    _timeline.element.addEventListener('mousemove', that.ondrag)
                    _timeline.element.addEventListener('mouseup', that.ondrop)
                }
            }
            _timeline.element.addEventListener('mousemove', _onmousemove)

            var _onmouseup = function (e) {
                e.preventDefault()
                _timeframe.resetStreamProperties()
                _timeframe.switchToTimeFrameReading()
                _timeframe.run()

                that.start = false

                _timeline.element.removeEventListener('mouseup', _onmouseup)
                _timeline.element.removeEventListener('mousemove', _onmousemove)

                that.info.text.innerHTML = ''
                that.info.element.style.display = ''
            }
            _timeline.element.addEventListener('mouseup', _onmouseup)
        }
        that.slider.element.addEventListener('mousedown', _onmousedown)
        that.slider.element.style.cursor = 'pointer'
        that.info.text.innerHTML = 'Playback: press to play'
        that.info.element.setAttribute('class', 'info bottom dg')
        that.info.element.style.display = 'inline'
        that.info.element.style.left = that.position + '%'

        that.ondrag = function (e) {
            e.preventDefault()
            mouseX = e.pageX - _timeline.element.offsetLeft - 5 + document.body.scrollLeft
            _dragSlider(mouseX)
            that.info.text.innerHTML = 'Playback: ' + (that.position / 100 * _timeframe.length << 0)
        }
        that.ondragInFrame = function (e) {
            e.preventDefault()
            mouseX = e.pageX - _timeline.element.offsetLeft - 5 + document.body.scrollLeft
            _dragSlider(mouseX)
            _inframe()
            that.info.text.innerHTML = 'Seek: ' + (that.position / 100 * _timeframe.length << 0)
        }

        _timeframe.goTo = function (duration) {
            _timeframeSync(duration)
            _moveSlider(_timeframe.duration / _timeframe.length * 100)
        }
        that.ondrop = function (e) {
            e.preventDefault()
            _timeframe.resetStreamProperties()
            _timeframe.switchToTimeFrameReading()
            that.start = false
            _resume()
            _timeline.element.removeEventListener('mousemove', that.ondrag)
            _timeline.element.removeEventListener('mouseup', that.ondrop)
            that.info.text.innerHTML = ''
            that.info.element.style.display = ''
        }
        that.ondropInFrame = function (e) {
            e.preventDefault()
            that.start = false
            _inframe()
            _timeline.element.removeEventListener('mousemove', that.ondragInFrame)
            _timeline.element.removeEventListener('mouseup', that.ondropInFrame)
            that.info.text.innerHTML = 'Playback: press to play'
        }
        that.goInFrame = function (exact, number, duration) {
            _inframe(exact, number, duration)
            that.info.text.innerHTML = 'Playback: press to play'
            that.info.element.setAttribute('class', 'info bottom dg')
        }

        var _dragSlider = function (mouseX) {
            _moveSlider((mouseX / that.width * 100))
        }

        var _moveSlider = function (percent) {
            that.position = percent
            that.position = that.position > 100 ? 100 : that.position < 0 ? 0 : that.position
            that.element.style.left = that.info.element.style.left = that.position + '%'
        }

        var _resume = function (duration) {
            _timeframeSync(duration)
            _timeframe.run()
        }
        var _inframe = function (exact, number, duration) {
            _timeframeSync(duration)
            _timeframe.tick(exact, number)
        }
        var _timeframeSync = function (duration) {
            _timeframe.duration = duration || that.position / 100 * _timeframe.length << 0
            _timeframe.syncing()
            _timeline.checkPassSegment()
        }
        var _timeframeAutoRun_startup = function () {
            setTimeout(function () {
                _timeframe.run()
            }, 500)
        }
        gui.addon.bind.onready(that, _timeline, _timeframeAutoRun_startup)

        return that
    })(gui)

    /**
     * dat.gui.Streaming.timeframe.timeline.seek AddOn: bar
     * @author leroyron / http://leroy.ron@gmail.com
     */
    gui.addon.Streaming.timeframe.timeline.seek.bar = (function (gui) {
        var that = gui.addon.Streaming.timeframe.timeline.seek.bar
        var mouseX = 0
        var deltaX = 0

        var _onmousedown = function (e) {
            e.preventDefault()
            if (_seek.start) {
                return
            }
            _seek.start = true

            var barElement = this
            deltaX = e.pageX - barElement.offsetLeft + document.body.scrollLeft

            _seek.info.text.innerHTML = 'Seek: drag/release'
            _seek.info.element.setAttribute('class', 'info bottom dg')
            _seek.info.element.style.display = 'inline'
            _seek.info.element.style.left = ((deltaX - (_timeline.element.offsetLeft - 5)) / _seek.width * 100) + '%'

            var _onmousemove = function (e) {
                e.preventDefault()

                mouseX = e.pageX - barElement.offsetLeft + document.body.scrollLeft

                if (Math.abs(mouseX - deltaX) > 4) {
                    _timeframe.resetStreamProperties()
                    _timeframe.switchToTimeFrameReading()
                    // pass event control for dragging within seek
                    _timeline.element.removeEventListener('mouseup', _onmouseup)
                    _timeline.element.removeEventListener('mousemove', _onmousemove)

                    _timeline.element.addEventListener('mousemove', _seek.ondragInFrame)
                    _timeline.element.addEventListener('mouseup', _seek.ondropInFrame)
                }
            }
            _timeline.element.addEventListener('mousemove', _onmousemove)

            var _onmouseup = function (e) {
                e.preventDefault()
                _timeframe.resetStreamProperties()
                _timeframe.switchToTimeFrameReading()
                mouseX = e.pageX - _timeline.element.offsetLeft - 5 + document.body.scrollLeft

                _seek.position = (mouseX / _seek.width * 100)
                _seek.position = _seek.position > 100 ? 100 : _seek.position < 0 ? 0 : _seek.position
                _seek.element.style.left = _seek.position + '%'

                _seek.start = false

                _seek.goInFrame()

                _timeline.element.removeEventListener('mouseup', _onmouseup)
                _timeline.element.removeEventListener('mousemove', _onmousemove)
            }
            _timeline.element.addEventListener('mouseup', _onmouseup)
        }
        that.element.addEventListener('mousedown', _onmousedown)
        that.element.style.cursor = 'pointer'

        return that
    })(gui)

    /**
     * dat.gui.Streaming.timeframe.timeline.seek AddOn: insert
     * @author leroyron / http://leroy.ron@gmail.com
     */
    var _insert = gui.addon.Streaming.timeframe.timeline.seek.insert = (function (gui, app) {
        var that = {}
        that.select = 'nothing'
        that.delta = 'nothing'
        that.element = {}
        that.position = {}
        that.dragging = false

        var _urlCheck = function (select, url, callback, position, list) {
            var script = document.createElement('script')
            script.type = 'text/javascript'
            script.async = false
            if (list) {
                script.id = select + 'json'
            } else {
                script.setAttribute('class', select + 'script')
            }

            if (script.readyState) {  // IE
                script.onreadystatechange = function () {
                    if (script.readyState == 'loaded' ||
                            script.readyState == 'complete') {
                        script.onreadystatechange = null
                        callback(window.Authority, select, position)
                        window.Authority = undefined
                        scriptLoadCount.finish++
                        if (scriptLoadCount.entry == scriptLoadCount.finish) {
                            _timeframe._ready() // timeframe ready has to be set to true for additional scripts to load
                        }
                    }
                }
            } else {  // Others
                script.onload = function () {
                    callback(window.Authority, select, position)
                    window.Authority = undefined
                    scriptLoadCount.finish++
                    if (scriptLoadCount.entry == scriptLoadCount.finish) {
                        _timeframe._ready() // timeframe ready has to be set to true for additional scripts to load
                    }
                }
            }

            script.src = url
            document.getElementsByTagName('body')[0].appendChild(script)
        }
        that.make = function () {
            var _divElement = document.createElement('div')
            _divElement.style.left = this.position + '%'
            _seek.span.element.appendChild(_divElement)

            this.element = _divElement
        }
        var scriptLoadCount = {entry: 0, finish: 0}
        that.load = function (select, callback, ref) {
            var localRef = ref || ''
            if (app.codesetting) {
                app.codesettingLoc = app.codesetting + '/'
            } else {
                app.codesettingLoc = ''
            }
            scriptLoadCount.entry++
            var url = 'user/' + app.codesettingLoc + select
            _urlCheck(select, localRef + url, loadScripts, 0, true)

            function loadScripts (scriptsJSON) {
                for (let si in scriptsJSON) {
                    scriptLoadCount.entry++
                    let url = 'user/' + app.codesettingLoc + select + si + '.js'
                    _urlCheck(select, localRef + url, callback, si, false)
                }
            }
        }
        that.reload = function (select, callback, ref) {
            this.load('action', this.action.init, app.vscode._fileLocal)
            this.load('sound', this.sound.init, app.vscode._fileLocal)
            this.load('comment', this.comment.init, app.vscode._fileLocal)
            this.load('segment', this.segment.init, app.vscode._fileLocal)
        }
        that.insertAuthorities = function (data) {
            for (let di in data) {
                this.delta = di
                for (let fi in data[di]) {
                    this.position = fi / _timeframe.length * 100

                    _timeframe.runtimeAuthority(data[di][fi].Authority, this.delta, fi)

                    that.make(fi)
                    that.change()
                }
            }

            _timeline.refresh()

            this.select = this.delta = 'nothing'
        }
        that.change = function () {
            if (this.delta == 'action') {
                this.element.setAttribute('class', 'action')
            } else if (this.delta == 'sound') {
                this.element.setAttribute('class', 'sound')
            } else if (this.delta == 'comment') {
                this.element.setAttribute('class', 'comment')
            } else if (this.delta == 'segment') {
                this.element.setAttribute('class', 'segment')
            } else if (this.delta == 'nothing') {
            }
        }
        return that
    })(gui, app)

    /**
     * dat.gui.Streaming.timeframe.timeline.seek.insert AddOn: comment
     * @author leroyron / http://leroy.ron@gmail.com
     */
    gui.addon.Streaming.timeframe.timeline.seek.insert.comment = (function (gui, app) {
        var that = {}

        that.init = function (Authority, select, position) {
            _timeframe.runtimeAuthority(Authority, select, position)

            var _divElement = document.createElement('div')
            _divElement.style.left = position / _timeframe.length * 100 + '%'
            _divElement.setAttribute('class', 'comment')
            _divElement.setAttribute('data-position', position)

            _seek.span.element.appendChild(_divElement)


            _timeline.refresh()
        }
        var _timeframeinit = function (that) {
            _insert.load('comment', that.init, app.vscode._fileLocal)
        }
        gui.addon.bind.oninit(that, _timeline, _timeframeinit)
        return that
    })(gui, app)

    /**
     * dat.gui.Streaming.timeframe.timeline.seek.insert AddOn: segment
     * @author leroyron / http://leroy.ron@gmail.com
     */
    gui.addon.Streaming.timeframe.timeline.seek.insert.segment = (function (gui, app) {
        var that = {}
        that.init = function (Authority, select, position) {
            _timeframe.runtimeAuthority(Authority, select, position)

            var _divElement = document.createElement('div')
            _divElement.style.left = position / _timeframe.length * 100 + '%'
            _divElement.setAttribute('class', 'segment')
            _divElement.setAttribute('data-position', position)

            _seek.span.element.appendChild(_divElement)

            _timeline.refresh()
        }
        var _timeframeinit = function (that) {
            _insert.load('segment', that.init, app.vscode._fileLocal)
        }
        gui.addon.bind.oninit(that, _timeline, _timeframeinit)

        return that
    })(gui, app)

    /**
     * dat.gui.Streaming.timeframe.timeline.seek.insert AddOn: action
     * @author leroyron / http://leroy.ron@gmail.com
     */
    gui.addon.Streaming.timeframe.timeline.seek.insert.action = (function (gui, app) {
        var that = {}

        that.init = function (Authority, select, position) {
            _timeframe.runtimeAuthority(Authority, select, position)

            var _divElement = document.createElement('div')
            _divElement.style.left = position / _timeframe.length * 100 + '%'
            _divElement.setAttribute('class', 'action')
            _divElement.setAttribute('data-position', position)

            _seek.span.element.appendChild(_divElement)

            _timeline.refresh()
        }
        var _timeframeinit = function (that) {
            _insert.load('action', that.init, app.vscode._fileLocal)
        }
        gui.addon.bind.oninit(that, _timeline, _timeframeinit)
        return that
    })(gui, app)

    /**
     * dat.gui.Streaming.timeframe.timeline.seek.insert AddOn: sound
     * @author leroyron / http://leroy.ron@gmail.com
     */
    gui.addon.Streaming.timeframe.timeline.seek.insert.sound = (function (gui, app) {
        var that = {}

        that.init = function (Authority, select, position) {
            _timeframe.runtimeAuthority(Authority, select, position)

            var _divElement = document.createElement('div')
            _divElement.style.left = position / _timeframe.length * 100 + '%'
            _divElement.setAttribute('class', 'sound')
            _divElement.setAttribute('data-position', position)

            _seek.span.element.appendChild(_divElement)

            _timeline.refresh()
        }

        var _timeframeinit = function (that) {
            _insert.load('sound', that.init, app.vscode._fileLocal)
        }
        gui.addon.bind.oninit(that, _timeline, _timeframeinit)
        return that
    })(gui, app)

    /**
     * dat.gui.Streaming.timeframe.timeline.seek AddOn: dialog
     * @author leroyron / http://leroy.ron@gmail.com
     */

    /**
     * dat.gui.Streaming.timeframe.timeline AddOn: charts
     * @author leroyron / http://leroy.ron@gmail.com
     */
}/* Buildup - End */)
