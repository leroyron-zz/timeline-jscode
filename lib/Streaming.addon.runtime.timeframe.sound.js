/**
 * AddOn: runtime sound
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Streaming) {
    var _struct = Streaming.prototype
    var _runtime = _struct.addon.runtime
    var _timeframe = _struct.addon.timeframe
    var that = _runtime.sound = {script: []}
    that.accessRuntime = undefined// setup flag to attach runtime access
    that.runtime = function (register, count) {
        if (_timeframe.control) { return }
        var end = register + count + _timeframe.duration
        for (let i = register + _timeframe.duration; i < end; i++) {
            if (that.script[i]) {
                that.script[i].main()
            }
        }
    }
    that.accessRevert = undefined// setup flag to attach revert
    that.revert = function (register, count) {
        if (_timeframe.control) { return }
        var end = register + count + _timeframe.duration - _timeframe.duration
        for (let i = register; i < end; i++) {
            if (that.script[i]) {
                that.script[i].main()
            }
        }
    }
})(this.Streaming)
