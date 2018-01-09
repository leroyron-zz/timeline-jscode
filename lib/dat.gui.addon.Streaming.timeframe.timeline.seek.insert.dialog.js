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

    that.open = function (Authority, select, position, callback, title, description, controls) {
        _dialog.element.style.display = 'block'
        this.title.element.innerHTML = title
        this.description.element.innerHTML = description
        time.hour = this.timeInput[0]
        time.minute = this.timeInput[1]
        time.second = this.timeInput[2]
        time.millisecond = this.timeInput[3]
        secMsToMinSecMsAndInput(position, time.hour, time.minute, time.second, time.millisecond)

        attachNumberDragEvent(time.hour)
        attachNumberDragEvent(time.minute)
        attachNumberDragEvent(time.second)
        attachNumberDragEvent(time.millisecond)
        attachNumberKeyEvent(time.hour)
        attachNumberKeyEvent(time.minute)
        attachNumberKeyEvent(time.second)
        attachNumberKeyEvent(time.millisecond)
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

    var secMsToMinSecMsAndInput = function (secMs, hour, minute, second, millisecond) {
        var length = Math.floor((secMs == 0) ? 1 : Math.log10(secMs) + 1)
        hour.value = ((secMs / 360000 /* (100 * 60 * 60) */) % 60) << 0 // hour
        hour.value = hour.value < 10 ? '0' + hour.value : hour.value
        minute.value = ((secMs / 6000 /* (100 * 60) */) % 60) << 0 // minute
        minute.value = minute.value < 10 ? '0' + minute.value : minute.value
        second.value = (secMs / 100) % 60 << 0 // sec
        second.value = second.value < 10 ? '0' + second.value : second.value
        millisecond.value = secMs.toString().substring(length - 2) // mms
        millisecond.value = millisecond.value < 0 ? '0' + millisecond.value : millisecond.value
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
        var position = (time.hour.value * 360000) + (time.minute.value * 6000) + (time.second.value * 100) + (time.millisecond.value * 1)

        if (position < _timeframe.length && position > 0) {
            // millisecondseconds >
            time.millisecond.value = position.toString().substring(time.length - 2) // mms
            if (time.millisecond.value > time.millisecond.max - 1) {
                time.millisecond.value = time.millisecond.min + 1
            } else if (time.millisecond.value < time.millisecond.min + 1) {
                time.millisecond.value = time.millisecond.max - 1
                position -= 100
            }

            // Effect Seconds >
            time.second.value = (position / 100) % 60 << 0 // sec
            if (time.second.value > time.second.max - 1) {
                time.second.value = time.second.min + 1
                position += 6000
            } else if (time.second.value < time.second.min + 1) {
                time.second.value = time.second.max - 1
                position -= 6000
            }

            // Effect Minutes >
            time.minute.value = ((position / 6000 /* (100 * 60) */) % 60) << 0 // minute
            if (time.minute.value > time.minute.max - 1) {
                time.minute.value = time.minute.min + 1
            } else if (time.minute.value < time.minute.min + 1) {
                time.minute.value = time.minute.max - 1
            }

            // Effect Hour >
            time.hour.value = ((position / 360000 /* (100 * 60 * 60) */) % 60) << 0 // hour
            if (time.hour.value > time.hour.max - 1) {
                time.hour.value = time.hour.min + 1
            } else if (time.hour.value < time.hour.min + 1) {
                time.hour.value = time.hour.max - 1
            }
        }

        if (position > _timeframe.length) {
            time.delta = position = _timeframe.length
        } else if (position < 0) {
            position = time.delta
        } else {
            time.delta = position
        }

        secMsToMinSecMsAndInput(position, time.hour, time.minute, time.second, time.millisecond)
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
