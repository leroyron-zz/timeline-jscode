/**
 * dat.gui.Streaming.timeframe AddOn: timeline
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (gui, app) {
    var _timeframe = gui.addon.Streaming.timeframe
    var that = _timeframe.timeline = {}
    that.time = 'sec/ms' // setup to invoke a function each frame//new Streaming.addon.timeframe.invoke = function () {}
    that.segment = 0
    that.actionETC = 0
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
    divTimelineStyle.innerHTML = '#timeline, .TL div {position: absolute;}\n                #timeline {width: 75%; height: 65px; top: 17px; left: 100px; z-index: 22;}\n                .info.dg {display:none}\n                .info.dg, .info.dg div {height: 15px; width: 150px;}\n                .info.top {top: -14px;}\n                .info.bottom {top: 68px;}\n                .info .text {text-align: center; left: -75px;}\n                .info .bg {background: black; opacity: 0.5; left: -75px;}\n                .TL .left, .TL .right, .TL .span {width: 5px; height: 29px; top: 0px;}\n                .TL .left {left: 0px; background: transparent url(' + app._fileLocal + 'assets/left-slide.png) no-repeat left top;}\n                .TL .right {right: -10px; background: transparent url(' + app._fileLocal + 'assets/right-slide.png) no-repeat right top;}\n                .TL .span {width: 100%; left: 5px; background: transparent url(' + app._fileLocal + 'assets/center-slide.png) repeat-x left top;}\n                .TL .comment {width: 15px; height: 14px; top: 25px; left: 5%; background: transparent url(' + app._fileLocal + 'assets/comment.png) no-repeat left top; cursor: pointer}\n                .TL .segment {width: 1px; height: 17px; top: 27px; left: 10%; border:#666 solid 1px; background: #fff; opacity: 0.50; cursor: pointer}\n                .TL .seek {background: #666; top: 4px; width: 1px; left: 0%; height: 21px;}\n                .TL .bar {background: #bbb none repeat scroll 0 0; border-radius: 10px; border-top: 1px solid #fff; height: 23px; opacity: 0.1; top: 44px; width: 100%;}\n                .TL .slider {background: transparent url(' + app._fileLocal + 'assets/slider.png) no-repeat center bottom; bottom: -43px; width: 40px; left: -20px; height: 36px;}\n                .TL .action {border:#666 solid 1px; background: #ff0000; top: 4px; width: 5px; height: 7px; cursor: pointer}\n                .TL .sound {border:#666 solid 1px; background: #fff; top: 17px; width: 5px; height: 7px; cursor: pointer}\n                .TL .dialog {display:none; background: #3f3f3f; width: 350px; height: 350px; border-radius: 10px; border: #555 1px solid; top: 115px; margin: auto; position: relative; color: #dadada; font-family: verdana; font-size: 11px; font-weight: bold;}\n                .TL .dialog div {position: unset;}\n                .TL .dialog .title {width: 340px; height: 27px; float: left; font-size: 15px;padding: 22px 0px 3px 10px;}\n                .TL .dialog .description {width: 340px; height: 24px; border-bottom: #222 1px solid; float: left;padding: 0px 0px 0px 10px;font-size: 9px;}\n                .TL .dialog .option {height: 40px; width: 340px; border-top: #555 1px solid; float: left;padding: 10px 0px 3px 10px;}\n                .dialog lable {width: 340px; float: left; height: 20px;}\n                .dialog input {width: 30px; background: #333; border: none; color: #fff; border-radius: 5px; padding: 0px 0px 0px 6px;}'
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
    inputNumber.min = 0
    inputNumber.max = 59
    inputNumber.step = 1
    divOption.appendChild(inputNumber)

    var textColon = document.createTextNode(' : ')
    divOption.appendChild(textColon)

    divOption.appendChild(inputNumber.cloneNode())

    var textDot = document.createTextNode(' . ')
    divOption.appendChild(textDot)

    var mmInputNumber = inputNumber.cloneNode()
    mmInputNumber.max = 99
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
    gui.controls.timeline.add(that, 'info')

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
        for (let ei = alen - 1; ei > -1; ei--) {
            this.seek.span.element.removeChild(actions[ei])
            document.getElementsByTagName('body')[0].removeChild(actionScripts[ei])
        }
        for (let ei = sdlen - 1; ei > -1; ei--) {
            this.seek.span.element.removeChild(sounds[ei])
            document.getElementsByTagName('body')[0].removeChild(soundScripts[ei])
        }
        for (let ei = clen - 1; ei > -1; ei--) {
            this.seek.span.element.removeChild(comments[ei])
            document.getElementsByTagName('body')[0].removeChild(commentScripts[ei])
        }
        for (let ei = slen - 1; ei > -1; ei--) {
            this.seek.span.element.removeChild(segments[ei])
            document.getElementsByTagName('body')[0].removeChild(segmentScripts[ei])
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
                _actionETC.setValue(actionsPos[a] - that.seek.position)
                break
            } else {
                _actionETC.setValue(0)
            }
        }
    }
    , 1000)

    var _performInit = function () {
        setTimeout(function () {
            if (_timeframe.init && typeof that.init != 'undefined') {
                that.init()

                var _performReady = function () {
                    setTimeout(function () {
                        if (_timeframe.ready && typeof that.ready != 'undefined') {
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
})(this.gui, this.app)
