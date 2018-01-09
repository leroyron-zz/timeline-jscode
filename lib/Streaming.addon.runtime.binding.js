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
                }
            }
        let runtimePropsPerNodeList = _runtime.access.bindings.propsPerNodeList
        let runtimeLastPropsPerNode = runtimePropsPerNodeList.length - 1
        _runtime[arguments[0]].nodesPerStream += arguments[1].length

        let stream = arguments[0]
        let streamBuild = _runtime[stream]
        streamBuild['length'] = streamBuild['length'] || _struct.length
        streamBuild['ids'] = streamBuild['ids'] || {}
        let objs = arguments[1]
        let propDataLength = _struct.length
        objs[0][0].type = objs[0][0].type
        ? 
        objs[0][0].type == 'translation' ||
        objs[0][0].type == 'radian' ||
        objs[0][0].type == 'poly' ||
        objs[0][0].type == 'uniform' ||
        objs[0][0].type == 'position' ||
        objs[0][0].type == 'rotation' ||
        objs[0][0].type == 'scale' ||
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

            // comment out for dynamic keys
            // if (runtimePropsPerNodeList[runtimeLastPropsPerNode] != pkeys.length)
            runtimePropsPerNodeList[buffKey] = pkeys.length
            streamBuild.propsPerNode = pkeys.length > streamBuild.propsPerNode ? pkeys.length : streamBuild.propsPerNode

            streamBuild['ids']['_bi' + buffKey] = new function (pkeys) {
                objs[0][0] = objs[0][0] || {}
                var exec = function () {
                    this.binding = '_bi' + buffKey
                    this.position = streamBuild.data.length
                    this.relative = relative
                    this.conversion = dataType
                    this.precision = dataTypePrecision
                    this.then = _execThen

                    for (let construct in this.__proto__) {
                        this[construct] = this.__proto__[construct]
                        delete this.__proto__[construct]

                        /* for (let proto in this[construct].prototype) {
                            this[construct][proto] = this[construct].prototype[proto]
                            delete this[construct].prototype[proto]
                        } */
                    }

                    if (this instanceof exec) {
                        return this.exec
                    } else {
                        return new exec()
                    }
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
                        
                        if (dataType != 'poly' && objs[0][0][props[0][0]] && typeof objs[0][0][props[0][0]].value != 'undefined') objs[0][0][props[0][0]].value = props[0][0] == 'value' ? props[0][1] : props[0][1] / dataTypePrecision
                        else objs[0][0][props[0][0]] = props[0][0] == 'value' ? props[0][1] : props[0][1] / dataTypePrecision// Assign starting value to both stream value and node property Math.Type.convertToPrecision(dataType, props[0][1])

                        exec.prototype[props[0][0]] = function (val, ease, duration, leapCallback, reassign, dispose, zeroIn, skipLeap) {
                            this.then(val, ease, duration, leapCallback, reassign, dispose, zeroIn, skipLeap)
                            return this
                        }
                        exec.prototype[props[0][0]].lastOffset = 0
                        exec.prototype[props[0][0]].lastVal = undefined
                        exec.prototype[props[0][0]].binding = propKey
                        exec.prototype[props[0][0]].data0PosI = streamBuild.data.length + 1
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

                objs[0][0][stream] = new exec()
                delete objs[0][0].type
                this.node = objs[0][0]
                nodes.push(this.node)
            }(pkeys)

            objs.shift()
        }

        return nodes
    }

    that.list = []
    that.queue = function () {
        let objs = arguments[1]
        objs[0][0] = objs[0][0] || {}
        objs[0][0].type = objs[0][0].type
        ? 
        objs[0][0].type == 'translation' ||
        objs[0][0].type == 'radian' ||
        objs[0][0].type == 'poly' ||
        objs[0][0].type == 'uniform' ||
        objs[0][0].type == 'position' ||
        objs[0][0].type == 'rotation' ||
        objs[0][0].type == 'scale' ||
        objs[0][0].type == 'f' ||
        objs[0][0].constructor.name == 'Vector3' ||
        objs[0][0].constructor.name == 'Euler'
            ? objs[0][0].type
            : arguments[2][0][0]
        : arguments[2][0][0] // type for conversion and precision

        let dataType = objs[0][0].type = Math.Type.identify(objs[0][0])

        let dataTypePrecision = 1

        let nodes = []
        let oi = 0

        let propsPerNode = arguments[2][0][0] == 'poly' ? arguments[2][0][1].length : arguments[3] ? arguments[3].length : arguments[2] ? arguments[2].length : 0
        that.list = that.list
        that.list[propsPerNode] = that.list[propsPerNode] || []

        while (objs.length > oi) {
            let props = dataType == 'poly'
                ? Math.Poly.generate(dataType, arguments[2][0][1], dataTypePrecision)
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
    var _execThen = function (val, ease, duration, leapCallback, reassign, dispose, zeroIn, skipLeap) {
        if (val && ease && duration) {
            if (this.then.caller) {
                this.execNode = _struct.addon.runtime.access.bindings.ids[this.binding].node || this.execNode
                this.execBinding = this.then.caller ? _struct.addon.runtime.access.bindings.ids[this.binding][this.then.caller.binding].binding : this.execBinding
                this.execLastOffset = typeof this.then.caller.lastOffset != 'undefined' ? this.then.caller.lastOffset : this.execLastOffset
                this.execLastVal = typeof this.then.caller.lastVal != 'undefined' ? this.then.caller.lastVal : this.execNode[this.execBinding]
            }
            _struct.addon.buffer.exec('timeline', [[[this.execNode], [[this.execLastOffset, this.execBinding, val, this.execLastVal, ease, duration]]]], false, undefined, undefined, leapCallback, reassign, dispose, zeroIn, typeof skipLeap == 'undefined' ? true : skipLeap)
            this.execLastOffset += duration
            this.execLastVal += val
        }
        return this
    }
})(this.Streaming)
