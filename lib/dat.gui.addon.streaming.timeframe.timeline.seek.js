/**
 * dat.gui.Streaming AddOn: timeline
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (gui, app) {
    var _timeframe = gui.addon.Streaming.timeframe
    var _timeline = _timeframe.timeline
    var slider = _timeline.slider
    var seek = _timeline.seek
    slider.element.style.cursor = 'pointer'

    var mouseX = 0
    var deltaX = 0
    var dragging = false

    var seekWidth = 0

    var _onmousedown = function (e) {
        e.preventDefault()
        _timeframe.stop()

        var sliderElement = this
        deltaX = e.pageX - sliderElement.offsetLeft + document.body.scrollLeft

        var _onmousemove = function (e) {
            e.preventDefault()

            mouseX = e.pageX - sliderElement.offsetLeft + document.body.scrollLeft

            if (Math.abs(mouseX - deltaX) > 4) {
                dragging = true
                // pass event control for dragging within seek
                seekWidth = seek.span.element.clientWidth

                this.removeEventListener('mouseup', _onmouseup)
                this.removeEventListener('mousemove', _onmousemove)

                this.addEventListener('mousemove', _ondrag)
                this.addEventListener('mouseup', _ondrop)
            }
        }
        _timeline.element.addEventListener('mousemove', _onmousemove)

        var _onmouseup = function (e) {
            e.preventDefault()
            _timeframe.run()

            dragging = false

            this.removeEventListener('mouseup', _onmouseup)
            this.removeEventListener('mousemove', _onmousemove)
        }
        _timeline.element.addEventListener('mouseup', _onmouseup)
    }
    slider.element.addEventListener('mousedown', _onmousedown)

    var _ondrag = function (e) {
        e.preventDefault()

        mouseX = e.pageX - _timeline.element.offsetLeft - 5 + document.body.scrollLeft
        seek.position = (mouseX / seekWidth * 100)
        seek.position = seek.position > 100 ? 100 : seek.position < 0 ? 0 : seek.position
        seek.element.style.left = seek.position + '%'
    }

    var _ondrop = function (e) {
        e.preventDefault()
        _timeframe.run()

        dragging = false

        _timeframe.duration = seek.position / 100 * _timeframe.length << 0

        _timeframe.syncing()

        _timeline.checkPassSegment()

        this.removeEventListener('mousemove', _ondrag)
        this.removeEventListener('mouseup', _ondrop)
    }
})(this.gui, this.app)

