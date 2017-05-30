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
