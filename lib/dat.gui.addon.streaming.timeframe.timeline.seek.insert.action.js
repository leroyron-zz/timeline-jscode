/**
 * dat.gui.Streaming.timeframe.timeline.seek.insert AddOn: action
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (gui, app) {
    var _timeframe = gui.addon.Streaming.timeframe
    var _timeline = _timeframe.timeline
    var _seek = _timeline.seek
    var _insert = _seek.insert
    var that = _insert.action = {}
    var _init

    that.init = function (Authority, select, position) {
        _timeframe.runtimeAuthority(Authority, select, position)

        var _divElement = document.createElement('div')
        _divElement.style.left = position / _timeframe.length * 100 + '%'
        _divElement.setAttribute('class', 'action')
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
            this.code = window.localStorage.getItem('action' + position + '.js')
            this.code = this.code || _getInitLocalCode(position)
        }

        _insert.dialog.open(
            'action' + position + '.js',
            'action',
            position,
            undefined,
            'Timeline | Insert: Action',
            'Insert action for programming application interactivity',
            ['positioning']
        )
    }
    var templateCode = function (position) {
        return ['var Authority = function (app = window.app || {}, THREE = window.THREE || {}, canvas = window.canvas || {}, ctx = window.ctx || {}) {',
            '    this.actionID = ' + position,
            '',
            '    this.main = function () {',
            '        debugger',
            '        ctx.timeline.addon.timeframe.stop()',
            '    }',
            '    return this',
            '}',
            ''].join('\n')
    }
    var _getInitCode = function (position) {
        _init = templateCode(position)
        _init = encodeURIComponent(_init)
        app._vscodeDocOBJ.fragment = _init
        var positionJSON = {}
        positionJSON[position] = {}
        var query = {file: 'action', logJSON: JSON.stringify(positionJSON)}
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
        return window.localStorage.getItem('action' + position + '.js')
    }
    var _localsave = function (position, _init) {
        return window.localStorage.setItem('action' + position + '.js', _init)
    }
    var _vsopen = function (position) {
        app._vscodeDocOBJ.query = app._fileRefUser + 'action' + position + '.js'
        app._vscodeDocURI = encodeURIComponent(JSON.stringify(app._vscodeDocOBJ))
        app._vscodeRef = app._vscodeCommandOpen + '%5B' + app._vscodeDocURI + '%5D'
        app._vscodeCommandLink.href = app._vscodeRef
        app._vscodeCommandLink.click()
    }
    var _vssave = function (position, query) {
        app._vscodeDocOBJ.query = app._fileLocalUser + 'action' + position + '.js?' + JSON.stringify(query)
        app._vscodeDocURI = encodeURIComponent(JSON.stringify(app._vscodeDocOBJ))
        app._vscodeRef = app._vscodeCommandSave + '%5B' + app._vscodeDocURI + '%5D'
        app._vscodeCommandLink.href = app._vscodeRef
        app._vscodeCommandLink.click()
    }
    var _timeframeinit = function (that) {
        _insert.load('action', that.init, app._fileLocal)
    }
    gui.addon.bind.oninit(that, _timeline, _timeframeinit)
})(this.gui, this.app)
