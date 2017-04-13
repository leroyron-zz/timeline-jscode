/**
 * dat.gui.Streaming.timeframe.timeline.seek AddOn: dialog
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (gui, app) {
    var _timeframe = gui.addon.Streaming.timeframe
    var _timeline = _timeframe.timeline
    var _dialog = _timeline.dialog
    var _seek = _timeline.seek
    var _insert = _seek.insert
    var that = _insert.dialog = _timeline.dialog
    var time = {}
    var changing = {}

    that.open = function (Authority, select, position, callback, title, description, contols) {
        _dialog.element.style.display = 'block'
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
        _dialog.element.style.display = 'none'
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
})(this.gui, this.app)
