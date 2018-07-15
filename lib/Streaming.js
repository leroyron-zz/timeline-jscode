/**
 * Streaming
 * @author leroyron / http://leroy.ron@gmail.com
 * //Streaming for javascript's linear parallelity
 */
var Streaming = Streaming || function () {
    this.open = this.open || function () {
        this.build = function (callback) {
            try {
                // release the rest of the queues
                // because the data stream array dosen't
                // have the capability to resize yet-
                this.stream = this.bindings.stream
                this.nodesPerStream = this.bindings.nodesPerStream
                this.propsPerNode = this.bindings.propsPerNode
                this.propsPerNodeList = this.bindings.propsPerNodeList
                this.propDataLength = this.bindings.propDataLength
                this.continuancePosValData0 = 1
                this.data0PropDataLength = this.continuancePosValData0 + this.propDataLength
                this.nodeDataLength = this.data0PropDataLength * this.propsPerNode + this.propsPerNode + 1
                this.proxy = this.bindings.proxy

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
                console.log('Like what you see? We\'er looking for developers! https://github.com/leroyron/timeline-jscode')
            }
        }
        this.access = this.access || function (setcontinuance, setskip, setrCount, settCount, setrevert, setmCount, setleap, setreset) {
            // stream reading environment vars
            var continuance = setcontinuance || true
            var skip = setskip || 0
            var rCount = setrCount || 0
            var tCount = settCount || 0
            var revert = setrevert || true
            var mCount = setmCount || 0
            var leap = setleap || -999999
            var reset = setreset || false
            var _accessed = false
            // changeable
            this.defaults = {}
            this.readCount = 0
            this.thrustCount = 0
            this.measureCount = 0
            this.nextRuntimeCallback = 0
            this.runtimeCalls = []
            this.ruclen = 0
            var instantRuntimeCallbacks = function (count) {
                let next = propDataLength
                let check = 0
                for (let r = 0; r < this.ruclen; r++) {
                    check = this.runtimeCalls[r][1](this.runtimeCalls[r][0] || this.nextRuntimeCallback, count, 0)
                    if (check && check < next) next = check
                }
                this.nextRuntimeCallback = next
                if (this.block) this.readCount = this.thrustCount = this.block = 0

                this.runtimeCallbacks = forwardRuntimeCallbacks
            }
            var forwardRuntimeCallbacks = function (count) {
                // this._currentDataPos(2) get current data position continuance
                if (count + this.data[2] <= this.nextRuntimeCallback || count + this.data[2] > propDataLength) return
                let next = propDataLength
                let check = 0
                for (let r = 0; r < this.ruclen; r++) {
                    check = this.runtimeCalls[r][1](this.runtimeCalls[r][0] || this.nextRuntimeCallback, count, this.data[2])
                    if (check && check < next) next = check
                }
                this.nextRuntimeCallback = next
                if (this.block) this.readCount = this.thrustCount = this.block = 0
            }
            this.runtimeCallbacks = instantRuntimeCallbacks
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
                // this._syncOffsets(count)
            }
            this._update = function (setcontinuance, setskip, setrCount, settCount, setrevert, setmCount, setleap, setreset) {
                continuance = setcontinuance
                skip = setskip
                rCount = setrCount
                tCount = settCount
                revert = setrevert
                mCount = setmCount
                leap = setleap
                reset = setreset
                //this.updateCallbacks()
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

            this._resetLeap = function () {
                setBind = this.bindings.ids[nodeBsIK]
                setBindProperty = setBind[propBsIK]
                leapPos = setBind.node[stream][setBindProperty.binding].leapNext
                setLeapList = setBind.node[stream][setBindProperty.binding].leap
                if (!setLeapList) { return }
                let setLeapLength = setLeapList.length
                for (let l = 0; l < setLeapLength; l++) {
                    if (setLeapList[l]) {
                        setBind.node[stream][setBindProperty.binding].leapNext = l
                        break
                    } else {

                    }
                }
            }

            // process
            this.option = 'Change the streaming process'
            this.method = 'Change the streaming process'
            this._process = function (val) {
                switch (this.option) {
                case 'thrust':
                    this.thrustCount = val + tCount
                    this.runtimeCallbacks(this.thrustCount)
                    switch (this.method) {
                    case 'all':
                        this._thrustAll(this.thrustCount)
                        break
                    case 'nodes':
                        this._thrustNodes(this.thrustCount, arguments[2])
                        break
                    case 'properties':
                        this._thrustProperties(this.thrustCount, arguments[2])
                        break
                    case 'mix':
                        this._thrustMix(this.thrustCount, arguments[2])
                        break
                    default:
                        this._thrustAll(this.thrustCount)
                        break
                    }
                    break
                case 'read':
                    this.readCount = val + rCount
                    this.runtimeCallbacks(this.readCount)
                    switch (this.method) {
                    case 'all':
                        this._readAll(this.readCount)
                        break
                    case 'nodes':
                        this._readNodes(this.readCount, arguments[2])
                        break
                    case 'properties':
                        this._readProperties(this.readCount, arguments[2])
                        break
                    case 'mix':
                        this._readMix(this.readCount, arguments[2])
                        break
                    default:
                        this._readAll(this.readCount)
                        break
                    }
                    break
                case 'measure':
                    // measure
                    // ToDo - use webworker
                    this.measureCount = val + mCount
                    this.runtimeCallbacks(this.measureCount)
                    switch (this.method) {
                    case 'all':
                        return [this._measureAll(this.measureCount)]
                    case 'nodes':
                        return [this._measureNodes(this.measureCount, arguments[2])]
                    case 'properties':
                        return [this._measureProperties(this.measureCount, arguments[2])]
                    case 'mix':
                        return [this._measureMix(this.measureCount, arguments[2])]
                    default:
                        return [this._measureAll(this.measureCount)]
                    }
                default:
                    break
                }
            }
            // read
            this.output_utilizeReadValues = 'Data entry portal for execute, ref this to outer functions'
            // thrust
            this.output_utilizeThrustValues = 'Data entry portal for execute, ref this to outer functions'
            // measure
            // ToDo - use webworker
            this.output_utilizeMeasureValues = 'Data entry portal for execute, ref this to outer functions'

            // //Common Vars and _functions that are used for thrust and measuring
            // "*I" indicates data index
            // "sI" indicates the stream index position
            // "*BsIK" indicates the bind index key in the stream array
            // cursor counts up start for offset reads
            // reads counts up for data reads
            // Procedure when edit programming stream:
            // When changes are being done, consider that syncing maybe triggered to adjust offset and continuance values for the data sets. // this._syncOffsets
            var sI = 0
            var partition = 0
            var cursor = 0
            var reads = 0
            var partFrac = 0
            var chunkStartI = 0
            var dataPos, dataPosI, endPosI
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

                return dataPos
            }
            this._checkOutRevertCallback = function (modskip) {
                let mS = modskip || skip
                if (!revert) {
                    return sI
                }

                this.data[dataPosI] = dataPos = this.reversion(dataPos + mS)

                this.output_revertCall(continuancePosValData0)
                this.revertCallbacks(continuancePosValData0, dataPos)
                return dataPos
            }

            this.output_revertCall = 'Data entry portal for execute, ref this to outer functions'

            // values from stream pair up and bind
            var setBind, setBindProperty
            var leapPos, setLeapNext, setLeapList, setLeapBind, leapPosI
            this._callOutLeap = function (nextPos) {
                // let setBind = this.bindings.ids[nodeBsIK]
                // let setBindProperty = setBind[propBsIK]
                let setLeapNext = setBind.node[stream][setBindProperty.binding].leapNext
                let setLeapList = setBind.node[stream][setBindProperty.binding].leap
                if (!setLeapList[leapPos]) { return }
                let setLeapBind = setLeapList[setLeapNext]
                let leapPosI = setLeapBind.dataPosI
                // if (!setLeapBind) { return }
                this.data[leapPosI] = !setLeapBind.dispose ? this.arguments.leap : setLeapBind.zeroIn ? setLeapBind.zeroIn : this.data[leapPosI + 1]// b.Zero out data
                setLeapBind.callback.apply(setBind.node[stream])
                if (setLeapBind.dispose) {
                    setBind.node[stream][setBindProperty.binding].leapNext = undefined
                    setLeapList[leapPos] = null
                    delete setLeapList[leapPos]
                }

                let setLeapLength = setLeapList.length
                for (let l = leapPos + 1; l < setLeapLength; l++) {
                    if (setLeapList[l]) {
                        setBind.node[stream][setBindProperty.binding].leapNext = l
                        if (l <= nextPos) {
                            leapPos = l
                            this._callOutLeap(l)
                        }
                        // break
                    } else {

                    }
                }
                // leapPos
            }
            // //

            // //Reading stores
            this._readAll = function (count) {
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
                        // sI = this._checkOutRevert(count)
                    }
                    setBind = this.bindings.ids[nodeBsIK]
                    setBindProperty = setBind[propBsIK]
                    leapPos = setBind.node[stream][setBindProperty.binding] ? setBind.node[stream][setBindProperty.binding].leapNext : setBind.node[stream][setBindProperty.property].leapNext
                    if (nodeBsIK == -1) {
                        sI = endPosI
                        this._updateDataPos()
                    } else if (dataPos + count > propDataLength - 1) {
                        if (dataPos + count >= leapPos)
                        {
                            this._callOutLeap(dataPos + count);
                            // data[nextPosI] = data[nextPosI + 1] // b.Zero out data
                            // get data from previous
                        }
                        if (!revert) {

                        } else {
                            if (nodeBsIK != 101) this._checkOutRevert(count)
                            else this._checkOutRevertCallback(count)
                        }
                        this._resetLeap()
                    } else if (count > 0) {
                        // Data Level//
                        /*setBind = this.bindings.ids[nodeBsIK]
                        setBindProperty = setBind[propBsIK]
                        leapPos = setBind.node[stream][setBindProperty.binding] ? setBind.node[stream][setBindProperty.binding].leapNext : setBind.node[stream][setBindProperty.property].leapNext*/
                        this.output_utilizeReadValues(this._dataVal(count), nodeBsIK, propBsIK)
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
                if (nextPos >= leapPos) {
                    if (continuance) {
                        this.data[dataPosI] = nextPos// a.store offset
                    }
                    this._callOutLeap(nextPos)
                    // this.data[nextPosI] = this.data[nextPosI + 1] // b.Zero out data
                    // get data from previous
                } else {
                    sI = nextPosI
                    this._updateDataPos()
                    this.data[dataPosI] = nextPos// a...
                    val = this.data[sI]
                }
                sI = endPosI
                this._updateDataPos()
                return val
            }
            // //read

            // //Thrusting stores dataoffsets and zeros out data
            this._thrustAll = function (count) {
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
                        // sI = this._checkOutRevert()
                    }

                    setBind = this.bindings.ids[nodeBsIK]
                    setBindProperty = setBind[propBsIK]
                    leapPos = setBind.node[stream][setBindProperty.binding] ? setBind.node[stream][setBindProperty.binding].leapNext : setBind.node[stream][setBindProperty.property].leapNext
                    if (nodeBsIK == -1) {
                        sI = endPosI
                        this._updateDataPos()
                    } else if (dataPos + count > propDataLength - 1) {
                        if (dataPos + count >= leapPos)
                        {
                            this._callOutLeap(dataPos + count);
                            // data[nextPosI] = data[nextPosI + 1] // b.Zero out data
                            // get data from previous
                        }
                        if (!revert) {

                        } else {
                            if (nodeBsIK != 101)
                                this._checkOutRevert(count)
                            else
                                this._checkOutRevertCallback(count)
                        }
                        this._resetLeap()
                    } else if (count > 0) {
                        // Data Level//
                        
                        this.output_utilizeThrustValues(this._dataSum(count), nodeBsIK, propBsIK)
                    } else {
                        return
                    }
                }
            }
            this._dataSum = function (count) {
                var sums = 0
                let next = count
                let nextPos = dataPos + next
                let nextPosI = dataPosI + nextPos
                if (nextPos >= leapPos) {
                    if (continuance) {
                        this.data[dataPosI] = nextPos// a.store offset
                    }
                    this._callOutLeap(nextPos)
                    // this.data[nextPosI] = this.data[nextPosI + 1] // b.Zero out data
                    // get data from previous
                }
                for (let d = 0; d < count; d++) {
                    next = d + 1
                    nextPos = dataPos + next
                    nextPosI = dataPosI + nextPos
                    sI = nextPosI
                    sums += this.data[sI]
                    // this.data[sI] = 0// b...
                }
                this.data[dataPosI] = nextPos// a...
                sI = endPosI
                this._updateDataPos()
                return sums
            }
            // //thrust

            // //Measuring gathers data for use
            var mI = 0
            var measureData
            // ToDo - for webworker
            this._measureAll = function (count) {
                measureData = new Float32Array(new ArrayBuffer(count * propsPerNode + propsPerNode + 1 * nodesPerStream * 4))
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
                    } else if (dataPos + count > propDataLength - 1) {
                        if (!revert) {

                        } else {
                            if (nodeBsIK != 101)
                                {this._checkOutRevert(count)}
                            else
                                {this._checkOutRevertCallback(count)}
                        }
                        this._resetLeap()
                    } else if (count > 0) {
                        // Data Level//
                        setBind = this.bindings.ids[nodeBsIK]
                        setBindProperty = setBind[propBsIK]
                        leapPos = setBind.node[stream][setBindProperty.binding] ? setBind.node[stream][setBindProperty.binding].leapNext : setBind.node[stream][setBindProperty.property].leapNext
                        this.output_utilizeMeasureValues(this._dataReturn(count), nodeBsIK, propBsIK)
                    } else {
                        return
                    }
                }

                return measureData
            }
            this._dataReturn = function (count) {
                let next = count
                let nextPos = dataPos + next
                let nextPosI = dataPosI + nextPos
                if (nextPos >= leapPos) {
                    if (continuance) {
                        this.data[dataPosI] = nextPos// a.store offset
                    }
                    this._callOutLeap(nextPos)
                    // this.data[nextPosI] = this.data[nextPosI + 1] // b.Zero out data
                    // get data from previous
                }
                for (let d = 0; d < count; d++) {
                    next = d + 1
                    nextPos = dataPos + next
                    nextPosI = dataPosI + nextPos
                    sI = nextPosI
                    measureData[mI++] = this.data[sI]
                }
                this.data[dataPosI] = nextPos// a...
                sI = endPosI
                this._updateDataPos()
            }
            // //measure

            this._syncOffsets = function (syncI) {
                var syncIS = 0
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
                        nodeBsIK = this.data[sI]
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

                        syncIS = 0
                        let setBind = this.bindings.ids[nodeBsIK]
                        let setBindProperty = setBind[propBsIK]
                        let shift = setBind.node[stream][setBindProperty.binding] ? setBind.node[stream][setBindProperty.binding]._shift : setBind.node[stream][setBindProperty.property]._shift
                        // shift = shift > 0 ? shift : this._checkOutRevert(propDataLength + shift)
                        syncIS = syncI + shift
                        if (syncIS > propDataLength) {
                            syncIS = this.reversion(syncIS)
                        }
                    }

                    this.data[dataPosI] = syncIS// a.
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
            var data = new Float32Array(new ArrayBuffer(alen * 4))
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
