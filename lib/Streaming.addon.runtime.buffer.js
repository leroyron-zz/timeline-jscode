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
    that.eval = function (stream, instructions, relative, precision, get, leapCallback, reassign, dispose, zeroIn, skipLeap) {
        var getData = []
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
                            buff(stream, node, prop, evalData(getset[0], deltaSetOffset, precision || deltaSetOffset), relative, skipLeap)
                            buffOffset += deltaSetOffset
                            valueOffset += prop[2]
                        }
                    }
                }
                // per-node
                if (leapCallback) {
                    that.assignLeap(stream, [node], propSet, false, buffOffset, leapCallback, reassign, dispose, zeroIn)
                }

                if (get) {
                    getData[n] = that.getData(stream, [node], propSet, get)
                }
            }
        }
        that.evals += nodes.length * sets.length
        that.update()
        return getData
    }

    that.assignLeap = function (stream, nodeSet, propSet, exact, at, func, reassign, dispose, zeroIn) {
        var state = _runtime[stream].state
        var access = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access

        var propDataLength = access.propDataLength + 1

        for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
            let nodeBind = nodeSet[n][stream]

            for (let p = 0, plen = propSet.length; p < plen; p++) {
                let prop = propSet[p]

                let nodeBindProp = nodeBind[prop]
                let data0PosI = nodeBindProp.data0PosI

                // byteOffset grabbed from the stream
                let byteOffset = access.data[data0PosI]// accuracy fix go forward (2) in offset

                let leapDataPosIDelta
                if (nodeBindProp.leap) {
                    if (reassign) {
                        leapDataPosIDelta = nodeBindProp.leap.dataPosI
                        access.data[leapDataPosIDelta] = 0
                    }
                }

                nodeBindProp.leap = {callback: func, dataPos: exact ? at : byteOffset + at, dispose: typeof dispose == 'undefined' ? true : dispose, zeroIn: zeroIn}

                let dataPos = nodeBindProp.leap.dataPos
                dataPos = dataPos < propDataLength ? dataPos : access.reversion(dataPos)
                let dataPosI = data0PosI + dataPos
                access.data[dataPosI] = access.arguments.leap

                nodeBindProp.leap.dataPosI = dataPosI
            }
        }
    }

    var buff = function (stream, node, prop, evalData, relative, skipLeap) {
        var nodeVal = node[prop[0]] + valueOffset
        var nodeBind = node[stream]
        var nodeBindProp = nodeBind[prop[0]]
        var data0PosI = nodeBindProp.data0PosI

        var state = _runtime[stream].state
        var access = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access

        // byteOffset grabbed from the stream
        var byteOffset = access.data[data0PosI]
        byteOffset += buffOffset

        var propDataLength = access.propDataLength + 1

        var valProp = prop[2]
        // nodeVal = Math.Type.precision(dataType, nodeVal)

        var data = evalData[0]
        var precision = evalData[1]
        // Check if it fills the stream beyond its current position
        var length = data.length

        for (let ew = 0; ew < length; ew++) {
            let dataPos = byteOffset + ew
            dataPos = dataPos < propDataLength ? dataPos : access.reversion(dataPos)
            let dataPosI = data0PosI + dataPos

            if (skipLeap) {
                if (access.data[dataPosI] == access.arguments.leap) { continue }
            }
            if (relative) {
                access.data[dataPosI] += (data[ew] - (data[ew + 1] || 0)) / (precision / valProp) << 0
            } else {
                access.data[dataPosI] = nodeVal + ((precision - data[ew]) / precision * valProp) << 0
            }
        }

        that.update()
    }

    that.zeroOut = function (stream, from, to, nodeSet, propSet, skipLeap) {
        var state = _runtime[stream].state
        var access = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access

        var propDataLength = access.propDataLength + 1// lapse

        var zeroLength = to - from

        if (nodeSet && propSet) {
            for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
                let nodeBind = nodeSet[n][stream]

                for (let p = 0, plen = propSet.length; p < plen; p++) {
                    let nodeBindProp = nodeBind[propSet[p]]

                    let data0PosI = nodeBindProp.data0PosI

                    for (let ew = 0; ew < zeroLength; ew++) {
                        let dataPos = from + ew
                        dataPos = dataPos < propDataLength ? dataPos : access.reversion(dataPos)
                        let dataPosI = data0PosI + dataPos
                        if (skipLeap) {
                            if (access.data[dataPosI + 1] == access.arguments.leap) { continue }
                        }
                        access.data[dataPosI + 1] = 0
                    }
                }
            }
        } else {
            for (let id in access.bindings.ids) {
                var nodeBinds = access.bindings.ids[id].node[stream]

                for (let prop in nodeBinds) {
                    if (nodeBinds[prop].data0PosI) {
                        let data0PosI = nodeBinds[prop].data0PosI

                        for (let ew = 0; ew < zeroLength; ew++) {
                            let dataPos = from + ew
                            dataPos = dataPos < propDataLength ? dataPos : access.reversion(dataPos)
                            let dataPosI = data0PosI + dataPos

                            if (skipLeap) {
                                if (access.data[dataPosI + 1] == access.arguments.leap) { continue }
                            }
                            access.data[dataPosI + 1] = 0
                        }
                    }
                }
            }
        }
    }

    that.valIn = function (stream, nodeSet, propSet, val, from, to, precision, exact, at, leapCallback, reassign, dispose, zeroIn, skipLeap) {
        var state = _runtime[stream].state
        var access = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access

        var propDataLength = access.propDataLength + 1

        if (nodeSet && propSet) {
            for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
                let nodeBind = nodeSet[n][stream]

                precision = precision || nodeBind.precision
                for (let p = 0, plen = propSet.length; p < plen; p++) {
                    let nodeBindProp = nodeBind[propSet[p]]

                    let data0PosI = nodeBindProp.data0PosI

                    let valLength = to - from

                    for (let ew = 0; ew < valLength; ew++) {
                        let dataPos = from + ew
                        dataPos = dataPos < propDataLength ? dataPos : access.reversion(dataPos)
                        let dataPosI = data0PosI + dataPos
                        if (skipLeap) {
                            if (access.data[dataPosI + 1] == access.arguments.leap) { continue }
                        }
                        access.data[dataPosI + 1] = val * precision
                    }
                }
            }
        }
        if (leapCallback) {
            that.assignLeap(stream, [nodeSet[0]], propSet, exact, at, leapCallback, reassign, dispose, zeroIn)
        }
    }

    that.getData = function (stream, nodeSet, propSet, get, skipLeap) {
        var state = _runtime[stream].state
        var access = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access

        var propDataLength = access.propDataLength + 1

        var obj = []

        for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
            let nodeBind = nodeSet[n][stream]
            obj[n] = {}

            for (let p = 0, plen = propSet.length; p < plen; p++) {
                let prop = propSet[p]

                let nodeBindProp = nodeBind[prop]
                let data0PosI = nodeBindProp.data0PosI

                // byteOffset grabbed from the stream
                let byteOffset = access.data[data0PosI] + 2// accuracy fix go forward (2) in offset

                obj[n][prop] = 0

                for (let ew = 0; ew < get; ew++) {
                    let dataPos = byteOffset + ew
                    dataPos = dataPos < propDataLength ? dataPos : access.reversion(dataPos)
                    let dataPosI = data0PosI + dataPos
                    if (skipLeap) {
                        if (access.data[dataPosI + 1] == access.arguments.leap) { continue }
                    }
                    obj[n][prop] += access.data[dataPosI + 1] / nodeBind.precision
                }
            }
        }
        return obj
    }
    that.injectData = function (stream, nodeSet, propSet, data, inject, skipLeap) {
        var state = _runtime[stream].state
        var access = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access

        var propDataLength = access.propDataLength
        for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
            let nodeBind = nodeSet[n][stream]

            for (let p = 0, plen = propSet.length; p < plen; p++) {
                let nodeBindProp
                let data0PosI
                let byteOffset
                let dataPosI
                let prop

                if (nodeBind.conversion == 'poly') {
                    prop = 'v0'
                    nodeBindProp = nodeBind[prop]
                    data0PosI = nodeBindProp.data0PosI
                    byteOffset = access.data[data0PosI]
                } else {
                    prop = propSet[p]
                    nodeBindProp = nodeBind[prop]
                    data0PosI = nodeBindProp.data0PosI
                    byteOffset = access.data[data0PosI]
                }

                for (let ew = 0; ew < inject; ew++) {
                    let dataPos = byteOffset + ew
                    dataPos = dataPos < propDataLength ? dataPos : access.reversion(dataPos)
                    if (nodeBind.conversion == 'poly') {
                        for (let pi = 0, plen = data.length; pi < plen; pi++) {
                            let polyPropBind = nodeBind['v' + pi]
                            data0PosI = polyPropBind.data0PosI
                            dataPosI = data0PosI + dataPos

                            if (skipLeap) {
                                if (access.data[dataPosI] == access.arguments.leap) { continue }
                            }
                            access.data[dataPosI] = data[pi] * nodeBind.precision
                        }
                    } else {
                        dataPosI = data0PosI + dataPos
                        if (skipLeap) {
                            if (access.data[dataPosI] == access.arguments.leap) { continue }
                        }
                        access.data[dataPosI] = data * nodeBind.precision
                    }
                }
            }
        }
    }
})(this.Streaming)
