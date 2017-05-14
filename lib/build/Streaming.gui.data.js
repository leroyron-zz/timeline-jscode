/**
 * dat.gui prototypes for 0.6.2
 * @dataarts / dat.GUI / https://github.com/dataarts/dat.gui
 * @author leroyron / http://leroy.ron@gmail.com
 * //customize dat.gui / bind/handle callbacks
 */
(function (dat, Addon) {
    dat.GUI.prototype.addHtmlFolder = function (name) {
    // We have to prevent collisions on names in order to have a key
    // by which to remember saved values
        if (this.__folders[name] !== undefined) {
            throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"')
        }

        var newGuiParams = { name: name, parent: this }

    // We need to pass down the autoPlace trait so that we can
    // attach event listeners to open/close folder actions to
    // ensure that a scrollbar appears if the window is too short.
        newGuiParams.autoPlace = this.autoPlace

    // Do we have saved appearance data for this folder?
        if (this.load && // Anything loaded?
    this.load.folders && // Was my parent a dead-end?
    this.load.folders[name]) {
        // Did daddy remember me?
        // Start me closed if I was closed
            newGuiParams.closed = this.load.folders[name].closed

        // Pass down the loaded data
            newGuiParams.load = this.load.folders[name]
        }

        var gui = new this.constructor(newGuiParams)
        this.__folders[name] = gui
        var li = addHtmlRow(this, gui.domElement)

        addHtmlClass(li, 'folder')

        return this
    }

    function addHtmlRow (gui, newDom, liBefore) {
        var li = document.createElement('li')
        if (newDom) {
            newDom.getElementsByClassName('title')[0].innerHTML = newDom.getElementsByClassName('title')[0].innerText
            li.appendChild(newDom)
        }

        if (liBefore) {
            gui.__ul.insertBefore(li, liBefore)
        } else {
            gui.__ul.appendChild(li)
        }
        gui.onResize()
        return li
    }

    function addHtmlClass (elem, className) {
        if (elem.className === undefined) {
            elem.className = className
        } else if (elem.className !== className) {
            let classes = elem.className.split(/ +/)
            if (classes.indexOf(className) === -1) {
                classes.push(className)
                elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '')
            }
        }
    }

    /**
     *
     * @param elem
     * @param event
     * @param func
     * @param bool
     */
    dat.GUI.prototype.bind = function bind (elem, event, func, newBool) {
        var bool = newBool || false
        elem._this = this
        if (elem.addEventListener) {
            elem.addEventListener(event, func, bool)
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + event, func)
        }
    }
    dat.GUI.prototype.unbind = function unbind (elem, event, func, newBool) {
        var bool = newBool || false
        if (elem.removeEventListener) {
            elem.removeEventListener(event, func, bool)
        } else if (elem.detachEvent) {
            elem.detachEvent('on' + event, func)
        }
    }

    dat.GUI.prototype.open = function open () {
        this.openFolderCallbacks(this.__ul.innerText)
        this.closed = false
    }

    dat.GUI.prototype.close = function close () {
        this.closeFolderCallbacks(this.__ul.innerText)
        this.closed = true
    }

    dat.GUI.prototype.onClickTitle = function onClickTitle (e) {
        e.preventDefault()
        this._this.openFolderCallbacks(this.textContent || this.innerText)
    }

    dat.GUI.prototype.onopenFolder = function (func) {
        this.openFolderCalls[this.__ul.textContent || this.__ul.innerText] = func
        this.bind(this.domElement, 'click', this.onClickTitle)
    }

    dat.GUI.prototype.openFolderCalls = {}
    dat.GUI.prototype.openFolderCallbacks = function (ulTitle) {
        if (typeof this.openFolderCalls[ulTitle] != 'undefined') {
            this.openFolderCalls[ulTitle]()
        }
    }

    dat.GUI.prototype.closeFolderCalls = {}
    dat.GUI.prototype.closeFolderCallbacks = function (ulTitle) {
        if (typeof this.closeFolderCalls[ulTitle] != 'undefined') {
            this.closeFolderCalls[ulTitle]()
        }
    }

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
            recording: gui.addHtmlFolder('Recordings<span class="rec off">&bull;</span> Segment <span class="rec seg">0</span>'),
            settings: gui.addFolder('Settings')
        }

        var _guiRecordingLightCss = document.createElement('style')
        _guiRecordingLightCss.innerHTML = '.dg .on {color:#FF0000;}\n    .dg .off {color:#000;}'
        document.head.appendChild(_guiRecordingLightCss)

        // Adjustments---
        gui.controls.recording.addFolder('Adjustments')
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

        return that
    })(gui)

    /**
     * dat.gui AddOn: Streaming arguments
     * @author leroyron / http://leroy.ron@gmail.com
     */
    gui.addon.Streaming = (function (gui, Streaming) {
        var _attach = gui.addon.Streaming = Streaming.prototype.addon
        var that = _attach.runtime.access
        var _onupdate = function (controller) {
        }
        _onupdate()
        var _onchange = function (controller) {
            var c = controller.object
            that.update(c.continuance, c.skip, c.rCount, c.tCount, c.revert, c.mCount, c.leap, c.reset)
        }
        var _onruntime = function (controller) {
            controller.updateDisplay()
        }

        gui.controls.Streaming = gui.addFolder('Streaming')
        gui.controls.Streaming.open()

        gui.controls.Streaming.addFolder('access').open()
        var _continuance = gui.controls.Streaming.__folders.access.add(that.arguments, 'continuance')
        gui.addon.bind.onchange(_continuance, _onchange)
        var _skip = gui.controls.Streaming.__folders.access.add(that.arguments, 'skip')
        gui.addon.bind.onchange(_skip, _onchange)
        var _rCount = gui.controls.Streaming.__folders.access.add(that.arguments, 'rCount')
        gui.addon.bind.onchange(_rCount, _onchange)
        var _tCount = gui.controls.Streaming.__folders.access.add(that.arguments, 'tCount')
        gui.addon.bind.onchange(_tCount, _onchange)
        var _revert = gui.controls.Streaming.__folders.access.add(that.arguments, 'revert')
        gui.addon.bind.onchange(_revert, _onchange)
        var _mCount = gui.controls.Streaming.__folders.access.add(that.arguments, 'mCount')
        gui.addon.bind.onchange(_mCount, _onchange)
        var _leap = gui.controls.Streaming.__folders.access.add(that.arguments, 'leap')
        gui.addon.bind.onchange(_leap, _onchange)
        var _reset = gui.controls.Streaming.__folders.access.add(that.arguments, 'reset')
        gui.addon.bind.onchange(_reset, _onchange)

        gui.controls.Streaming.__folders.access.addFolder('runtime')
        var _read = gui.controls.Streaming.__folders.access.__folders.runtime.add(that, 'rCount')
        gui.addon.bind.onruntime(_read, that, _onruntime)
        var _thrust = gui.controls.Streaming.__folders.access.__folders.runtime.add(that, 'tCount')
        gui.addon.bind.onruntime(_thrust, that, _onruntime)
        var _measure = gui.controls.Streaming.__folders.access.__folders.runtime.add(that, 'mCount')
        gui.addon.bind.onruntime(_measure, that, _onruntime)
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
        var _onruntime = function (controller) {
            controller.updateDisplay()
        }

        gui.controls.Streaming.__folders.access.addFolder('timeframe').open()

        var _running = gui.controls.Streaming.__folders.access.__folders.timeframe.add(that, 'running')
        gui.addon.bind.onchange(_running, _onchange)
        gui.addon.bind.onupdate(_running, that, _onupdate)

        var _lapse = gui.controls.Streaming.__folders.access.__folders.timeframe.add(that, 'lapse')
        gui.addon.bind.onchange(_lapse, _onchange)

        gui.controls.Streaming.__folders.access.__folders.timeframe.addFolder('runtime')
        var _read = gui.controls.Streaming.__folders.access.__folders.timeframe.__folders.runtime.add(that, 'read')
        gui.addon.bind.onruntime(_read, that, _onruntime)

        var _thrust = gui.controls.Streaming.__folders.access.__folders.timeframe.__folders.runtime.add(that, 'thrust')
        gui.addon.bind.onruntime(_thrust, that, _onruntime)

        return that
    })(gui)

    /**
     * dat.gui.Streaming.timeframe AddOn: timeline
     * @author leroyron / http://leroy.ron@gmail.com
     */
    var _timeline = gui.addon.Streaming.timeframe.timeline = (function (gui, app) {
        var that = {}
        that.time = 'sec/ms' // setup to invoke a function each frame//new Streaming.addon.timeframe.invoke = function () {}
        that.segment = 0
        that.actionETC = 0.1
        that.info = 'spacebar to refresh'
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

            _time.setValue(_timeframe.duration + 'sec/ms')

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
        divTimelineStyle.innerHTML = '#timeline, .TL div {position: absolute;}\n                #timeline {width: 75%; height: 65px; top: 17px; left: 100px; z-index: 22;}\n                .info.dg {display:none}\n                .info.dg, .info.dg div {height: 15px; width: 150px;}\n                .info.top {top: -14px;}\n                .info.bottom {top: 68px;}\n                .info .text {text-align: center; left: -75px;}\n                .info .bg {background: black; opacity: 0.5; left: -75px;}\n                .TL .left, .TL .right, .TL .span {width: 5px; height: 29px; top: 0px;}\n                .TL .left {left: 0px; background: transparent url(' + app.vscode._fileLocal + 'assets/left-slide.png) no-repeat left top;}\n                .TL .right {right: -10px; background: transparent url(' + app.vscode._fileLocal + 'assets/right-slide.png) no-repeat right top;}\n                .TL .span {width: 100%; left: 5px; background: transparent url(' + app.vscode._fileLocal + 'assets/center-slide.png) repeat-x left top;}\n                .TL .comment {width: 15px; height: 14px; top: 25px; left: 5%; background: transparent url(' + app.vscode._fileLocal + 'assets/comment.png) no-repeat left top; cursor: pointer}\n                .TL .segment {width: 1px; height: 17px; top: 27px; left: 10%; border:#666 solid 1px; background: #fff; opacity: 0.50; cursor: pointer}\n                .TL .seek {background: #666; top: 4px; width: 1px; left: 0%; height: 21px;}\n                .TL .bar {background: #bbb none repeat scroll 0 0; border-radius: 10px; border-top: 1px solid #fff; height: 23px; opacity: 0.1; top: 44px; width: 100%;}\n                .TL .slider {background: transparent url(' + app.vscode._fileLocal + 'assets/slider.png) no-repeat center bottom; bottom: -43px; width: 40px; left: -20px; height: 36px;}\n                .TL .action {border:#666 solid 1px; background: #ff0000; top: 4px; width: 5px; height: 7px; cursor: pointer}\n                .TL .sound {border:#666 solid 1px; background: #fff; top: 17px; width: 5px; height: 7px; cursor: pointer}\n                .TL .dialog {display:none; background: #3f3f3f; width: 350px; height: 350px; border-radius: 10px; border: #555 1px solid; top: 115px; margin: auto; position: relative; color: #dadada; font-family: verdana; font-size: 11px; font-weight: bold;}\n                .TL .dialog div {position: unset;}\n                .TL .dialog .title {width: 340px; height: 27px; float: left; font-size: 15px;padding: 22px 0px 3px 10px;}\n                .TL .dialog .description {width: 340px; height: 24px; border-bottom: #222 1px solid; float: left;padding: 0px 0px 0px 10px;font-size: 9px;}\n                .TL .dialog .option {height: 40px; width: 340px; border-top: #555 1px solid; float: left;padding: 10px 0px 3px 10px;}\n                .dialog lable {width: 340px; float: left; height: 20px;}\n                .dialog input {width: 30px; background: #333; border: none; color: #fff; border-radius: 5px; padding: 0px 0px 0px 6px;}'
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

        var divDialog = document.createElement('div')
        divDialog.setAttribute('class', 'dialog')

        var divTitle = document.createElement('div')
        divTitle.setAttribute('class', 'title')
        divTitle.innerHTML = 'Timeline | Insert: Action'
        divDialog.appendChild(divTitle)

        var divDescription = document.createElement('div')
        divDescription.setAttribute('class', 'description')
        divDescription.innerHTML = 'Insert action for programming application interactivity'
        divDialog.appendChild(divDescription)

        var divOption = document.createElement('div')
        divOption.setAttribute('class', 'option')

        var divLable = document.createElement('lable')
        divLable.innerHTML = 'Time'
        divOption.appendChild(divLable)

        var inputNumber = document.createElement('input')
        inputNumber.setAttribute('class', 'dialogtime')
        inputNumber.value = 0
        inputNumber.min = -1
        inputNumber.max = 60
        inputNumber.step = 1
        divOption.appendChild(inputNumber)

        var textColon = document.createTextNode(' : ')
        divOption.appendChild(textColon)

        divOption.appendChild(inputNumber.cloneNode())

        var textDot = document.createTextNode(' . ')
        divOption.appendChild(textDot)

        var mmInputNumber = inputNumber.cloneNode()
        mmInputNumber.max = 100
        divOption.appendChild(mmInputNumber)

        divDialog.appendChild(divOption)

        divTimeline.appendChild(divDialog)

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

        // GUI
        gui.controls.timeline = gui.addFolder('TimeLine')
        var _time = gui.controls.timeline.add(that, 'time')
        var _segment = gui.controls.timeline.add(that, 'segment')
        var _actionETC = gui.controls.timeline.add(that, 'actionETC')
        that.info = gui.controls.timeline.add(that, 'info')

        gui.controls.timeline.open()

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

        that.dialog = {
            title: {element: divTitle},
            description: {element: divDescription},
            timeInput: document.getElementsByClassName('dialogtime'),
            element: divDialog
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
            _segment.setValue(this.passSegment)

            this.prevSegmentPos = segmentsPos[this.segment - 1] || 0
            this.segmentPos = segmentsPos[this.segment] || 100
            this.nextSegmentPos = segmentsPos[this.segment + 1] || 100

            this.pass()
        }

        that.destroy = function () {
            _timeframe.clearRuntimeAuthority('action')
            _timeframe.clearRuntimeAuthority('sound')
            _timeframe.clearRuntimeAuthority('comment')
            _timeframe.clearRuntimeAuthority('segment')
            var inserts = ['action', 'sound', 'comment', 'segment']
            for (let ii = 0; ii < inserts.length; ii++) {
                let elements = this.seek.span.element.getElementsByClassName(inserts[ii])
                while (elements.length > 0) {
                    elements[0].parentNode.removeChild(elements[0])
                }
            }
            for (let ei = alen - 1; ei > -1; ei--) {
                if (actionScripts[ei]) document.getElementsByTagName('body')[0].removeChild(actionScripts[ei])
            }
            for (let ei = sdlen - 1; ei > -1; ei--) {
                if (soundScripts[ei]) document.getElementsByTagName('body')[0].removeChild(soundScripts[ei])
            }
            for (let ei = clen - 1; ei > -1; ei--) {
                if (commentScripts[ei]) document.getElementsByTagName('body')[0].removeChild(commentScripts[ei])
            }
            for (let ei = slen - 1; ei > -1; ei--) {
                if (segmentScripts[ei]) document.getElementsByTagName('body')[0].removeChild(segmentScripts[ei])
            }
            if (actionJson) {
                document.getElementsByTagName('body')[0].removeChild(actionJson)
            }
            if (soundJson) {
                document.getElementsByTagName('body')[0].removeChild(soundJson)
            }
            if (commentJson) {
                document.getElementsByTagName('body')[0].removeChild(commentJson)
            }
            if (segmentJson) {
                document.getElementsByTagName('body')[0].removeChild(segmentJson)
            }
            this.refresh()
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
                    rec[r].innerHTML = _segment.getValue()
                }
            }
            for (let a = 0; a < alen; a++) {
                if (that.seek.position <= actionsPos[a]) {
                    _actionETC.setValue((actionsPos[a] - that.seek.position) * 0.1)
                    break
                } else {
                    _actionETC.setValue(0)
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

        var mouseX = 0
        var mouseY = 0
        var deltaX = 0
        var deltaY = 0

        var spanElement

        var _onmouseover = function (e) {
            e.preventDefault()
            if (_seek.start || !_timeframe.running) {
                return
            }
            spanElement = this
            deltaX = e.pageX - spanElement.offsetLeft + document.body.scrollLeft

            _seek.info.text.innerHTML = 'Playback: press to pause'
            _seek.info.element.setAttribute('class', 'info top dg')
            _seek.info.element.style.display = 'inline'
            _seek.info.element.style.left = ((deltaX - (_timeline.element.offsetLeft - 5)) / _seek.width * 100) + '%'
        }
        _seek.span.element.addEventListener('mouseover', _onmouseover)

        var _onmousedown = function (e) {
            e.preventDefault()
            if (_seek.start) {
                return
            }
            _seek.start = true
            _timeframe.stop()

            spanElement = this
            deltaX = e.pageX - spanElement.offsetLeft + document.body.scrollLeft
            deltaY = e.pageY - spanElement.offsetTop + document.body.scrollTop

            _seek.info.text.innerHTML = 'Insert: drag to create'
            _seek.info.element.setAttribute('class', 'info top dg')
            _seek.info.element.style.display = 'inline'
            _seek.info.element.style.left = ((deltaX - (_timeline.element.offsetLeft - 5)) / _seek.width * 100) + '%'

            var _onmousemove = function (e) {
                e.preventDefault()

                mouseX = e.pageX - spanElement.offsetLeft + document.body.scrollLeft
                mouseY = e.pageY - spanElement.offsetTop + document.body.scrollTop

                if ((Math.abs(mouseX - deltaX) > 4 || Math.abs(mouseY - deltaY) > 4) && (deltaY > 20 && deltaY < 45)) {
                    if (mouseY > 55) {
                        that.select = 'segment'
                    } else if (mouseY > 45) {
                        that.select = 'comment'
                    } else if (mouseY > 33) {
                        that.select = 'sound'
                    } else if (mouseY > 20) {
                        that.select = 'action'
                    } else {
                        that.select = 'nothing'
                    }

                    _timeline.element.removeEventListener('mouseup', _onmouseup)
                    _timeline.element.removeEventListener('mousemove', _onmousemove)

                    _timeline.element.addEventListener('mousemove', _ondrag)
                    _timeline.element.addEventListener('mouseup', _ondrop)
                }
            }
            _timeline.element.addEventListener('mousemove', _onmousemove)

            var _onmouseup = function (e) {
                e.preventDefault()
                _timeframe.resetStreamProperties()
                _timeframe.switchToTimeFrameReading()
                that.position = _seek.position

                that.drop()

                _timeline.element.removeEventListener('mouseup', _onmouseup)
                _timeline.element.removeEventListener('mousemove', _onmousemove)
            }
            _timeline.element.addEventListener('mouseup', _onmouseup)
        }
        _seek.span.element.addEventListener('mousedown', _onmousedown)

        var _ondrag = function (e) {
            e.preventDefault()
            mouseX = e.pageX - _timeline.element.offsetLeft - 5 + document.body.scrollLeft
            mouseY = e.pageY - _timeline.element.offsetTop + document.body.scrollTop

            if (mouseY < 15) {
                that.select = 'action'
            } else if (mouseY < 28) {
                that.select = 'sound'
            } else if (mouseY < 40) {
                that.select = 'comment'
            } else if (mouseY < 50) {
                that.select = 'segment'
            } else {
                that.select = 'nothing'
            }

            if (that.delta == that.select) {
                if (that.select == 'nothing') {

                } else {
                    that.position = (mouseX / _seek.width * 100)
                    that.position = that.position > 100 ? 100 : that.position < 0 ? 0 : that.position
                    that.element.style.left = _seek.info.element.style.left = that.position + '%'
                    _seek.info.text.innerHTML = 'Insert: ' + that.select + ' at ' + (that.position / 100 * _timeframe.length << 0)
                }
            } else {
                that.delta = that.select
                if (that.dragging) {
                    that.change()
                } else {
                    that.make()
                    that.change()
                    that.dragging = true
                }
            }
        }

        var _ondrop = function (e) {
            e.preventDefault()
            that.drop()

            this.removeEventListener('mousemove', _ondrag)
            this.removeEventListener('mouseup', _ondrop)
        }
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

                    that.make()
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
        that.drop = function () {
            _seek.position = this.position

            var _frame = (this.position / 100 * _timeframe.length << 0)

            _seek.goInFrame(true, _frame)

            if (this.dragging) {
                this[this.select].dialog(this.element, _frame)
            }

            this.dragging = false
            _seek.start = false

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
        var _init

        that.init = function (Authority, select, position) {
            _timeframe.runtimeAuthority(Authority, select, position)

            var _divElement = document.createElement('div')
            _divElement.style.left = position / _timeframe.length * 100 + '%'
            _divElement.setAttribute('class', 'comment')
            _divElement.setAttribute('data-position', position)

            _seek.span.element.appendChild(_divElement)

            if (app.vscode._CommandLink) {
                _divElement.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _vsopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
            } else {
                _divElement.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _localopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
            }

            _timeline.refresh()
        }

        that.dialog = function (element, position) {
            this.code = undefined

            element.setAttribute('data-position', position)

            if (app.vscode._CommandLink) {
                element.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _vsopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
                this.code = this.code || _getInitCode(position)
            } else {
                element.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _localopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
                this.code = window.localStorage.getItem('comment' + position + '.js')
                this.code = this.code || _getInitLocalCode(position)
            }

            _insert.dialog.open(
                'comment' + position + '.js',
                'comment',
                position,
                function () {
                    _timeline.destroy()
                    setTimeout(function () {
                        _insert.reload()
                    }, 1000)
                },
                'Timeline | Insert: Comment',
                'Comments for code or storyboarding',
                ['positioning']
            )
        }
        var templateCode = function (position) {
            return ['window.Authority = new function (info) {',
                '    this.commentID = ' + position,
                '',
                '    this.main = function () {',
                '        debugger',
                '        // info',
                '    }',
                '    return this',
                '}(this.info)',
                ''].join('\n')
        }
        var _getInitCode = function (position) {
            _init = templateCode(position)
            _init = encodeURIComponent(_init)
            app.vscode._DocOBJ.fragment = _init
            var positionJSON = {}
            positionJSON[position] = {}
            var query = {file: 'comment', logJSON: JSON.stringify(positionJSON)}
            _vssave(position, query)
            _vsopen(position)
            return _init
        }
        var _getInitLocalCode = function (position) {
            _init = templateCode(position)
            _init = encodeURIComponent(_init)
            _localsave(position, _init)
            return _init
        }
        var _localopen = function (position) {
            return window.localStorage.getItem('comment' + position + '.js')
        }
        var _localsave = function (position, _init) {
            return window.localStorage.setItem('comment' + position + '.js', _init)
        }
        var _vsopen = function (position) {
            app.vscode._DocOBJ.query = app.vscode._fileRefUser + 'comment' + position + '.js'
            app.vscode._DocURI = encodeURIComponent(JSON.stringify(app.vscode._DocOBJ))
            app.vscode._Ref = app.vscode._CommandOpen + '%5B' + app.vscode._DocURI + '%5D'
            app.vscode._CommandLink.href = app.vscode._Ref
            app.vscode._CommandLink.click()
        }
        var _vssave = function (position, query) {
            app.vscode._DocOBJ.query = app.vscode._fileLocalUser + 'comment' + position + '.js?' + JSON.stringify(query)
            app.vscode._DocURI = encodeURIComponent(JSON.stringify(app.vscode._DocOBJ))
            app.vscode._Ref = app.vscode._CommandSave + '%5B' + app.vscode._DocURI + '%5D'
            app.vscode._CommandLink.href = app.vscode._Ref
            app.vscode._CommandLink.click()
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
        var _init

        that.init = function (Authority, select, position) {
            _timeframe.runtimeAuthority(Authority, select, position)

            var _divElement = document.createElement('div')
            _divElement.style.left = position / _timeframe.length * 100 + '%'
            _divElement.setAttribute('class', 'segment')
            _divElement.setAttribute('data-position', position)

            _seek.span.element.appendChild(_divElement)

            if (app.vscode._CommandLink) {
                _divElement.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _vsopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
            } else {
                _divElement.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _localopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
            }

            _timeline.refresh()
        }

        that.dialog = function (element, position) {
            this.code = undefined

            element.setAttribute('data-position', position)

            if (app.vscode._CommandLink) {
                element.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _vsopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
                this.code = this.code || _getInitCode(position)
            } else {
                element.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _localopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
                this.code = window.localStorage.getItem('segment' + position + '.js')
                this.code = this.code || _getInitLocalCode(position)
            }

            _insert.dialog.open(
                'segment' + position + '.js',
                'segment',
                position,
                function () {
                    _timeline.destroy()
                    setTimeout(function () {
                        _insert.reload()
                    }, 1000)
                },
                'Timeline | Insert: Segment',
                'Segments for visuals and charting',
                ['positioning']
            )
        }
        var templateCode = function (position) {
            return ['window.Authority = new function (timeline, timeframe, buffer, binding, nodes, ctx) {',
                '    this.segmentID = ' + position,
                '',
                '    this.main = function () {',
                '        debugger',
                '        timeframe.stop()',
                '    }',
                '    return this',
                '}(this.ctx.timeline, this.ctx.timeline.addon.timeframe, this.ctx.timeline.addon.buffer, this.ctx.timeline.addon.binding, this.ctx)',
                ''].join('\n')
        }
        var _getInitCode = function (position) {
            _init = templateCode(position)
            _init = encodeURIComponent(_init)
            app.vscode._DocOBJ.fragment = _init
            var positionJSON = {}
            positionJSON[position] = {}
            var query = {file: 'segment', logJSON: JSON.stringify(positionJSON)}
            _vssave(position, query)
            _vsopen(position)
            return _init
        }
        var _getInitLocalCode = function (position) {
            _init = templateCode(position)
            _init = encodeURIComponent(_init)
            _localsave(position, _init)
            return _init
        }
        var _localopen = function (position) {
            return window.localStorage.getItem('segment' + position + '.js')
        }
        var _localsave = function (position, _init) {
            return window.localStorage.setItem('segment' + position + '.js', _init)
        }
        var _vsopen = function (position) {
            app.vscode._DocOBJ.query = app.vscode._fileRefUser + 'segment' + position + '.js'
            app.vscode._DocURI = encodeURIComponent(JSON.stringify(app.vscode._DocOBJ))
            app.vscode._Ref = app.vscode._CommandOpen + '%5B' + app.vscode._DocURI + '%5D'
            app.vscode._CommandLink.href = app.vscode._Ref
            app.vscode._CommandLink.click()
        }
        var _vssave = function (position, query) {
            app.vscode._DocOBJ.query = app.vscode._fileLocalUser + 'segment' + position + '.js?' + JSON.stringify(query)
            app.vscode._DocURI = encodeURIComponent(JSON.stringify(app.vscode._DocOBJ))
            app.vscode._Ref = app.vscode._CommandSave + '%5B' + app.vscode._DocURI + '%5D'
            app.vscode._CommandLink.href = app.vscode._Ref
            app.vscode._CommandLink.click()
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
        var _init

        that.init = function (Authority, select, position) {
            _timeframe.runtimeAuthority(Authority, select, position)

            var _divElement = document.createElement('div')
            _divElement.style.left = position / _timeframe.length * 100 + '%'
            _divElement.setAttribute('class', 'action')
            _divElement.setAttribute('data-position', position)

            _seek.span.element.appendChild(_divElement)

            if (app.vscode._CommandLink) {
                _divElement.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _vsopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
            } else {
                _divElement.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _localopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
            }

            _timeline.refresh()
        }

        that.dialog = function (element, position) {
            this.code = undefined

            element.setAttribute('data-position', position)

            if (app.vscode._CommandLink) {
                element.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _vsopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
                this.code = this.code || _getInitCode(position)
            } else {
                element.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _localopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
                this.code = window.localStorage.getItem('action' + position + '.js')
                this.code = this.code || _getInitLocalCode(position)
            }

            _insert.dialog.open(
                'action' + position + '.js',
                'action',
                position,
                function () {
                    _timeline.destroy()
                    setTimeout(function () {
                        _insert.reload()
                    }, 1000)
                },
                'Timeline | Insert: Action',
                'Actions for programming application interactivity',
                ['positioning']
            )
        }
        var templateCode = function (position) {
            return ['window.Authority = new function (app, THREE, camera, canvas, ctx) {',
                '    this.actionID = ' + position,
                '',
                '    this.main = function () {',
                '        debugger',
                '        ctx.timeline.addon.timeframe.stop()',
                '    }',
                '    return this',
                '}(this.app, this.THREE, this.ctx.camera, this.canvas, this.ctx)',
                ''].join('\n')
        }
        var _getInitCode = function (position) {
            _init = templateCode(position)
            _init = encodeURIComponent(_init)
            app.vscode._DocOBJ.fragment = _init
            var positionJSON = {}
            positionJSON[position] = {}
            var query = {file: 'action', logJSON: JSON.stringify(positionJSON)}
            _vssave(position, query)
            _vsopen(position)
            return _init
        }
        var _getInitLocalCode = function (position) {
            _init = templateCode(position)
            _init = encodeURIComponent(_init)
            _localsave(position, _init)
            return _init
        }
        var _localopen = function (position) {
            return window.localStorage.getItem('action' + position + '.js')
        }
        var _localsave = function (position, _init) {
            return window.localStorage.setItem('action' + position + '.js', _init)
        }
        var _vsopen = function (position) {
            app.vscode._DocOBJ.query = app.vscode._fileRefUser + 'action' + position + '.js'
            app.vscode._DocURI = encodeURIComponent(JSON.stringify(app.vscode._DocOBJ))
            app.vscode._Ref = app.vscode._CommandOpen + '%5B' + app.vscode._DocURI + '%5D'
            app.vscode._CommandLink.href = app.vscode._Ref
            app.vscode._CommandLink.click()
        }
        var _vssave = function (position, query) {
            app.vscode._DocOBJ.query = app.vscode._fileLocalUser + 'action' + position + '.js?' + JSON.stringify(query)
            app.vscode._DocURI = encodeURIComponent(JSON.stringify(app.vscode._DocOBJ))
            app.vscode._Ref = app.vscode._CommandSave + '%5B' + app.vscode._DocURI + '%5D'
            app.vscode._CommandLink.href = app.vscode._Ref
            app.vscode._CommandLink.click()
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
        var _init

        that.init = function (Authority, select, position) {
            _timeframe.runtimeAuthority(Authority, select, position)

            var _divElement = document.createElement('div')
            _divElement.style.left = position / _timeframe.length * 100 + '%'
            _divElement.setAttribute('class', 'sound')
            _divElement.setAttribute('data-position', position)

            _seek.span.element.appendChild(_divElement)

            if (app.vscode._CommandLink) {
                _divElement.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _vsopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
            } else {
                _divElement.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _localopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
            }

            _timeline.refresh()
        }

        that.dialog = function (element, position) {
            this.code = undefined

            element.setAttribute('data-position', position)

            if (app.vscode._CommandLink) {
                element.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _vsopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
                this.code = this.code || _getInitCode(position)
            } else {
                element.addEventListener('click', function () {
                    let position = this.getAttribute('data-position')
                    _localopen(position)
                    _seek.goInFrame(true, undefined, parseInt(position))
                })
                this.code = window.localStorage.getItem('sound' + position + '.js')
                this.code = this.code || _getInitLocalCode(position)
            }

            _insert.dialog.open(
                'sound' + position + '.js',
                'sound',
                position,
                function () {
                    _timeline.destroy()
                    setTimeout(function () {
                        _insert.reload()
                    }, 1000)
                },
                'Timeline | Insert: Sound',
                'Sounds for audio feedback',
                ['positioning']
            )
        }
        var templateCode = function (position) {
            return ['window.Authority = new function (Audio, AudioListener, AudioLoader, PositionalAudio, AudioAnalyser) {',
                '    this.soundID = ' + position,
                '',
                '    this.main = function () {',
                '        debugger',
                '        // sound here',
                '    }',
                '    return this',
                '}(this.THREE.Audio, this.THREE.AudioListener, this.THREE.AudioLoader, this.THREE.PositionalAudio, this.THREE.AudioAnalyser)',
                ''].join('\n')
        }
        var _getInitCode = function (position) {
            _init = templateCode(position)
            _init = encodeURIComponent(_init)
            app.vscode._DocOBJ.fragment = _init
            var positionJSON = {}
            positionJSON[position] = {}
            var query = {file: 'sound', logJSON: JSON.stringify(positionJSON)}
            _vssave(position, query)
            _vsopen(position)
            return _init
        }
        var _getInitLocalCode = function (position) {
            _init = templateCode(position)
            _init = encodeURIComponent(_init)
            _localsave(position, _init)
            return _init
        }
        var _localopen = function (position) {
            return window.localStorage.getItem('sound' + position + '.js')
        }
        var _localsave = function (position, _init) {
            return window.localStorage.setItem('sound' + position + '.js', _init)
        }
        var _vsopen = function (position) {
            app.vscode._DocOBJ.query = app.vscode._fileRefUser + 'sound' + position + '.js'
            app.vscode._DocURI = encodeURIComponent(JSON.stringify(app.vscode._DocOBJ))
            app.vscode._Ref = app.vscode._CommandOpen + '%5B' + app.vscode._DocURI + '%5D'
            app.vscode._CommandLink.href = app.vscode._Ref
            app.vscode._CommandLink.click()
        }
        var _vssave = function (position, query) {
            app.vscode._DocOBJ.query = app.vscode._fileLocalUser + 'sound' + position + '.js?' + JSON.stringify(query)
            app.vscode._DocURI = encodeURIComponent(JSON.stringify(app.vscode._DocOBJ))
            app.vscode._Ref = app.vscode._CommandSave + '%5B' + app.vscode._DocURI + '%5D'
            app.vscode._CommandLink.href = app.vscode._Ref
            app.vscode._CommandLink.click()
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
    gui.addon.Streaming.timeframe.timeline.seek.insert.dialog = (function (gui, app) {
        var that = _insert.dialog = _timeline.dialog
        var time = {}
        var changing = {}

        that.open = function (Authority, select, position, callback, title, description, contols) {
            this.element.style.display = 'block'
            this.title.element.innerHTML = title
            this.description.element.innerHTML = description
            time.minutes = this.timeInput[0]
            time.seconds = this.timeInput[1]
            time.millis = this.timeInput[2]
            secMsToMinSecMsAndInput(position, time.minutes, time.seconds, time.millis)

            attachNumberDragEvent(time.minutes)
            attachNumberDragEvent(time.seconds)
            attachNumberDragEvent(time.millis)
            attachNumberKeyEvent(time.minutes)
            attachNumberKeyEvent(time.seconds)
            attachNumberKeyEvent(time.millis)
            _timeline.element.addEventListener('mousedown', keepOpen)
            _timeline.element.removeEventListener('mouseup', makeClose)
            document.body.addEventListener('mousedown', that.close)
            if (callback) {
                callback()
            }
        }

        that.close = function () {
            this.element.style.display = 'none'
        }

        var keepOpen = function () {
            document.body.removeEventListener('mousedown', that.close)
            this.removeEventListener('mousedown', keepOpen)
            this.addEventListener('mouseup', makeClose)
        }

        var makeClose = function () {
            document.body.addEventListener('mousedown', that.close)
            this.addEventListener('mousedown', keepOpen)
            this.removeEventListener('mouseup', makeClose)
        }

        var attachNumberDragEvent = function (element, func) {
            element.addEventListener('mousedown', numberDragValue)
        }

        var attachNumberKeyEvent = function (element, func) {
            element.addEventListener('keyup', numberKeyValue)
        }

        var secMsToMinSecMsAndInput = function (secMs, minutes, seconds, millis) {
            var length = Math.floor((secMs == 0) ? 1 : Math.log10(secMs) + 1)
            minutes.value = ((secMs / (100 * 60)) % 60) << 0 // minute
            minutes.value = minutes.value < 10 ? '0' + minutes.value : minutes.value
            seconds.value = (secMs / 100) % 60 << 0 // sec
            seconds.value = seconds.value < 10 ? '0' + seconds.value : seconds.value
            millis.value = secMs.toString().substring(length - 2) // mms
            millis.value = millis.value < 0 ? '0' + millis.value : millis.value
            return secMs
        }

        var numberDragValue = function (e) {
            changing = this
            changing.delta = {x: e.pageX, y: e.pageY}
            document.body.addEventListener('mousemove', changeValue)
            window.addEventListener('mouseup', endChangeValue)
        }

        var numberKeyValue = function (e) {
            changing = this
            if (isNaN(this.value)) this.value = 0
            limitRenderValue(time)
        }

        var changeValue = function (e) {
            changing.current = {x: e.pageX, y: e.pageY}
            var moveVelocity = Math.abs(changing.current.y - changing.delta.y)

            if (moveVelocity > 4) {
                changing.value = changing.current.y - changing.delta.y > 0
                ? parseInt(changing.value) > parseInt(changing.min) ? parseInt(changing.value) - (parseInt(changing.step) + (moveVelocity - 5)) : changing.min
                : parseInt(changing.value) < parseInt(changing.max) ? parseInt(changing.value) + (parseInt(changing.step) + (moveVelocity - 5)) : changing.max

                limitRenderValue(time)

                changing.delta.x = changing.current.x
                changing.delta.y = changing.current.y
            }
        }

        var limitRenderValue = function (time) {
            var position = (time.minutes.value * 6000) + (time.seconds.value * 100) + (time.millis.value * 1)

            if (position < _timeframe.length && position > 0) {
                // Milliseconds >
                time.millis.value = position.toString().substring(time.length - 2) // mms
                if (time.millis.value > time.millis.max - 1) {
                    time.millis.value = time.millis.min + 1
                } else if (time.millis.value < time.millis.min + 1) {
                    time.millis.value = time.millis.max - 1
                    position -= 100
                }

                // Effect Seconds >
                time.seconds.value = (position / 100) % 60 << 0 // sec
                if (time.seconds.value > time.seconds.max - 1) {
                    time.seconds.value = time.seconds.min + 1
                    position += 6000
                } else if (time.seconds.value < time.seconds.min + 1) {
                    time.seconds.value = time.seconds.max - 1
                    position -= 6000
                }

                // Effect Minutes >
                time.minutes.value = ((position / (100 * 60)) % 60) << 0 // minute
                if (time.minutes.value > time.minutes.max - 1) {
                    time.minutes.value = time.minutes.min + 1
                } else if (time.minutes.value < time.minutes.min + 1) {
                    time.minutes.value = time.minutes.max - 1
                }
            }

            if (position > _timeframe.length) {
                time.delta = position = _timeframe.length
            } else if (position < 0) {
                position = time.delta
            } else {
                time.delta = position
            }

            secMsToMinSecMsAndInput(position, time.minutes, time.seconds, time.millis)
            changing.focus()
        }

        var endChangeValue = function (e) {
            e.preventDefault()
            changing = undefined
            document.body.removeEventListener('mousemove', changeValue)
            window.removeEventListener('mouseup', endChangeValue)
        }

        window.keydown_space_pause = function (e) {
            if (e) {
                if (e.keyCode != 32) {
                    return
                }
                _timeline.destroy()
                _insert.load('action', _insert.action.init, app.vscode._fileLocal)
                _insert.load('sound', _insert.sound.init, app.vscode._fileLocal)
                _insert.load('comment', _insert.comment.init, app.vscode._fileLocal)
                _insert.load('segment', _insert.segment.init, app.vscode._fileLocal)
            }
        }
        window.addEventListener('keyup', window.keydown_space_pause)
        return that
    })(gui, app)

    /**
     * dat.gui.Streaming.timeframe.timeline AddOn: charts
     * @author leroyron / http://leroy.ron@gmail.com
     */
    gui.addon.Streaming.timeframe.timeline.charts = (function (gui, app) {
        var that = {}
        var _onupdate = function (controller) {
            var seeksegPos = (_timeline.seek.position - _timeline.prevSegmentPos) / (_timeline.segmentPos - _timeline.prevSegmentPos) * 100

            controller.style.left = seeksegPos + '%'
        }
        var _onchange = function (controller, change) {
        }
        _onchange()
        var _onruntime = function (controller) {
        }
        _onruntime()
        var _onpass = function (controller) {
            controller.style.left = (app.width - 395) * (_timeline.prevSegmentPos / 100) + 'px'
            controller.style.width = (app.width - 395) * ((_timeline.segmentPos / 100) - (_timeline.prevSegmentPos / 100)) + 'px'
            controller.innerHTML = 'Segment ' + _timeline.passSegment
        }
        var _resize = function () {
            divCharts.style.width = (app.width - 375) + 'px'
            divCharts.style.paddingRight = 20 + 'px'
            divCsegment.style.left = (app.width - 395) * (_timeline.prevSegmentPos / 100) + 'px'
            divCsegment.style.width = (app.width - 395) * ((_timeline.segmentPos / 100) - (_timeline.prevSegmentPos / 100)) + 'px'
        }

        var divApp = app.element

        // //Charts
        var divChartsStyle = document.createElement('style')
        divChartsStyle.innerHTML = '#charts, .CH div {float: left; position: absolute; width: 100%;}                #charts {color: #fff; font: 11px "Lucida Grande",sans-serif; height: 100%; left: 80px; text-indent: 5px; top: 85px; width: 75%; z-index: 21;}                .CH .name {width: 10%;}                .CH .blocks, .CH .segline {width: 90%;}                .CH div {height: 14px;}                .CH .node, .CH .buffers, .CH .properties {height: auto;}                .CH .set {height: auto;}                .CH .block {background: #ff0000;}                .CH .block:hover {border: #ff0000 1px solid; margin: -1px; z-index: 1}                .CH .csegment {position: relative; color: #222; background: #dad5cb; height: 30px; left: 10%; margin-left: 26px; top: -33px; width: 29%; word-break: break-all; overflow: hidden;}                .CH .data {position: relative; background: #dad5cb; height: 100%; left: 25px; top: -33px; width: 100%; overflow: auto;}                .CH .node {background: #1a1a1a; float: left; padding: 5px 0px; position: relative; top: 10px;width: 100%;}                .CH .node div {position: relative;}                .CH .segseek, .CH .seekwidth, .CH .seekseg, .CH .segline {background: #aaa; width: 1px; z-index: 1;}                .CH .segseek {height: 5px; left: 1%;}                .CH .seekwidth {height: 1px; top: 5px;}                .CH .seekseg {height: 13808px; top: 5px;}                .CH .segline {background: none; width: 90%; height: 1px;}                #coords {color:#fff; position: relative; bottom: 0px; left: 0px; z-index: 1;}                #coords {color: #000};                input {right: left;}                #splinecanvas {position: relative; top: 0px; left: 0px; width:100%; height:120px}             text {font-size: 12px; fill: #bbb}                path, line {stroke: #aaa; fill: #FFF;}'
        divApp.appendChild(divChartsStyle)

        var divCharts = document.createElement('div')
        divCharts.id = 'charts'
        divCharts.style.display = 'none'
        divCharts.setAttribute('class', 'CH')

        var divSeekseg = document.createElement('div')
        divSeekseg.style.left = '11%'
        divSeekseg.setAttribute('class', 'seekseg')

        var divSegline = document.createElement('div')
        divSegline.style.left = '10%'
        divSegline.setAttribute('class', 'segline')
        divSegline.appendChild(divSeekseg)

        var divSegseek = document.createElement('div')
        divSegseek.style.left = '0%'
        divSegseek.setAttribute('class', 'segseek')

        var divData = document.createElement('div')
        divData.setAttribute('class', 'data')
        divData.appendChild(divSegseek)
        divData.appendChild(divSegline)

        var divCsegment = document.createElement('div')
        divCsegment.style.left = '0%'
        divCsegment.style.width = '29%'
        divCsegment.setAttribute('class', 'csegment')
        divCsegment.innerHTML = 'Segment0'

        divCharts.appendChild(divCsegment)
        divCharts.appendChild(divData)

        divApp.appendChild(divCharts)
        // //

        // //Chart fake data
        var divNodes = ['Adjustments', 'MotionBlur', 'Uniforms']

        var properties = {}
        properties.Adjustments = [
            ['value',
                [['resolution',
                [6200, 'auto']]]
            ]
        ]
        properties.MotionBlur = [
            ['value',
                [['shutterspeed',
                [6200, 2]],
                ['influence',
                [6200, 10]]]
            ]
        ]
        properties.Uniforms = [
            ['value',
                [['godray_amount',
                [6200, 15]],
                ['screenshadow_alpha',
                [6200, 1]],
                ['ash_direction',
                [6200, 3]]]
            ]
        ]
        properties.translations = [
            ['position',
                [['x'// ,
                // [6200,100]
                ],
                ['y'// ,
                // [6200,100]
                ],
                ['z'// ,
                // [6200,100]
                ]]
            ],
            ['rotation',
                [['x'],
                ['y'],
                ['z']]
            ]
        ]

        var randFromTo = function (nfrom, nto) { // To fake the values
            return Math.floor((Math.random() * (nto - nfrom) + 1) + nfrom)
        }
        var randFromToString = function (nfrom, nto) { // To fake the values
            var ranNum = Math.floor((Math.random() * (nto - nfrom) + 1) + nfrom)
            ranNum = ranNum < 0 ? ranNum : '+' + ranNum
            return ranNum
        }
        genBlocks(divNodes)
        genBlocks(100, 'tri')

        function genBlocks (gen, genName) {
            var nlen = 0
            var isNum = !isNaN(gen)
            if (isNum) {
                nlen = gen
            } else {
                nlen = gen.length
            }

            for (let n = 0; n < nlen; n++) {
                let divNode = document.createElement('div')
                divNode.setAttribute('class', 'node')

                let divName = document.createElement('div')
                divName.className = 'name'
                if (isNum) {
                    divName.innerHTML = genName + n
                } else {
                    divName.innerHTML = gen[n]
                }

                let divBlocks = document.createElement('div')
                divBlocks.setAttribute('class', 'blocks')

                let divBuffers = document.createElement('div')
                divBuffers.setAttribute('class', 'buffers')

                let divProperties = document.createElement('div')
                divProperties.setAttribute('class', 'properties')

                divNode.appendChild(divName)
                divNode.appendChild(divBlocks)

                let prop
                if (isNum) {
                    prop = properties.translations
                } else {
                    prop = properties[gen[n]]
                }

                for (let p = 0; p < prop.length; p++) {
                    let divSet = document.createElement('div')
                    divSet.setAttribute('class', 'set')

                    divName = document.createElement('div')
                    divName.className = 'name'
                    divName.innerHTML = prop[p][0]
                    divSet.appendChild(divName)
                    for (let s = 0; s < prop[p][1].length; s++) {
                        let divProp = document.createElement('div')
                        divProp.setAttribute('class', 'prop')

                        divName = document.createElement('div')
                        divName.className = 'name'
                        divName.innerHTML = prop[p][1][s][0]
                        divProp.appendChild(divName)

                        divBlocks = document.createElement('div')
                        divBlocks.setAttribute('class', 'blocks')

                        let segment4length = 6200// gui.nextSegmentPos - gui.segmentPos;//At segment 4 22000 - 15800

                        if (isNum) {
                            let sumCheck = 0
                            let fNum = 0
                            prop[p][1][s] = [prop[p][1][s][0]]
                            for (let fs = segment4length; fs > 0; fs -= fNum) { // Randomize fake data
                                fNum = randFromTo(2000, 5000)
                                sumCheck += fNum
                                if (sumCheck > segment4length) {
                                    fNum -= (sumCheck - segment4length)
                                }
                                prop[p][1][s].push([fNum, randFromToString(-1000, 1000)])
                            }
                        }

                        for (let b = 1; b < prop[p][1][s].length; b++) {
                            let divBlock = document.createElement('div')
                            divBlock.setAttribute('class', 'block')
                            divBlock.setAttribute('data-value', parseInt(prop[p][1][s][b][1]))
                            divBlock.setAttribute('data-length', prop[p][1][s][b][0])
                                // divBlock.setAttribute('data-length', prop[p][1][s][b][0]);
                            divBlock.style.width = prop[p][1][s][b][0] / segment4length * 100/* (prop[p][1][s][b][0]/(gui.nextSegmentPos - gui.segmentPos)*100) */+ '%'
                            divBlock.style.background = 'rgb(' + parseInt(225 - 255 * (prop[p][1][s][b][0] / segment4length)) + ',50,' + parseInt(455 * (prop[p][1][s][b][0] / segment4length)) + ')'
                            divBlock.innerHTML = prop[p][1][s][b][1]
                                // divBlock.addEventListener('click', showGraph)
                            divBlocks.appendChild(divBlock)
                        }

                        divProp.appendChild(divBlocks)

                        divSet.appendChild(divProp)
                    }

                    divProperties.appendChild(divSet)
                }

                divBuffers.appendChild(divProperties)

                divNode.appendChild(divBuffers)

                divData.appendChild(divNode)
            }
        }

        // GUI
        gui.controls.charts = gui.addFolder('Charts')
        var chartsOpen = false
        that.openToggleCharts = function () {
            if (chartsOpen) {
                divCharts.style.display = 'none'
                chartsOpen = false
            } else {
                divCharts.style.display = 'inline'
                chartsOpen = true
                _timeline.checkPassSegment()
            }
        }

        gui.addon.bind.onupdate(divSeekseg, _timeline, _onupdate)

        gui.addon.bind.onpass(divCsegment, _timeline, _onpass)

        gui.controls.charts.onopenFolder(that.openToggleCharts)

        _resize()
        window.resizeCalls.push(_resize)

        return that
    })(gui, app)
}/* Buildup - End */)
