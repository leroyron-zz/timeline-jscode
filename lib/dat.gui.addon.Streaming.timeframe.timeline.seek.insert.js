/**
 * dat.gui.Streaming.timeframe.timeline.seek AddOn: insert
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (gui, app) {
    var _timeframe = gui.addon.Streaming.timeframe
    var _timeline = _timeframe.timeline
    var _seek = _timeline.seek
    var that = _seek.insert = {}
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
})(this.gui, this.app)
