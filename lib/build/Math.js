// math.addon
// Converts from degrees to radians.
Math.radians = function (degrees) {
    return degrees * Math.PI / 180
}

// Converts from radians to degrees.
Math.degrees = function (radians) {
    return radians * 180 / Math.PI
}

// Returns a fraction of value.
Math.lerp = function (val, frac) {
    return val * frac
}

// Returns a fraction of two comparable value.
Math.lerpSubject = function (val1, val2, frac) {
    return this.lerp((val1 - val2), frac)
    // Useage - obj.x += Math.lerpSubject(move, obj.x, obj.speed);
}

// Assigns value directly to object property
Math.lerpProp = function (obj, prop, val, frac) {
    obj[prop] += this.lerpSubject(val, obj[prop], frac)
    // Useage - Math.lerpProp(obj, 'x', move, obj.speed);
}

// Assigns value directly to multiple object property
Math.lerpProps = function (objs, prop, val, frac) {
    for (let oi = 0; oi < objs.length; oi++) {
        objs[oi][prop] += this.lerpSubject(val, objs[oi][prop], frac)
    }
    // Useage - Math.lerpProp(obj, 'x', move, obj.speed);
}

// Get distance
Math.distance2 = function (p1, p2) {
    var a = p1.x - p2.x
    var b = p1.y - p2.y
    return Math.sqrt(a * a + b * b)
}

// Random number from to
Math.randomFromTo = function (from, to) {
    return Math.floor((Math.random() * (to - from)) + from)
}

// Aspectratio
Math.aspectRatio = function (orginalWidth, originalHeight) {
    return orginalWidth / originalHeight
}

Math.rotateFromPoint = function (pointX, pointY, originX, originY, angle, clockwise) {
    if (clockwise) angle -= 180.0
    angle = angle * Math.PI / 180.0
    return {
        x: Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
        y: Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY
    }
}

// math.addon.type
Math.Type = {}
// Returns string of object type
Math.Type.identify = function (obj) {
    if (obj.constructor) {
        if (obj.constructor.name == 'Vector3') {
            return 'translation'
        } else if (obj.constructor.name == 'Euler') {
            return 'radian'
        }
    }
    if (obj.type == 'position') {
        return 'translation'
    } else if (obj.type == 'rotation') {
        return 'radian'
    } else if (obj.type == 'poly') {
        return 'poly'
    } else {
        return 'uniform'
    }
}

// Returns the precision value for integer conversions
Math.Type.precision = function (type) {
    if (type == 'translation') {
        return 1000
    } else if (type == 'radian') {
        return 10000
    } else if (type == 'uniform') {
        return 1000
    }
}

// Return precision or type conversion value for a specific type ///
Math.Type.convertToPrecision = function (type, val) {
    return val * this.precision(type)
}

Math.Type.convertFromPrecision = function (type, val) {
    return val / this.precision(type)
}

Math.Type.convertToType = function (type, val) {
    if (type == 'radian') {
        return Math.radians(val)
    } else {
        return val
    }
}

Math.Type.convertFromType = function (type, val) {
    if (type == 'radian') {
        return Math.degrees(val)
    } else {
        return val
    }
}

Math.Type.convertToPrecisionType = function (type, val, precision) {
    return Math.Type.convertToType(type, precision ? val * precision : val * this.precision(type))
}

Math.Type.convertFromPrecisionType = function (type, val, precision) {
    return Math.Type.convertFromType(type, precision ? val / precision : val / this.precision(type))
}

Math.Type.convertToPrecisionData = function (type, data, start, end, precision) {
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        for (let ci = start; ci < start + end; ci++) {
            if (data[di][ci]) {
                data[di][ci] = precision ? data[di][ci] * precision : this.convertToPrecision(type, data[di][ci])
            }
        }
    }
    return data
}

Math.Type.convertFromPrecisionData = function (type, data, start, end, precision) {
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        for (let ci = start; ci < start + end; ci++) {
            if (data[di][ci]) {
                data[di][ci] = precision ? data[di][ci] / precision : this.convertFromPrecision(type, data[di][ci])
            }
        }
    }
    return data
}

Math.Type.convertToTypeData = function (type, data, start, end) {
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        for (let ci = start; ci < start + end; ci++) {
            if (data[di][ci]) {
                data[di][ci] = this.convertToType(type, data[di][ci])
            }
        }
    }
    return data
}

Math.Type.convertFromTypeData = function (type, data, start, end) {
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        for (let ci = start; ci < start + end; ci++) {
            if (data[di][ci]) {
                data[di][ci] = this.convertFromType(type, data[di][ci])
            }
        }
    }
    return data
}

Math.Type.convertToPrecisionDataType = function (type, data, start, end, precision) {
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        for (let ci = start; ci < start + end; ci++) {
            if (data[di][ci]) {
                data[di][ci] = precision ? data[di][ci] * precision : this.convertToPrecision(type, data[di][ci])
                data[di][ci] = this.convertToType(type, data[di][ci])
            }
        }
    }
    return data
}

Math.Type.convertFromPrecisionDataType = function (type, data, start, end, precision) {
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        for (let ci = start; ci < start + end; ci++) {
            if (data[di][ci]) {
                data[di][ci] = precision ? data[di][ci] / precision : this.convertFromPrecision(type, data[di][ci])
                data[di][ci] = this.convertFromType(type, data[di][ci])
            }
        }
    }
    return data
}

// math.addon.cache
Math.Cache = {}
// Storing math data/functions for access and performance
Math.Cache.store = function (prop, func, apply) {
    Math.Cache[prop] = func.apply(this, [apply])
}

// math.addon.poly
Math.Poly = {}

Math.Poly.generateKeys = function (data, start) {
    let poly = []
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        poly[di] = start ? start + di : di
    }
    return poly
}

Math.Poly.poly = function (type, data, precision) {
    if (!data.length) return precision ? data * precision : Math.Type.convertToPrecision(type, data)
    let poly = []
    for (let pi = 0, dlen = data.length; pi < dlen; pi++) {
        poly[pi] = data[pi] ? Math.Poly.poly(type, data[pi], precision) : 0
    }
    return poly
}

Math.Poly.generate = function (type, data, precision) {
    let poly = []
    for (let di = 0, dlen = data.length; di < dlen; di++) {
        poly[di] = [di, data[di] ? Math.Poly.poly(type, data[di], precision) : 0]
    }
    return poly
}

Math.Poly.add = function (type, data1, data2) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] + data2[pi]
    }
    return poly
}

Math.Poly.subtract = function (type, data1, data2) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] - data2[pi]
    }
    return poly
}

Math.Poly.multiply = function (type, data1, data2) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] * data2[pi]
    }
    return poly
}

Math.Poly.divide = function (type, data1, data2) {
    let poly = []
    for (let pi = 0, dlen = data1.length; pi < dlen; pi++) {
        poly[pi] = data1[pi] / data2[pi]
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

// math.addon.poly.medium
Math.Poly.Medium = {}

Math.Poly.Medium.midDisperse = function (length, duration, smooth) {
    let matrix = []
    var inset = 0
    for (let m = 0; m < duration; m++) {
        let mid = length * (m / duration)
        let capture = []
        for (let i = 0, l = length + 1; i < l; i++) {
            let iMid = i + mid
            let span = (iMid / length << 0) * length
            let oct = (iMid - span)
            let hyp = oct > length / 2 ? length - oct : oct
            hyp = hyp > inset ? hyp - inset : 0
            let disI = hyp < i ? 0 : 1
            hyp = disI == 0 ? 0 : hyp
            capture[i] = hyp
        }
        let poly = []
        let reverse = []
        let ci = 0
        for (let ri = capture.length; ri > 0; ri--) {
            reverse[ci] = capture[ri - 1]
            poly[ri - 1] = reverse[ci] + capture[ci]
            poly[ri - 1] = poly[ri - 1] > length / 2 ? 1 : poly[ri - 1] / (length / 2)
            ci++
        }
        matrix[m] = smooth ? Math.Poly.smoothOut(poly, smooth) : poly
    }
    return matrix
}

Math.Poly.Medium.midEase = function (length, smooth) {
    var inset = 0
    let mid = 0
    let capture = []
    for (let i = 0, l = length + 1; i < l; i++) {
        let iMid = i + mid
        let span = (iMid / length << 0) * length
        let oct = (iMid - span)
        let hyp = oct > length / 2 ? length - oct : oct
        hyp = hyp > inset ? hyp - inset : 0
        let disI = hyp < i ? 0 : 1
        hyp = disI == 0 ? 0 : hyp

        let iMidReverse = mid - i + length
        let spanReverse = (iMidReverse / length << 0) * length
        let octReverse = (iMidReverse - spanReverse)
        let hypReverse = octReverse > length / 2 ? length - octReverse : octReverse
        capture[i] = hypReverse > inset ? hypReverse - inset : 0
        continue
        // let inHyp = hyp+hypReverse
        // let splitWidth = length / split
        // let splitSpan = (i / splitWidth << 0) * splitWidth
        // let splitOct = (i - splitSpan)
        // let splitHyp = splitOct > splitWidth / 2 ? splitWidth - splitOct : splitOct
    }
    let poly = []
    for (let ci = 0; ci < capture.length; ci++) {
        poly[ci] = capture[ci] > length / 2 ? 1 : capture[ci] / (length / 2)
    }
    poly = smooth ? Math.Poly.smoothOut(poly, smooth) : poly
    return poly
}