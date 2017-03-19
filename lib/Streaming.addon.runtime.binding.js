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
        _runtime.access.bindings = _runtime[arguments[0]] = _runtime[arguments[0]] ||
            {
                stream: arguments[0],
                data: [],
                nodesPerStream: 0,
                propsPerNode: arguments[3].length,
                propDataLength: _struct.length,
                state: 'prebuff'
            }
        _runtime[arguments[0]].nodesPerStream += arguments[1].length

        var streamClass = arguments[0]
        var streamObj = _runtime[streamClass]
        streamObj['length'] = streamObj['length'] || _struct.length
        streamObj['ids'] = streamObj['ids'] || {}
        var objs = arguments[1]
        var propDataLength = _struct.length
        var dataType = Math.Type.identify(objs[0][0])
        var dataTypePrecision = arguments[5] || Math.Type.precision(dataType)
        var relative = arguments[4]
        var nodes = []
        while (objs.length > 0) {
            var props = Math.Type.convertToPrecisionData(dataType, arguments[2].concat(), 1, 2)
            var pkeys = arguments[3].concat()
            streamObj['ids']['_bi' + objs[0][1]] = new function (pkeys) {
                objs[0][0] = objs[0][0] || {}
                objs[0][0][streamClass] =
                {
                    binding: '_bi' + objs[0][1],
                    position: streamObj.data.length,
                    relative: relative,
                    conversion: dataType,
                    precision: dataTypePrecision
                }
                streamObj.data.push(objs[0][1])// For the node slot
                while (pkeys.length > 0) {
                    this[pkeys[0]] = new function (props) {
                        this['binding'] = props[0][0]
                        this['value'] = objs[0][0][props[0][0]] = props[0][1] / dataTypePrecision// Assign starting value to both stream value and node property Math.Type.convertToPrecision(dataType, props[0][1])
                        objs[0][0][streamClass][props[0][0]] =
                        {
                            binding: pkeys[0],
                            data0PositionI: streamObj.data.length + 1
                        }
                        streamObj.data.push(pkeys[0])
                        streamObj.data.push(1)// (propDataLength) one extra slot for data0PositionI and continuancePosValData0 in stream set a default Data position 1

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
                }

                this.node = objs[0][0]
                nodes.push(this.node)
            }(pkeys)

            objs.shift()
        }

        return nodes
    }
})(this.Streaming)
