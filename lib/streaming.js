/**
 * Streaming
 * @author leroyron / http://leroy.ron@gmail.com
 * //Streaming for javascript's linear parallelity
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
            this.rCount = 0
            this.tCount = 0
            this.mCount = 0
            this.runtimeCalls = []
            this.ruclen = 0
            this.runtimeCallbacks = function (count) {
                for (let r = 0; r < this.ruclen; r++) {
                    this.runtimeCalls[r][1](this.runtimeCalls[r][0], count)
                }
            }
            this.revertCalls = []
            this.rrclen = 0
            this.revertCallbacks = function (count) {
                for (let r = 0; r < this.rrclen; r++) {
                    this.revertCalls[r][1](this.revertCalls[r][0], count)
                }
                deltaRevert = 0
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

            // read
            this.read = function (val, option) {
                this.rCount = val + rCount
                this.runtimeCallbacks(this.rCount)
                switch (option) {
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
            }
            this.output_utilizeReadData = 'Data entry portal for execute, ref this to outer functions'
            // thrust
            this.thrust = function (val, option) {
                this.tCount = val + tCount
                this.runtimeCallbacks(this.rCount)
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
            this.output_utilizeThrustData = 'Data entry portal for execute, ref this to outer functions'
            // measure
            // ToDo - use webworker
            this.measure = function (val, option) {
                this.mCount = val + mCount
                this.runtimeCallbacks(this.rCount)
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
            this.output_utilizeMeasureData = 'Data entry portal for execute, ref this to outer functions'

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
            var deltaRevert = 0
            this._checkInContinuance = function () {
                if (!continuance) {
                    return sI
                }
                sI += this.data[data0PosI]
                this._updateDataPos()
                return sI
            }
            this._updateDataPos = function (modsI) {
                let mI = modsI || sI
                dataPos = ((mI - cursor) - chunkStartI)
                data0PosI = mI - dataPos
            }
            this._checkOutRevert = function (modskip) {
                let mS = modskip || skip
                if (!revert) {
                    return sI
                }
                let reverancy = (this.data[data0PosI] + mS) / propDataLength << 0
                if (reverancy >= 1) {
                    let revertPos = (this.data[data0PosI] + mS) - (propDataLength * reverancy) + continuancePosValData0
                    let revertPosI = data0PosI + revertPos
                    this.data[data0PosI] = revertPos
                    this._updateDataPos(revertPosI)
                    if (deltaRevert != dataPos) {
                        deltaRevert = dataPos
                        this.output_revertCall(revertPos)
                        this.revertCallbacks(revertPos)
                    }
                    return revertPosI
                } else {
                    sI += mS
                    this._updateDataPos()
                    return sI
                }
            }
            this.output_revertCall = 'Data entry portal for execute, ref this to outer functions'
            // //

            // //Reading stores dataoffsets
            this._readAll = function (rCount) {
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
                        var nodeBI = this.data[sI]
                        sI++
                        cursor = 1
                        reads++
                    }

                    // Property Level//
                    if ((sI - reads) % data0PropDataLength == 0) {
                        chunkStartI = (sI - cursor)
                        // var prop = ((sI-reads) - ( data0PropDataLength * propsPerNode * node_i)) / data0PropDataLength;//property index number of chunk
                        // ->> Property Selection > buffer identifier

                        var propBI = this.data[sI]
                        sI++
                        cursor++
                        reads++

                        dataPos = ((sI - cursor) - chunkStartI)
                        data0Pos = dataPos
                        data0PosI = sI - data0Pos
                        let endPos = (data0PropDataLength - data0Pos) - 1
                        endPosI = data0PosI + endPos

                        if (reset) {
                            this.data[data0PosI] = continuancePosValData0
                        }

                        sI = this._checkInContinuance()
                        sI = this._checkOutRevert()
                    }

                    // Data Level//
                    if (rCount > 0) {
                        this.output_utilizeReadData(this._dataVal(rCount), nodeBI, propBI)
                    } else {
                        return
                    }
                }
            }
            this._dataVal = function (count) {
                let val = this.data[sI]
                let next = count
                let nextPos = dataPos + next
                let nextPosI = data0PosI + nextPos
                if (nextPos > propDataLength) {
                    if (!revert) {
                        sI = endPosI
                        this._updateDataPos()
                        return val
                    } else {
                        sI = this._checkOutRevert(count)
                        nextPos = dataPos
                        nextPosI = data0PosI + nextPos
                    }
                }
                if (this.data[nextPosI] == leap) {
                    if (continuance) {
                        this.data[data0PosI] = nextPos// a.store offset
                    }
                    sI = endPosI
                    this._updateDataPos()
                } else {
                    sI = nextPosI
                    this._updateDataPos()
                    this.data[data0PosI] = dataPos// a...
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
                        var nodeBI = this.data[sI]
                        sI++
                        cursor = 1
                        reads++
                    }

                    // Property Level//
                    if ((sI - reads) % data0PropDataLength == 0) {
                        chunkStartI = (sI - cursor)
                        // var prop = ((sI-reads) - ( data0PropDataLength * propsPerNode * node_i)) / data0PropDataLength;//property index number of chunk
                        // ->> Property Selection > buffer identifier

                        var propBI = this.data[sI]
                        sI++
                        cursor++
                        reads++

                        dataPos = ((sI - cursor) - chunkStartI)
                        data0Pos = dataPos
                        data0PosI = sI - data0Pos
                        let endPos = (data0PropDataLength - data0Pos) - 1
                        endPosI = data0PosI + endPos

                        if (reset) {
                            this.data[data0PosI] = continuancePosValData0
                        }

                        sI = this._checkInContinuance()
                        sI = this._checkOutRevert()
                    }

                    // Data Level//
                    if (tCount > 0) {
                        this.output_utilizeThrustData(this._dataSum(tCount), nodeBI, propBI)
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
                    let nextPosI = data0PosI + nextPos
                    if (nextPos > propDataLength) {
                        if (!revert) {
                            break
                        } else {
                            d--
                            sI = data0PosI + continuancePosValData0
                            this._updateDataPos()
                            this.data[data0PosI] = dataPos// a.store offset
                        }
                    } else if (this.data[nextPosI] == leap) {
                        if (continuance) {
                            this.data[data0PosI] = nextPos// a...
                        }
                        this.data[nextPosI] = 0// b.Zero out data
                        sI = endPosI
                        this._updateDataPos()
                        break
                    } else {
                        sI = nextPosI
                        this._updateDataPos()
                        this.data[data0PosI] = dataPos// a...
                        sums += this.data[sI]
                        this.data[sI] = 0// b...
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
                        // ->> Property Selection > buffer identifier

                        var propBI = this.data[sI]
                        measureData[mI++] = propBI
                        sI++
                        cursor++
                        reads++

                        dataPos = ((sI - cursor) - chunkStartI)
                        data0Pos = dataPos
                        data0PosI = sI - data0Pos
                        let endPos = (data0PropDataLength - data0Pos) - 1
                        endPosI = data0PosI + endPos

                        if (reset) {
                            this.data[data0PosI] = continuancePosValData0
                        }

                        sI = this._checkInContinuance()
                        sI = this._checkOutRevert()
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
                for (let d = 0; d < count; d++) {
                    let next = 1
                    let nextPos = dataPos + next
                    let nextPosI = data0PosI + nextPos
                    if (nextPos > propDataLength) {
                        if (!revert) {
                            break
                        } else {
                            d--
                            sI = data0PosI + continuancePosValData0
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
                        sI++
                        cursor = 1
                        reads++
                    }

                    // Property Level//
                    if ((sI - reads) % data0PropDataLength == 0) {
                        chunkStartI = (sI - cursor)
                        // var prop = ((sI-reads) - ( data0PropDataLength * propsPerNode * node_i)) / data0PropDataLength;//property index number of chunk
                        // ->> Property Selection > buffer identifier

                        sI++
                        cursor++
                        reads++

                        dataPos = ((sI - cursor) - chunkStartI)
                        data0Pos = dataPos
                        data0PosI = sI - data0Pos
                        let endPos = (data0PropDataLength - data0Pos) - 1
                        endPosI = data0PosI + endPos

                        if (reset) {
                            this.data[data0PosI] = continuancePosValData0
                        }

                        sI = this._checkInContinuance()
                        sI = this._checkOutRevert()
                    }

                    this.data[data0PosI] = syncI// a.
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
