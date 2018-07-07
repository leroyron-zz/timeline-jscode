/**
 * AddOn: runtime binding
 * //Object and property binding
 * //binding nodes and their properties to the stream data
 * //allowing pre-buffing and sub-node collections and their properties
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Streaming) {
    var _struct = Streaming.prototype
    var _runtime = _struct.addon.runtime
    var that = _struct.addon.binding = {}
    var dataType = ''
    that.buffIdKey = 800
    that.propIdKey = 801
    that.init = function () {
        _runtime.access.defaults.relative = _runtime.access.defaults.relative || false
        _runtime.access.bindings = _runtime[arguments[0]] = _runtime[arguments[0]] ||
            {
                stream: arguments[0],
                data: [],
                nodesPerStream: 0,
                propsPerNode: arguments[3] ? arguments[3].length : arguments[2] ? arguments[2].length : 0,
                propDataLength: _struct.length,
                propsPerNodeList: [],
                state: 'prebuff',
                continuancePosValData0: 1,
                reversion: function (dataPos) {
                    return dataPos - (this.propDataLength * (dataPos / this.propDataLength << 0)) + this.continuancePosValData0
                },
                proxy: 0
            }
        if (_runtime[arguments[0]].proxy === 0) { _runtime[arguments[0]].proxy++; _runtime[arguments[0]].proxy = this.proxy() }
        let runtimePropsPerNodeList = _runtime.access.bindings.propsPerNodeList
        //let runtimeLastPropsPerNode = runtimePropsPerNodeList.length - 1
        _runtime[arguments[0]].nodesPerStream += arguments[1].length

        let stream = arguments[0]
        let streamBuild = _runtime[stream]
        streamBuild['length'] = streamBuild['length'] || _struct.length
        streamBuild['ids'] = streamBuild['ids'] || {}
        let objs = arguments[1]
        let propDataLength = _struct.length
        let initObj = objs[0]
        let initProp = initObj[0]
        initProp.type = initProp.type ? initProp.type == 'translation' ||
        initProp.type == 'radian' ||
        initProp.type == 'poly' ||
        initProp.type == 'uniform' ||
        initProp.type == 'position' ||
        initProp.type == 'rotation' ||
        initProp.type == 'scale' ||
        initProp.type == 'f' ||
        initProp.constructor.name == 'Vector3' ||
        initProp.constructor.name == 'Euler'
            ? initProp.type
            : arguments[2][0][0]
        : arguments[2][0][0] // type for conversion precision

        dataType = initProp.type = Math.Type.identify(initProp)

        // these keys are used to tweak/control runtime operations
        that.buffIdKey = that.buffIdKey || 800
        that.propIdKey = dataType == 'radian' ? 806 : 801
        // Note: for position 'x' is identified as 801, 'y' as 802 and 'z' as 803
        //           rotation 'x' is identified as 804, 'y' as 805 and 'z' as 806
        // Example: In timeframe - if (property == 806) setBind.node.blockCallback = false // release rotation for callback z bind
        
        let relative = arguments[4] || _runtime.access.defaults.relative
        let nodes = []

        while (objs.length > 0) {
            let buffKey = initObj[1] || that.buffIdKey

            let props = dataType == 'poly'
                ? Math.Poly.generate(dataType, arguments[2][0][1])
                : Math.Type.convertToTypeData(dataType, arguments[2].concat(), 1, 2)
            let pkeys = dataType == 'poly'
                ? Math.Poly.generateKeys(arguments[2][0][1], arguments[3]
                                                             ? arguments[3][0]
                                                             : that.propIdKey)
                : arguments[3]
                  ? arguments[3].concat()
                  : Math.Poly.generateKeys(arguments[2], arguments[3]
                                                         ? arguments[3][0]
                                                         : that.propIdKey)

            // comment out for dynamic keys
            // if (runtimePropsPerNodeList[runtimeLastPropsPerNode] != pkeys.length)
            runtimePropsPerNodeList[buffKey] = pkeys.length
            var nodePos = streamBuild.data.length;
            streamBuild.propsPerNode = pkeys.length > streamBuild.propsPerNode ? pkeys.length : streamBuild.propsPerNode

            streamBuild['ids']['_bi' + buffKey] = new function (pkeys) {
                initProp = initProp || {}
                var Exec = function () {
                    this.binding = '_bi' + buffKey
                    this.position = nodePos
                    this.relative = relative
                    this.conversion = dataType
                    this.then = _execThen
                    this.keep = _execKeep
                    this.wait = _execWait
                    this.hold = _execHold
                    this.pair = _execPair
                    this.shift = _execShift
                    this.break = _execBreak
                    this.at = _execAt

                    var protoConstruct = this.__proto__ || Object.getPrototypeOf(this)
                    for (let construct in protoConstruct) {
                        this[construct] = protoConstruct[construct]
                        delete protoConstruct[construct]

                        /* for (let proto in this[construct].prototype) {
                            this[construct][proto] = this[construct].prototype[proto]
                            delete this[construct].prototype[proto]
                        } */
                    }

                    if (this instanceof Exec) {
                        return this.exec
                    } else {
                        return new Exec()
                    }
                }

                streamBuild.data.push(that.buffIdKey = buffKey)// For the node slot, assign buffIdKey for ensure consistency & no conflict
                that.buffIdKey++ // increment
                while (props.length > 0) {
                    let propKey = pkeys[0] || that.propIdKey
                    this[propKey] = new function (props) {
                        // TO-DO rework binding for all or future demos, uniform scheme
                        this['binding'] = dataType != 'poly' && initProp[props[0][0]] && typeof initProp[props[0][0]].value != 'undefined' ? (function (propKeyObj) { propKeyObj['property'] = props[0][0]; return 'value' })(this) : props[0][0]
                        props[0][1] = props[0][1] || 0
                        this['value'] = props[0][1]

                        if (dataType != 'poly' && initProp[props[0][0]] && typeof initProp[props[0][0]].value != 'undefined') initProp[props[0][0]].value = props[0][1]
                        else initProp[props[0][0]] = props[0][1]// Assign starting value to both stream value and node property

                        Exec.prototype[props[0][0]] = function (val, ease, duration, leapCallback, reassign, dispose, zeroIn, skipLeap) {
                            this.then(val, ease, duration, leapCallback, reassign, dispose, zeroIn, skipLeap, this)
                            return this
                        }
                        Exec.prototype[props[0][0]].lastOffset = Exec.prototype[props[0][0]]._shift = 0
                        Exec.prototype[props[0][0]].lastVal = undefined
                        Exec.prototype[props[0][0]].binding = propKey
                        Exec.prototype[props[0][0]].data0PosI = streamBuild.data.length + 1

                        Exec.prototype[props[0][0]].node = initProp

                        Exec.prototype[props[0][0]].then = function /* _then */(val, ease, duration, leapCallback, reassign, dispose, zeroIn, skipLeap) {
                            this.node[stream].then(val, ease, duration, leapCallback, reassign, dispose, zeroIn, skipLeap, this)
                            return this.node[stream]
                        }
                        Exec.prototype[props[0][0]].keep = function /* _then */(leapCallback, reassign, dispose, zeroIn, skipLeap) {
                            this.node[stream].keep(leapCallback, reassign, dispose, zeroIn, skipLeap, this)
                            return this.node[stream]
                        }
                        Exec.prototype[props[0][0]].wait = function /* _wait */(duration, leapCallback, reassign, dispose, zeroIn, skipLeap) {
                            this.node[stream].wait(duration, leapCallback, reassign, dispose, zeroIn, skipLeap, this)
                            return this.node[stream]
                        }
                        Exec.prototype[props[0][0]].hold = function /* _hold */(duration, leapCallback, reassign, dispose, zeroIn, skipLeap) {
                            // go back in time
                            // duration < 0 length + duration allow reversion
                            this.node[stream].hold(duration, leapCallback, reassign, dispose, zeroIn, skipLeap, this)
                            // then fill to start
                            return this.node[stream]
                        }
                        Exec.prototype[props[0][0]].pair = function /* _pair */(array, leapCallback, reassign, dispose, zeroIn, skipLeap) {
                            // go back in time
                            // duration < 0 length + duration allow reversion
                            this.node[stream].pair(array, leapCallback, reassign, dispose, zeroIn, skipLeap, this)
                            // then fill to start
                            return this.node[stream]
                        }
                        Exec.prototype[props[0][0]].shift = function /* _shift */(shift, leapCallback, reassign, dispose, zeroIn, skipLeap) {
                            this.node[stream].shift(shift, leapCallback, reassign, dispose, zeroIn, skipLeap, this)
                            return this.node[stream]
                        }
                        Exec.prototype[props[0][0]].break = function /* _break */(at, leapCallback, reassign, dispose, zeroIn, skipLeap) {
                            this.node[stream].break(at, leapCallback, reassign, dispose, zeroIn, skipLeap, this)
                            return this.node[stream]
                        }
                        Exec.prototype[props[0][0]].at = function /* _at */(at, leapCallback, reassign, dispose, zeroIn, skipLeap) {
                            this.node[stream].at(at, leapCallback, reassign, dispose, zeroIn, skipLeap, this)
                            return this.node[stream]
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

                initProp[stream] = new Exec()
                delete initProp.type
                this.node = initProp
                nodes.push(this.node)
            }(pkeys)

            objs.shift()
        }

        return nodes
    }

    that.list = []
    that.queue = function () {
        let objs = arguments[1]
        let initObj = objs[0]
        let initProp = initObj[0]
        initProp = initProp || {}
        initProp.type = initProp.type ? initProp.type == 'translation' ||
        initProp.type == 'radian' ||
        initProp.type == 'poly' ||
        initProp.type == 'uniform' ||
        initProp.type == 'position' ||
        initProp.type == 'rotation' ||
        initProp.type == 'scale' ||
        initProp.type == 'f' ||
        initProp.constructor.name == 'Vector3' ||
        initProp.constructor.name == 'Euler'
            ? initProp.type
            : arguments[2][0][0]
        : arguments[2][0][0] // type for conversion precision

        let dataType = initProp.type = Math.Type.identify(initProp)

        let nodes = []
        let oi = 0

        let propsPerNode = arguments[2][0][0] == 'poly' ? arguments[2][0][1].length : arguments[3] ? arguments[3].length : arguments[2] ? arguments[2].length : 0
        that.list = that.list
        that.list[propsPerNode] = that.list[propsPerNode] || []

        while (objs.length > oi) {
            let props = dataType == 'poly'
                ? Math.Poly.generate(dataType, arguments[2][0][1])
                : arguments[2]

            let pi = 0
            while (props.length > pi) {
                if (dataType != 'poly' && objs[oi][0][props[pi][0]] && typeof objs[oi][0][props[pi][0]].value != 'undefined') objs[oi][0][props[pi][0]].value = props[pi][1]
                else if (dataType != 'poly') objs[oi][0][props[pi][0]] = props[pi][1]

                pi++
            }

            this.node = objs[oi][0]
            nodes.push(this.node)
            oi++
        }

        that.list[propsPerNode].push(arguments)
        // queue must be listed highest to lowest propsPerNode, steaming algorithm partFrac = sI % data0PropDataLength, partitioning sections of read data
        return nodes
    }
    that.proxy = function () {
        var element = {value: 0}
        // // Simple Bind and Buffering
        this.init('timeline', [
        [element, 101]
        ],
            [
            ['value', 0, _struct.length]
            ],
        [102],
        false)
        return element
    }

    that.run = function (callback, This) {
        console.log('Binding objects to stream - Running queue')
        let list = that.list
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
    this.execNode = 0
    this.execBinding = 0
    var _assignExec = function (This, who, _called) {
        var called = !_called.node ? This[who].caller : _called

        var access = _runtime.access
        This.execNode = access.bindings.ids[This.binding].node || This.execNode
        This.execBinding = called ? access.bindings.ids[This.binding][called.binding].binding : This.execBinding
        This.execData0PosI = This.execNode[access.stream][This.execBinding].data0PosI
        This.execByteOffset = access.data[This.execData0PosI]
        This.execLastOffset = typeof called.lastOffset != 'undefined' ? called.lastOffset : This.execLastOffset
        This.value = This.execLastVal = typeof called.lastVal != 'undefined' ? called.lastVal : This.execNode[This.execBinding]
        This.array = This.array || new Float32Array(new ArrayBuffer(_runtime.access.propDataLength * 4))

        // to-do called.lastOffset or This.execLastOffset === 0 // start lastoffset over again
        return This
    }
    var _execThen = function (val, ease, duration, leapCallback, reassign, dispose, zeroIn, skipLeap, This) {
        if (val && ease && duration) {
            if (This) {
                This = _assignExec(this, 'then', This)
            } else {
                This = this
            }
            zeroIn = zeroIn || _runtime.access.data[This.execDataPosI]
            _struct.addon.buffer.exec('timeline', [[[This.execNode], [[This.execLastOffset, This.execBinding, val, This.execLastVal, ease, duration]]]], false, undefined, undefined, leapCallback, reassign, dispose, zeroIn, typeof skipLeap == 'undefined' ? true : skipLeap)
            This.execLastOffset += duration
            This.execLastVal += val
        }
        return This
    }
    var _execKeep = function (leapCallback, reassign, dispose, zeroIn, skipLeap, This) {
        if (This) {
            This = _assignExec(this, 'keep', This)
        } else {
            This = this
        }

        var firstDataPosI = This.execData0PosI + 1
        var endDataPosI = firstDataPosI + _runtime.access.propDataLength

        This.execDataPos = This.execLastOffset || 0
        This.execDataPos = This.execDataPos < _runtime.access.propDataLength ? This.execDataPos : _runtime.access._reversion(This.execDataPos)
        This.execDataPosI = This.execData0PosI + This.execDataPos
        This.value = _runtime.access.data[This.execDataPosI]
        _runtime.access.data.fill(This.value, This.execDataPosI, endDataPosI)

        return This
    }
    var _execWait = function (duration, leapCallback, reassign, dispose, zeroIn, skipLeap, This) {
        if (duration) {
            if (This) {
                This = _assignExec(this, 'wait', This)
            } else {
                This = this
            }
            _struct.addon.buffer.valIn('timeline', [This.execNode], [This.execBinding], This.execLastVal, This.execLastOffset, This.execLastOffset + duration, undefined, undefined, leapCallback, reassign, dispose, zeroIn, typeof skipLeap == 'undefined' ? true : skipLeap)
            This.execLastOffset += duration
        }
        return This
    }
    var _execHold = function (duration, leapCallback, reassign, dispose, zeroIn, skipLeap, This) {
        if (duration) {
            var _This = This
            if (This) {
                This = _assignExec(this, 'hold', This)
            } else {
                This = this
            }
            This.execDataPos = This.execLastOffset || This.execByteOffset
            This.execDataPos = This.execDataPos < _runtime.access.propDataLength ? This.execDataPos : _runtime.access._reversion(This.execDataPos)
            This.execDataPosI = This.execData0PosI + This.execDataPos
            This.value = _runtime.access.data[This.execDataPosI]

            var firstDataPosI = This.execData0PosI + 1
            var endDataPosI = firstDataPosI + _runtime.access.propDataLength

            if (duration >= _runtime.access.propDataLength) {
                _execFlood(This.value, firstDataPosI, endDataPosI)
            } else {
                This = _execShift.apply(This, [-duration, leapCallback, reassign, dispose, zeroIn, skipLeap])// check this from chained .at().hold() // would "This" be returned
                var end = This.execDataPosI + duration
                zeroIn = zeroIn || _runtime.access.data[This.execDataPosI]
                if (end > endDataPosI) {
                    end -= _runtime.access.propDataLength
                    zeroIn = _runtime.access.data[end]
                    This.array.set(_runtime.access.data.slice(firstDataPosI, end), 0)
                    _execFlood(This.value, firstDataPosI, end)
                    This.array.set(_runtime.access.data.slice(This.execDataPosI, endDataPosI), This.execDataPosI - firstDataPosI)
                    _execFlood(This.value, This.execDataPosI, endDataPosI)
                    if (leapCallback) _struct.addon.buffer.assignLeap('timeline', [This.execNode], [This.execBinding], true, end - firstDataPosI, leapCallback, reassign, dispose, zeroIn, true)
                } else {
                    zeroIn = _runtime.access.data[end]
                    This.array = _runtime.access.data.slice(This.execDataPosI, end)
                    _execFlood(This.value, This.execDataPosI, end)
                    if (leapCallback) _struct.addon.buffer.assignLeap('timeline', [This.execNode], [This.execBinding], true, end - firstDataPosI, leapCallback, reassign, dispose, zeroIn)
                }
            }
            This.execLastOffset = end || This.execDataPos // check this out// may have to check different chain cases
            // at() to move offset .hold(100, at) // at override? I think not.
            // hold only with duration
        }
        return This
    }
    var _execShift = function (shift, leapCallback, reassign, dispose, zeroIn, skipLeap, This) {
        shift = shift > 0 ? shift : _runtime.access._reversion(_runtime.access.propDataLength + shift)
        if (This) {
            This._shift = shift
            This = _assignExec(this, 'shift', This)
        } else {
            This = this
            This[This.execBinding]._shift += shift
        }

        This.execDataPos = This.execByteOffset + shift
        This.execDataPos = This.execDataPos < _runtime.access.propDataLength ? This.execDataPos : _runtime.access._reversion(This.execDataPos)
        _runtime.access.data[This.execData0PosI] = This.execByteOffset = This.execDataPos
        This.execDataPosI = This.execData0PosI + This.execDataPos

        return This
    }

    var _execBreak = function (at, leapCallback, reassign, dispose, zeroIn, skipLeap, This) {
        // if (at) { // default able
        if (This) {
            This = _assignExec(this, 'break', This)
        } else {
            This = this
        }
        This.execDataPos = at || This.execByteOffset
        This.execDataPos = This.execDataPos < _runtime.access.propDataLength ? This.execDataPos : _runtime.access._reversion(This.execDataPos)
        This.execLastOffset += at || 0
        // }
        return This
    }
    var _execAt = function (at, leapCallback, reassign, dispose, zeroIn, skipLeap, This) {
        // if (at) { // default able
        var shift = This._shift
        if (This) {
            This = _assignExec(this, 'at', This)
        } else {
            This = this
        }
        This.execDataPos = at || This.execByteOffset
        This.execDataPos += shift
        This.execDataPos = This.execDataPos < _runtime.access.propDataLength ? This.execDataPos : _runtime.access._reversion(This.execDataPos)
        This.execDataPosI = This.execData0PosI + This.execDataPos
        zeroIn = _runtime.access.data[This.execDataPosI]
        This.execLastOffset += This.execDataPos || 0
        if (leapCallback) _struct.addon.buffer.assignLeap('timeline', [This.execNode], [This.execBinding], true, at, leapCallback, reassign, dispose, zeroIn, true)
        This.value = zeroIn
        // }
        return This
    }
    var _execPair = function (array, leapCallback, reassign, dispose, zeroIn, skipLeap, This) {
        // if (at) { // default able
        if (This) {
            This = _assignExec(this, 'at', This)
        } else {
            This = this
        }
        var firstDataPosI = This.execData0PosI + 1
        for (var p = 0; p < array.length; p++) {
            _runtime.access.data[firstDataPosI + p] = array[p] ? array[p] : _runtime.access.data[firstDataPosI + p]
        }
        // }
        return This
    }
    var _execFlood = function (val, from, to) {
        //for (var i = from; i < to; i++) {
            //_runtime.access.data[i] = val
        //}
        if (_runtime.access.defaults.relative) _runtime.access.data.fill(0, from, to)
        else _runtime.access.data.fill(val, from, to)
    }
})(this.Streaming)
