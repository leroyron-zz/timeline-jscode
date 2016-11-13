/**
 * dat.gui.Streaming.timeframe.timeframe.timeline.seek AddOn: insert
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
                return
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
    that.make = function () {
        var _divElement = document.createElement('div')
        _divElement.style.left = this.position + '%'
        _seek.span.element.appendChild(_divElement)

        this.element = _divElement
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
        _seek.position = that.position

        this.select = this.delta = 'nothing'
        this.dragging = false
        _seek.start = false

        _seek.goInFrame(true, (that.position / 100 * _timeframe.length << 0))

        _seek.info.text.innerHTML = 'Playback: press to play'
        _seek.info.element.setAttribute('class', 'info bottom dg')
        _seek.info.element.style.display = 'inline'
        _seek.info.element.style.left = _seek.element.style.left = _seek.position + '%'
    }
})(this.gui, this.app)
