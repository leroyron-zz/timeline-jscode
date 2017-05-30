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
    var that = _struct.addon
    that.binding = function () {
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

        let streamClass = arguments[0]
        let streamObj = _runtime[streamClass]
        streamObj['length'] = streamObj['length'] || _struct.length
        streamObj['ids'] = streamObj['ids'] || {}
        let objs = arguments[1]
        let propDataLength = _struct.length
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
            streamObj.propsPerNode = pkeys.length > streamObj.propsPerNode ? pkeys.length : streamObj.propsPerNode

            streamObj['ids']['_bi' + buffKey] = new function (pkeys) {
                objs[0][0] = objs[0][0] || {}
                objs[0][0][streamClass] =
                {
                    binding: '_bi' + buffKey,
                    position: streamObj.data.length,
                    relative: relative,
                    conversion: dataType,
                    precision: dataTypePrecision
                }
                streamObj.data.push(that.buffIdKey = buffKey)// For the node slot, assign buffIdKey for ensure consistency & no conflict
                that.buffIdKey++ // increment
                while (props.length > 0) {
                    let propKey = pkeys[0] || that.propIdKey
                    this[propKey] = new function (props) {
                        this['binding'] = props[0][0]
                        props[0][1] = props[0][1] || 0
                        this['value'] = props[0][1]
                        // debugger
                        objs[0][0][props[0][0]] = props[0][0] == 'value' ? props[0][1] : props[0][1] / dataTypePrecision// Assign starting value to both stream value and node property Math.Type.convertToPrecision(dataType, props[0][1])
                        objs[0][0][streamClass][props[0][0]] =
                        {
                            binding: propKey,
                            data0PosI: streamObj.data.length + 1
                        }
                        streamObj.data.push(propKey)
                        streamObj.data.push(1)// (propDataLength) one extra slot for data0PosI and continuancePosValData0 in stream set a default Data position 1

                        for (let bDI = 0, alen = propDataLength; bDI < alen; bDI++) {
                            if (props[0][2]) {
                                if (relative) {
                                    streamObj.data.push((props[0][2] - props[0][1]) / propDataLength)
                                } else {
                                    streamObj.data.push(props[0][1] + ((props[0][2] - props[0][1]) / propDataLength * bDI))
                                }
                            } else {
                                if (relative) {
                                    streamObj.data.push(0)
                                } else {
                                    streamObj.data.push(props[0][1])
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
})(this.Streaming)
