Math.Type = {}
// Returns string of object type
Math.Type.identify = function (obj) {
    if (obj.constructor.name == 'Vector3') {
        return 'translation'
    } else if (obj.constructor.name == 'Euler') {
        return 'radian'
    } else if (obj.type == 'f') {
        return 'uniform'
    }
}

// Returns the precision value for integer conversions
Math.Type.precision = function (type) {
    if (type == 'translation') {
        return 1
    } else if (type == 'radian') {
        return 10000
    } else if (type == 'uniform') {
        return 1000
    }
}

// Return converted value for a specific type
Math.Type.convert = function (type, val) {
    if (type == 'translation') {
        return val// * Type.precision(type)
    } else if (type == 'radian') {
        return Math.radians(val) * this.precision(type)
    } else if (type == 'uniform') {
        return val// * Type.precision(type)
    }
}

// Return converted data for a specific type
Math.Type.convertData = function (type, data, start, end) {
    if (type == 'translation') {
        //
    } else if (type == 'radian') {
        for (let di = 0, dlen = data.length; di < dlen; di++) {
            for (let ci = start; ci < start + end; ci++) {
                if (data[di][ci]) {
                    data[di][ci] = this.convert(type, data[di][ci])
                }
            }
        }
    } else if (type == 'uniform') {
        //
    }
    return data
}
