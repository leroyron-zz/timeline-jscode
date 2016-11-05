/**
 * dat.gui.Streaming AddOn: buffer
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (gui) {
    var that = gui.addon.Streaming.buffer
    var _onupdate = function (controller) {
        controller.updateDisplay()
    }
    var _onchange = function (controller, change) {
    }
    _onchange()
    var _onruntime = function (controller) {
    }
    _onruntime()

    var _bufferFolder = gui.controls.Streaming.addFolder('buffer')
    var _evals = gui.controls.Streaming.__folders.buffer.add(that, 'evals')
    gui.addon.bind.onupdate(_evals, that, _onupdate)
    _bufferFolder.open()
})(this.gui)
