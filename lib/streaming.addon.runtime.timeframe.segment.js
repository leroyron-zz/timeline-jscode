/**
 * AddOn: runtime segment
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Streaming) {
    var _struct = Streaming.prototype
    var _runtime = _struct.addon.runtime
    var _timeframe = _struct.addon.timeframe
    var that = _runtime.segment = {script: []}
    that.accessRuntime = undefined// setup flag to attach runtime access
    that.runtime = function (register, count) {
        var end = register + count + _timeframe.duration
        for (let i = register + _timeframe.duration; i < end; i++) {
            if (that.script[i]) {
                that.script[i]()
            }
        }
    }
})(this.Streaming)
