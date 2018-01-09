/**
 * dat.gui AddOn: Streaming
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (gui, Streaming) {
    var _attach = gui.addon.Streaming = Streaming.prototype.addon
    var that = _attach.runtime.access
    var _onupdate = function (controller) {
    }
    _onupdate()
    var _onchange = function (controller) {
        var c = controller.object
        that._update(c.continuance, c.skip, c.rCount, c.tCount, c.revert, c.mCount, c.leap, c.reset)
    }
    var _onruntime = function (controller) {
        controller.updateDisplay()
    }

    gui.controls.Streaming = gui.addFolder('Streaming')
    gui.controls.Streaming.open()

    gui.controls.Streaming.addFolder('access').open()
    var _continuance = gui.controls.Streaming.__folders.access.add(that.arguments, 'continuance')
    gui.addon.bind.onchange(_continuance, _onchange)
    var _skip = gui.controls.Streaming.__folders.access.add(that.arguments, 'skip')
    gui.addon.bind.onchange(_skip, _onchange)
    var _rCount = gui.controls.Streaming.__folders.access.add(that.arguments, 'rCount')
    gui.addon.bind.onchange(_rCount, _onchange)
    var _tCount = gui.controls.Streaming.__folders.access.add(that.arguments, 'tCount')
    gui.addon.bind.onchange(_tCount, _onchange)
    var _revert = gui.controls.Streaming.__folders.access.add(that.arguments, 'revert')
    gui.addon.bind.onchange(_revert, _onchange)
    var _mCount = gui.controls.Streaming.__folders.access.add(that.arguments, 'mCount')
    gui.addon.bind.onchange(_mCount, _onchange)
    var _leap = gui.controls.Streaming.__folders.access.add(that.arguments, 'leap')
    gui.addon.bind.onchange(_leap, _onchange)
    var _reset = gui.controls.Streaming.__folders.access.add(that.arguments, 'reset')
    gui.addon.bind.onchange(_reset, _onchange)

    gui.controls.Streaming.__folders.access.addFolder('runtime')
    var _read = gui.controls.Streaming.__folders.access.__folders.runtime.add(that, 'rCount')
    gui.addon.bind.onruntime(_read, that, _onruntime)
    var _thrust = gui.controls.Streaming.__folders.access.__folders.runtime.add(that, 'tCount')
    gui.addon.bind.onruntime(_thrust, that, _onruntime)
    var _measure = gui.controls.Streaming.__folders.access.__folders.runtime.add(that, 'mCount')
    gui.addon.bind.onruntime(_measure, that, _onruntime)
})(this.gui, this.Streaming)
