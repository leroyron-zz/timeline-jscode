/**
 * dat.gui.Streaming AddOn: timeline
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (gui, app) {
    var _timeframe = gui.addon.Streaming.timeframe
    var that = _timeframe.timeline = {}
    that.time = 'sec/ms' // setup to invoke a function each frame//new Streaming.addon.timeframe.invoke = function () {}
    that.segment = 0
    that.actionETC = 0
    that.info = 'spacebar to pause'
    var update = function (controller) {
        that.updateCallbacks()
    }
    that.updateCalls = []
    that.uclen = 0
    that.updateCallbacks = function () {
        for (var c = 0; c < this.uclen; c++) {
            this.updateCalls[c][1](this.updateCalls[c][0])
        }
    }
    var pass = function (controller) {
        that.passCallbacks()
    }
    that.passCalls = []
    that.pclen = 0
    that.passCallbacks = function () {
        for (var p = 0; p < this.pclen; p++) {
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

        update()
    }
    var _onrevert = function (controller, revertPos) {
        _timeframe.duration = revertPos
        _timeframe.syncing()
        that.checkPassSegment()
    }
    var _resize = function () {
        divTimeline.style.width = (app.width - 395) + 'px'
    }

    var divApp = app.element

    // //TimeLine
    var divTimelineStyle = document.createElement('style')
    divTimelineStyle.innerHTML = '#timeline, .TL div {position: absolute;}                #timeline {width: 75%; height: 65px; top: 17px; left: 100px;z-index: 22;}                .TL .left, .TL .right, .TL .center {width: 5px; height: 29px; top: 0px;}                .TL .left {left: 0px; background: transparent url(assets/left-slide.png) no-repeat left top;}                .TL .right {right: -10px; background: transparent url(assets/right-slide.png) no-repeat right top;}                .TL .center {width: 100%; left: 5px; background: transparent url(assets/center-slide.png) repeat-x left top;}                .TL .comment {width: 15px; height: 14px; top: 25px; left: 5%; background: transparent url(assets/comment.png) no-repeat left top;}                .TL .segment {width: 1px; height: 17px; top: 27px; left: 10%; border:#666 solid 1px; background: #fff; opacity: 0.50;}                .TL .seek {background: #666; top: 4px; width: 1px; left: 0%; height: 21px;}                .TL .slider {background: transparent url(assets/slider.png) no-repeat left bottom; bottom: -43px; width: 20px; left: -10px; height: 36px;}                .TL .action {border:#666 solid 1px; background: #ff0000; top: 4px; width: 5px; height: 7px;}                .TL .sound {border:#666 solid 1px; background: #fff; top: 17px; width: 5px; height: 7px;};'
    divApp.appendChild(divTimelineStyle)

    var divTimeline = document.createElement('div')
    divTimeline.id = 'timeline'
    divTimeline.setAttribute('class', 'TL')

    var divLeft = document.createElement('div')
    divLeft.setAttribute('class', 'left')

    var divRight = document.createElement('div')
    divRight.setAttribute('class', 'right')

    var divCenter = document.createElement('div')
    divCenter.setAttribute('class', 'center')

    for (var cs = 1; cs < 4; cs++) {
        var divComment = document.createElement('div')
        divComment.style.left = (cs / 4 * 100) + '%'
        divComment.setAttribute('class', 'comment')
        divCenter.appendChild(divComment)

        var divSegment = document.createElement('div')
        divSegment.style.left = (cs / 4 * 100) + '%'
        divSegment.setAttribute('class', 'segment')
        divCenter.appendChild(divSegment)
    }

    var divSlider = document.createElement('div')
    divSlider.setAttribute('class', 'slider')

    var divSeek = document.createElement('div')
    divSeek.style.left = '0%'
    divSeek.setAttribute('class', 'seek')
    divSeek.appendChild(divSlider)
    divCenter.appendChild(divSeek)

    var divAction = document.createElement('div')
    divAction.style.left = '13%'
    divAction.setAttribute('class', 'action')
    divCenter.appendChild(divAction)

    var divSound = document.createElement('div')
    divSound.style.left = '0%'
    divSound.setAttribute('class', 'sound')
    divCenter.appendChild(divSound)

    divSound = document.createElement('div')
    divSound.style.left = '10%'
    divSound.setAttribute('class', 'sound')
    divCenter.appendChild(divSound)

    divTimeline.appendChild(divLeft)
    divTimeline.appendChild(divCenter)
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

    that.seek = {position: undefined, element: divSeek, span: {element: divCenter}}

    that.slider = {element: divSlider}
    that.prevSegmentPos = undefined
    that.segmentPos = undefined
    that.nextSegmentPos = undefined
    that.passSegment = undefined
    that.callbackPass = {list: [], count: 0}

    var actions = document.getElementsByClassName('action')
    var alen = actions.length
    var actionsPos = new Int32Array(new ArrayBuffer(alen * 4))
    for (var a = 0; a < alen; a++) {
        actionsPos[a] = parseInt(actions[a].style.left)
    }

    var segments = document.getElementsByClassName('segment')
    var slen = segments.length
    var segmentsPos = new Int32Array(new ArrayBuffer(slen * 4))
    for (var s = 0; s < slen; s++) {
        segmentsPos[s] = parseInt(segments[s].style.left)
    }

    that.checkPassSegment = function () {
        this.passSegment = 0
        for (var s = 0; s < slen; s++) {
            if (this.seek.position >= segmentsPos[s]) {
                this.passSegment++
            }
        }
        _segment.setValue(this.passSegment)

        this.prevSegmentPos = segmentsPos[that.segment - 1] || 0
        this.segmentPos = segmentsPos[that.segment] || 100
        this.nextSegmentPos = segmentsPos[that.segment + 1] || 100

        pass()
    }
    that.checkPassSegment()

    var rec = document.getElementsByClassName('rec')
    window.setInterval(function () {
        for (var r = 0; r < rec.length; r++) {
            if (rec[r].className == 'rec on') {
                rec[r].className = 'rec off'
            } else if (rec[r].className == 'rec off') {
                rec[r].className = 'rec on'
            } else if (rec[r].className == 'rec seg') {
                rec[r].innerHTML = _segment.getValue()
            }
        }
        for (var a = 0; a < alen; a++) {
            if (that.seek.position <= actionsPos[a]) {
                _actionETC.setValue(actionsPos[a] - that.seek.position)
                break
            } else {
                _actionETC.setValue(0)
            }
        }
    }
      , 1000)

    gui.addon.bind.onrevert(divSeek, _timeframe, _onrevert)
    gui.addon.bind.onruntime(divSeek, _timeframe, _onruntime)

    _resize()
    window.resizeCalls.push(_resize)
})(this.gui, this.app)

