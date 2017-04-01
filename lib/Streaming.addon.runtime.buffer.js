/**
 * AddOn: runtime buffer
 * //Time-based easings
 * //Changing node properties
 * //by buffing the stream with values.
 * @author leroyron / http://leroy.ron@gmail.com
 * //_struct.addon: modifies, enhances and accesses
 */
(function (Streaming) {
    var _struct = Streaming.prototype
    var _runtime = _struct.addon.runtime
    var that = _struct.addon.buffer = {evals: 0}
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
    that.eval = function (stream, instructions, relative, precision, get) {
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
                            prop[2] = Math.Type.convertToPrecision(node[stream].conversion, prop[2])
                            buff(stream, node, prop, evalData(getset[0], deltaSetOffset, precision || deltaSetOffset), relative)
                            buffOffset += deltaSetOffset
                            valueOffset += prop[2]
                        }
                    }
                }
                if (get) {
                    return that.getData(stream, node, propSet, get)
                }
            }
        }
        that.evals += nodes.length * nodes.length * sets.length
        that.update()
    }

    var buff = function (stream, node, prop, evalData, relative) {
        var nodeVal = node[prop[0]] + valueOffset
        var nodeBind = node[stream]
        var nodeBindProp = nodeBind[prop[0]]
        var data0PositionI = nodeBindProp.data0PositionI

        var state = _runtime[stream].state
        var assignData = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access

        // byteOffset grabbed from the stream
        var byteOffset = assignData.data[data0PositionI]
        byteOffset += buffOffset

        var propDataLength = assignData.propDataLength + 1

        var continuancePosValData0 = state == 'prebuff'
        ? 1
        : assignData.continuancePosValData0

        var valProp = prop[2]
        // nodeVal = Math.Type.precision(dataType, nodeVal)

        var data = evalData[0]
        var precision = evalData[1]
        // Check if it fills the stream beyond its current position
        var length = data.length

        for (let ew = 0; ew < length; ew++) {
            let dataPos = byteOffset + ew
            let dataPosI = data0PositionI + dataPos
            let reverancy = dataPos / propDataLength << 0
            if (reverancy > 0) {
                let revertPos = dataPos - (propDataLength * reverancy) + continuancePosValData0
                let revertPosI = data0PositionI + revertPos
                dataPosI = revertPosI
            }

            if (relative) {
                assignData.data[dataPosI] += (data[ew] - (data[ew + 1] || 0)) / (precision / valProp) << 0
            } else {
                assignData.data[dataPosI] = nodeVal + ((precision - data[ew]) / precision * valProp) << 0
            }
        }

        that.update()
    }

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

    that.zeroOut = function (stream, from, to) {
        var state = _runtime[stream].state
        var assignData = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access

        var propDataLength = assignData.propDataLength + 1

        var continuancePosValData0 = state == 'prebuff'
        ? 1
        : assignData.continuancePosValData0

        var zeroLength = to - from

        for (let id in assignData.bindings.ids) {
            var nodeBinds = assignData.bindings.ids[id].node[stream]
            for (let prop in nodeBinds) {
                if (nodeBinds[prop].data0PositionI) {
                    let data0PositionI = nodeBinds[prop].data0PositionI

                    for (let ew = 0; ew < zeroLength; ew++) {
                        let dataPos = from + ew
                        let dataPosI = data0PositionI + dataPos
                        let reverancy = dataPos / propDataLength << 0
                        if (reverancy > 0) {
                            let revertPos = dataPos - (propDataLength * reverancy) + continuancePosValData0
                            let revertPosI = data0PositionI + revertPos
                            dataPosI = revertPosI
                        }
                        assignData.data[dataPosI + 1] = 0
                    }
                }
            }
        }
    }

    that.valIn = function (stream, node, prop, val, from, to) {
        var nodeBind = node[stream]

        var state = _runtime[stream].state
        var assignData = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access

        var propDataLength = assignData.propDataLength + 1

        var continuancePosValData0 = state == 'prebuff'
        ? 1
        : assignData.continuancePosValData0

        var nodeBindProp = nodeBind[prop]
        var data0PositionI = nodeBindProp.data0PositionI
        var byteOffset = assignData.data[data0PositionI]

        var valLength = to - from

        for (let ew = 0; ew < valLength; ew++) {
            let dataPos = from + ew
            let dataPosI = data0PositionI + dataPos
            let reverancy = dataPos / propDataLength << 0
            if (reverancy > 0) {
                let revertPos = dataPos - (propDataLength * reverancy) + continuancePosValData0
                let revertPosI = data0PositionI + revertPos
                dataPosI = revertPosI
            }
            assignData.data[dataPosI + 1] = val * nodeBind.precision
        }
    }

    that.getData = function (stream, node, propSet, get) {
        var nodeBind = node[stream]

        var state = _runtime[stream].state
        var assignData = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access

        var propDataLength = assignData.propDataLength + 1

        var continuancePosValData0 = state == 'prebuff'
        ? 1
        : assignData.continuancePosValData0

        var obj = {}
        for (let p = 0, plen = propSet.length; p < plen; p++) {
            let prop = propSet[p]

            let nodeBindProp = nodeBind[prop]
            let data0PositionI = nodeBindProp.data0PositionI

            // byteOffset grabbed from the stream
            var byteOffset = assignData.data[data0PositionI] + 2// accuracy fix go forward (2) in offset

            obj[prop] = 0

            for (let ew = 0; ew < get; ew++) {
                let dataPos = byteOffset + ew
                let dataPosI = data0PositionI + dataPos
                let reverancy = dataPos / propDataLength << 0
                if (reverancy > 0) {
                    let revertPos = dataPos - (propDataLength * reverancy) + continuancePosValData0
                    let revertPosI = data0PositionI + revertPos
                    dataPosI = revertPosI
                }
                obj[prop] += assignData.data[dataPosI + 1] / nodeBind.precision
            }
        }
        return obj
    }
    that.injectDataVal = function (stream, node, prop, val, inject) {
        var nodeBind = node[stream]

        var state = _runtime[stream].state
        var assignData = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access

        var propDataLength = assignData.propDataLength + 1

        var continuancePosValData0 = state == 'prebuff'
        ? 1
        : assignData.continuancePosValData0

        var nodeBindProp = nodeBind[prop]
        var data0PositionI = nodeBindProp.data0PositionI
        var byteOffset = assignData.data[data0PositionI]

        for (let ew = 0; ew < inject; ew++) {
            var dataPos = byteOffset + ew
            var dataPosI = data0PositionI + dataPos
            var reverancy = dataPos / propDataLength << 0
            if (reverancy > 0) {
                let revertPos = dataPos - (propDataLength * reverancy) + continuancePosValData0
                let revertPosI = data0PositionI + revertPos
                dataPosI = revertPosI
            }
            assignData.data[dataPosI] = val * nodeBind.precision
        }
    }
})(this.Streaming)
