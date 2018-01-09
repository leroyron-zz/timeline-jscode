/**
 * AddOn: runtime
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Streaming) {
    var _struct = Streaming.prototype
    var _binding = _struct.addon.binding
    var _buffer = _struct.addon.buffer
    var _timeframe = _struct.addon.timeframe

    // Ease of Use------------------------------------------------------------------------------------------------------------------
    _struct.take = function (obj, instructions) {
        obj = obj.constructor === Array ? obj : [obj]
        var queue = []
        var q = -1
        var pairProp = [['position'], ['rotation'], ['rotate'], ['scale', 'uniform']]
        if (instructions) {

        } else {
            for (let oi = 0; oi < obj.length; oi++) {
                for (let pi = 0; pi < pairProp.length; pi++) {
                    let pair = pairProp[pi]
                    let prop = pair[0]
                    let type = pair[1]
                    if (obj[oi][prop]) {
                        q++
                        queue[q] = [undefined, [], [], false]
                        queue[q][0] = 'timeline'
                        obj[oi][prop].type = type || prop
                        let node = []
                        let props = []
                        node.push(obj[oi][prop])
                        if (typeof obj[oi][prop].x != 'undefined') props.push(['x', obj[oi][prop].x])
                        if (typeof obj[oi][prop].y != 'undefined') props.push(['y', obj[oi][prop].y])
                        if (typeof obj[oi][prop].z != 'undefined') props.push(['z', obj[oi][prop].z])
                        if (typeof obj[oi][prop].value != 'undefined') props.push(['value', obj[oi][prop].value])
                        queue[q][1] = [node]
                        queue[q][2] = props
                    }
                }
            }
        }

        for (let qi = 0; qi < queue.length; qi++) _binding.queue.apply(this, queue[qi])
    }

    // Ease of starting
    _struct.buffer = _buffer
    _struct.ready = function (canvas) {
        _binding.run(function () { // run the queues
            _buffer.run()
        })
        _timeframe._forceInit(canvas)
        this.build()
    }

    // Ease of assign
    _struct.timeframe = {
        get process () {
            return _struct.addon.timeframe.process
        },
        set process (func) {
            _struct.addon.timeframe.process = func
        },
        get invoke () {
            return _struct.addon.timeframe.invoke
        },
        set invoke (func) {
            _struct.addon.timeframe.invoke = func
        },
        get update () {
            _struct.addon.timeframe.update.apply(_struct.addon.timeframe)
        },
        set update (func) {
            return _struct.addon.timeframe.update
        },
        get switchTo () {
            return _struct.addon.runtime.access.option
        },
        set switchTo (func) {
            if (arguments[0] == 'thrust' || arguments[0] == 'thrusting') _struct.addon.timeframe.switchToTimeFrameThrusting.apply(_struct.addon.timeframe); else _struct.addon.timeframe.switchToTimeFrameReading.apply(_struct.addon.timeframe)
        }
    }
    _struct.timeframe.process = _struct.addon.timeframe.process = function () {}
    _struct.timeframe.invoke = _struct.addon.timeframe.invoke = function () {}
    _struct.timeframe.update = _struct.addon.timeframe.update
    // Ease of Use------------------------------------------------------------------------------------------------------------------
})(this.Streaming)
