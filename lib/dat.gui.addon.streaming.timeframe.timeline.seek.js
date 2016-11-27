/**
 * dat.gui.Streaming.timeframe.timeline AddOn: seek
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (gui, app) {
    var _timeframe = gui.addon.Streaming.timeframe
    var _timeline = _timeframe.timeline
    var that = _timeline.seek
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
    that.ondrop = function (e) {
        e.preventDefault()
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
        that.position = (mouseX / that.width * 100)
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
})(this.gui, this.app)
