Math.Poly = {}

Math.Poly.generateKeys = function (data, start) {
    let poly = []
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        poly[di] = start ? start + di : di
    }
    return poly
}

Math.Poly.poly = function (type, data) {
    if (!data.length) return Math.Type.convertToType(type, data)
    let poly = []
    for (let pi = 0, dlen = data.length; pi < dlen; pi++) {
        poly[pi] = data[pi] ? Math.Type.convertToType(type, data[pi]) : 0
    }
    return poly
}

Math.Poly.generate = function (type, data) {
    let poly = []
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        poly[di] = [di, data[di] ? Math.Type.convertToType(type, data[di]) : 0]
    }
    return poly
}

Math.Poly.add = function (data1, data2) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] + data2[pi]
    }
    return poly
}

Math.Poly.subtract = function (data1, data2) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] - data2[pi]
    }
    return poly
}

Math.Poly.multiply = function (data1, data2) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] * data2[pi]
    }
    return poly
}

Math.Poly.divide = function (data1, data2) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] / data2[pi]
    }
    return poly
}

Math.Poly.addScalar = function (data1, val) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] + val
    }
    return poly
}

Math.Poly.subtractScalar = function (data1, val) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] - val
    }
    return poly
}

Math.Poly.multiplyScalar = function (data1, val) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] * val
    }
    return poly
}

Math.Poly.divideScalar = function (data1, val) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] / val
    }
    return poly
}

Math.Poly.addScalarVector = function (data1, v) {
    let poly = [v.x, v.y, v.z]
    let qual = 0
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        qual = pi - (3 * (pi / 3 << 0))
        data1[pi] += poly[qual] ? poly[qual] : 1
    }
}

Math.Poly.subtractScalarVector = function (data1, v) {
    let poly = [v.x, v.y, v.z]
    let qual = 0
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        qual = pi - (3 * (pi / 3 << 0))
        data1[pi] -= poly[qual] ? poly[qual] : 1
    }
}

Math.Poly.multiplyScalarVector = function (data1, v) {
    let poly = [v.x, v.y, v.z]
    let qual = 0
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        qual = pi - (3 * (pi / 3 << 0))
        data1[pi] *= poly[qual] ? poly[qual] : 1
    }
}

Math.Poly.divideScalarVector = function (data1, v) {
    let poly = [v.x, v.y, v.z]
    let qual = 0
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        qual = pi - (3 * (pi / 3 << 0))
        data1[pi] /= poly[qual] ? poly[qual] : 1
    }
}

Math.Poly.smoothOut = function (data1, variance) {
    var tAvg = this.avg(data1) * variance
    var poly = Array(data1.length)
    for (let i = 0; i < data1.length; i++) {
        let prev = i > 0 ? poly[i - 1] : data1[i]
        let next = i < data1.length ? data1[i] : data1[i - 1]
        poly[i] = this.avg([tAvg, this.avg([prev, data1[i], next])])
    }
    return poly
}

Math.Poly.avg = function (v) {
    return v.reduce((a, b) => a + b, 0) / v.length
}
// var test = [[1, 2, 3, [1, 2, 3, [1, 2, 3], [11, 12, 13], [21, 22, 23]], [11, 12, 13], [21, 22, 23]], [11, 12, 13], [21, 22, 23]]
// console.log(JSON.stringify(Math.Poly.generate('poly', test, 10)))
