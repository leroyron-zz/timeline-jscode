// array.addon
// IE fix Array fill
Array.prototype.fill = !Array.prototype.fill ? function (value) {
    return Array.apply(null, Array(this.length)).map(Number.prototype.valueOf, value)
} : Array.prototype.fill

Array.prototype.BYTES_PER_ELEMENT = 4
