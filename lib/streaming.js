/**
 * Streaming
 * @author leroyron / http://leroy.ron@gmail.com
 * //Streaming for javascripts linear parallelity
 */
var Streaming = Streaming || function () {
    this.open = this.open || function () {
        this.build = function (stream) {
            this.stream = this.bindings.stream
            this.nodesPerStream = this.bindings.nodesPerStream
            this.propsPerNode = this.bindings.propsPerNode
            this.propDataLength = this.bindings.propDataLength
            this.continuancePosValData0 = 1
            this.data0PropDataLength = this.continuancePosValData0 + this.propDataLength
            this.nodeDataLength = this.data0PropDataLength * this.propsPerNode + this.propsPerNode + 1

            // buff up the stream with data
            this.data = this._prebuff(this.bindings.data)

            this.bindings.stream = this.bindings.nodesPerStream = this.bindings.propsPerNode = this.bindings.propDataLength = this.bindings.data = null
            delete this.bindings.stream
            delete this.bindings.nodesPerStream
            delete this.bindings.propsPerNode
            delete this.bindings.propDataLength
            delete this.bindings.data

            this._finalize()
        }
        this.access = this.access || function (setcontinuance, setskip, settCount, setrevert, setmCount, setleap, setreset) {
            // stream reading enviornment vars
            var continuance = setcontinuance
            var skip = setskip
            var tCount = settCount
            var revert = setrevert
            var mCount = setmCount
            var leap = setleap
            var reset = setreset
            var _accessed = false
            // changable
            this.tCount = 0
            this.mCount = 0
            this.runtimeCalls = []
            this.rclen = 0
            this.runtimeCallbacks = function () {
                for (var r = 0; r < this.rclen; r++) {
                    this.runtimeCalls[r][1](this.runtimeCalls[r][0])
                }
            }
            this.update = function (setcontinuance, setskip, settCount, setrevert, setmCount, setleap, setreset) {
                continuance = setcontinuance
                skip = setskip
                tCount = settCount
                revert = setrevert
                mCount = setmCount
                leap = setleap
                reset = setreset
                this.updateCallbacks()
            }
            this.updateCalls = []
            this.uclen = 0
            this.updateCallbacks = function () {
                for (var c = 0; c < this.uclen; c++) {
                    this.updateCalls[c][1](this.updateCalls[c][0])
                }
            }

            // stream runtime vars
            var stream = stream || 'stream'
            var nodesPerStream, propsPerNode, propDataLength, continuancePosValData0, data0PropDataLength, nodeDataLength, streamDataLength
            this._finalize = function () {
                // Initialization from build
                stream = this.stream
                nodesPerStream = this.nodesPerStream
                propsPerNode = this.propsPerNode
                propDataLength = this.propDataLength
                continuancePosValData0 = this.continuancePosValData0
                data0PropDataLength = this.data0PropDataLength
                nodeDataLength = this.nodeDataLength

                this.nodesPerStream = this.propsPerNode = this.propDataLength = this.continuancePosValData0 = this.data0PropDataLength = this.nodeDataLength = null
                delete this.nodesPerStream
                delete this.propsPerNode
                delete this.propDataLength
                delete this.continuancePosValData0
                delete this.data0PropDataLength
                delete this.nodeDataLength

                // FOR PRODUCTION
                //! !!IMPORTANT hide data (private)... replace this.data with var data;-->
                // var data = this.data;
                // delete this.data;

                streamDataLength = this.data.length
                this.updateCallbacks()
            }

            // thrust and measure methods
            this.thrust = function (val, option) {
                this.tCount = val + tCount
                this.runtimeCallbacks()
                switch (option) {
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
            }
            this.output_utilizeThrustData = 'Data entry portal for execute, ref this to outter functions'
            // ToDo - use webworker
            this.measure = function (val, option) {
                this.mCount = val + mCount
                this.runtimeCallbacks()
                switch (option) {
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
            }
            this.output_utilizeMeasureData = 'Data entry portal for execute, ref this to outter functions'

            // //Common Vars and _functions that are used for thrust and measuring
            // "*I" indicates data index
            // sI is the position in stream array
            // cursor counts up start for offset reads
            // reads counts up for data reads
            var sI = 0
            var cursor = 0
            var reads = 0
            var chunkStartI = 0
            var dataPos, data0Pos, data0PosI, endPosI
            this._checkInContinuance = function () {
                if (!continuance) {
                    return sI
                }
                sI += this.data[data0PosI]
                this._updateDataPos(sI)
                return sI
            }
            this._updateDataPos = function () {
                dataPos = ((sI - cursor) - chunkStartI)
                data0PosI = sI - dataPos
            }
            this._checkOutRevert = function () {
                if (!revert) {
                    return sI
                }
                var reverancy = ((this.data[data0PosI] + skip) / propDataLength) << 0
                var revertPos = ((this.data[data0PosI] + skip) - (propDataLength * reverancy) + continuancePosValData0)
                var revertPosI = data0PosI + revertPos
                if (reverancy >= 1) {
                    this.data[data0PosI] = revertPos
                    this._updateDataPos(revertPosI)
                    return revertPosI
                } else {
                    sI += skip
                    this._updateDataPos(sI)
                    return sI
                }
            }
            // //

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
                        // ->> Node Selection > buffer identifyer
                        var nodeBI = this.data[sI]
                        sI++
                        cursor = 1
                        reads++
                    }

                    // Property Level//
                    if ((sI - reads) % data0PropDataLength == 0) {
                        chunkStartI = (sI - cursor)
                        // var prop = ((sI-reads) - ( data0PropDataLength * propsPerNode * node_i)) / data0PropDataLength;//property index number of chunk
                        // ->> Property Selection > buffer identifyer

                        var propBI = this.data[sI]
                        sI++
                        cursor++
                        reads++

                        dataPos = ((sI - cursor) - chunkStartI)
                        data0Pos = dataPos
                        data0PosI = sI - data0Pos
                        var endPos = (data0PropDataLength - data0Pos) - 1
                        endPosI = data0PosI + endPos

                        if (reset) {
                            this.data[data0PosI] = continuancePosValData0
                        }

                        sI = this._checkInContinuance(sI, continuance)
                        sI = this._checkOutRevert(sI, skip, revert)
                    }

                    // Data Level//
                    if (tCount > 0) {
                        var tSums = this._dataSum(tCount)
                        this.output_utilizeThrustData(tSums, nodeBI, propBI)
                    } else {
                        return
                    }
                }
            }
            this._dataSum = function (count) {
                var sums = 0
                for (var d = 0; d < count; d++) {
                    var next = 1
                    var nextPos = dataPos + next
                    var nextPosI = data0PosI + nextPos
                    if (nextPos > propDataLength) {
                        if (!revert) {
                            break
                        } else {
                            d--
                            sI = data0PosI + continuancePosValData0
                            this._updateDataPos(sI)
                            this.data[data0PosI] = dataPos// a.store offset
                        }
                    } else if (this.data[nextPosI] == leap) {
                        if (continuance) {
                            this.data[data0PosI] = nextPos// a.
                        }
                        this.data[nextPosI] = 0// b.Zero out data
                        sI = endPosI
                        this._updateDataPos(sI)
                        break
                    } else {
                        sI = nextPosI
                        this._updateDataPos(sI)
                        this.data[data0PosI] = dataPos// a.
                        sums += this.data[sI]
                        this.data[sI] = 0// b.
                    }
                }
                sI = endPosI
                this._updateDataPos(sI)
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
                        // ->> Node Selection > buffer identifyer in stream
                        var nodeBI = this.data[sI]
                        measureData[mI++] = nodeBI
                        sI++
                        cursor = 1
                        reads++
                    }

                    // Property Level//
                    if ((sI - reads) % data0PropDataLength == 0) {
                        chunkStartI = (sI - cursor)
                        // var prop = ((sI-reads) - ( data0PropDataLength * propsPerNode * node_i)) / data0PropDataLength;//property index number of chunk
                        // ->> Property Selection > buffer identifyer

                        var propBI = this.data[sI]
                        measureData[mI++] = propBI
                        sI++
                        cursor++
                        reads++

                        dataPos = ((sI - cursor) - chunkStartI)
                        data0Pos = dataPos
                        data0PosI = sI - data0Pos
                        var endPos = (data0PropDataLength - data0Pos) - 1
                        endPosI = data0PosI + endPos

                        if (reset) {
                            this.data[data0PosI] = continuancePosValData0
                        }

                        sI = this._checkInContinuance(sI, continuance)
                        sI = this._checkOutRevert(sI, skip, revert)
                    }

                    // Data Level//
                    if (mCount > 0) {
                        this.output_utilizeMeasureData(this._dataReturn(mCount, measureData), nodeBI, propBI)
                    } else {
                        return
                    }
                }

                return measureData
            }
            this._dataReturn = function (count, measureData) {
                for (var d = 0; d < count; d++) {
                    var next = 1
                    var nextPos = dataPos + next
                    var nextPosI = data0PosI + nextPos
                    if (nextPos > propDataLength) {
                        if (!revert) {
                            break
                        } else {
                            d--
                            sI = data0PosI + continuancePosValData0
                            this._updateDataPos(sI)
                        }
                    } else if (this.data[nextPosI] == leap) {
                        sI = endPosI
                        this._updateDataPos(sI)
                        break
                    } else {
                        sI = nextPosI
                        this._updateDataPos(sI)
                        measureData[mI++] = this.data[sI]
                    }
                }
                sI = endPosI
                this._updateDataPos(sI)
                return measureData
            }
            // //measure

            _accessed = true
            this.arguments = {
                continuance: continuance,
                skip: skip,
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
            for (var bDI = 0; bDI < alen; bDI++) {
                data[bDI] = arr[bDI]
            }
            return data
        }

        // passing the length to access constructor
        this.access.prototype.length = this.length
    }

    // aquire the stream length once : new streaming(number);
    this.constructor.prototype.length = this.constructor.prototype.length || arguments[0]
    // passing the length to open constructor
    this.open.prototype.length = this.constructor.prototype.length
    // return ref/open a stream for buffing
    return this.open()
}
