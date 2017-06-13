/**
 * Streaming
 * @author leroyron / http://leroy.ron@gmail.com
 * //Streaming for javascript's linear parallelity
 */
var Streaming = (function (Addon) {
    Streaming = function () {
        this.open = this.open || function () {
            this.build = function (callback) {
                try {
                    this.stream = this.bindings.stream
                    this.nodesPerStream = this.bindings.nodesPerStream
                    this.propsPerNode = this.bindings.propsPerNode
                    this.propsPerNodeList = this.bindings.propsPerNodeList
                    this.propDataLength = this.bindings.propDataLength
                    this.continuancePosValData0 = 1
                    this.data0PropDataLength = this.continuancePosValData0 + this.propDataLength
                    this.nodeDataLength = this.data0PropDataLength * this.propsPerNode + this.propsPerNode + 1

                    // buff up the stream with data
                    this.data = this._prebuff(this.bindings.data)

                    this.bindings.stream = this.bindings.nodesPerStream = this.bindings.propsPerNode = this.bindings.propsPerNodeList = this.bindings.propDataLength = this.bindings.data = null
                    delete this.bindings.stream
                    delete this.bindings.nodesPerStream
                    delete this.bindings.propsPerNode
                    delete this.bindings.propsPerNodeList
                    delete this.bindings.propDataLength
                    delete this.bindings.state
                    delete this.bindings.data

                    this._finalize(callback)
                } catch (e) {
                    // handle(e)
                    console.log('Streaming: No bindings - ref: http://')
                } finally {
                    console.log('Streaming - ')
                    console.log('Like what you see? Are you a dev? We need people like you! https://github.com/leroyron/timeline-jscode')
                }
            }
            this.access = this.access || function (setcontinuance, setskip, setrCount, settCount, setrevert, setmCount, setleap, setreset) {
                // stream reading environment vars
                var continuance = setcontinuance
                var skip = setskip
                var rCount = setrCount
                var tCount = settCount
                var revert = setrevert
                var mCount = setmCount
                var leap = setleap
                var reset = setreset
                var _accessed = false
                // changeable
                this.defaults = {}
                this.rCount = 0
                this.tCount = 0
                this.mCount = 0
                this.nextRuntimeCallback = 0
                this.runtimeCalls = []
                this.ruclen = 0
                var runtime = this.runtimeCallbacks = function (count) {
                    let next = propDataLength
                    let check = 0
                    for (let r = 0; r < this.ruclen; r++) {
                        check = this.runtimeCalls[r][1](this.runtimeCalls[r][0] || this.nextRuntimeCallback, count, 0)
                        if (check && check < next) next = check
                    }
                    this.nextRuntimeCallback = next
                    if (this.block) this.rCount = this.tCount = this.block = 0

                    this.runtimeCallbacks = optimizeRuntime
                }
                var optimizeRuntime = function (count) {
                    // this._currentDataPos(2) get current data position continuance
                    if (count + this.data[2] <= this.nextRuntimeCallback || count + this.data[2] > propDataLength) return
                    let next = propDataLength
                    let check = 0
                    for (let r = 0; r < this.ruclen; r++) {
                        check = this.runtimeCalls[r][1](this.runtimeCalls[r][0] || this.nextRuntimeCallback, count, this.data[2])
                        if (check && check < next) next = check
                    }
                    this.nextRuntimeCallback = next
                    if (this.block) this.rCount = this.tCount = this.block = 0
                }
                this.revertCalls = []
                this.rrclen = 0
                this.revertCallbacks = function (register, count) {
                    let next = propDataLength
                    let check = 0

                    for (let r = 0; r < this.rrclen; r++) {
                        check = this.revertCalls[r][1](this.revertCalls[r][0] || register, count)
                        if (check && check < next) next = check
                    }
                    this.nextRuntimeCallback = next
                    this.syncOffsets(register)
                }
                this.update = function (setcontinuance, setskip, setrCount, settCount, setrevert, setmCount, setleap, setreset) {
                    continuance = setcontinuance
                    skip = setskip
                    rCount = setrCount
                    tCount = settCount
                    revert = setrevert
                    mCount = setmCount
                    leap = setleap
                    reset = setreset
                    this.updateCallbacks()
                }
                this.updateCalls = []
                this.upclen = 0
                this.updateCallbacks = function () {
                    for (let c = 0; c < this.upclen; c++) {
                        this.updateCalls[c][1](this.updateCalls[c][0])
                    }
                }

                // stream runtime vars
                var stream = 'stream'
                var nodesPerStream, propsPerNode, propsPerNodeList, propDataLength, continuancePosValData0, data0PropDataLength, nodeDataLength, streamDataLength
                this._finalize = function (callback) {
                    // Initialization from build
                    stream = this.stream
                    nodesPerStream = this.nodesPerStream
                    propsPerNode = this.propsPerNode
                    propsPerNodeList = this._prebuff(this.propsPerNodeList)
                    propDataLength = this.propDataLength
                    continuancePosValData0 = this.continuancePosValData0
                    data0PropDataLength = this.data0PropDataLength
                    nodeDataLength = this.nodeDataLength

                    this.nodesPerStream = this.propsPerNode = /* this.propDataLength = this.continuancePosValData0 = */this.data0PropDataLength = // this.nodeDataLength = null
                    delete this.nodesPerStream
                    delete this.propsPerNode
                    delete this.propsPerNodeList
                    // delete this.propDataLength
                    // delete this.continuancePosValData0
                    delete this.data0PropDataLength
                    // delete this.nodeDataLength

                    // FOR PRODUCTION
                    //! !!IMPORTANT hide data (private)... replace this.data with var data;-->
                    // var data = this.data;
                    // delete this.data;

                    streamDataLength = this.data.length
                    this.updateCallbacks()
                    callback()
                }

                this.revertFromTo = function (from, to) {
                    this.propDataLength = propDataLength = from
                    this.continuancePosValData0 = continuancePosValData0 = to + 1
                }

                this.reversion = function (dataPos) {
                    return dataPos - (propDataLength * (dataPos / propDataLength << 0)) + continuancePosValData0
                }

                // process
                this.option = 'Change the streaming process'
                this.method = 'Change the streaming process'
                this.process = function (val) {
                    switch (this.option) {
                    case 'thrust':
                        this.tCount = val + tCount
                        this.runtimeCallbacks(this.tCount)
                        switch (this.method) {
                        case 'all':
                            this._thrustAll(this.tCount)
                            break
                        case 'nodes':
                            this._thrustNodes(this.tCount, arguments[2])
                            break
                        case 'properties':
                            this._thrustProperties(this.tCount, arguments[2])
                            break
                        case 'mix':
                            this._thrustMix(this.tCount, arguments[2])
                            break
                        default:
                            this._thrustAll(this.tCount)
                            break
                        }
                        break
                    case 'read':
                        this.rCount = val + rCount
                        this.runtimeCallbacks(this.rCount)
                        switch (this.method) {
                        case 'all':
                            this._readAll(this.rCount)
                            break
                        case 'nodes':
                            this._readNodes(this.rCount, arguments[2])
                            break
                        case 'properties':
                            this._readProperties(this.rCount, arguments[2])
                            break
                        case 'mix':
                            this._readMix(this.rCount, arguments[2])
                            break
                        default:
                            this._readAll(this.rCount)
                            break
                        }
                        break
                    case 'measure':
                        // measure
                        // ToDo - use webworker
                        this.mCount = val + mCount
                        this.runtimeCallbacks(this.mCount)
                        switch (this.method) {
                        case 'all':
                            return [this._measureAll(this.mCount)]
                        case 'nodes':
                            return [this._measureNodes(this.mCount, arguments[2])]
                        case 'properties':
                            return [this._measureProperties(this.mCount, arguments[2])]
                        case 'mix':
                            return [this._measureMix(this.mCount, arguments[2])]
                        default:
                            return [this._measureAll(this.mCount)]
                        }
                    default:
                        break
                    }
                }
                // read
                this.output_utilizeReadData = 'Data entry portal for execute, ref this to outer functions'
                // thrust
                this.output_utilizeThrustData = 'Data entry portal for execute, ref this to outer functions'
                // measure
                // ToDo - use webworker
                this.output_utilizeMeasureData = 'Data entry portal for execute, ref this to outer functions'

                // //Common Vars and _functions that are used for thrust and measuring
                // "*I" indicates data index
                // "sI" indicates the stream index position
                // "*BsIK" indicates the bind index key in the stream array
                // cursor counts up start for offset reads
                // reads counts up for data reads
                // Procedure when edit programming stream:
                // When changes are being done, consider that syncing maybe triggered to adjust offset and continuance values for the data sets. // this.syncOffsets
                var sI = 0
                var partition = 0
                var cursor = 0
                var reads = 0
                var partFrac = 0
                var chunkStartI = 0
                var dataPos, dataPosI, endPosI
                var deltaRevert = -1
                var nodeBsIK = 0
                var propBsIK = 0
                this._currentDataPos = function () {
                    return this.data[2]
                }
                this._checkInContinuance = function () {
                    if (!continuance) {
                        return sI
                    }
                    sI += this.data[dataPosI]
                    this._updateDataPos()
                    return sI
                }
                this._updateDataPos = function (modsI) {
                    let mI = modsI || sI
                    dataPos = ((mI - cursor) - chunkStartI)
                    dataPosI = mI - dataPos
                }
                this._checkOutRevert = function (modskip) {
                    let mS = modskip || skip
                    if (!revert) {
                        return sI
                    }

                    this.data[dataPosI] = dataPos = this.reversion(dataPos + mS)

                    if (deltaRevert != dataPos) {
                        deltaRevert = dataPos
                        this.output_revertCall(continuancePosValData0)
                        this.revertCallbacks(continuancePosValData0, dataPos)
                        setTimeout(function () {
                            deltaRevert = -1
                        }, 1000)
                    }
                    return dataPos
                }

                this.output_revertCall = 'Data entry portal for execute, ref this to outer functions'
                this._callOutLeap = function (dataPosI) {
                    let setBind = this.bindings.ids['_bi' + nodeBsIK]
                    let setBindProperty = setBind[propBsIK]
                    let leap = setBind.node[stream][setBindProperty.binding].leap
                    if (!leap) { return }
                    this.data[dataPosI] = leap.zeroIn || 0// b.Zero out data
                    leap.callback()
                    if (leap.dispose) {
                        setBind.node[stream][setBindProperty.binding].leap = null
                        delete setBind.node[stream][setBindProperty.binding].leap
                    }
                }
                // //

                // //Reading stores
                this._readAll = function (rCount) {
                    for (
                        sI = 0,
                        partition = 0,
                        partFrac = 0,
                        cursor = 0,
                        reads = 0;
                        sI < streamDataLength;
                        sI++
                        ) {
                        // Node Level//
                        if ((sI - partition) % nodeDataLength == 0) {
                            // let node_i = sI/nodeDataLength;//node index number
                            // ->> Node Selection > buffer identifier
                            nodeBsIK = this.data[sI]
                            if (propsPerNodeList[nodeBsIK]) {
                                if ((sI - partition) != partition) {
                                    partition = sI
                                    partFrac = sI % data0PropDataLength
                                    reads = 0
                                }
                                propsPerNode = propsPerNodeList[nodeBsIK]
                                nodeDataLength = data0PropDataLength * propsPerNode + propsPerNode + 1
                            }
                            sI++
                            cursor = 1
                            reads++
                        }

                        // Property Level//
                        if ((sI - reads) % data0PropDataLength == partFrac) {
                            chunkStartI = (sI - cursor)
                            // var prop = ((sI-reads) - ( data0PropDataLength * propsPerNode * node_i)) / data0PropDataLength;//property index number of chunk
                            // ->> Property Selection > buffer identifier

                            propBsIK = this.data[sI]
                            sI++
                            cursor++
                            reads++

                            dataPos = ((sI - cursor) - chunkStartI)
                            dataPosI = sI - dataPos
                            let endPos = (data0PropDataLength - dataPos) - 1
                            endPosI = dataPosI + endPos

                            if (reset) {
                                this.data[dataPosI] = continuancePosValData0
                            }

                            sI = this._checkInContinuance()
                            // sI = this._checkOutRevert(rCount)
                        }

                        if (nodeBsIK == -1) {
                            sI = endPosI
                            this._updateDataPos()
                        } else if (rCount > 0) {
                            // Data Level//
                            this.output_utilizeReadData(this._dataVal(rCount), nodeBsIK, propBsIK)
                        } else {
                            return
                        }
                    }
                }
                this._dataVal = function (count) {
                    let val = this.data[sI]
                    let next = count
                    let nextPos = dataPos + next
                    let nextPosI = dataPosI + nextPos
                    if (nextPos > propDataLength) {
                        if (!revert) {

                        } else {
                            nextPos = this._checkOutRevert(next)
                            sI = nextPosI = dataPosI + nextPos
                        }
                    }
                    if (this.data[nextPosI] == leap) {
                        if (continuance) {
                            this.data[dataPosI] = nextPos// a.store offset
                        }
                        // this._callOutLeap(nextPosI)// doesn't work well because reading steps over
                        this.data[nextPosI] = 0// b.Zero out data
                    } else {
                        sI = nextPosI
                        this._updateDataPos()
                        this.data[dataPosI] = dataPos// a...
                        val = this.data[sI]
                    }
                    sI = endPosI
                    this._updateDataPos()
                    return val
                }
                // //read

                // //Thrusting stores dataoffsets and zeros out data
                this._thrustAll = function (tCount) {
                    for (
                        sI = 0,
                        cursor = 0,
                        reads = 0;
                        sI < streamDataLength;
                        sI++
                        ) {
                        // Node Level//
                        if (sI % nodeDataLength == 0) {
                            // var node_i = sI/nodeDataLength;//node index number
                            // ->> Node Selection > buffer identifier
                            nodeBsIK = this.data[sI]
                            sI++
                            cursor = 1
                            reads++
                        }

                        // Property Level//
                        if ((sI - reads) % data0PropDataLength == 0) {
                            chunkStartI = (sI - cursor)
                            // var prop = ((sI-reads) - ( data0PropDataLength * propsPerNode * node_i)) / data0PropDataLength;//property index number of chunk
                            // ->> Property Selection > buffer identifier

                            propBsIK = this.data[sI]
                            sI++
                            cursor++
                            reads++

                            dataPos = ((sI - cursor) - chunkStartI)
                            dataPosI = sI - dataPos
                            let endPos = (data0PropDataLength - dataPos) - 1
                            endPosI = dataPosI + endPos

                            if (reset) {
                                this.data[dataPosI] = continuancePosValData0
                            }

                            sI = this._checkInContinuance()
                            // sI = this._checkOutRevert()
                        }

                        if (nodeBsIK == -1) {
                            sI = endPosI
                            this._updateDataPos()
                        } else if (tCount > 0) {
                            // Data Level//
                            this.output_utilizeThrustData(this._dataSum(tCount), nodeBsIK, propBsIK)
                        } else {
                            return
                        }
                    }
                }
                this._dataSum = function (count) {
                    var sums = 0
                    for (let d = 0; d < count; d++) {
                        let next = 1
                        let nextPos = dataPos + next
                        let nextPosI = dataPosI + nextPos
                        if (nextPos > propDataLength) {
                            if (!revert) {
                                break
                            } else {
                                d--
                                nextPos = this._checkOutRevert(next)
                                sI = nextPosI = dataPosI + nextPos
                            }
                        } else if (this.data[nextPosI] == leap) {
                            if (continuance) {
                                this.data[dataPosI] = nextPos// a...
                            }
                            this._callOutLeap(nextPosI)
                            break
                        } else {
                            sI = nextPosI
                            this._updateDataPos()
                            this.data[dataPosI] = dataPos// a...
                            sums += this.data[sI]
                            // this.data[sI] = 0// b...
                        }
                    }
                    sI = endPosI
                    this._updateDataPos()
                    return sums
                }
                // //thrust

                // //Measuring gathers data for use
                var mI = 0
                var measureData
                // ToDo - for webworker
                this._measureAll = function (mCount) {
                    measureData = new Int32Array(new ArrayBuffer(mCount * propsPerNode + propsPerNode + 1 * nodesPerStream * 4))
                    for (
                        mI = 0,
                        sI = 0,
                        cursor = 0,
                        reads = 0;
                        sI < streamDataLength;
                        sI++
                        ) {
                        // Node Level//
                        if (sI % nodeDataLength == 0) {
                            // var node_i = sI/nodeDataLength;//node index number
                            // ->> Node Selection > buffer identifier in stream
                            nodeBsIK = this.data[sI]
                            measureData[mI++] = nodeBsIK
                            sI++
                            cursor = 1
                            reads++
                        }

                        // Property Level//
                        if ((sI - reads) % data0PropDataLength == 0) {
                            chunkStartI = (sI - cursor)
                            // var prop = ((sI-reads) - ( data0PropDataLength * propsPerNode * node_i)) / data0PropDataLength;//property index number of chunk
                            // ->> Property Selection > buffer identifier

                            propBsIK = this.data[sI]
                            measureData[mI++] = propBsIK
                            sI++
                            cursor++
                            reads++

                            dataPos = ((sI - cursor) - chunkStartI)
                            dataPosI = sI - dataPos
                            let endPos = (data0PropDataLength - dataPos) - 1
                            endPosI = dataPosI + endPos

                            if (reset) {
                                this.data[dataPosI] = continuancePosValData0
                            }

                            sI = this._checkInContinuance()
                            // sI = this._checkOutRevert()
                        }

                        if (nodeBsIK == -1) {
                            sI = endPosI
                            this._updateDataPos()
                        } else if (mCount > 0) {
                            this.output_utilizeMeasureData(this._dataReturn(mCount, measureData), nodeBsIK, propBsIK)
                        } else {
                            return
                        }
                    }

                    return measureData
                }
                this._dataReturn = function (count, measureData) {
                    for (let d = 0; d < count; d++) {
                        let next = 1
                        let nextPos = dataPos + next
                        let nextPosI = dataPosI + nextPos
                        if (nextPos > propDataLength) {
                            if (!revert) {
                                break
                            } else {
                                d--
                                sI = dataPosI + continuancePosValData0
                                this._updateDataPos()
                            }
                        } else if (this.data[nextPosI] == leap) {
                            sI = endPosI
                            this._updateDataPos()
                            break
                        } else {
                            sI = nextPosI
                            this._updateDataPos()
                            measureData[mI++] = this.data[sI]
                        }
                    }
                    sI = endPosI
                    this._updateDataPos()
                    return measureData
                }
                // //measure

                this.syncOffsets = function (syncI) {
                    syncI++
                    for (
                        sI = 0,
                        partition = 0,
                        partFrac = 0,
                        cursor = 0,
                        reads = 0;
                        sI < streamDataLength;
                        sI++
                        ) {
                        // Node Level//
                        if ((sI - partition) % nodeDataLength == 0) {
                            // var node_i = sI/nodeDataLength;//node index number
                            // ->> Node Selection > buffer identifier
                            if (propsPerNodeList[this.data[sI]]) {
                                if ((sI - partition) != partition) {
                                    partition = sI
                                    partFrac = sI % data0PropDataLength
                                    reads = 0
                                }
                                propsPerNode = propsPerNodeList[this.data[sI]]
                                nodeDataLength = data0PropDataLength * propsPerNode + propsPerNode + 1
                            }
                            sI++
                            cursor = 1
                            reads++
                        }

                        // Property Level//
                        if ((sI - reads) % data0PropDataLength == partFrac) {
                            chunkStartI = (sI - cursor)
                            // var prop = ((sI-reads) - ( data0PropDataLength * propsPerNode * node_i)) / data0PropDataLength;//property index number of chunk
                            // ->> Property Selection > buffer identifier

                            sI++
                            cursor++
                            reads++

                            dataPos = ((sI - cursor) - chunkStartI)
                            dataPosI = sI - dataPos
                            let endPos = (data0PropDataLength - dataPos) - 1
                            endPosI = dataPosI + endPos

                            if (reset) {
                                this.data[dataPosI] = continuancePosValData0
                            }

                            sI = this._checkInContinuance()
                            if (syncI > propDataLength) {
                                syncI = this._checkOutRevert(syncI)
                            }
                        }

                        this.data[dataPosI] = syncI// a.
                        sI = endPosI
                        this._updateDataPos()
                    }
                }

                _accessed = true
                this.arguments = {
                    continuance: continuance,
                    skip: skip,
                    rCount: rCount,
                    tCount: tCount,
                    revert: revert,
                    mCount: mCount,
                    leap: leap,
                    reset: reset,
                    _accessed: _accessed
                }

                return this
            }
            this._prebuff = function (arr) {
                var alen = arr.length
                var data = new Int32Array(new ArrayBuffer(alen * 4))
                for (let bDI = 0; bDI < alen; bDI++) {
                    data[bDI] = arr[bDI]
                }
                return data
            }

            // passing the length to access constructor
            this.access.prototype.length = this.length
        }

        // acquire the stream length once : new streaming(number);
        this.constructor.prototype.length = this.constructor.prototype.length || arguments[0]
        // passing the length to open constructor
        this.open.prototype.length = this.constructor.prototype.length
        // return ref/open a stream for buffing
        return this.open()
    }

    Addon(Streaming)

    return Streaming
})(/* Buildup - Start */
/**
 * AddOn attaching for open Streaming
 * @author leroyron / http://leroy.ron@gmail.com
 * //_struct.addon: attach to Streaming to give addons access to data
 */
function (Streaming) {
    var Class = Streaming.prototype
    Class.addon = {}
    // open access
    // override open and access construct and attach access to
    // addons are carried down to access level
    // @Streaming this.open = this.open || func

    // base constructor override

    Class.open = function () {
        var _openlevel = this.open.prototype
        _openlevel.addon = this.addon

        // remove base constructor override and refresh class
        Class.open = undefined
        var openlevel = new Streaming()

        // access level
        // @Streaming // reference access base constructor
        openlevel._access = openlevel.access

        var _accesslevel = openlevel._access.prototype
        _accesslevel.addon = _openlevel.addon

        openlevel.access = function () {
            // run access and expose access to addons
            this.access = this._access
            var accesslevel = this.access.apply(this, arguments)

            for (let addon in this.addon) {
                for (let flagClass in this.addon[addon]) {
                    if (flagClass == 'access') {
                        this.addon[addon][flagClass] = accesslevel
                    } else {
                        for (let flagFunc in this.addon[addon][flagClass]) {
                            if (flagFunc == 'accessRuntime') {
                                accesslevel.runtimeCalls.push([0, this.addon[addon][flagClass].runtime])
                                accesslevel.ruclen++
                            }
                            if (flagFunc == 'accessRevert') {
                                accesslevel.revertCalls.push([0, this.addon[addon][flagClass].revert])
                                accesslevel.rrclen++
                            }
                            if (flagFunc == 'accessUpdate') {
                                accesslevel.updateCalls.push([0, this.addon[addon][flagClass].update])
                                accesslevel.upclen++
                            }
                        }
                    }
                }
            }

            return accesslevel
        }

        return openlevel
    }

    /**
     * AddOn: runtime
     * @author leroyron / http://leroy.ron@gmail.com
     */
    var _runtime = Class.addon.runtime = {
        access: undefined,
        /**
         * AddOn: runtime system
         * //System utilizing stream
         * //systems that undergo runtime commands and flow
         * //allowing each system to be controlled by runtime process through proxy stream
         * @author leroyron / http://leroy.ron@gmail.com
         */
        system: function () {
            var That = this.constructor
            var Pointer, Knob, Subject,
                Marquee, Grid, Parallax,
                Entity, Physic, Bound, Collision,
                Particle, Rig
            this.update = function () {
                return this
            }
            this.proxy = function () {
                return this
            }
            this.init = function () {
                return this
            }

            this.Pointer = function () {
                Pointer = That.pointer
                this.Pointer = new Pointer()

                return this
            }

            this.Knob = function () {
                Knob = That.knob
                this.Knob = new Knob()

                return this
            }

            this.Subject = function () {
                Subject = That.subject
                this.Subject = new Subject()

                return this
            }

            this.Marquee = function () {
                if (!Pointer && !Knob && !Subject) { console.log('System Marquee: No - Pointer, Knob or Subject detected'); return }
                Marquee = That.marquee
                this.Marquee = new Marquee()

                return this
            }

            this.Grid = function () {
                if (!Pointer && !Knob && !Subject) { console.log('System Grid: No - Pointer, Knob or Subject detected'); return }
                Grid = That.grid
                this.Grid = new Grid()

                return this
            }

            this.Parallax = function () {
                if (!Grid) { console.log('System Parallax: No - Grid system detected'); return }
                Parallax = this.Grid.parallax
                this.Parallax = new Parallax()

                return this
            }

            this.Entity = function () {
                if (!Parallax) { console.log('System Entity: No - Parallax system detected'); return }
                Entity = this.Parallax.entity
                this.Entity = new Entity()

                return this
            }

            this.Physic = function () {
                if (!Parallax) { console.log('System Physic: No - Parallax system detected'); return }
                Physic = this.Parallax.physic
                this.Physic = new Physic()

                return this
            }

            this.Bound = function () {
                if (!Parallax) { console.log('System Bound: No - Parallax system detected'); return }
                Bound = this.Parallax.bound
                this.Bound = new Bound()

                return this
            }

            this.Collision = function () {
                if (!Parallax) { console.log('System Collision: No - Parallax system detected'); return }
                Collision = this.Parallax.collision
                this.Collision = new Collision()

                return this
            }

            this.Particle = function () {
                if (!Entity && !Physic && !Bound && !Collision) { console.log('System Particle: No - Entity, Physic, Bound or Collision detected'); return }
                Particle = this.Parallax.particle
                this.Particle = new Particle()

                return this
            }

            this.Rig = function () {
                if (!Entity && !Physic && !Bound && !Collision) { console.log('System Rig: No - Entity, Physic, Bound or Collision detected'); return }
                Rig = this.Parallax.rig
                this.Rig = new Rig()

                return this
            }

            if (this instanceof That) {
                return this.That
            } else {
                return new That()
            }
        }
    }
    /**
     * To-Do Comment
     * @author leroyron / http://leroy.ron@gmail.com
     */
    Class.addon.runtime.system.pointer = function () {
        var That = this.constructor
        var pointers = {}
        var element = {}
        var result = {}

        this.bind = function (appPointers, appElement) {
            pointers = appPointers
            element = appElement
            return this
        }
        this.result = function (callForward) {
            result = callForward
            return this
        }
        this.init = function () {
            element.onmousedown = element.ontouchstart = function (e) {
                e.preventDefault(); if (!pointers.enabled) return
                if (!e.changedTouches) {
                    touch(false, pointers, 0, e, this, function (pointer) {
                        result(pointer)
                    })
                } else {
                    for (let ts = 0, dlen = e.changedTouches.length; ts < dlen; ts++) {
                        let id = e.changedTouches[ts].identifier
                        touch(true, pointers, id, e, this, function (pointer) {
                            result(pointer)
                        })
                    }
                }
            }

            // // CONTROLLER
            element.onmousemove = element.ontouchmove = function (e) {
                e.preventDefault()
                // FREEFORM
                if (!pointers.inUse) {
                    if (!e.changedTouches) {
                        // mouse freeform
                        touch(false, pointers, 0, e, this, function (pointer) {
                            result(pointer)
                        }, true)
                    }
                    //
                } else if (!e.changedTouches) {
                    touch(false, pointers, 0, e, this, function (pointer) {
                        result(pointer)
                    }, true)
                } else {
                    for (let tm = 0, dlen = e.changedTouches.length; tm < dlen; tm++) {
                        let id = e.changedTouches[tm].identifier
                        touch(true, pointers, id, e, this, function (pointer) {
                            result(pointer)
                        }, true)
                    }
                }
            }

            element.onmouseup = element.ontouchend = function (e) {
                e.preventDefault(); if (!pointers.enabled) return

                if (!e.changedTouches) {
                    touch(false, pointers, 0, e, this, function (pointer) {
                        result(pointer)
                    })
                    pointers.inUse = false

                    delete pointers[0]
                } else {
                    for (let te = 0, dlen = e.changedTouches.length; te < dlen; te++) {
                        if (!touchExists(e.targetTouches, e.changedTouches[te].identifier)) {
                            let id = e.changedTouches[te].identifier
                            touch(true, pointers, id, e, this, function (pointer) {
                                result(pointer)
                            })

                            delete pointers[id]
                        }
                    }
                }
            }
            return this
        }

        var touch = function (use, touches, id, e, canvas, callback, optimize) {
            touches[id] = e
            touches[id].normal = {}
            touches[id].viewport = {}

            var active = {}
            if (use) {
                if (!e.targetTouches[id]) {
                    console.log('touch missed')
                    if (e.changedTouches[id]) {
                        active = e.changedTouches[id]
                    } else {
                        console.log('exiting')
                        return
                    }
                } else {
                    active = e.targetTouches[id]
                }
            } else {
                active = e
            }

            // TO-DO optimize select
            touches[id].normal.x = ((active.pageX - canvas.offsetLeft) / canvas.clientWidth)
            touches[id].normal.y = ((active.pageY - canvas.offsetTop) / canvas.clientHeight)
            touches[id].viewport.x = touches[id].normal.x * 2 - 1
            touches[id].viewport.y = -touches[id].normal.y * 2 + 1

            callback(touches[id])
            if (optimize) return

            if (e.type == 'mousedown' || e.type == 'touchstart') pointers.inUse = true
            if (e.type == 'mouseup' || e.type == 'touchend') pointers.inUse = false

            if (use) {
                pointers.multi = false
                if (active.length == 0) {
                    pointers.inUse = false
                } else if (active.length > 1) {
                    pointers.multi = true
                }
            }
            touches[id].area = active.pageX > 0 ? 'right' : 'left'
        }

        var touchExists = function (touchArr, match) {
            for (let ct = 0, tlen = touchArr.length; ct < tlen; ct++) {
                if (touchArr[ct].identifier === match) return true
            }
            return false
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
    /**
     * To-Do Comment
     * @author leroyron / http://leroy.ron@gmail.com
     */
    Class.addon.runtime.system.knob = function () {
        var That = this.constructor
        var element = {}
        var result = {}

        this.bind = function () {

            return this
        }
        this.result = function (callForward) {
            result = callForward
            return this
        }
        this.init = function () {
            
            return this
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
    /**
     * To-Do Comment
     * @author leroyron / http://leroy.ron@gmail.com
     */
    Class.addon.runtime.system.subject = function () {
        var That = this.constructor
        var element = {}
        var result = {}

        this.bind = function () {

            return this
        }
        this.result = function (callForward) {
            result = callForward
            return this
        }
        this.init = function () {
            
            return this
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
    /**
     * To-Do Comment
     * @author leroyron / http://leroy.ron@gmail.com
     */
    Class.addon.runtime.system.marquee = function () {
        var That = this.constructor
        var element = {}
        var result = {}

        this.bind = function () {

            return this
        }
        this.result = function (callForward) {
            result = callForward
            return this
        }
        this.init = function () {
            
            return this
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
    /**
     * AddOn: runtime system.grid
     * //Systems grid system to copulate portions
     * //allowing each grid block to be rendererd for optimal performance
     * @author leroyron / http://leroy.ron@gmail.com
     */
    Class.addon.runtime.system.grid = function () {
        var That = this.constructor
        this.layers = {}
        var mode = ''
        var batches = []
        var offsets = []
        var count = 0
        var i = 0
        var column = 0
        var row = 0
        var properties = {}
        this.update = function () {
            
            return this
        }
        this.mode = function () {
            mode = arguments[0]
            return this
        }
        this.dir = function () {
            this.dir = arguments[0]
            return this
        }
        this.batches = function () {
            batches = arguments
            return this
        }
        this.offsets = function () {
            offsets = arguments
            return this
        }
        this.properties = function () {
            count = arguments[0].count
            this.name = arguments[0].name
            this.columns = arguments[0].columns
            this.rows = arguments[0].rows
            properties.width = arguments[0].width
            properties.height = arguments[0].height
            return this
        }
        this.syntax = function (callForward) {
            this.syntax = callForward
            return this
        }
        this.assign = function (callForward) {
            this.assign = callForward
            return this
        }
        this.init = function () {
            for (let bi = 0; bi < batches.length; bi++) {
                this.batch = {name: batches[bi], index: bi}
                this.layers[this.batch.name] = {offset: offsets[bi], update: this.update, grid: []}
                for (let i = 0; i < count; i++) {
                    let row = i / this.columns << 0
                    let column = i - (row * this.columns)
                    if (!this.layers[this.batch.name].grid[column]) this.layers[this.batch.name].grid[column] = []
                    this.layers[this.batch.name].grid[column][row] = {}
                    this.layers[this.batch.name].grid[column][row] = this.assign(this.syntax(i), i, this.batch, column, row, properties, this.layers[this.batch.name].grid[column][row])
                }
            }
            return this.layers
        }

        for (let construct in That) {
            this[construct] = That[construct]
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
    /**
     * AddOn: runtime system.grid.parallax
     * //Systems grid system parallax matrix
     * //allowing parallax optimization
     * @author leroyron / http://leroy.ron@gmail.com
     */
    Class.addon.runtime.system.grid.parallax = function () {
        var That = this.constructor
        var grid
        this.update = function () {

            return this
        }
        this.field = function () {
            grid = arguments[0]
            return this
        }
        this.separation = function () {

            return this
        }
        this.update = function () {

            return this
        }
        this.func = function () {
            
            return this
        }
        this.move = function () {
            
            return this
        }
        this.init = function () {
            
            return this
        }

        for (let construct in That) {
            this[construct] = That[construct]
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
    /**
     * To-Do Comment
     * @author leroyron / http://leroy.ron@gmail.com
     */
    Class.addon.runtime.system.grid.parallax.entity = function () {
        var That = this.constructor
        var element = {}
        var result = {}

        this.bind = function () {

            return this
        }
        this.result = function (callForward) {
            result = callForward
            return this
        }
        this.init = function () {
            
            return this
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
    /**
     * To-Do Comment
     * @author leroyron / http://leroy.ron@gmail.com
     */
    Class.addon.runtime.system.grid.parallax.physic = function () {
        var That = this.constructor
        var element = {}
        var result = {}

        this.bind = function () {

            return this
        }
        this.result = function (callForward) {
            result = callForward
            return this
        }
        this.init = function () {
            
            return this
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
    /**
     * To-Do Comment
     * @author leroyron / http://leroy.ron@gmail.com
     */
    Class.addon.runtime.system.grid.parallax.bound = function () {
        var That = this.constructor
        var element = {}
        var result = {}

        this.bind = function () {

            return this
        }
        this.result = function (callForward) {
            result = callForward
            return this
        }
        this.init = function () {
            
            return this
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
    /**
     * To-Do Comment
     * @author leroyron / http://leroy.ron@gmail.com
     */
    Class.addon.runtime.system.grid.parallax.collision = function () {
        var That = this.constructor
        var element = {}
        var result = {}

        this.bind = function () {

            return this
        }
        this.result = function (callForward) {
            result = callForward
            return this
        }
        this.init = function () {
            
            return this
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
    /**
     * To-Do Comment
     * @author leroyron / http://leroy.ron@gmail.com
     */
    Class.addon.runtime.system.grid.parallax.particle = function () {
        var That = this.constructor
        var element = {}
        var result = {}

        this.bind = function () {

            return this
        }
        this.result = function (callForward) {
            result = callForward
            return this
        }
        this.init = function () {
            
            return this
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
    /**
     * To-Do Comment
     * @author leroyron / http://leroy.ron@gmail.com
     */
    Class.addon.runtime.system.grid.parallax.rig = function () {
        var That = this.constructor
        var element = {}
        var result = {}

        this.bind = function () {

            return this
        }
        this.result = function (callForward) {
            result = callForward
            return this
        }
        this.init = function () {
            
            return this
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
    /**
     * AddOn: runtime binding
     * //Object and property binding
     * //binding nodes and their properties to the stream data
     * //allowing pre-buffing and sub-node collections and their properties
     * @author leroyron / http://leroy.ron@gmail.com
     */
    Class.addon.binding = function () {
        var that = Class.addon.binding = {}
        that.init = function () {
            _runtime.access.defaults.relative = _runtime.access.defaults.relative || false
            _runtime.access.bindings = _runtime[arguments[0]] = _runtime[arguments[0]] ||
                {
                    stream: arguments[0],
                    data: [],
                    nodesPerStream: 0,
                    propsPerNode: arguments[3] ? arguments[3].length : arguments[2] ? arguments[2].length : 0,
                    propDataLength: Class.length,
                    propsPerNodeList: [],
                    state: 'prebuff',
                    continuancePosValData0: 1,
                    reversion: function (dataPos) {
                        return dataPos - (this.propDataLength * (dataPos / this.propDataLength << 0)) + this.continuancePosValData0
                    }
                }
            let runtimePropsPerNodeList = _runtime.access.bindings.propsPerNodeList
            let runtimeLastPropsPerNode = runtimePropsPerNodeList.length - 1
            _runtime[arguments[0]].nodesPerStream += arguments[1].length

            let stream = arguments[0]
            let streamBuild = _runtime[stream]
            streamBuild['length'] = streamBuild['length'] || Class.length
            streamBuild['ids'] = streamBuild['ids'] || {}
            // debugger
            let objs = arguments[1]
            let propDataLength = Class.length
            objs[0][0].type = objs[0][0].type
                        ? objs[0][0].type == 'position' ||
                        objs[0][0].type == 'rotation' ||
                        objs[0][0].type == 'f' ||
                        objs[0][0].constructor.name == 'Vector3' ||
                        objs[0][0].constructor.name == 'Euler'
                            ? objs[0][0].type
                            : arguments[2][0][0]
                        : arguments[2][0][0] // type for conversion and precision

            let dataType = objs[0][0].type = Math.Type.identify(objs[0][0])

            // these keys are used to tweak/control runtime operations
            that.buffIdKey = that.buffIdKey || 800
            that.propIdKey = dataType == 'radian' ? 806 : 801
            // Note: for position 'x' is identified as 801, 'y' as 802 and 'z' as 803
            //           rotation 'x' is identified as 804, 'y' as 805 and 'z' as 806
            // Example: In timeframe - if (property == 806) setBind.node.blockCallback = false // release rotation for callback z bind

            let dataTypePrecision = arguments[5] || Math.Type.precision(dataType)
            let relative = arguments[4] || _runtime.access.defaults.relative
            let nodes = []

            while (objs.length > 0) {
                let buffKey = objs[0][1] || that.buffIdKey
                let props = dataType == 'poly'
                    ? Math.Poly.generate(dataType, arguments[2][0][1], dataTypePrecision)
                    : Math.Type.convertToPrecisionDataType(dataType, arguments[2].concat(), 1, 2, dataTypePrecision)
                let pkeys = dataType == 'poly'
                    ? Math.Poly.generateKeys(arguments[2][0][1], arguments[3]
                                                                ? arguments[3][arguments[3].length - 1]
                                                                : that.propIdKey)
                    : arguments[3]
                    ? arguments[3].concat()
                    : Math.Poly.generateKeys(arguments[2], arguments[3]
                                                            ? arguments[3][arguments[3].length - 1]
                                                            : that.propIdKey)

                if (runtimePropsPerNodeList[runtimeLastPropsPerNode] != pkeys.length) runtimePropsPerNodeList[buffKey] = pkeys.length
                streamBuild.propsPerNode = pkeys.length > streamBuild.propsPerNode ? pkeys.length : streamBuild.propsPerNode

                streamBuild['ids']['_bi' + buffKey] = new function (pkeys) {
                    objs[0][0] = objs[0][0] || {}
                    objs[0][0][stream] =
                    {
                        binding: '_bi' + buffKey,
                        position: streamBuild.data.length,
                        relative: relative,
                        conversion: dataType,
                        precision: dataTypePrecision
                    }
                    streamBuild.data.push(that.buffIdKey = buffKey)// For the node slot, assign buffIdKey for ensure consistency & no conflict
                    that.buffIdKey++ // increment
                    while (props.length > 0) {
                        let propKey = pkeys[0] || that.propIdKey
                        this[propKey] = new function (props) {
                            // TO-DO rework binding for all or future demos, uniform scheme
                            this['binding'] = dataType != 'poly' && objs[0][0][props[0][0]] && typeof objs[0][0][props[0][0]].value != 'undefined' ? (function (propKeyObj) { propKeyObj['property'] = props[0][0]; return 'value' })(this) : props[0][0]
                            props[0][1] = props[0][1] || 0
                            this['value'] = props[0][1]
                            // debugger
                            if (dataType != 'poly' && objs[0][0][props[0][0]] && typeof objs[0][0][props[0][0]].value != 'undefined') objs[0][0][props[0][0]].value = props[0][0] == 'value' ? props[0][1] : props[0][1] / dataTypePrecision; else objs[0][0][props[0][0]] = props[0][0] == 'value' ? props[0][1] : props[0][1] / dataTypePrecision// Assign starting value to both stream value and node property Math.Type.convertToPrecision(dataType, props[0][1])
                            objs[0][0][stream][props[0][0]] =
                            {
                                binding: propKey,
                                data0PosI: streamBuild.data.length + 1
                            }
                            streamBuild.data.push(propKey)
                            streamBuild.data.push(1)// (propDataLength) one extra slot for data0PosI and continuancePosValData0 in stream set a default Data position 1

                            for (let bDI = 0, alen = propDataLength; bDI < alen; bDI++) {
                                if (props[0][2]) {
                                    if (relative) {
                                        streamBuild.data.push((props[0][2] - props[0][1]) / propDataLength)
                                    } else {
                                        streamBuild.data.push(props[0][1] + ((props[0][2] - props[0][1]) / propDataLength * bDI))
                                    }
                                } else {
                                    if (relative) {
                                        streamBuild.data.push(0)
                                    } else {
                                        streamBuild.data.push(props[0][1])
                                    }
                                }
                            }
                        }(props)

                        pkeys.shift()
                        props.shift()
                        that.propIdKey = propKey // assign propIdKey for ensure consistency & no conflict
                        that.propIdKey++ // increment
                    }

                    this.node = objs[0][0]
                    nodes.push(this.node)
                }(pkeys)

                objs.shift()
            }

            return nodes
        }
        that.queue = function () {
            let propsPerNode = arguments[2][0][0] == 'poly' ? arguments[2][0][1].length : arguments[3] ? arguments[3].length : arguments[2] ? arguments[2].length : 0
            this.list = this.list || []
            this.list[propsPerNode] = this.list[propsPerNode] || []
            this.list[propsPerNode].push(arguments)
            // queue must be listed highest to lowest propsPerNode, steaming algorithm partFrac = sI % data0PropDataLength, partitioning sections of read data
        }
        that.start = function (callback) {
            console.log('Binding objects to stream - Running queue')
            let list = this.list
            while (list.length > 0) {
                if (list[list.length - 1]) {
                    let bindings = list[list.length - 1]
                    for (let bi = 0; bi < bindings.length; bi++) {
                        that.init.apply(this, bindings[bi])
                    }
                }
                list.pop()
            }
            if (callback) callback()
        }
        return that
    }
    var _binding = Class.addon.binding()

    /**
     * AddOn: runtime buffer
     * //Time-based easings
     * //Changing node properties
     * //by buffing the stream with values.
     * @author leroyron / http://leroy.ron@gmail.com
     * //_struct.addon: modifies, enhances and accesses
     */
    Class.addon.buffer = function () {
        var that = Class.addon.buffer = {evals: 0}
        that.update = function () {
            this.updateCallbacks()
        }
        that.updateCalls = []
        that.upclen = 0
        that.updateCallbacks = function () {
            for (let c = 0; c < this.upclen; c++) {
                this.updateCalls[c][1](this.updateCalls[c][0])
            }
        }

        that.presets = function (sets) {
            for (let set in sets) {
                evaluate.presets[set] = sets[set]
            }
        }
        var buffOffset
        var valueOffset
        var deltaSetOffset
        // Private
        var evaluate = {
            presets: {}
        }
        var evalData = function (get, duration, precision) {
            var CSPL = this.CSPL || {}
            var CPs = evaluate.presets[get].CPs

            var preDuration = evaluate.presets[get].duration
            var prePrecision = evaluate.presets[get].precision

            var cplen = CPs.length
            // evaluating by scaling the spline control points time and collecting modified data
            var CPEval = []
            for (let cp = 0; cp < cplen; cp++) {
                let curTFrac = CPs[cp].t / preDuration
                let curPFrac = CPs[cp].p / prePrecision
                CPEval[cp] = {t: duration * curTFrac, p: precision * curPFrac || CPs[cp].p}
            }

            // CPs.sort(function(a,b){return a.t-b.t;});
            var ts = []
            var ps = []
            var ks = []
            for (let cp = 0; cp < cplen; cp++) {
                let d = CPEval[cp]
                ts[cp] = d.t; ps[cp] = d.p; ks[cp] = 1
            }

            CSPL.getNaturalKs(ts, ps, ks)

            var minx = CPEval[0].t
            var maxx = CPEval[cplen - 1].t

            var data = new Int32Array(new ArrayBuffer(maxx * 4))
            for (let i = minx; i <= maxx; i++) {
                data[i] = CSPL.evalSpline(i, ts, ps, ks)// Scale numbers
            }

            return [data, precision || evaluate.presets[get].precision]
        }
        that.eval = function (stream, instructions, relative, precision, get, leapCallback, reassign, dispose, zeroIn, skipLeap) {
            _runtime.access.defaults.relative = _runtime.access.defaults.relative || false
            relative = relative || _runtime.access.defaults.relative
            var getData = []
            for (let e = 0, elen = instructions.length; e < elen; e++) {
                var options = instructions[e]
                var nodes = options[0]
                var sets = options[2]
                var blend = options[3]
                var propSet = []

                for (let n = 0, nlen = nodes.length; n < nlen; n++) {
                    let node = nodes[n]

                    let propChain = options[1]
                    for (let pc = 0, pclen = propChain.length; pc < pclen; pc++) {
                        buffOffset = 0
                        if (blend) {
                            if (blend == 1) { // true or 1
                                buffOffset -= deltaSetOffset
                            } else if (blend > 1 || blend < 1) {
                                buffOffset += blend
                            }
                        }
                        valueOffset = 0

                        let props = propChain[pc]
                        propSet[pc] = propChain[pc][0]
                        for (let p = 0, plen = props.length; p < plen; p++) {
                            let prop = props[p]
                            propSet[pc] = prop[0]
                            let sumDurations = 0

                            for (let s = 0, slen = sets.length; s < slen; s++) {
                                sets[s][1] <<= 0 // round off to plug in 32intArrayBuffer
                                sumDurations += sets[s][1]
                            }
                            for (let e = 0, elen = sets.length; e < elen; e++) {
                                let getset = sets[e]
                                deltaSetOffset = getset[1]
                                prop[2] = prop[1] * (deltaSetOffset / sumDurations)
                                prop[2] = Math.Type.convertToPrecisionType(node[stream].conversion, prop[2])
                                buff(stream, node, prop, evalData(getset[0], deltaSetOffset, precision || deltaSetOffset), relative, skipLeap)
                                buffOffset += deltaSetOffset
                                valueOffset += prop[2]
                            }
                        }
                    }
                    // per-node
                    if (leapCallback) {
                        that.assignLeap(stream, [node], propSet, false, buffOffset, leapCallback, reassign, dispose, zeroIn)
                    }

                    if (get) {
                        getData[n] = that.getData(stream, [node], propSet, get)
                    }
                }
            }
            that.evals += nodes.length * sets.length
            that.update()
            return getData
        }

        that.exec = function (stream, instructions, relative, precision, get, leapCallback, reassign, dispose, zeroIn, skipLeap) {
            _runtime.access.defaults.relative = _runtime.access.defaults.relative || false
            relative = relative || _runtime.access.defaults.relative
            var getData = []
            for (let e = 0, elen = instructions.length; e < elen; e++) {
                var options = instructions[e]
                var nodes = options[0]
                let chains = options[1]
                let propSet = []

                for (let n = 0, nlen = nodes.length; n < nlen; n++) {
                    let node = nodes[n]
                    buffOffset = 0
                    valueOffset = 0

                    for (let ci = 0, cilen = chains.length; ci < cilen; ci++) {
                        let chain = chains[ci]
                        let blend = chain[0]
                        let prop = [propSet[ci] = chain[1], chain[2]]
                        let getset = [chain[3], chain[4]]
                        valueOffset += Math.Type.convertToPrecisionType(node[stream].conversion, chain[5]) || 0

                        buffOffset = 0
                        if (blend) {
                            if (blend == 1) { // true or 1
                                buffOffset -= deltaSetOffset
                            } else if (blend > 1 || blend < 1) {
                                buffOffset += blend
                            }
                        }

                        deltaSetOffset = getset[1]
                        prop[2] = Math.Type.convertToPrecisionType(node[stream].conversion, prop[1])
                        buff(stream, node, prop, evalData(getset[0], deltaSetOffset, precision || deltaSetOffset), relative, skipLeap, true)
                        buffOffset += deltaSetOffset
                    }
                    // per-node
                    if (leapCallback) {
                        that.assignLeap(stream, [node], [propSet], false, buffOffset, leapCallback, reassign, dispose, zeroIn)
                    }

                    if (get) {
                        getData[n] = that.getData(stream, [node], [propSet], get)
                    }
                }
                that.evals += chains.length
            }
            that.update()
            return getData
        }

        that.execLerp = function (stream, nodeSet, propSet, refnode, refprop, startVal, flux, parallel, reach, from, to, ease, precision, exact, at, leapCallback, reassign, dispose, zeroIn, skipLeap) {
            var state = _runtime[stream].state
            var access = state == 'prebuff'
            ? _runtime[stream]
            : _runtime.access

            var propDataLength = access.propDataLength + 1
            var refNodeBindProp = refnode[stream][refprop]
            var refData0PosI = refNodeBindProp.data0PosI

            var valDuration = to - from
            ease = ease || 'linear'
            var easeData = evalData(ease, valDuration, valDuration)
            precision = precision || 1
            if (nodeSet && propSet) {
                for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
                    let nodeBind = nodeSet[n][stream]

                    for (let p = 0, plen = propSet.length; p < plen; p++) {
                        let nodeBindProp = nodeBind[propSet[p]]

                        let data0PosI = nodeBindProp.data0PosI
                        let lerpVal = access.data[data0PosI + from + 1]
                        for (let ew = 0; ew < valDuration; ew++) {
                            let dataPos = from + ew
                            dataPos = dataPos < propDataLength ? dataPos : access.reversion(dataPos)
                            let refDataPosI = refData0PosI + dataPos
                            let dataPosI = data0PosI + dataPos
                            if (skipLeap) if (access.data[dataPosI + 1] == access.arguments.leap) continue
                            // console.log(1 - ((easeData[1] - easeData[0][ew]) / easeData[1]))
                            let fluxin = Math.lerpSubject(lerpVal, access.data[refDataPosI + 1], flux * (1 - ((easeData[1] - easeData[0][ew]) / easeData[1])))
                            // if (fluxin < 0.001) continue
                            // fluxin *= easeData[ew]
                            lerpVal -= fluxin
                            access.data[dataPosI + 1] = lerpVal * precision
                        }
                    }
                }
            }
            if (leapCallback) that.assignLeap(stream, [nodeSet[0]], propSet, exact, at, leapCallback, reassign, dispose, zeroIn)
            that.evals += nodeSet.length * propSet.length
            that.update()
        }

        that.assignLeap = function (stream, nodeSet, propSet, exact, at, func, reassign, dispose, zeroIn) {
            var state = _runtime[stream].state
            var access = state == 'prebuff'
            ? _runtime[stream]
            : _runtime.access

            var propDataLength = access.propDataLength + 1

            for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
                let nodeBind = nodeSet[n][stream]

                for (let p = 0, plen = propSet.length; p < plen; p++) {
                    let prop = propSet[p]

                    let nodeBindProp = nodeBind[prop]
                    let data0PosI = nodeBindProp.data0PosI

                    // byteOffset grabbed from the stream
                    let byteOffset = access.data[data0PosI]// accuracy fix go forward (2) in offset

                    let leapDataPosIDelta
                    if (nodeBindProp.leap) {
                        if (reassign) {
                            leapDataPosIDelta = nodeBindProp.leap.dataPosI
                            access.data[leapDataPosIDelta] = 0
                        }
                    }

                    nodeBindProp.leap = {callback: func, dataPos: exact ? at : byteOffset + at, dispose: typeof dispose == 'undefined' ? true : dispose, zeroIn: zeroIn}

                    let dataPos = nodeBindProp.leap.dataPos
                    dataPos = dataPos < propDataLength ? dataPos : access.reversion(dataPos)
                    let dataPosI = data0PosI + dataPos
                    access.data[dataPosI] = access.arguments.leap

                    nodeBindProp.leap.dataPosI = dataPosI
                }
            }
        }

        var buff = function (stream, node, prop, evalData, relative, skipLeap, ahead) {
            var nodeVal = node[prop[0]].value
            ? prop[0] == 'value' ? node[prop[0]].value : node[prop[0]].value * node[stream].precision
            : prop[0] == 'value' ? node[prop[0]] : node[prop[0]] * node[stream].precision

            if (ahead) nodeVal = valueOffset; else nodeVal += valueOffset
            var nodeBind = node[stream]
            var nodeBindProp = nodeBind[prop[0]]
            var data0PosI = nodeBindProp.data0PosI

            var state = _runtime[stream].state
            var access = state == 'prebuff'
            ? _runtime[stream]
            : _runtime.access

            // byteOffset grabbed from the stream
            var byteOffset = access.data[data0PosI]
            byteOffset += buffOffset

            var propDataLength = access.propDataLength + 1

            var valProp = prop[2]
            // nodeVal = Math.Type.precision(dataType, nodeVal)

            var data = evalData[0]
            var precision = evalData[1]
            // Check if it fills the stream beyond its current position
            var length = data.length
            for (let ew = 0; ew < length; ew++) {
                let dataPos = byteOffset + ew
                dataPos = dataPos < propDataLength ? dataPos : access.reversion(dataPos)
                let dataPosI = data0PosI + dataPos

                if (skipLeap) if (access.data[dataPosI] == access.arguments.leap) continue
                if (relative) {
                    access.data[dataPosI] += (data[ew] - (data[ew + 1] || 0)) / (precision / valProp) << 0
                } else {
                    access.data[dataPosI] = nodeVal + ((precision - data[ew]) / precision * valProp) << 0
                }
            }

            that.update()
        }

        that.zeroOut = function (stream, from, to, nodeSet, propSet, skipLeap) {
            var state = _runtime[stream].state
            var access = state == 'prebuff'
            ? _runtime[stream]
            : _runtime.access

            var propDataLength = access.propDataLength + 1// lapse

            var zeroDuration = to - from

            if (nodeSet && propSet) {
                for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
                    let nodeBind = nodeSet[n][stream]

                    for (let p = 0, plen = propSet.length; p < plen; p++) {
                        let nodeBindProp = nodeBind[propSet[p]]

                        let data0PosI = nodeBindProp.data0PosI

                        for (let ew = 0; ew < zeroDuration; ew++) {
                            let dataPos = from + ew
                            dataPos = dataPos < propDataLength ? dataPos : access.reversion(dataPos)
                            let dataPosI = data0PosI + dataPos
                            if (skipLeap) if (access.data[dataPosI + 1] == access.arguments.leap) continue
                            access.data[dataPosI + 1] = 0
                        }
                    }
                }
            } else {
                for (let id in access.bindings.ids) {
                    let nodeBinds = access.bindings.ids[id].node[stream]

                    for (let prop in nodeBinds) {
                        if (nodeBinds[prop].data0PosI) {
                            let data0PosI = nodeBinds[prop].data0PosI

                            for (let ew = 0; ew < zeroDuration; ew++) {
                                let dataPos = from + ew
                                dataPos = dataPos < propDataLength ? dataPos : access.reversion(dataPos)
                                let dataPosI = data0PosI + dataPos

                                if (skipLeap) if (access.data[dataPosI + 1] == access.arguments.leap) continue
                                access.data[dataPosI + 1] = 0
                            }
                        }
                    }
                }
            }
        }

        that.valIn = function (stream, nodeSet, propSet, val, from, to, precision, exact, at, leapCallback, reassign, dispose, zeroIn, skipLeap) {
            var state = _runtime[stream].state
            var access = state == 'prebuff'
            ? _runtime[stream]
            : _runtime.access

            var propDataLength = access.propDataLength + 1

            if (nodeSet && propSet) {
                for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
                    let nodeBind = nodeSet[n][stream]

                    precision = precision || nodeBind.precision
                    for (let p = 0, plen = propSet.length; p < plen; p++) {
                        let nodeBindProp = nodeBind[propSet[p]]

                        let data0PosI = nodeBindProp.data0PosI

                        let valDuration = to - from

                        for (let ew = 0; ew < valDuration; ew++) {
                            let dataPos = from + ew
                            dataPos = dataPos < propDataLength ? dataPos : access.reversion(dataPos)
                            let dataPosI = data0PosI + dataPos
                            if (skipLeap) if (access.data[dataPosI + 1] == access.arguments.leap) continue
                            access.data[dataPosI + 1] = Math.Type.convertToPrecisionType(nodeBind.conversion, val, precision)
                        }
                    }
                }
            }
            if (leapCallback) {
                that.assignLeap(stream, [nodeSet[0]], propSet, exact, at, leapCallback, reassign, dispose, zeroIn)
            }
        }

        that.getforwardData = function (stream, nodeSet, propSet, get, skipLeap) {
            var state = _runtime[stream].state
            var access = state == 'prebuff'
            ? _runtime[stream]
            : _runtime.access

            var propDataLength = access.propDataLength + 1

            var obj = []

            for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
                let nodeBind = nodeSet[n][stream]
                obj[n] = {}

                for (let p = 0, plen = propSet.length; p < plen; p++) {
                    let prop = propSet[p]

                    let nodeBindProp = nodeBind[prop]
                    let data0PosI = nodeBindProp.data0PosI

                    // byteOffset grabbed from the stream
                    let byteOffset = access.data[data0PosI] + 2// accuracy fix go forward (2) in offset

                    obj[n][prop] = 0

                    for (let ew = 0; ew < get; ew++) {
                        let dataPos = byteOffset + ew
                        dataPos = dataPos < propDataLength ? dataPos : access.reversion(dataPos)
                        let dataPosI = data0PosI + dataPos
                        if (skipLeap) if (access.data[dataPosI + 1] == access.arguments.leap) continue
                        obj[n][prop] += access.data[dataPosI + 1] / nodeBind.precision
                    }
                }
            }
            return obj
        }

        that.injectData = function (stream, nodeSet, propSet, data, inject, blend, min, max, skipLeap) {
            var state = _runtime[stream].state
            var access = state == 'prebuff'
            ? _runtime[stream]
            : _runtime.access

            var propDataLength = access.propDataLength
            for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
                let nodeBind = nodeSet[n][stream]

                min *= nodeBind.precision
                max *= nodeBind.precision

                for (let p = 0, plen = propSet.length; p < plen; p++) {
                    let nodeBindProp
                    let data0PosI
                    let byteOffset
                    let dataPosI
                    let prop

                    if (nodeBind.conversion == 'poly') {
                        prop = 0
                        nodeBindProp = nodeBind[prop]
                        data0PosI = nodeBindProp.data0PosI
                        byteOffset = access.data[data0PosI]
                    } else {
                        prop = propSet[p]
                        nodeBindProp = nodeBind[prop]
                        data0PosI = nodeBindProp.data0PosI
                        byteOffset = access.data[data0PosI]
                    }

                    for (let ew = 0; ew < inject; ew++) {
                        let dataPos = byteOffset + ew
                        dataPos = dataPos < propDataLength ? dataPos : access.reversion(dataPos)
                        if (nodeBind.conversion == 'poly') {
                            for (let pi = 0, plen = data.length; pi < plen; pi++) {
                                let polyPropBind = nodeBind[pi]
                                data0PosI = polyPropBind.data0PosI
                                dataPosI = data0PosI + dataPos

                                if (skipLeap) if (access.data[dataPosI] == access.arguments.leap) continue

                                access.data[dataPosI] = blend ? data[pi] * nodeBind.precision + access.data[dataPosI] : data[pi] * nodeBind.precision

                                access.data[dataPosI] =
                                access.data[dataPosI] < min ? min
                                : access.data[dataPosI] > max ? max
                                : access.data[dataPosI]
                            }
                        } else {
                            dataPosI = data0PosI + dataPos
                            if (skipLeap) if (access.data[dataPosI] == access.arguments.leap) continue
                            access.data[dataPosI] = blend ? data * nodeBind.precision + access.data[dataPosI] : data * nodeBind.precision

                            access.data[dataPosI] =
                            access.data[dataPosI] < min ? min
                            : access.data[dataPosI] > max ? max
                            : access.data[dataPosI]
                        }
                    }
                }
            }
        }

        that.queue = function () {
            this.list = this.list || []
            this.list.push(arguments)
            return this.list.length - 1
        }

        that.start = function (callback) {
            console.log('Buffering binded objects in stream - Running queue')
            let list = this.list
            while (list.length > 0) {
                let method = Array.prototype.shift.apply(list[0])// shift arguments array list[0].shift() doesn't work
                that[method].apply(this, list[0])
                list.shift()
            }
            if (callback) callback()
        }

        that.loadData = function (stream, src, offset, callback, nodeDataLength, propDataLength) {
            console.log('Loading in data and buffing objects in stream - ' + src)
            var script = new window.XMLHttpRequest()
            script.open('GET', src, true)
            script.responseType = 'text'
            script.callback = callback
            script.onload = function () {
                var data = processData(this.response)
                that.buffinData(stream, data.data, offset, nodeDataLength || data.nodeDataLength, propDataLength || data.propDataLength)

                if (this.callback) this.callback()
            }
            script.send()
        }

        var processData = function (csv) {
            csv = csv.split(',')
            var nodeDataLength = Array.prototype.shift.apply(csv)
            var propDataLength = Array.prototype.shift.apply(csv)
            return {data: csv, nodeDataLength: nodeDataLength << 0, propDataLength: propDataLength << 0}
        }

        that.buffinData = function (stream, data, offset, nodeDataLength, propDataLength) {
            var state = _runtime[stream].state
            var access = state == 'prebuff'
            ? _runtime[stream]
            : _runtime.access
            let continuancePosValData0 = 1
            let data0PropDataLength = continuancePosValData0 + propDataLength
            for (
                let dI = 0,
                    partition = 0,
                    partFrac = 0,
                    cursor = 0,
                    reads = 0;
                dI < data.length;
                dI++
                ) {
                // Node Level//
                if ((dI - partition) % nodeDataLength == 0) {
                    // var node_i = dI/nodeDataLength;//node index number
                    // ->> Node Selection > buffer identifier
                    var nodeBdIK = data[dI]
                    dI++
                    cursor = 1
                    reads++
                }

                // Property Level//
                if ((dI - reads) % data0PropDataLength == partFrac) {
                    let chunkStartI = (dI - cursor)
                    // var prop = ((dI-reads) - ( data0PropDataLength * propsPerNode * node_i)) / data0PropDataLength;//property index number of chunk
                    // ->> Property Selection > buffer identifier

                    var propBdIK = data[dI]
                    dI++
                    cursor++
                    reads++

                    let dataPos = ((dI - cursor) - chunkStartI)
                    let dataPosI = dI - dataPos
                    let endPos = (data0PropDataLength - dataPos) - 1
                    let endPosI = dataPosI + endPos
                }

                let setBind = state == 'prebuff' ? access.ids['_bi' + nodeBdIK] : access.bindings.ids['_bi' + nodeBdIK]
                let setBindProperty = setBind[propBdIK]
                let data0PosI = setBind.node[stream][setBindProperty.binding].data0PosI
                for (let l = 0; l < propDataLength; l++) {
                    access.data[data0PosI + offset + l] = data[dI]// a...
                    dI++
                }
                // dI = endPosI
                // this._updateDataPos()
            }
        }

        that.getData = function (stream, nodeSet, propSet, from, to, nodeDataLength, propDataLength) {
            var state = _runtime[stream].state
            var access = state == 'prebuff'
            ? _runtime[stream]
            : _runtime.access

            to = to
            ? (to < from) || to > access.propDataLength
                ? access.propDataLength
                : to
            : access.propDataLength

            from = from
            ? (to && from > to) || from > access.propDataLength
                ? 0
                : from
            : 0

            var data = that.buffoutData(stream, nodeSet, propSet, from, to)

            return data
        }

        that.saveData = (function (data, fileName) {
            var a = document.createElement('a')
            document.body.appendChild(a)
            a.style = 'display: none'
            return function (data, fileName) {
                var json = [data]
                var blob = new window.Blob([json], {type: 'octet/stream'})
                var url = window.URL.createObjectURL(blob)
                a.href = url
                a.download = fileName
                a.click()
                window.URL.revokeObjectURL(url)
            }
        }())

        that.buffoutData = function (stream, nodeSet, propSet, from, to) {
            var state = _runtime[stream].state
            var access = state == 'prebuff'
            ? _runtime[stream]
            : _runtime.access

            let valDuration = to - from
            let continuancePosValData0 = 1
            let data0PropDataLength = continuancePosValData0 + valDuration
            let nodeDataLength = propSet ? data0PropDataLength * propSet.length + propSet.length + 1 : 0

            var data = [nodeDataLength, valDuration]

            if (nodeSet) {
                for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
                    let nodeBind = nodeSet[n][stream]

                    if (!propSet) {
                        propSet = []
                        for (let propKey in nodeBind) {
                            if (typeof nodeSet[n][propKey] != 'undefined') propSet.push(propKey)
                        }
                    }
                    if (nodeDataLength == 0) {
                        nodeDataLength = data0PropDataLength * propSet.length + propSet.length + 1
                        data = [nodeDataLength, valDuration]
                    }

                    data.push(nodeBind.binding.replace('_bi', '') << 0)

                    for (let p = 0, plen = propSet.length; p < plen; p++) {
                        let nodeBindProp = nodeBind[propSet[p]]
                        data.push(nodeBindProp.binding)

                        let data0PosI = nodeBindProp.data0PosI
                        data.push(access.data[data0PosI + from])

                        for (let ew = 0; ew < valDuration; ew++) {
                            let dataPos = from + ew
                            dataPos = dataPos < access.propDataLength ? dataPos : access.reversion(dataPos)
                            let dataPosI = data0PosI + dataPos
                            data.push(access.data[dataPosI + 1])
                        }
                    }
                }
            }
            return data
        }
        return that
    }
    var _buffer = Class.addon.buffer()
    /**
     * AddOn: runtime buffer.ease
     * //Time-based easings
     * //Changing node properties
     * //by buffing the stream with values.
     * @author leroyron / http://leroy.ron@gmail.com
     * //_struct.addon: modifies, enhances and accesses
     */
    Class.addon.buffer.ease = function () {
        var that = Class.addon.buffer.ease = {}
        that.precisions = 100
        that.update = function () {
            ease.precisions = this.precisions
            // scaling the spline control points percents
            var easePrecisions = easePresets.precisions
            for (let preset in easePresets) {
                for (let cp in easePresets[preset].CPs) {
                    let curPFrac = easePresets[preset].CPs[cp].p / easePrecisions
                    easePresets[preset].CPs[cp].p = ease.precisions * curPFrac
                }
                easePresets[preset].duration = easePresets.durations
                easePresets[preset].precision = ease.precisions
            }
            easePresets.precisions = ease.precisions
            _buffer.presets(easePresets)
            this.updateCallbacks()
        }
        that.updateCalls = []
        that.upclen = 0
        that.updateCallbacks = function () {
            for (let c = 0; c < this.upclen; c++) {
                this.updateCalls[c][1](this.updateCalls[c][0])
            }
        }

        var ease = {precisions: that.precisions}
        var init = function () {
            that.update()
        }
        var easePresets = // t = time, p = percent/precision
            {
                durations: 100,
                precisions: 100,
                linear:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 50, 'p': 50}, {'t': 100, 'p': 0}]
                },
            // Sine
                easeInSine:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 17, 'p': 96}, {'t': 100, 'p': 0}]
                },
                easeOutSine:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 83, 'p': 3}, {'t': 100, 'p': 0}]
                },
                easeInOutSine:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 19, 'p': 92}, {'t': 81, 'p': 8}, {'t': 100, 'p': 0}]
                },
            // Quad
                easeInQuad:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 32, 'p': 89}, {'t': 75, 'p': 44}, {'t': 100, 'p': 0}]
                },
                easeOutQuad:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 17, 'p': 69}, {'t': 74, 'p': 6}, {'t': 100, 'p': 0}]
                },
                easeInOutQuad:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 17, 'p': 93}, {'t': 35, 'p': 75}, {'t': 55, 'p': 40}, {'t': 80, 'p': 7}, {'t': 100, 'p': 0}]
                },
            // Cubic
                easeInCubic:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 17, 'p': 99}, {'t': 42, 'p': 92}, {'t': 66, 'p': 71}, {'t': 86, 'p': 35}, {'t': 100, 'p': 0}]
                },
                easeOutCubic:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 15, 'p': 59}, {'t': 33, 'p': 30}, {'t': 57, 'p': 8}, {'t': 83, 'p': 0}, {'t': 100, 'p': 0}]
                },
                easeInOutCubic:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 22, 'p': 96}, {'t': 38, 'p': 77}, {'t': 50, 'p': 50}, {'t': 64, 'p': 18}, {'t': 82, 'p': 2}, {'t': 100, 'p': 0}]
                },
            // Quart
                easeInQuart:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 21, 'p': 100}, {'t': 42, 'p': 96}, {'t': 63, 'p': 84}, {'t': 82, 'p': 54}, {'t': 92, 'p': 28}, {'t': 100, 'p': 0}]
                },
                easeOutQuart:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 12, 'p': 58}, {'t': 27, 'p': 28}, {'t': 45, 'p': 9}, {'t': 66, 'p': 1}, {'t': 81, 'p': 0}, {'t': 100, 'p': 0}]
                },
                easeInOutQuart:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 15, 'p': 100}, {'t': 28, 'p': 94}, {'t': 41, 'p': 76}, {'t': 50, 'p': 49}, {'t': 57, 'p': 26}, {'t': 68, 'p': 8}, {'t': 84, 'p': 0}, {'t': 100, 'p': 0}]
                },
            // Quint
                easeInQuint:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 24, 'p': 100}, {'t': 43, 'p': 98}, {'t': 64, 'p': 89}, {'t': 81, 'p': 64}, {'t': 93, 'p': 28}, {'t': 100, 'p': 0}]
                },
                easeOutQuint:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 9, 'p': 61}, {'t': 23, 'p': 26}, {'t': 37, 'p': 10}, {'t': 59, 'p': 1}, {'t': 78, 'p': 0}, {'t': 100, 'p': 0}]
                },
                easeInOutQuint:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 16, 'p': 99}, {'t': 28, 'p': 96}, {'t': 45, 'p': 70}, {'t': 52, 'p': 39}, {'t': 60, 'p': 17}, {'t': 75, 'p': 1}, {'t': 88, 'p': 0}, {'t': 100, 'p': 0}]
                },
            // Expo
                easeInExpo:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 9, 'p': 99}, {'t': 56, 'p': 94}, {'t': 72, 'p': 85}, {'t': 83, 'p': 69}, {'t': 92, 'p': 42}, {'t': 100, 'p': 0}]
                },
                easeOutExpo:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 5, 'p': 70}, {'t': 22, 'p': 21}, {'t': 48, 'p': 3}, {'t': 64, 'p': 1}, {'t': 93, 'p': 0}, {'t': 100, 'p': 0}]
                },
                easeInOutExpo:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 11, 'p': 99}, {'t': 21, 'p': 99}, {'t': 30, 'p': 96}, {'t': 38, 'p': 90}, {'t': 47, 'p': 67}, {'t': 53, 'p': 33}, {'t': 60, 'p': 12}, {'t': 72, 'p': 2}, {'t': 79, 'p': 0}, {'t': 85, 'p': 0}, {'t': 100, 'p': 0}]
                },
            // Circ
                easeInCirc:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 33, 'p': 94}, {'t': 54, 'p': 83}, {'t': 81, 'p': 58}, {'t': 94, 'p': 35}, {'t': 99, 'p': 10}, {'t': 100, 'p': 0}]
                },
                easeOutCirc:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 1, 'p': 90}, {'t': 6, 'p': 66}, {'t': 14, 'p': 48}, {'t': 26, 'p': 32}, {'t': 41, 'p': 19}, {'t': 60, 'p': 8}, {'t': 79, 'p': 2}, {'t': 100, 'p': 0}]
                },
                easeInOutCirc:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 17, 'p': 97}, {'t': 27, 'p': 92}, {'t': 37, 'p': 83}, {'t': 44, 'p': 74}, {'t': 47, 'p': 67}, {'t': 49, 'p': 60}, {'t': 50, 'p': 50}, {'t': 51, 'p': 41}, {'t': 53, 'p': 31}, {'t': 57, 'p': 22}, {'t': 62, 'p': 17}, {'t': 71, 'p': 9}, {'t': 82, 'p': 3}, {'t': 100, 'p': 0}]
                },
            // Back
                easeInBack:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 4, 'p': 100}, {'t': 64, 'p': 100}, {'t': 86, 'p': 53}, {'t': 100, 'p': 0}]
                },
                easeOutBack:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 3, 'p': 86}, {'t': 35, 'p': 1}, {'t': 95, 'p': 0}, {'t': 100, 'p': 0}]
                },
                easeInOutBack:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 3, 'p': 100}, {'t': 46, 'p': 69}, {'t': 51, 'p': 44}, {'t': 56, 'p': 22}, {'t': 97, 'p': 0}, {'t': 100, 'p': 0}]
                },
            // Elastic
                easeInElastic:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 8, 'p': 99}, {'t': 15, 'p': 99}, {'t': 22, 'p': 100}, {'t': 32, 'p': 100}, {'t': 41, 'p': 98}, {'t': 47, 'p': 99}, {'t': 63, 'p': 99}, {'t': 74, 'p': 90}, {'t': 93, 'p': 93}, {'t': 95, 'p': 60}, {'t': 100, 'p': 0}]
                },
                easeOutElastic:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 3, 'p': 65}, {'t': 7, 'p': 2}, {'t': 26, 'p': 11}, {'t': 38, 'p': 0}, {'t': 56, 'p': 1}, {'t': 69, 'p': 0}, {'t': 75, 'p': 0}, {'t': 83, 'p': 0}, {'t': 90, 'p': 0}, {'t': 100, 'p': 0}]
                },
                easeInOutElastic:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 13, 'p': 100}, {'t': 23, 'p': 99}, {'t': 33, 'p': 99}, {'t': 45, 'p': 95}, {'t': 48, 'p': 67}, {'t': 51, 'p': 41}, {'t': 55, 'p': 4}, {'t': 67, 'p': 0}, {'t': 78, 'p': 0}, {'t': 87, 'p': 0}, {'t': 100, 'p': 0}]
                },
            // Bounce
                easeInBounce:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 4, 'p': 98}, {'t': 8, 'p': 100}, {'t': 12, 'p': 96}, {'t': 23, 'p': 97}, {'t': 26, 'p': 100}, {'t': 28, 'p': 96}, {'t': 60, 'p': 95}, {'t': 63, 'p': 100}, {'t': 68, 'p': 80}, {'t': 87, 'p': 13}, {'t': 100, 'p': 0}]
                },
                easeOutBounce:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 15, 'p': 83}, {'t': 28, 'p': 40}, {'t': 33, 'p': 17}, {'t': 36, 'p': 2}, {'t': 38, 'p': 4}, {'t': 71, 'p': 4}, {'t': 73, 'p': 0}, {'t': 77, 'p': 4}, {'t': 88, 'p': 3}, {'t': 91, 'p': 0}, {'t': 94, 'p': 1}, {'t': 100, 'p': 0}]
                },
                easeInOutBounce:
                {
                    CPs: [{'t': 0, 'p': 100}, {'t': 3, 'p': 98}, {'t': 5, 'p': 99}, {'t': 9, 'p': 97}, {'t': 13, 'p': 99}, {'t': 16, 'p': 94}, {'t': 28, 'p': 94}, {'t': 31, 'p': 98}, {'t': 37, 'p': 77}, {'t': 44, 'p': 55}, {'t': 55, 'p': 46}, {'t': 64, 'p': 19}, {'t': 68, 'p': 1}, {'t': 72, 'p': 6}, {'t': 82, 'p': 7}, {'t': 86, 'p': 0}, {'t': 91, 'p': 3}, {'t': 95, 'p': 0}, {'t': 97, 'p': 1}, {'t': 100, 'p': 0}]
                }
            }
        init()
    }
    Class.addon.buffer.ease()
    /**
     * AddOn: runtime timeframe
     * //Time-based thrusting
     * //TimeFrame thrust bit by bit through datasets in the stream
     * //based on CPU clock-time.
     * @author leroyron / http://leroy.ron@gmail.com
     */
    Class.addon.timeframe = function () {
        var that = Class.addon.timeframe = {}
        that.process = undefined // setup to invoke a function before each frame//new Streaming.addon.timeframe.process = function () {}
        that.invoke = undefined // setup to invoke a function after after frame//new Streaming.addon.timeframe.invoke = function () {}
        that.length = undefined
        that.init = false
        that.ready = false
        that.running = false
        that.control = false
        that.lapse = 10
        that.duration = that._duration = 0
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
            if (isNaN(at)) {
                _runtime[select].script = []
            } else {
                if (_runtime[select].script[at]) _runtime[select].script.splice(at, 1)
            }
        }
        that.clearRuntimeAuthoritiesNear = function (select, at, near) {
            // debugger
            this.timeline.removeInsertsNear(select, at, near)
            let from = at - near
            let to = at + near
            for (let ni = from; ni < to; ni++) {
                this.clearRuntimeAuthority(select, ni)
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

        that.update = function (position) {
            time.process = this.process
            time.invoke = this.invoke
            time.length = this.length
            time.running = this.running
            time.lapse = this.lapse
            if (this.updateCallbacks) this.updateCallbacks()

            if (that.mode == '3d') {
                timeframeThrustingStreamingUtilizationAsRuntimeSumingValuesForTHREE()
                timeframeReadingStreamingUtilizationAsRuntimeGettingValuesForTHREE()
            } else {
                timeframeThrustingStreamingUtilizationAsRuntimeSumingValues()
                timeframeReadingStreamingUtilizationAsRuntimeGettingValues()
            }
            syncInTimeframe(position ? position - 1 : undefined)
            timeframeRuntimeStreamRevertCallAndForwardingRevertPositionValue(_revert)
        }

        that._init = function (window) {
            this.mode = window.canvases['0'].context.constructor.name == 'CanvasRenderingContext2D' ? '2d' : '3d'
            this.length = _runtime[_runtime.access.stream].length
            this.init = true
        }

        that._forceInit = function (window) {
            this.mode = window.canvases['0'].context.constructor.name == 'CanvasRenderingContext2D' ? '2d' : '3d'
            this.length = _runtime.access.access.prototype.length
            this.init = true
        }
        that._ready = function () {
            this.ready = true
        }
        that.run = function () {
            if (!this.running && this.ready) {
                time.now = time._then = Date.now()
                this.length = _runtime[_runtime.access.stream] ? _runtime[_runtime.access.stream].length : this.length
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
            that._duration = that.duration + time._timeFrame
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
            _runtime.access.block = true
            this.update(position)
        }
        var timeframeThrustingStreamingUtilizationAsRuntimeSumingValuesForTHREE = function () {
            _runtime.access.output_utilizeThrustData = function (value, node, property) {
                if (value == 0 && property != 806) return
                let setBind = this.bindings.ids['_bi' + node]
                let setBindProperty = setBind[property]
                setBindProperty.value += value
                // TO-DO redo all demos to utilize property binding value and remove if else statement, uniform scheme
                if (setBindProperty.property) setBind.node[setBindProperty.property][setBindProperty.binding] = setBindProperty.value / setBind.node[this.stream].precision; else setBind.node[setBindProperty.binding] = setBindProperty.value / setBind.node[this.stream].precision

                if (property == 806) setBind.node.blockCallback = false // release rotation for callback z bind
            }
        }
        var timeframeThrustingStreamingUtilizationAsRuntimeSumingValues = function () {
            _runtime.access.output_utilizeThrustData = function (value, node, property) {
                if (value == 0) return
                let setBind = this.bindings.ids['_bi' + node]
                let setBindProperty = setBind[property]
                setBindProperty.value += value
                // TO-DO redo all demos to utilize property binding value and remove if else statement, uniform scheme
                if (setBindProperty.property) setBind.node[setBindProperty.property][setBindProperty.binding] = setBindProperty.value / setBind.node[this.stream].precision; else setBind.node[setBindProperty.binding] = setBindProperty.value / setBind.node[this.stream].precision
            }
        }
        that.switchToTimeFrameReading = function (position) {
            time.access = 'read'
            _runtime.access.defaults.relative = true
            _runtime.access.block = true
            this.update(position)
        }
        var syncInTimeframe = function (position) {
            _runtime.access.option = time.access
            _runtime.access.method = 'all'
            _runtime.access.rCount = _runtime.access.tCount = 1
            if (position) that.syncing(position)
        }
        var timeframeReadingStreamingUtilizationAsRuntimeGettingValuesForTHREE = function () {
            _runtime.access.output_utilizeReadData = function (value, node, property) {
                let setBind = this.bindings.ids['_bi' + node]
                let setBindProperty = setBind[property]
                setBindProperty.value = value
                // TO-DO redo all demos to utilize property binding value and remove if else statement, uniform scheme
                if (setBindProperty.property) setBind.node[setBindProperty.property][setBindProperty.binding] = setBindProperty.value / setBind.node[this.stream].precision; else setBind.node[setBindProperty.binding] = setBindProperty.value / setBind.node[this.stream].precision

                if (property == 806) setBind.node.blockCallback = false // release rotation for callback z bind
            }
        }
        var timeframeReadingStreamingUtilizationAsRuntimeGettingValues = function () {
            _runtime.access.output_utilizeReadData = function (value, node, property) {
                let setBind = this.bindings.ids['_bi' + node]
                let setBindProperty = setBind[property]
                setBindProperty.value = value
                // TO-DO redo all demos to utilize property binding value and remove if else statement, uniform scheme
                if (setBindProperty.property) setBind.node[setBindProperty.property][setBindProperty.binding] = setBindProperty.value / setBind.node[this.stream].precision; else setBind.node[setBindProperty.binding] = setBindProperty.value / setBind.node[this.stream].precision
            }
        }
        var timeframeRuntimeStreamRevertCallAndForwardingRevertPositionValue = function () {
            _runtime.access.output_revertCall = _revert
        }
        that.resetStreamProperties = function () {
            _runtime.access.revertFromTo(this.length, 0)
        }
        return that
    }
    var _timeframe = Class.addon.timeframe()
    /**
     * AddOn: runtime timeframe execution of comment, segment, action and sound
     * @author leroyron / http://leroy.ron@gmail.com
     */
    var classTimeframeInserts = ['comment', 'segment', 'action', 'sound']
    for (let ci = 0; ci < classTimeframeInserts.length; ci++) {
        Class.addon.timeframe[classTimeframeInserts[ci]] = function () {
            var that = _runtime[classTimeframeInserts[ci]] = {script: []}
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
        }
        Class.addon.timeframe[classTimeframeInserts[ci]]()
    }
}/* Buildup - End */)


/**
 * Cubic Spline Interpolation
 * http://blog.ivank.net/interpolation-with-cubic-splines.html
 */
function CSPL () {};

CSPL._gaussJ = {}
CSPL._gaussJ.solve = function (A, x) {
    var m = A.length
    // column
    for (let k = 0; k < m; k++) {
        // pivot for column
        let iMax = 0; var vali = Number.NEGATIVE_INFINITY
        for (let i = k; i < m; i++) {
            if (A[i][k] > vali) {
                iMax = i
                vali = A[i][k]
            }
        }
        CSPL._gaussJ.swapRows(A, k, iMax)

        if (A[iMax][k] === 0) console.log('matrix is singular!')

        // for all rows below pivot
        for (let i = k + 1; i < m; i++) {
            for (let j = k + 1; j < m + 1; j++) {
                A[i][j] = A[i][j] - A[k][j] * (A[i][k] / A[k][k])
            }
            A[i][k] = 0
        }
    }

    // rows = columns
    for (let i = m - 1; i >= 0; i--) {
        let v = A[i][m] / A[i][i]
        x[i] = v
        // rows
        for (let j = i - 1; j >= 0; j--) {
            A[j][m] -= A[j][i] * v
            A[j][i] = 0
        }
    }
}
CSPL._gaussJ.zerosMat = function (r, c) {
    var A = []
    for (let i = 0; i < r; i++) {
        A.push([])
        for (let j = 0; j < c; j++) A[i].push(0)
    }
    return A
}
CSPL._gaussJ.printMat = function (A) {
    for (let i = 0; i < A.length; i++) console.log(A[i])
}
CSPL._gaussJ.swapRows = function (m, k, l) {
    var p = m[k]
    m[k] = m[l]; m[l] = p
}

// in x values, in y values, out k values
CSPL.getNaturalKs = function (xs, ys, ks) {
    var n = xs.length - 1
    var A = CSPL._gaussJ.zerosMat(n + 1, n + 2)

    // rows
    for (let i = 1; i < n; i++) {
        A[i][i - 1] = 1 / (xs[i] - xs[i - 1])
        A[i][i] = 2 * (1 / (xs[i] - xs[i - 1]) + 1 / (xs[i + 1] - xs[i]))
        A[i][i + 1] = 1 / (xs[i + 1] - xs[i])
        A[i][n + 1] = (
            3 * (
                (ys[i] - ys[i - 1]) / (
                    (xs[i] - xs[i - 1]) * (xs[i] - xs[i - 1])
                ) + (ys[i + 1] - ys[i]) / (
                    (xs[i + 1] - xs[i]) * (xs[i + 1] - xs[i])
                )
            )
        )
    }

    A[0][0] = 2 / (xs[1] - xs[0])
    A[0][1] = 1 / (xs[1] - xs[0])
    A[0][n + 1] = 3 * (ys[1] - ys[0]) / ((xs[1] - xs[0]) * (xs[1] - xs[0]))

    A[n][n - 1] = 1 / (xs[n] - xs[n - 1])
    A[n][n] = 2 / (xs[n] - xs[n - 1])
    A[n][n + 1] = (
        3 * (
            ys[n] - ys[n - 1]
        ) / (
            (xs[n] - xs[n - 1]) * (xs[n] - xs[n - 1])
        )
    )

    CSPL._gaussJ.solve(A, ks)
}

CSPL.evalSpline = function (x, xs, ys, ks) {
    var i = 1
    while (xs[i] < x) i++

    var t = (x - xs[i - 1]) / (xs[i] - xs[i - 1])

    var a = ks[i - 1] * (xs[i] - xs[i - 1]) - (ys[i] - ys[i - 1])
    var b = -ks[i] * (xs[i] - xs[i - 1]) + (ys[i] - ys[i - 1])

    var q = (
        (1 - t) * ys[i - 1] + t * ys[i] + t * (1 - t) * (a * (1 - t) + b * t)
    )
    return q
}
var Utils = {}

Utils.userSelectDropDown = function (dropdownSelect) {
    var userSelect = dropdownSelect
    userSelect.addEventListener('change', function () {
        window.localStorage.setItem('storedSelect', [this.selectedIndex, this.options[this.selectedIndex].value])
        window.location.reload()
    })
    var storedSelect = window.localStorage.getItem('storedSelect')
    if (storedSelect) {
        storedSelect = storedSelect.split(',')
        userSelect.selectedIndex = storedSelect[0]
        userSelect = storedSelect[1]
    } else userSelect = undefined
    return userSelect || dropdownSelect.options[dropdownSelect.selectedIndex].value
}

Utils.vscodeSelectDropDown = function (vsCodesetting, dropdownSelect) {
    var vscodeSelect
    for (var i = 0; i < dropdownSelect.length; i++) {
        if (dropdownSelect[i].value === vsCodesetting) {
            dropdownSelect[i].selected = true
            vscodeSelect = dropdownSelect.options[i].value
            break
        }
    }
    return vscodeSelect
}

Utils.Blend = {}
Utils.Blend.src = [ 'ZeroFactor', 'OneFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor', 'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor' ]
        //          '200'         '201'        '204'             '205'                     '206'             '207'                     '208'             '209'                     '210'
Utils.Blend.dst = [ 'ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor' ]
        //          '200'         '201'        '208'             '203'                     '204'             '205'                     '206'             '207'
Utils.Blend.blending = 'CustomBlending'

Utils.flagBut = false
// BINDING AND UNBINDING BUTTONS AND KEYS
Utils.bindButtonUseFunction = function (button, func, args) {
    if (typeof (button) == 'undefined') { return }
    var clickTouch = function (e) {
        e.preventDefault()
        if (!Utils.flagBut) {
            Utils.flagBut = true
            setTimeout(function () { Utils.flagBut = false }, 100)

            if (arguments.length > 0) { func.apply(this, args) } else { func() }
        }
        return false
    }
    button.addEventListener('click', clickTouch)
    button.addEventListener('touchstart', clickTouch)
}
Utils.unBindButton = function (button) {
    if (typeof (button) == 'undefined') { return }
    button.removeEventListener('click')
    button.removeEventListener('touchstart')
}

Utils.bindButtonAndKeyPressUseFunction = function (button, key, func, args) {
    if (typeof (button) == 'undefined') { return }
    var clickTouch = function (e) {
        e.preventDefault()
        if (!Utils.flagBut) {
            Utils.flagBut = true
            setTimeout(function () { Utils.flagBut = false }, 100)

            if (arguments.length > 0) { func.apply(this, args) } else { func() }
        }
        return false
    }
    var keyPress = function (e) {
        // e.preventDefault()
        if (Utils.keyBindings[e.keyCode].args.length > 0) { Utils.keyBindings[e.keyCode].func.apply(this, Utils.keyBindings[e.keyCode].args) } else { Utils.keyBindings[e.keyCode].func() }
        return false
    }
    button.addEventListener('click', clickTouch)
    button.addEventListener('touchstart', clickTouch)
    Utils.keyBindings[Utils.keyMapping[key]] = {keyPress: keyPress, func: func, key: key, args: args}
    window.addEventListener('keypress', Utils.keyBindings[Utils.keyMapping[key]].keyPress)
}
Utils.unBindButtonAndKeyPress = function (button, key) {
    if (typeof (button) == 'undefined') { return }
    button.removeEventListener('click')
    button.removeEventListener('touchstart')
    window.removeEventListener('keypress', Utils.keyBindings[Utils.keyMapping[key]].keyPress)
}

Utils.bindKeyPressUseFunction = function (key, func, args) {
    var keyPress = function (e) {
        // e.preventDefault()
        if (Utils.keyBindings[e.keyCode].args.length > 0) { Utils.keyBindings[e.keyCode].func.apply(this, Utils.keyBindings[e.keyCode].args) } else { Utils.keyBindings[e.keyCode].func() }
        return false
    }
    Utils.keyBindings[Utils.keyMapping[key]] = {keyPress: keyPress, func: func, key: key, args: args}
    window.addEventListener('keypress', Utils.keyBindings[Utils.keyMapping[key]].keyPress)
}
Utils.unBindKeyPress = function (key) {
    window.removeEventListener('keypress', Utils.keyBindings[Utils.keyMapping[key]].keyPress)
}

Utils.bindKeyUpDownUseFunction = function (key, func1, func2, args, hold) {
    var flagBut = false
    var keyDown = function (code) {
        if (hold && func1) {
            if (!flagBut) {
                flagBut = true
            } else return false
            keyState[code] = undefined
        }
        if (args.length > 0) func1.apply(this, args); else func1()
        return false
    }

    var keyUp = function (code) {
        if (hold && func2) {
            if (flagBut) {
                flagBut = false
            } else return false
            keyState[code] = undefined
        }
        if (args.length > 0) func2.apply(this, args); else func2()
        return false
    }

    Utils.keyBindings[Utils.keyMapping[key]] = {
        keyDown: keyDown, keyUp: keyUp
    }
}

// keyState loop (non-thread blocking)
var keyState = []
Utils.bindKeyStateLoop = function () {
    for (let code = 0; code < keyState.length; code++) if (keyState[code]) keyState[code][0][keyState[code][1]](code)
}

window.addEventListener('keydown', function (e) {
    // e.preventDefault()
    keyState[e.keyCode || e.which] = Utils.keyBindings[e.keyCode || e.which] ? [Utils.keyBindings[e.keyCode || e.which], 'keyDown'] : undefined
}, true)

window.addEventListener('keyup', function (e) {
    // e.preventDefault()
    keyState[e.keyCode || e.which] = Utils.keyBindings[e.keyCode || e.which] ? [Utils.keyBindings[e.keyCode || e.which], 'keyUp'] : undefined
}, true)

Utils.unBindKeyUpDown = function (key) {
    Utils.keyBindings[Utils.keyMapping[key]] = undefined
}

Utils.keyBindings = {}
Utils.keyMapping = {
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
    '0': 48,
    '-': 189,
    '=': 187,
    '\\': 220,
    'q': 81,
    'w': 87,
    'e': 69,
    'r': 82,
    't': 84,
    'y': 89,
    'u': 85,
    'i': 73,
    'o': 79,
    'p': 80,
    '[': 219,
    ']': 221,
    'a': 65,
    's': 83,
    'd': 68,
    'f': 70,
    'g': 71,
    'h': 72,
    'j': 74,
    'k': 75,
    'l': 76,
    ';': 186,
    '\'': 222,
    'z': 90,
    'x': 88,
    'c': 67,
    'v': 86,
    'b': 66,
    'n': 78,
    'm': 77,
    ',': 188,
    '.': 190,
    '/': 191
}

// array.addon
// IE fix Array fill
Array.prototype.fill = !Array.prototype.fill ? function (value) {
    return Array.apply(null, Array(this.length)).map(Number.prototype.valueOf, value)
} : Array.prototype.fill

// math.addon
// Converts from degrees to radians.
Math.radians = function (degrees) {
    return degrees * Math.PI / 180
}

// Converts from radians to degrees.
Math.degrees = function (radians) {
    return radians * 180 / Math.PI
}

// Returns a fraction of value.
Math.lerp = function (val, frac) {
    return val * frac
}

// Returns a fraction of two comparable value.
Math.lerpSubject = function (val1, val2, frac) {
    return this.lerp((val1 - val2), frac)
    // Useage - obj.x += Math.lerpSubject(move, obj.x, obj.speed);
}

// Assigns value directly to object property
Math.lerpProp = function (obj, prop, val, frac) {
    obj[prop] += this.lerpSubject(val, obj[prop], frac)
    // Useage - Math.lerpProp(obj, 'x', move, obj.speed);
}

// Assigns value directly to multiple object property
Math.lerpProps = function (objs, prop, val, frac) {
    for (let oi = 0; oi < objs.length; oi++) {
        objs[oi][prop] += this.lerpSubject(val, objs[oi][prop], frac)
    }
    // Useage - Math.lerpProp(obj, 'x', move, obj.speed);
}

// Get distance
Math.distance2 = function (p1, p2) {
    var a = p1.x - p2.x
    var b = p1.y - p2.y
    return Math.sqrt(a * a + b * b)
}

// Random number from to
Math.randomFromTo = function (from, to) {
    return Math.floor((Math.random() * (to - from)) + from)
}

// Aspectratio
Math.aspectRatio = function (orginalWidth, originalHeight) {
    return orginalWidth / originalHeight
}

Math.rotateFromPoint = function (pointX, pointY, originX, originY, angle, clockwise) {
    if (clockwise) angle -= 180.0
    angle = angle * Math.PI / 180.0
    return {
        x: Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
        y: Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY
    }
}

// math.addon.type
Math.Type = {}
// Returns string of object type
Math.Type.identify = function (obj) {
    if (obj.constructor) {
        if (obj.constructor.name == 'Vector3') {
            return 'translation'
        } else if (obj.constructor.name == 'Euler') {
            return 'radian'
        }
    }
    if (obj.type == 'position') {
        return 'translation'
    } else if (obj.type == 'rotation') {
        return 'radian'
    } else if (obj.type == 'poly') {
        return 'poly'
    } else {
        return 'uniform'
    }
}

// Returns the precision value for integer conversions
Math.Type.precision = function (type) {
    if (type == 'translation') {
        return 1000
    } else if (type == 'radian') {
        return 10000
    } else if (type == 'uniform') {
        return 1000
    }
}

// Return precision or type conversion value for a specific type ///
Math.Type.convertToPrecision = function (type, val) {
    return val * this.precision(type)
}

Math.Type.convertFromPrecision = function (type, val) {
    return val / this.precision(type)
}

Math.Type.convertToType = function (type, val) {
    if (type == 'radian') {
        return Math.radians(val)
    } else {
        return val
    }
}

Math.Type.convertFromType = function (type, val) {
    if (type == 'radian') {
        return Math.degrees(val)
    } else {
        return val
    }
}

Math.Type.convertToPrecisionType = function (type, val, precision) {
    return Math.Type.convertToType(type, precision ? val * precision : val * this.precision(type))
}

Math.Type.convertFromPrecisionType = function (type, val, precision) {
    return Math.Type.convertFromType(type, precision ? val / precision : val / this.precision(type))
}

Math.Type.convertToPrecisionData = function (type, data, start, end, precision) {
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        for (let ci = start; ci < start + end; ci++) {
            if (data[di][ci]) {
                data[di][ci] = precision ? data[di][ci] * precision : this.convertToPrecision(type, data[di][ci])
            }
        }
    }
    return data
}

Math.Type.convertFromPrecisionData = function (type, data, start, end, precision) {
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        for (let ci = start; ci < start + end; ci++) {
            if (data[di][ci]) {
                data[di][ci] = precision ? data[di][ci] / precision : this.convertFromPrecision(type, data[di][ci])
            }
        }
    }
    return data
}

Math.Type.convertToTypeData = function (type, data, start, end) {
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        for (let ci = start; ci < start + end; ci++) {
            if (data[di][ci]) {
                data[di][ci] = this.convertToType(type, data[di][ci])
            }
        }
    }
    return data
}

Math.Type.convertFromTypeData = function (type, data, start, end) {
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        for (let ci = start; ci < start + end; ci++) {
            if (data[di][ci]) {
                data[di][ci] = this.convertFromType(type, data[di][ci])
            }
        }
    }
    return data
}

Math.Type.convertToPrecisionDataType = function (type, data, start, end, precision) {
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        for (let ci = start; ci < start + end; ci++) {
            if (data[di][ci]) {
                data[di][ci] = precision ? data[di][ci] * precision : this.convertToPrecision(type, data[di][ci])
                data[di][ci] = this.convertToType(type, data[di][ci])
            }
        }
    }
    return data
}

Math.Type.convertFromPrecisionDataType = function (type, data, start, end, precision) {
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        for (let ci = start; ci < start + end; ci++) {
            if (data[di][ci]) {
                data[di][ci] = precision ? data[di][ci] / precision : this.convertFromPrecision(type, data[di][ci])
                data[di][ci] = this.convertFromType(type, data[di][ci])
            }
        }
    }
    return data
}

// math.addon.cache
Math.Cache = {}
// Storing math data/functions for access and performance
Math.Cache.store = function (prop, func, apply) {
    Math.Cache[prop] = func.apply(this, [apply])
}

// math.addon.poly
Math.Poly = {}

Math.Poly.generateKeys = function (data, start) {
    let poly = []
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        poly[di] = start ? start + di : di
    }
    return poly
}

Math.Poly.poly = function (type, data, precision) {
    if (!data.length) return precision ? data * precision : Math.Type.convertToPrecision(type, data)
    let poly = []
    for (let pi = 0, dlen = data.length; pi < dlen; pi++) {
        poly[pi] = data[pi] ? Math.Poly.poly(type, data[pi], precision) : 0
    }
    return poly
}

Math.Poly.generate = function (type, data, precision) {
    let poly = []
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        poly[di] = [di, data[di] ? Math.Poly.poly(type, data[di], precision) : 0]
    }
    return poly
}

Math.Poly.add = function (type, data1, data2) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] + data2[pi]
    }
    return poly
}

Math.Poly.subtract = function (type, data1, data2) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] - data2[pi]
    }
    return poly
}

Math.Poly.multiply = function (type, data1, data2) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] * data2[pi]
    }
    return poly
}

Math.Poly.divide = function (type, data1, data2) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] / data2[pi]
    }
    return poly
}

Math.Poly.addScalarVector = function (data1, v) {
    let poly = [v.x, v.y, v.z]
    let qual = 0
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        qual = pi - (3 * (pi / 3 << 0))
        data1[pi] += poly[qual] ? poly[qual] : 1
    }
}

Math.Poly.subtractScalarVector = function (data1, v) {
    let poly = [v.x, v.y, v.z]
    let qual = 0
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        qual = pi - (3 * (pi / 3 << 0))
        data1[pi] -= poly[qual] ? poly[qual] : 1
    }
}

Math.Poly.multiplyScalarVector = function (data1, v) {
    let poly = [v.x, v.y, v.z]
    let qual = 0
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        qual = pi - (3 * (pi / 3 << 0))
        data1[pi] *= poly[qual] ? poly[qual] : 1
    }
}

Math.Poly.divideScalarVector = function (data1, v) {
    let poly = [v.x, v.y, v.z]
    let qual = 0
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        qual = pi - (3 * (pi / 3 << 0))
        data1[pi] /= poly[qual] ? poly[qual] : 1
    }
}

Math.Poly.smoothOut = function (data1, variance) {
    var tAvg = this.avg(data1) * variance
    var poly = Array(data1.length)
    for (let i = 0; i < data1.length; i++) {
        let prev = i > 0 ? poly[i - 1] : data1[i]
        let next = i < data1.length ? data1[i] : data1[i - 1]
        poly[i] = this.avg([tAvg, this.avg([prev, data1[i], next])])
    }
    return poly
}

Math.Poly.avg = function (v) {
    return v.reduce((a, b) => a + b, 0) / v.length
}

// math.addon.poly.medium
Math.Poly.Medium = {}

Math.Poly.Medium.midDisperse = function (length, duration, smooth) {
    let matrix = []
    var inset = 0
    for (let m = 0; m < duration; m++) {
        let mid = length * (m / duration)
        let capture = []
        for (let i = 0, l = length + 1; i < l; i++) {
            let iMid = i + mid
            let span = (iMid / length << 0) * length
            let oct = (iMid - span)
            let hyp = oct > length / 2 ? length - oct : oct
            hyp = hyp > inset ? hyp - inset : 0
            let disI = hyp < i ? 0 : 1
            hyp = disI == 0 ? 0 : hyp
            capture[i] = hyp
        }
        let poly = []
        let reverse = []
        let ci = 0
        for (let ri = capture.length; ri > 0; ri--) {
            reverse[ci] = capture[ri - 1]
            poly[ri - 1] = reverse[ci] + capture[ci]
            poly[ri - 1] = poly[ri - 1] > length / 2 ? 1 : poly[ri - 1] / (length / 2)
            ci++
        }
        matrix[m] = smooth ? Math.Poly.smoothOut(poly, smooth) : poly
    }
    return matrix
}

Math.Poly.Medium.midEase = function (length, smooth) {
    var inset = 0
    let mid = 0
    let capture = []
    for (let i = 0, l = length + 1; i < l; i++) {
        let iMid = i + mid
        let span = (iMid / length << 0) * length
        let oct = (iMid - span)
        let hyp = oct > length / 2 ? length - oct : oct
        hyp = hyp > inset ? hyp - inset : 0
        let disI = hyp < i ? 0 : 1
        hyp = disI == 0 ? 0 : hyp

        let iMidReverse = mid - i + length
        let spanReverse = (iMidReverse / length << 0) * length
        let octReverse = (iMidReverse - spanReverse)
        let hypReverse = octReverse > length / 2 ? length - octReverse : octReverse
        capture[i] = hypReverse > inset ? hypReverse - inset : 0
        continue
        // let inHyp = hyp+hypReverse
        // let splitWidth = length / split
        // let splitSpan = (i / splitWidth << 0) * splitWidth
        // let splitOct = (i - splitSpan)
        // let splitHyp = splitOct > splitWidth / 2 ? splitWidth - splitOct : splitOct
    }
    let poly = []
    for (let ci = 0; ci < capture.length; ci++) {
        poly[ci] = capture[ci] > length / 2 ? 1 : capture[ci] / (length / 2)
    }
    poly = smooth ? Math.Poly.smoothOut(poly, smooth) : poly
    return poly
}

/**
 * //windowApp: Window and canvases dat.gui
 * //WINDOW, APP, GUI and DATA Controls
 * @author leroyron / http://leroy.ron@gmail.com
 */
window.app =
{
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: '1280,720',
    fullscreen: false,
    touch: false,
    popup: false,
    pointers: {enabled: true, inUse: false},
    marquee: {},
    motionblur:
    {
        shutterspeed: 2,
        influence: 10
    },
    uniforms:
    {
        godray_amount: 15,
        screenshadow_alpha: 1,
        ash_direction: 3
    },
    sound: true,
    ready: false
}

window.canvases = []
window.createCanvas = {}
window.container = {}
window.info = {}// Added info for app output(Remove at will)
window.stats = {}// Added stats for app output(Remove at will)
// context App inside of a container
window.context = function (parent, child) {
    var THREE = this.THREE
    var Stats = this.Stats
    this.container = document.getElementById(parent)
    this.info = document.getElementById(child)// Added info for app output(Remove at will)
    this.stats = Stats ? new Stats() : {showPanel: function () {}, begin: function () {}, end: function () {}}// Added stats for app output(Remove at will)
    this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    if (Stats) this.info.appendChild(this.stats.dom)// Added stats for app output(Remove at will)
    this.createCanvas = function (option) {
        var canvas = {}
        if (option !== '3d') {
            canvas.node = document.createElement('canvas')
            canvas.context = canvas.node.getContext('2d')
        } else {
            canvas.renderer = new THREE.WebGLRenderer()
            canvas.renderer.setSize(this.app.resolution.width, this.app.resolution.height)
            canvas.renderer.setClearColor(0x000000)
            canvas.renderer.context.scene = new THREE.Scene()
            // canvas.renderer.context.scene.fog = new THREE.FogExp2(0x000000, 0.025)
            canvas.renderer.context.camera = new THREE.PerspectiveCamera(100, this.app.width / this.app.height, 1, 100000)
            canvas.context = canvas.renderer.context
            canvas.node = canvas.renderer.domElement
            canvas.node.tabindex = '1'
        }
        canvas.node.width = this.app.resolution.width
        canvas.node.height = this.app.resolution.height
        canvas.node.style.width = this.app.width + 'px'
        canvas.node.style.height = this.app.height + 'px'

        this.app.element = this.container

        // for @ Streaming.addon.runtime.timeframe _init mode
        canvas.context.constructor.name = canvas.context.constructor.name || option == '2d' ? 'CanvasRenderingContext2D' : 'WebGLRenderingContext'

        this.container.appendChild(canvas.node)
        window.canvases.push(canvas)
        return canvas
    }
    this.buildContext = function (ctx, src, callback) {
        var script = document.createElement('script')
        script.src = src
        script.onload = function () {
            callback()
        }
        document.body.appendChild(script)
        return ctx
    }
}
// resize App inside of container
window.onresize = function onresize () {
    this.app.width = this.innerWidth
    this.app.height = this.innerHeight
    // Resize all canvases
    if (this.canvases.length > 0) {
        for (let cvi = 0, cvslen = this.canvases.length; cvi < cvslen; cvi++) {
            if (typeof this.canvases[cvi].id !== 'undefined') {
                continue
            }
            if (this.canvases[cvi].renderer) {
                this.canvases[cvi].renderer.setSize(this.app.resolution.width, this.app.resolution.height)
                this.canvases[cvi].renderer.render(this.canvases[cvi].context.scene, this.canvases[cvi].context.camera)
                this.canvases[cvi].context.camera.updateProjectionMatrix()
            }
            this.canvases[cvi].node.width = this.app.resolution.width
            this.canvases[cvi].node.height = this.app.resolution.height
            this.canvases[cvi].node.style.width = this.app.width + 'px'
            this.canvases[cvi].node.style.height = this.app.height + 'px'

            if (!this.app.ready) return
            if (this.canvases[cvi].app) { this.canvases[cvi].app.resolution(this.app) }

            if (window.ctx.calc) {
                window.ctx.calc()
            }
            if (window.ctx.rendering) {
                window.ctx.rendering()
            }
        }
    }
    this.resizeCallbacks()
}

window.launchFullscreen = function (element) {
    if (element.requestFullscreen) {
        element.requestFullscreen()
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
    }
}
window.exitFullscreen = function (element) {
    if (document.exitFullscreen) {
        document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
    }
}
window.toggleFullscreen = function (bool, elem) {
    if (!bool) {
        window.exitFullscreen()
    } else {
        window.launchFullscreen(elem)
    }
    window.setTimeout(window.onresize(), 1000)
}
window.update = function () {
    this.updateCallbacks()
}
window.resizeCalls = []
window.resizeCallbacks = function () {
    for (let r = 0; r < this.resizeCalls.length; r++) {
        if (this.resizeCalls[r]._resize) this.resizeCalls[r]._resize(); else this.resizeCalls[r]()
    }
}
window.changeResolution = function (res) {
    window.app.resolution = res
    window.setTimeout(window.onresize(), 1000)
}
window.popupCount = 0
window.popup = function () {
    var top = window.open('http://localhost:5000/', 'app' + window.popupCount, 'width=1024,height=768,toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1')
    top.focus()
    window.popupCount++
}

/**
 * //windowInfo: Window/Dom/WebGL/System Information
 * //For debugging and statistic
 * @author leroyron / http://leroy.ron@gmail.com
 */
window.getChromeVersionPerfomanceGL = function (canvas) {
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)

    var performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {}

    console.log('Performance--------')
    for (var value in performance) {
        console.log(value)
    }

    if (!canvas.context.getParameter) {
        console.log('2D Context--------')
        return raw ? parseInt(raw[2], 10) : false
    } else { console.log('OpenGL--------') }

    var gl = canvas.context

    console.log(gl.getParameter(gl.RENDERER))
    console.log(gl.getParameter(gl.VENDOR))
    console.log(getUnmaskedInfo(gl).vendor)
    console.log(getUnmaskedInfo(gl).renderer)

    function getUnmaskedInfo (gl) {
        var unMaskedInfo = {
            renderer: '',
            vendor: ''
        }

        var dbgRenderInfo = gl.getExtension('WEBGL_debug_renderer_info')
        if (dbgRenderInfo != null) {
            unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL)
            unMaskedInfo.vendor = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL)
        }

        return unMaskedInfo
    }

    return raw ? parseInt(raw[2], 10) : false
}

/**
 * //windowApp: Visual Studio Code linkage for timeline.vscode.md
 * //VScode Command Palette iFrame window parent associating
 * @author leroyron / http://leroy.ron@gmail.com
 */
window.app.vscode = window.parent.Authority || window.top.Authority || {_fileLocal: ''}
