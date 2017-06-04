/**
 * AddOn: runtime action
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Streaming) {
    var _struct = Streaming.prototype
    var _runtime = _struct.addon.runtime
    var _timeframe = _struct.addon.timeframe
    var that = _runtime.action = {script: []}
    that.accessRuntime = undefined// setup flag to attach runtime access
    that.runtime = function (register, count, duration) {
        if (_timeframe.control) { return }
        var end = count + duration
        for (let i = register; i < end; i++) {
            if (that.script[i]) {
                that.script[i].main()
            }
        }
        return that.checkNext(end)
    }
    that.accessRevert = undefined// setup flag to attach revert
    that.revert = function (register, count) {
        if (_timeframe.control) { return }
        return that.checkNext(register)
    }
    that.checkNext = function (end) { // optimize runtime callbacks
        var next = _runtime.access.propDataLength
        for (let i = end; i < that.script.length; i++) {
            if (that.script[i]) {
                if (i < next || next < end) next = i
            }
        }
        return next
    }
})(this.Streaming)
