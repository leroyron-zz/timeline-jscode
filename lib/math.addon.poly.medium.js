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
console.log(JSON.stringify(Math.Poly.Medium.midEase(10)))
// console.log(JSON.stringify(Math.Poly.Medium.midDisperse(10, 10, 0.85)))
// console.log(Math.Poly.Medium.midDisperse(10, 10, 0.85))
