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

    that.init = function (Authority, select, position) {
        _timeframe.runtimeAuthority(Authority, select, position)

        var _divElement = document.createElement('div')
        _divElement.style.left = position / _timeframe.length * 100 + '%'
        _divElement.setAttribute('class', 'sound')
        _divElement.setAttribute('data-position', position)

        _seek.span.element.appendChild(_divElement)

        if (app.vscode._CommandLink) {
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

        if (app.vscode._CommandLink) {
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

        _insert.dialog.open(
            'sound' + position + '.js',
            'sound',
            position,
            function () {
                _timeline.destroy()
                setTimeout(function () {
                    _insert.reload()
                }, 1000)
            },
            'Timeline | Insert: Sound',
            'Sounds for audio feedback',
            ['positioning']
        )
    }
    var templateCode = function (position) {
        return ['var Authority = new function (Audio, AudioListener, AudioLoader, PositionalAudio, AudioAnalyser) {',
            '    this.soundID = ' + position,
            '',
            '    this.main = function () {',
            '        debugger',
            '        // sound here',
            '    }',
            '    return this',
            '}(this.THREE.Audio, this.THREE.AudioListener, this.THREE.AudioLoader, this.THREE.PositionalAudio, this.THREE.AudioAnalyser)',
            ''].join('\n')
    }
    var _getInitCode = function (position) {
        _init = templateCode(position)
        _init = encodeURIComponent(_init)
        app.vscode._DocOBJ.fragment = _init
        var positionJSON = {}
        positionJSON[position] = {}
        var query = {file: 'sound', logJSON: JSON.stringify(positionJSON)}
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
        return window.localStorage.getItem('sound' + position + '.js')
    }
    var _localsave = function (position, _init) {
        return window.localStorage.setItem('sound' + position + '.js', _init)
    }
    var _vsopen = function (position) {
        app.vscode._DocOBJ.query = app.vscode._fileRefUser + 'sound' + position + '.js'
        app.vscode._DocURI = encodeURIComponent(JSON.stringify(app.vscode._DocOBJ))
        app.vscode._Ref = app.vscode._CommandOpen + '%5B' + app.vscode._DocURI + '%5D'
        app.vscode._CommandLink.href = app.vscode._Ref
        app.vscode._CommandLink.click()
    }
    var _vssave = function (position, query) {
        app.vscode._DocOBJ.query = app.vscode._fileLocalUser + 'sound' + position + '.js?' + JSON.stringify(query)
        app.vscode._DocURI = encodeURIComponent(JSON.stringify(app.vscode._DocOBJ))
        app.vscode._Ref = app.vscode._CommandSave + '%5B' + app.vscode._DocURI + '%5D'
        app.vscode._CommandLink.href = app.vscode._Ref
        app.vscode._CommandLink.click()
    }
    var _timeframeinit = function (that) {
        _insert.load('sound', that.init, app.vscode._fileLocal)
    }
    gui.addon.bind.oninit(that, _timeline, _timeframeinit)
})(this.gui, this.app)
