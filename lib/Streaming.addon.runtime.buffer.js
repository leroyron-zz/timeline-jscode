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
        _runtime.access.defaults.relative = _runtime.access.defaults.relative || false
        relative = relative || _runtime.access.defaults.relative
        var getData = []
        for (let e = 0, elen = instructions.length; e < elen; e++) {
            let options = instructions[e]
            var nodes = options[0]
            var nlen = nodes.length
            let sets = options[2]
            var slen = sets.length
            let blend = options[3]
            let propSet = []

            for (let n = 0; n < nlen; n++) {
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

                        for (let s = 0; s < slen; s++) {
                            sets[s][1] <<= 0 // round off to plug in 32intArrayBuffer
                            sumDurations += sets[s][1]
                        }
                        for (let s = 0; s < slen; s++) {
                            let getset = sets[s]
                            deltaSetOffset = getset[1]
                            prop[2] = prop[1] * (deltaSetOffset / sumDurations)
                            prop[2] = Math.Type.convertToPrecisionType(node[stream].conversion, prop[2])
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
        that.evals += nlen * slen
        that.update()
        return getData
    }

    that.exec = function (stream, instructions, relative, precision, get, leapCallback, reassign, dispose, zeroIn, skipLeap) {
        _runtime.access.defaults.relative = _runtime.access.defaults.relative || false
        relative = relative || _runtime.access.defaults.relative
        var getData = []
        for (let e = 0, elen = instructions.length; e < elen; e++) {
            var options = instructions[e]
            var nodes = options[0]
            let chains = options[1]
            let propSet = []

            for (let n = 0, nlen = nodes.length; n < nlen; n++) {
                let node = nodes[n]
                buffOffset = 0
                valueOffset = 0

                for (let ci = 0, cilen = chains.length; ci < cilen; ci++) {
                    let chain = chains[ci]
                    let blend = chain[0]
                    let prop = [propSet[ci] = chain[1], chain[2]]
                    let getset = [chain[4], chain[5]]
                    valueOffset += Math.Type.convertToPrecisionType(node[stream].conversion, chain[3]) || 0

                    buffOffset = 0
                    if (blend) {
                        if (blend == 1) { // true or 1
                            buffOffset -= deltaSetOffset
                        } else if (blend > 1 || blend < 1) {
                            buffOffset += blend
                        }
                    }

                    deltaSetOffset = getset[1]
                    prop[2] = Math.Type.convertToPrecisionType(node[stream].conversion, prop[1])
                    buff(stream, node, prop, evalData(getset[0], deltaSetOffset, precision || deltaSetOffset), relative, skipLeap, true)
                    buffOffset += deltaSetOffset
                }
                // per-node
                if (leapCallback) {
                    that.assignLeap(stream, [node], [propSet], false, buffOffset, leapCallback, reassign, dispose, zeroIn)
                }

                if (get) {
                    getData[n] = that.getData(stream, [node], [propSet], get)
                }
            }
            that.evals += chains.length
        }
        that.update()
        return getData
    }

    that.execLerp = function (stream, nodeSet, propSet, refnode, refprop, startVal, flux, parallel, reach, from, to, ease, precision, exact, at, leapCallback, reassign, dispose, zeroIn, skipLeap) {
        var state = _runtime[stream].state
        var access = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access

        var propDataLength = access.propDataLength + 1
        var refNodeBindProp = refnode[stream][refprop]
        var refData0PosI = refNodeBindProp.data0PosI

        var valDuration = to - from
        ease = ease || 'linear'
        var easeData = evalData(ease, valDuration, valDuration)
        precision = precision || 1
        if (nodeSet && propSet) {
            for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
                let nodeBind = nodeSet[n][stream]

                for (let p = 0, plen = propSet.length; p < plen; p++) {
                    let nodeBindProp = nodeBind[propSet[p]]

                    let data0PosI = nodeBindProp.data0PosI
                    let lerpVal = access.data[data0PosI + from + 1]
                    for (let ew = 0; ew < valDuration; ew++) {
                        let dataPos = from + ew
                        dataPos = dataPos < propDataLength ? dataPos : access._reversion(dataPos)
                        let refDataPosI = refData0PosI + dataPos
                        let dataPosI = data0PosI + dataPos
                        if (skipLeap) if (access.data[dataPosI + 1] == access.arguments.leap) continue
                        // console.log(1 - ((easeData[1] - easeData[0][ew]) / easeData[1]))
                        let fluxin = Math.lerpSubject(lerpVal, access.data[refDataPosI + 1], flux * (1 - ((easeData[1] - easeData[0][ew]) / easeData[1])))
                        // if (fluxin < 0.001) continue
                        // fluxin *= easeData[ew]
                        lerpVal -= fluxin
                        access.data[dataPosI + 1] = lerpVal * precision
                    }
                }
            }
        }
        if (leapCallback) that.assignLeap(stream, [nodeSet[0]], propSet, exact, at, leapCallback, reassign, dispose, zeroIn)
        that.evals += nodeSet.length * propSet.length
        that.update()
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
                dataPos = dataPos < propDataLength ? dataPos : access._reversion(dataPos)
                let dataPosI = data0PosI + dataPos
                access.data[dataPosI] = access.arguments.leap

                nodeBindProp.leap.dataPosI = dataPosI
            }
        }
    }

    var buff = function (stream, node, prop, evalData, relative, skipLeap, ahead) {
        var nodeVal = node[prop[0]].value
        ? prop[0] == 'value' ? node[prop[0]].value : node[prop[0]].value * node[stream].precision
        : prop[0] == 'value' ? node[prop[0]] : node[prop[0]] * node[stream].precision

        if (ahead) nodeVal = valueOffset; else nodeVal += valueOffset
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
            dataPos = dataPos < propDataLength ? dataPos : access._reversion(dataPos)
            let dataPosI = data0PosI + dataPos

            if (skipLeap) if (access.data[dataPosI] == access.arguments.leap) continue
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

        var zeroDuration = to - from

        if (nodeSet && propSet) {
            for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
                let nodeBind = nodeSet[n][stream]

                for (let p = 0, plen = propSet.length; p < plen; p++) {
                    let nodeBindProp = nodeBind[propSet[p]]

                    let data0PosI = nodeBindProp.data0PosI

                    for (let ew = 0; ew < zeroDuration; ew++) {
                        let dataPos = from + ew
                        dataPos = dataPos < propDataLength ? dataPos : access._reversion(dataPos)
                        let dataPosI = data0PosI + dataPos
                        if (skipLeap) if (access.data[dataPosI + 1] == access.arguments.leap) continue
                        access.data[dataPosI + 1] = 0
                    }
                }
            }
        } else {
            for (let id in access.bindings.ids) {
                let nodeBinds = access.bindings.ids[id].node[stream]

                for (let prop in nodeBinds) {
                    if (nodeBinds[prop].data0PosI) {
                        let data0PosI = nodeBinds[prop].data0PosI

                        for (let ew = 0; ew < zeroDuration; ew++) {
                            let dataPos = from + ew
                            dataPos = dataPos < propDataLength ? dataPos : access._reversion(dataPos)
                            let dataPosI = data0PosI + dataPos

                            if (skipLeap) if (access.data[dataPosI + 1] == access.arguments.leap) continue
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

                    let valDuration = to - from

                    for (let ew = 0; ew < valDuration; ew++) {
                        let dataPos = from + ew
                        dataPos = dataPos < propDataLength ? dataPos : access._reversion(dataPos)
                        let dataPosI = data0PosI + dataPos
                        if (skipLeap) if (access.data[dataPosI + 1] == access.arguments.leap) continue
                        access.data[dataPosI + 1] = Math.Type.convertToPrecisionType(nodeBind.conversion, val, precision)
                    }
                }
            }
        }
        if (leapCallback) {
            that.assignLeap(stream, [nodeSet[0]], propSet, exact, at, leapCallback, reassign, dispose, zeroIn)
        }
    }

    that.getforwardData = function (stream, nodeSet, propSet, get, skipLeap) {
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
                    dataPos = dataPos < propDataLength ? dataPos : access._reversion(dataPos)
                    let dataPosI = data0PosI + dataPos
                    if (skipLeap) if (access.data[dataPosI + 1] == access.arguments.leap) continue
                    obj[n][prop] += access.data[dataPosI + 1] / nodeBind.precision
                }
            }
        }
        return obj
    }

    that.injectData = function (stream, nodeSet, propSet, data, inject, blend, min, max, skipLeap) {
        var state = _runtime[stream].state
        var access = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access

        var propDataLength = access.propDataLength
        for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
            let nodeBind = nodeSet[n][stream]

            min *= nodeBind.precision
            max *= nodeBind.precision

            for (let p = 0, plen = propSet.length; p < plen; p++) {
                let nodeBindProp
                let data0PosI
                let byteOffset
                let dataPosI
                let prop

                if (nodeBind.conversion == 'poly') {
                    prop = 0
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
                    dataPos = dataPos < propDataLength ? dataPos : access._reversion(dataPos)
                    if (nodeBind.conversion == 'poly') {
                        for (let pi = 0, plen = data.length; pi < plen; pi++) {
                            let polyPropBind = nodeBind[pi]
                            data0PosI = polyPropBind.data0PosI
                            dataPosI = data0PosI + dataPos

                            if (skipLeap) if (access.data[dataPosI] == access.arguments.leap) continue

                            access.data[dataPosI] = blend ? data[pi] * nodeBind.precision + access.data[dataPosI] : data[pi] * nodeBind.precision

                            access.data[dataPosI] =
                            access.data[dataPosI] < min ? min
                            : access.data[dataPosI] > max ? max
                            : access.data[dataPosI]
                        }
                    } else {
                        dataPosI = data0PosI + dataPos
                        if (skipLeap) if (access.data[dataPosI] == access.arguments.leap) continue
                        access.data[dataPosI] = blend ? data * nodeBind.precision + access.data[dataPosI] : data * nodeBind.precision

                        access.data[dataPosI] =
                        access.data[dataPosI] < min ? min
                        : access.data[dataPosI] > max ? max
                        : access.data[dataPosI]
                    }
                }
            }
        }
    }

    that.list = []
    that.queue = function () {
        that.list = that.list
        that.list.push(arguments)
        return that.list.length - 1
    }

    that.run = function (callback) {
        let list = that.list
        while (list.length > 0) {
            let method = Array.prototype.shift.apply(list[0])// shift arguments array list[0].shift() doesn't work
            that[method].apply(this, list[0])
            list.shift()
        }
        if (callback) callback()
    }

    that.loadData = function (stream, src, offset, callback, nodeDataLength, propDataLength) {
        var script = new window.XMLHttpRequest()
        script.open('GET', src, true)
        script.responseType = 'text'
        script.callback = callback
        script.onload = function () {
            var data = processData(this.response)
            that.buffinData(stream, data.data, offset, nodeDataLength || data.nodeDataLength, propDataLength || data.propDataLength)

            if (this.callback) this.callback()
        }
        script.send()
    }

    var processData = function (csv) {
        csv = csv.split(',')
        var nodeDataLength = Array.prototype.shift.apply(csv)
        var propDataLength = Array.prototype.shift.apply(csv)
        return {data: csv, nodeDataLength: nodeDataLength << 0, propDataLength: propDataLength << 0}
    }

    that.buffinData = function (stream, data, offset, nodeDataLength, propDataLength) {
        var state = _runtime[stream].state
        var access = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access
        let continuancePosValData0 = 1
        let data0PropDataLength = continuancePosValData0 + propDataLength
        for (
            let dI = 0,
                partition = 0,
                partFrac = 0,
                cursor = 0,
                reads = 0;
            dI < data.length;
            dI++
            ) {
            // Node Level//
            if ((dI - partition) % nodeDataLength == 0) {
                // var node_i = dI/nodeDataLength;//node index number
                // ->> Node Selection > buffer identifier
                var nodeBdIK = data[dI]
                dI++
                cursor = 1
                reads++
            }

            // Property Level//
            if ((dI - reads) % data0PropDataLength == partFrac) {
                let chunkStartI = (dI - cursor)
                // var prop = ((dI-reads) - ( data0PropDataLength * propsPerNode * node_i)) / data0PropDataLength;//property index number of chunk
                // ->> Property Selection > buffer identifier

                var propBdIK = data[dI]
                dI++
                cursor++
                reads++

                let dataPos = ((dI - cursor) - chunkStartI)
                let dataPosI = dI - dataPos
                let endPos = (data0PropDataLength - dataPos) - 1
                let endPosI = dataPosI + endPos
            }

            let setBind = state == 'prebuff' ? access.ids['_bi' + nodeBdIK] : access.bindings.ids['_bi' + nodeBdIK]
            let setBindProperty = setBind[propBdIK]
            let data0PosI = setBind.node[stream][setBindProperty.binding].data0PosI
            for (let l = 0; l < propDataLength; l++) {
                access.data[data0PosI + offset + l] = data[dI]// a...
                dI++
            }
            // dI = endPosI
            // this._updateDataPos()
        }
    }

    that.getData = function (stream, nodeSet, propSet, from, to, nodeDataLength, propDataLength) {
        var state = _runtime[stream].state
        var access = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access

        to = to
        ? (to < from) || to > access.propDataLength
            ? access.propDataLength
            : to
        : access.propDataLength

        from = from
        ? (to && from > to) || from > access.propDataLength
            ? 0
            : from
        : 0

        var data = that.buffoutData(stream, nodeSet, propSet, from, to)

        return data
    }

    that.saveData = (function (data, fileName) {
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.style = 'display: none'
        return function (data, fileName) {
            var json = [data]
            var blob = new window.Blob([json], {type: 'octet/stream'})
            var url = window.URL.createObjectURL(blob)
            a.href = url
            a.download = fileName
            a.click()
            window.URL.revokeObjectURL(url)
        }
    }())

    that.buffoutData = function (stream, nodeSet, propSet, from, to) {
        var state = _runtime[stream].state
        var access = state == 'prebuff'
        ? _runtime[stream]
        : _runtime.access

        let valDuration = to - from
        let continuancePosValData0 = 1
        let data0PropDataLength = continuancePosValData0 + valDuration
        let nodeDataLength = propSet ? data0PropDataLength * propSet.length + propSet.length + 1 : 0

        var data = [nodeDataLength, valDuration]

        if (nodeSet) {
            for (let n = 0, nlen = nodeSet.length; n < nlen; n++) {
                let nodeBind = nodeSet[n][stream]

                if (!propSet) {
                    propSet = []
                    for (let propKey in nodeBind) {
                        if (typeof nodeSet[n][propKey] != 'undefined') propSet.push(propKey)
                    }
                }
                if (nodeDataLength == 0) {
                    nodeDataLength = data0PropDataLength * propSet.length + propSet.length + 1
                    data = [nodeDataLength, valDuration]
                }

                data.push(nodeBind.binding.replace('_bi', '') << 0)

                for (let p = 0, plen = propSet.length; p < plen; p++) {
                    let nodeBindProp = nodeBind[propSet[p]]
                    data.push(nodeBindProp.binding)

                    let data0PosI = nodeBindProp.data0PosI
                    data.push(access.data[data0PosI + from])

                    for (let ew = 0; ew < valDuration; ew++) {
                        let dataPos = from + ew
                        dataPos = dataPos < access.propDataLength ? dataPos : access._reversion(dataPos)
                        let dataPosI = data0PosI + dataPos
                        data.push(access.data[dataPosI + 1])
                    }
                }
            }
        }
        return data
    }
})(this.Streaming)
