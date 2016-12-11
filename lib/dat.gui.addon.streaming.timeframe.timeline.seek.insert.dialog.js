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

    that.open = function (Authority, select, position, callback, title, description, contols) {
        _dialog.element.style.display = 'block'
        this.title.element.innerHTML = title
        this.description.element.innerHTML = description
        position = position.toString()
        this.input[0].value = position.substring(0, position.length - 1)
        this.input[1].value = position.substring(0, position.length - 1)
        this.input[2].value = position.substring(0, position.length - 2)
        if (callback) {
            callback()
        }
    }

    window.addEventListener('keyup', function (e) {
        if (e) {
            console.log('KeyCode:' + e.keyCode)
            if (e.keyCode != 32) {
                return
            }
            _timeline.destroy()
            _insert.load('action', _insert.action.init, app._fileLocal)
            _insert.load('sound', _insert.sound.init, app._fileLocal)
            _insert.load('comment', _insert.comment.init, app._fileLocal)
            _insert.load('segment', _insert.segment.init, app._fileLocal)
        }
    })
})(this.gui, this.app)
