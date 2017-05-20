Math.Poly.Medium = {}

Math.Poly.Medium.midDisperse = function (length, duration) {
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
        matrix[m] = poly
    }
    return matrix
}

console.log(Math.Poly.Medium.midDisperse(10, 10))
