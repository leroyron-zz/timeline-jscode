/**
 * AddOn: buffer
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
    that.eval = function (stream, options, relative, precision) {
        var nodes = options[0]
        var sets = options[2]
        for (let n = 0, nlen = nodes.length; n < nlen; n++) {
            let node = nodes[n]
            buffOffset = 0
            valueOffset = 0

            let props = options[1]
            for (let p = 0, plen = props.length; p < plen; p++) {
                let prop = props[p]
                let sumDurations = 0
                for (let s = 0, slen = sets.length; s < slen; s++) {
                    sumDurations += sets[s][1]
                }
                for (let e = 0, elen = sets.length; e < elen; e++) {
                    let getset = sets[e]

                    prop[2] = prop[1] * (getset[1] / sumDurations)
                    prop[2] = Math.Type.convert(node[stream].conversion, prop[2])
                    buff(stream, node, prop, evalData(getset[0], getset[1], precision), relative)
                    buffOffset += getset[1]
                    valueOffset += prop[2]
                    console.log
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
        // byteOffset grabbed from the stream
        var byteOffset = _runtime[stream].data[data0PositionI] + buffOffset
        var propDataLength = _runtime[stream].propDataLength + 1

        var valProp = prop[2]
        // nodeVal = Math.Type.precision(dataType, nodeVal)

        var data = evalData[0]
        var precision = evalData[1]
        // Check if it fills the stream beyond its current position
        var length = data.length
        for (let ew = 0; ew < length; ew++) {
            let dataPos = byteOffset + ew
            let dataPosI = data0PositionI + dataPos
            let reverancy = (dataPos) / propDataLength << 0
            let revertPos = (dataPos) - (propDataLength * reverancy)
            let revertPosI = data0PositionI + revertPos
            if (reverancy >= 1) {
                dataPosI = revertPosI
            }

            if (relative) {
                _runtime[stream].data[dataPosI] += (data[ew] - (data[ew + 1] || 0)) / (precision / valProp) << 0
            } else {
                _runtime[stream].data[dataPosI] = nodeVal + ((precision - data[ew]) / precision * valProp) << 0
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
})(this.Streaming)
