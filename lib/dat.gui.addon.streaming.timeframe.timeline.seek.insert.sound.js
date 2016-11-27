/**
 * dat.gui.Streaming.timeframe.timeline.seek.insert AddOn: sound
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (gui, app) {
    var _timeframe = gui.addon.Streaming.timeframe
    var _timeline = _timeframe.timeline
    var _seek = _timeline.seek
    var _insert = _seek.insert
    var that = _insert.sound = {}
    var _init

    that.init = function (position) {
        var _divElement = document.createElement('div')
        _divElement.style.left = position / _timeframe.length * 100 + '%'
        _divElement.setAttribute('class', 'sound')
        _divElement.setAttribute('data-position', position)

        _seek.span.element.appendChild(_divElement)

        if (app._vscodeCommandLink) {
            _divElement.addEventListener('click', function () {
                let position = this.getAttribute('data-position')
                _vsopen(position)
                _seek.goInFrame(true, undefined, parseInt(position))
            })
        } else {
            _divElement.addEventListener('click', function () {
                let position = this.getAttribute('data-position')
                _localopen(position)
                _seek.goInFrame(true, undefined, parseInt(position))
            })
        }
    }

    that.dialog = function (element, position) {
        this.code = undefined

        element.setAttribute('data-position', position)

        if (app._vscodeCommandLink) {
            element.addEventListener('click', function () {
                let position = this.getAttribute('data-position')
                _vsopen(position)
                _seek.goInFrame(true, undefined, parseInt(position))
            })
            this.code = this.code || _getInitCode(position)
        } else {
            element.addEventListener('click', function () {
                let position = this.getAttribute('data-position')
                _localopen(position)
                _seek.goInFrame(true, undefined, parseInt(position))
            })
            this.code = window.localStorage.getItem('sound' + position + '.js')
            this.code = this.code || _getInitLocalCode(position)
        }
    }

    var _getInitCode = function (position) {
        _init = '// @ID\nlet soundID = ' + position + '\n'
        _init = encodeURIComponent(_init)
        app._vscodeDocOBJ.fragment = _init
        _vssave(position)
        _vsopen(position)
        return _init
    }
    var _getInitLocalCode = function (position) {
        _init = '// @ID\nlet soundID = ' + position + '\n'
        _init = encodeURIComponent(_init)
        _localsave(position, _init)
        return _init
    }
    var _localopen = function (position) {
        return window.localStorage.getItem('sound' + position + '.js')
    }
    var _localsave = function (position, _init) {
        return window.localStorage.setItem('sound' + position + '.js', _init)
    }
    var _vsopen = function (position) {
        app._vscodeDocOBJ.query = app._fileRefUser + 'sound' + position + '.js'
        app._vscodeDocURI = encodeURI(JSON.stringify(app._vscodeDocOBJ))
        app._vscodeRef = app._vscodeCommandOpen + '%5B' + app._vscodeDocURI + '%5D'
        app._vscodeCommandLink.href = app._vscodeRef
        app._vscodeCommandLink.click()
    }
    var _vssave = function (position) {
        app._vscodeDocOBJ.query = app._fileLocalUser + 'sound' + position + '.js'
        app._vscodeDocURI = encodeURI(JSON.stringify(app._vscodeDocOBJ))
        app._vscodeRef = app._vscodeCommandSave + '%5B' + app._vscodeDocURI + '%5D'
        app._vscodeCommandLink.href = app._vscodeRef
        app._vscodeCommandLink.click()
    }
    var _timeframeready = function (that) {
        _insert.load('sound', that.init, app._fileLocal)
    }
    gui.addon.bind.onready(that, _timeline, _timeframeready)
})(this.gui, this.app)
