/**
 * dat.gui.Streaming.timeframe.timeline.seek AddOn: bar
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (gui, app) {
    var _timeframe = gui.addon.Streaming.timeframe
    var _timeline = _timeframe.timeline
    var _seek = _timeline.seek
    var that = _seek.bar

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
})(this.gui, this.app)

