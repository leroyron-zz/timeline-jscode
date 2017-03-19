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

    that.init = function (Authority, select, position) {
        _timeframe.runtimeAuthority(Authority, select, position)

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

        _insert.dialog.open(
            'segment' + position + '.js',
            'segment',
            position,
            function () {
                _timeline.destroy()
                setTimeout(function () {
                    _insert.reload()
                }, 1000)
            },
            'Timeline | Insert: Segment',
            'Segments for visuals and charting',
            ['positioning']
        )
    }
    var templateCode = function (position) {
        return ['var Authority = new function (timeline, timeframe, buffer, binding, nodes, ctx) {',
            '    this.segmentID = ' + position,
            '',
            '    this.main = function () {',
            '        debugger',
            '        timeframe.stop()',
            '    }',
            '    return this',
            '}(this.ctx.timeline, this.ctx.timeline.addon.timeframe, this.ctx.timeline.addon.buffer, this.ctx.timeline.addon.binding, this.ctx.scene.nodes, this.ctx)',
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
    var _timeframeinit = function (that) {
        _insert.load('segment', that.init, app._fileLocal)
    }
    gui.addon.bind.oninit(that, _timeline, _timeframeinit)
})(this.gui, this.app)
