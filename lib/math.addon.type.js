Math.Type = {}
// Returns string of object type
Math.Type.identify = function (obj) {
    if (obj.constructor) {
        if (obj.constructor.name == "Vector3") {
            return "translation"
        } else if (obj.constructor.name == "Euler") {
            return "radian"
        }
    }
    if (obj.type == "position") {
        return "translation"
    } else if (obj.type == "rotation") {
        return "radian"
    } else if (obj.type == "scale") {
        return "uniform"
    } else if (obj.type == "poly") {
        return "poly"
    } else if (obj.type == "translation" || obj.type == "radian" || obj.type == "poly" || obj.type == "uniform") {
        return obj.type
    } else {
        return "uniform"
    }
}

Math.Type.convertToType = function (type, val) {
    if (type == "radian") {
        return Math.radians(val)
    } else {
        return val
    }
}

Math.Type.convertFromType = function (type, val) {
    if (type == "radian") {
        return Math.degrees(val)
    }
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