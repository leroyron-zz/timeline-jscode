/**
 * dat.gui.Streaming.timeframe.timeline.seek.insert AddOn: segment
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (gui, app) {
    var _timeframe = gui.addon.Streaming.timeframe
    var _timeline = _timeframe.timeline
    var _seek = _timeline.seek
    var _insert = _seek.insert
    var that = _insert.segment = {}
    var _init

    that.init = function (authority, select, position) {
        _timeframe.runtimeAuthority(authority, select, position)

        var _divElement = document.createElement('div')
        _divElement.style.left = position / _timeframe.length * 100 + '%'
        _divElement.setAttribute('class', 'segment')
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

        _timeline.refresh()
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
            this.code = window.localStorage.getItem('segment' + position + '.js')
            this.code = this.code || _getInitLocalCode(position)
        }
    }
    var templateCode = function (position) {
        return ['var authority = (function () {',
            '    let segmentID = ' + position,
            '',
            '    return function () {',
            '        debugger',
            '    }',
            '})()',
            ''].join('\n')
    }
    var _getInitCode = function (position) {
        _init = templateCode(position)
        _init = encodeURIComponent(_init)
        app._vscodeDocOBJ.fragment = _init
        var positionJSON = {}
        positionJSON[position] = {}
        var query = {file: 'segment', logJSON: JSON.stringify(positionJSON)}
        _vssave(position, query)
        _vsopen(position)
        return _init
    }
    var _getInitLocalCode = function (position) {
        _init = templateCode(position)
        _init = encodeURIComponent(_init)
        _localsave(position, _init)
        return _init
    }
    var _localopen = function (position) {
        return window.localStorage.getItem('segment' + position + '.js')
    }
    var _localsave = function (position, _init) {
        return window.localStorage.setItem('segment' + position + '.js', _init)
    }
    var _vsopen = function (position) {
        app._vscodeDocOBJ.query = app._fileRefUser + 'segment' + position + '.js'
        app._vscodeDocURI = encodeURIComponent(JSON.stringify(app._vscodeDocOBJ))
        app._vscodeRef = app._vscodeCommandOpen + '%5B' + app._vscodeDocURI + '%5D'
        app._vscodeCommandLink.href = app._vscodeRef
        app._vscodeCommandLink.click()
    }
    var _vssave = function (position, query) {
        app._vscodeDocOBJ.query = app._fileLocalUser + 'segment' + position + '.js?' + JSON.stringify(query)
        app._vscodeDocURI = encodeURIComponent(JSON.stringify(app._vscodeDocOBJ))
        app._vscodeRef = app._vscodeCommandSave + '%5B' + app._vscodeDocURI + '%5D'
        app._vscodeCommandLink.href = app._vscodeRef
        app._vscodeCommandLink.click()
    }
    var _timeframeready = function (that) {
        _insert.load('segment', that.init, app._fileLocal)
    }
    gui.addon.bind.onready(that, _timeline, _timeframeready)

    window.addEventListener('keyup', function (e) {
        if (e) {
            console.log('KeyCode:' + e.keyCode)
            if (e.keyCode != 32) {
                return
            }
            _insert.load('segment', that.init, app._fileLocal)
        }
    })
})(this.gui, this.app)
