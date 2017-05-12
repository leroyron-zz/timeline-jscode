/**
 * AddOn: runtime timeframe
 * //Time-based thrusting
 * //TimeFrame thrust bit by bit through datasets in the stream
 * //based on CPU clock-time.
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Streaming) {
    var _struct = Streaming.prototype
    var _runtime = _struct.addon.runtime
    var that = _struct.addon.timeframe = {}
    that.process = undefined // setup to invoke a function before each frame//new Streaming.addon.timeframe.process = function () {}
    that.invoke = undefined // setup to invoke a function after after frame//new Streaming.addon.timeframe.invoke = function () {}
    that.length = undefined
    that.init = false
    that.ready = false
    that.running = false
    that.control = false
    that.lapse = 10
    that.duration = 0
    that.read = 0
    that.thrust = 0
    that.mode = '2d'
    that.runtime = function () {
        this.runtimeCallbacks()
    }
    that.runtimeAuthority = function (Authority, select, position) {
        _runtime[select].script[position] = Authority
    }
    that.clearRuntimeAuthority = function (select, at) {
        if (at) {
            _runtime[select].script.splice(at, 1)
        } else {
            _runtime[select].script = []
        }
    }
    that.revert = function (revertPos) {
        this.revertCallbacks(revertPos)
    }
    that.revertCalls = []
    that.rrclen = 0
    that.revertCallbacks = function (revertPos) {
        for (let rr = 0; rr < this.rrclen; rr++) {
            this.revertCalls[rr][1](this.revertCalls[rr][0], revertPos)
        }
    }
    // reverting start stream from start
    var _revert = function (revertPos) {
        that.revert(revertPos)
    }

    that.update = function () {
        time.process = this.process
        time.invoke = this.invoke
        time.length = this.length
        time.running = this.running
        time.lapse = this.lapse
        this.updateCallbacks()

        if (that.mode == '3d') {
            timeframeThrustingStreamingUtilizationAsRuntimeSumingValuesForTHREE()
            timeframeReadingStreamingUtilizationAsRuntimeGettingValuesForTHREE()
        } else {
            timeframeThrustingStreamingUtilizationAsRuntimeSumingValues()
            timeframeReadingStreamingUtilizationAsRuntimeGettingValues()
        }
        syncInTimeframe()
        timeframeRuntimeStreamRevertCallAndForwardingRevertPositionValue(_revert)
    }

    that._init = function (window) {
        this.mode = window.canvases['0'].context.constructor.name == 'CanvasRenderingContext2D' ? '2d' : '3d'
        this.length = _runtime[_runtime.access.stream].length
        this.init = true
    }
    that._ready = function () {
        this.ready = true
    }
    that.run = function () {
        if (!this.running && this.ready) {
            time.now = time._then = Date.now()
            this.length = _runtime[_runtime.access.stream].length
            this.running = true
            this.update()
            frame()
        }
    }
    that.stop = function (at) {
        if (this.running) {
            this.running = false
            this.update()
            window.cancelAnimationFrame(time.animationFrameLoop)
        }
        if (at) {
            this.duration = at
            this.syncing()
        }
    }
    that.tick = function (exact, number) {
        time.byFrame.exact = exact || time.byFrame.exact
        time.byFrame.number = number || 1
        this.running = false
        this.run()
    }
    that.keyPauseToggle = function (e) {
        if (e) {
            console.log('KeyCode:' + e.keyCode)
            if (e.keyCode != 32) {
                return
            }
            if (this.running) {
                this.stop()
            } else {
                this.run()
            }
        }
    }
    that.syncing = function (position) {
        var modDuration = position || this.duration
        _runtime.access.syncOffsets(modDuration)
    }

    // Private
    var time = {_then: Date.now(), access: 'read', _remain: 0, lapse: that.lapse, byFrame: {number: 0, exact: false}, frame: that}
    var frame = function () {
        if (!time.running) {
            return
        }
        window.stats.begin()
        time.now = Date.now()
        time._delta = time.now - time._then + time._remain
        that[time.access] = time._timeFrame = time._delta / 10 << 0
        time.process()
        time._remain = time._delta - (time._timeFrame * 10)// get remainder for percision
        time._then = time.now
        if (time._timeFrame > 0 && time._timeFrame < time.lapse) {
            that.runtime()
            if (!time.byFrame.exact) {
                // values summed up overtime and passed to node properties
                _runtime.access.process(time._timeFrame)
                if (time.byFrame.number > 0) {
                    if (time.byFrame.number == 1) {
                        that.stop()
                    }
                    time.byFrame.number--
                }
                that.duration += time._timeFrame
            } else if (time.byFrame.exact) {
                _runtime.access.process(1)
                time.byFrame.exact = false
                time.byFrame.number = 0
                that.stop()
            }
            time.invoke()
        } else if (time._timeFrame > time.lapse) {
            // time.lapse; if CPU halts the streams for too long then stop process
        }
        time.animationFrameLoop = window.requestAnimationFrame(frame)
        window.stats.end()
    }
    that.switchToTimeFrameThrusting = function (position) {
        time.access = 'thrust'
        _runtime.access.defaults.relative = true
        if (position) syncInTimeframe(position - 1)
    }
    var timeframeThrustingStreamingUtilizationAsRuntimeSumingValuesForTHREE = function () {
        _runtime.access.output_utilizeThrustData = function (value, node, property) {
            if (value == 0) return
            let setBind = this.bindings.ids['_bi' + node]
            let setBindProperty = setBind[property]
            setBindProperty.value += value
            setBind.node[setBindProperty.binding] = setBindProperty.value / setBind.node[this.stream].precision

            if (property == 806) setBind.node.blockCallback = false // release rotation for callback z bind
        }
    }
    var timeframeThrustingStreamingUtilizationAsRuntimeSumingValues = function () {
        _runtime.access.output_utilizeThrustData = function (value, node, property) {
            if (value == 0) return
            let setBind = this.bindings.ids['_bi' + node]
            let setBindProperty = setBind[property]
            setBindProperty.value += value
            setBind.node[setBindProperty.binding] = setBindProperty.value / setBind.node[this.stream].precision
        }
    }
    that.switchToTimeFrameReading = function (position) {
        time.access = 'read'
        _runtime.access.defaults.relative = false
        if (position) syncInTimeframe(position - 1)
    }
    var syncInTimeframe = function (position) {
        _runtime.access.option = time.access
        _runtime.access.method = 'all'
        _runtime.access.rCount = _runtime.access.tCount = 1
        that.syncing(position)
    }
    var timeframeReadingStreamingUtilizationAsRuntimeGettingValuesForTHREE = function () {
        _runtime.access.output_utilizeReadData = function (value, node, property) {
            let setBind = this.bindings.ids['_bi' + node]
            let setBindProperty = setBind[property]
            setBindProperty.value = value
            setBind.node[setBindProperty.binding] = setBindProperty.value / setBind.node[this.stream].precision

            if (property == 806) setBind.node.blockCallback = false // release rotation for callback z bind
        }
    }
    var timeframeReadingStreamingUtilizationAsRuntimeGettingValues = function () {
        _runtime.access.output_utilizeReadData = function (value, node, property) {
            let setBind = this.bindings.ids['_bi' + node]
            let setBindProperty = setBind[property]
            setBindProperty.value = value
            setBind.node[setBindProperty.binding] = setBindProperty.value / setBind.node[this.stream].precision
        }
    }
    var timeframeRuntimeStreamRevertCallAndForwardingRevertPositionValue = function () {
        _runtime.access.output_revertCall = _revert
    }
    that.resetStreamProperties = function () {
        _runtime.access.revertFromTo(this.length, 0)
    }
})(this.Streaming)
