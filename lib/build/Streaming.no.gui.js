/**
 * Streaming gui timeline theme (Optimal - no charts, inserting, dialogs and vscode authority no settings, no timeline...)
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (dat, Addon) {
    this.gui = {}
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

        // window.toggleFullscreen(bool, document.documentElement)
        that.resolution =
        {
            r2160p: [3840, 2160],
            r1440p: [2560, 1440],
            r1080p: [1920, 1080],
            r720p: [1280, 720],
            r480p: [854, 480],
            r360p: [640, 360],
            r240p: [426, 240]
        }

        app.resolution.update = (function (res) {
            window.changeResolution({width: that.resolution[res][0], height: that.resolution[res][1]})
        })('r720p')

        return that
    })(gui)

    /**
     * dat.gui AddOn: Streaming arguments
     * @author leroyron / http://leroy.ron@gmail.com
     */
    gui.addon.Streaming = (function (gui, Streaming) {
        var _attach = gui.addon.Streaming = Streaming.prototype.addon

        return _attach
    })(gui, Streaming)

    /**
     * dat.gui.Streaming AddOn: timeframe
     * @author leroyron / http://leroy.ron@gmail.com
     */
    var _timeframe = (function (gui) {
        var that = gui.addon.Streaming.timeframe

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
        var _onruntime = function () {
            if (_timeframe.duration > _timeframe.length) {
                _timeframe.duration += _timeframe.length - _timeframe.duration
            }

            that.seek.position = _timeframe.duration / _timeframe.length * 100

            if ((that.seek.position - that.prevSegmentPos) > (that.segmentPos - that.prevSegmentPos)) {
                that.checkPassSegment()
            }

            that.update()
        }
        var _onrevert = function (controller, revertPos) {
            _timeframe.duration = revertPos
            _onruntime()
            _timeframe.syncing()
            that.checkPassSegment()
        }

        // //

        that.seek = {
            position: undefined,
            slider: {},
            span: {},
            bar: {},
            info: {}
        }

        that.prevSegmentPos = undefined
        that.segmentPos = undefined
        that.nextSegmentPos = undefined
        that.passSegment = undefined
        that.callbackPass = {list: [], count: 0}

        var actionJson, actionScripts, alen, actionsPos,
            soundJson, soundScripts, sdlen,
            commentJson, commentScripts, clen,
            segmentJson, segmentScripts, slen, segmentsPos
        that.refresh = function () {
            actionJson = document.getElementById('actionjson')
            actionScripts = document.getElementsByClassName('actionscript')
            alen = actionScripts.length
            actionsPos = new Int32Array(new ArrayBuffer(alen * 4))
            for (let a = 0; a < alen; a++) {
                actionsPos[a] = parseInt(actionScripts[a].data)
            }

            soundJson = document.getElementById('soundjson')
            soundScripts = document.getElementsByClassName('soundscript')
            sdlen = soundScripts.length

            commentJson = document.getElementById('commentjson')
            commentScripts = document.getElementsByClassName('commentscript')
            clen = commentScripts.length

            segmentJson = document.getElementById('segmentjson')
            segmentScripts = document.getElementsByClassName('segmentscript')
            slen = segmentScripts.length
            segmentsPos = new Int32Array(new ArrayBuffer(slen * 4))
            for (let s = 0; s < slen; s++) {
                segmentsPos[s] = parseInt(segmentScripts[s].data) || 1
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
        }

        that.removeInsertAt = function (insert, at) {
        }

        that.destroy = function (inserts, refresh) {
            inserts = inserts || ['action', 'sound', 'comment', 'segment']
            inserts = inserts.constructor === Array ? inserts : [inserts]
            for (let ii = 0; ii < inserts.length; ii++) {
                _timeframe.clearRuntimeAuthority(inserts[ii])
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

        gui.addon.bind.onrevert(that.seek, _timeframe, _onrevert)
        gui.addon.bind.onruntime(that.seek, _timeframe, _onruntime)

        return that
    })(gui, app)

    /**
     * dat.gui.Streaming.timeframe.timeline AddOn: seek
     * @author leroyron / http://leroy.ron@gmail.com
     */
    var _seek = (function (gui) {
        var that = gui.addon.Streaming.timeframe.timeline.seek
        _timeframe.goTo = function (duration) {
            _timeframeSync(duration)
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

    /**
     * dat.gui.Streaming.timeframe.timeline.seek AddOn: insert
     * @author leroyron / http://leroy.ron@gmail.com
     */
    var _insert = gui.addon.Streaming.timeframe.timeline.seek.insert = (function (gui, app) {
        var that = {}
        that.select = 'nothing'
        that.delta = 'nothing'
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
                script.data = position
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
                }
            }

            _timeline.refresh()

            this.select = this.delta = 'nothing'
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
