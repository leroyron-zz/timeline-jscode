/**
 * dat.gui.Streaming AddOn: timeframe
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (gui) {
    var that = gui.addon.Streaming.timeframe
    var _onupdate = function (controller) {
        controller.updateDisplay()
    }
    var _onchange = function (controller, change) {
        that.update()
    }
    var _onruntime = function (controller) {
        controller.updateDisplay()
    }

    gui.controls.Streaming.__folders.access.addFolder('timeframe').open()

    var _running = gui.controls.Streaming.__folders.access.__folders.timeframe.add(that, 'running')
    gui.addon.bind.onchange(_running, _onchange)
    gui.addon.bind.onupdate(_running, that, _onupdate)

    var _lapse = gui.controls.Streaming.__folders.access.__folders.timeframe.add(that, 'lapse')
    gui.addon.bind.onchange(_lapse, _onchange)

    gui.controls.Streaming.__folders.access.__folders.timeframe.addFolder('runtime')
    var _thrust = gui.controls.Streaming.__folders.access.__folders.timeframe.__folders.runtime.add(that, 'thrust')
    gui.addon.bind.onruntime(_thrust, that, _onruntime)
})(this.gui)
