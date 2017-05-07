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
                delete this.bindings.state
                delete this.bindings.data

                this._finalize(callback)
            } catch (e) {
                // handle(e)
                console.log('Streaming: No bindings - ref: http://')
            } finally {
                console.log('Streaming: ')
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
            this.revertCallbacks = function (register, count) {
                for (let r = 0; r < this.rrclen; r++) {
                    this.revertCalls[r][1](register || this.revertCalls[r][0], count)
                }
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
            var nodesPerStream, propsPerNode, propDataLength, continuancePosValData0, data0PropDataLength, nodeDataLength, streamDataLength
            this._finalize = function (callback) {
                // Initialization from build
                stream = this.stream
                nodesPerStream = this.nodesPerStream
                propsPerNode = this.propsPerNode
                propDataLength = this.propDataLength
                continuancePosValData0 = this.continuancePosValData0
                data0PropDataLength = this.data0PropDataLength
                nodeDataLength = this.nodeDataLength

                this.nodesPerStream = this.propsPerNode = /* this.propDataLength = this.continuancePosValData0 = */this.data0PropDataLength = this.nodeDataLength = null
                delete this.nodesPerStream
                delete this.propsPerNode
                // delete this.propDataLength
                // delete this.continuancePosValData0
                delete this.data0PropDataLength
                delete this.nodeDataLength

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
            var sI = 0
            var cursor = 0
            var reads = 0
            var chunkStartI = 0
            var dataPos, dataPosI, endPosI
            var deltaRevert = -1
            var nodeBsIK = 0
            var propBsIK = 0
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
                let reversion = (this.data[dataPosI] + mS) / propDataLength << 0
                if (reversion > 0) {
                    let revertPos = (this.data[dataPosI] + mS) - (propDataLength * reversion) + continuancePosValData0
                    let revertPosI = dataPosI + revertPos
                    this.data[dataPosI] = revertPos
                    this._updateDataPos(revertPosI)

                    if (deltaRevert != dataPos) {
                        deltaRevert = dataPos
                        this.output_revertCall(revertPos)
                        this.revertCallbacks(continuancePosValData0, revertPos)
                        setTimeout(function () {
                            deltaRevert = -1
                        }, 1000)
                    }
                    return revertPosI
                } else {
                    sI += mS
                    this._updateDataPos()
                    return sI
                }
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
                        sI = this._checkOutRevert(count)
                        nextPos = dataPos
                        nextPosI = dataPosI + nextPos
                    }
                }
                if (this.data[nextPosI] == leap) {
                    if (continuance) {
                        this.data[dataPosI] = nextPos// a.store offset
                    }
                    // this._callOutLeap(nextPosI)// dosen't workwell because reading steps over
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
                        sI = this._checkOutRevert()
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
                            sI = this._checkOutRevert(next)
                            nextPos = dataPos
                            nextPosI = dataPosI + nextPos
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
                        sI = this._checkOutRevert()
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
                        dataPosI = sI - dataPos
                        let endPos = (data0PropDataLength - dataPos) - 1
                        endPosI = dataPosI + endPos

                        if (reset) {
                            this.data[dataPosI] = continuancePosValData0
                        }

                        sI = this._checkInContinuance()
                        sI = this._checkOutRevert()
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
