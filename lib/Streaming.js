/**
 * Streaming
 * @author leroyron / http://leroy.ron@gmail.com
 * //Streaming for javascript's linear parallelity
 */
var Streaming = Streaming || function () {
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
                console.log('Oh! You like to see what\'s under the hood! If you like what you see? https://github.com/leroyron/timeline-jscode')
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

            this.loadData = function (stream, data, nodeDataLength, propDataLength, offset) {
                let continuancePosValData0 = 1
                let data0PropDataLength = continuancePosValData0 + propDataLength
                for (
                    sI = 0,
                    partition = 0,
                    partFrac = 0,
                    cursor = 0,
                    reads = 0;
                    sI < data.length;
                    sI++
                    ) {
                    // Node Level//
                    if ((sI - partition) % nodeDataLength == 0) {
                        // var node_i = sI/nodeDataLength;//node index number
                        // ->> Node Selection > buffer identifier
                        nodeBsIK = data[sI]
                        sI++
                        cursor = 1
                        reads++
                    }

                    // Property Level//
                    if ((sI - reads) % data0PropDataLength == partFrac) {
                        chunkStartI = (sI - cursor)
                        // var prop = ((sI-reads) - ( data0PropDataLength * propsPerNode * node_i)) / data0PropDataLength;//property index number of chunk
                        // ->> Property Selection > buffer identifier

                        propBsIK = data[sI]
                        sI++
                        cursor++
                        reads++

                        dataPos = ((sI - cursor) - chunkStartI)
                        dataPosI = sI - dataPos
                        let endPos = (data0PropDataLength - dataPos) - 1
                        endPosI = dataPosI + endPos
                    }

                    let setBind = this.bindings.ids['_bi' + nodeBsIK]
                    let setBindProperty = setBind[propBsIK]
                    let data0PosI = setBind.node[stream][setBindProperty.binding].data0PosI
                    for (let l = 0; l < propDataLength; l++) {
                        this.data[data0PosI + offset + l] = data[sI]// a...
                        sI++
                    }
                    // sI = endPosI
                    // this._updateDataPos()
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
