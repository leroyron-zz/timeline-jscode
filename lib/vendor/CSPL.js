/**
 * Cubic Spline Interpolation
 * http://blog.ivank.net/interpolation-with-cubic-splines.html
 */
function CSPL () {};

CSPL._gaussJ = {}
CSPL._gaussJ.solve = function (A, x) {
    var m = A.length
    // column
    for (var k = 0; k < m; k++) {
        // pivot for column
        var iMax = 0; var vali = Number.NEGATIVE_INFINITY
        for (let i = k; i < m; i++) {
            if (A[i][k] > vali) {
                iMax = i
                vali = A[i][k]
            }
        }
        CSPL._gaussJ.swapRows(A, k, iMax)

        if (A[iMax][k] === 0) console.log('matrix is singular!')

        // for all rows below pivot
        for (let i = k + 1; i < m; i++) {
            for (let j = k + 1; j < m + 1; j++) {
                A[i][j] = A[i][j] - A[k][j] * (A[i][k] / A[k][k])
            }
            A[i][k] = 0
        }
    }

    // rows = columns
    for (let i = m - 1; i >= 0; i--) {
        var v = A[i][m] / A[i][i]
        x[i] = v
        // rows
        for (let j = i - 1; j >= 0; j--) {
            A[j][m] -= A[j][i] * v
            A[j][i] = 0
        }
    }
}
CSPL._gaussJ.zerosMat = function (r, c) {
    var A = []
    for (let i = 0; i < r; i++) {
        A.push([])
        for (let j = 0; j < c; j++) A[i].push(0)
    }
    return A
}
CSPL._gaussJ.printMat = function (A) {
    for (let i = 0; i < A.length; i++) console.log(A[i])
}
CSPL._gaussJ.swapRows = function (m, k, l) {
    var p = m[k]
    m[k] = m[l]; m[l] = p
}

// in x values, in y values, out k values
CSPL.getNaturalKs = function (xs, ys, ks) {
    var n = xs.length - 1
    var A = CSPL._gaussJ.zerosMat(n + 1, n + 2)

    // rows
    for (let i = 1; i < n; i++) {
        A[i][i - 1] = 1 / (xs[i] - xs[i - 1])
        A[i][i] = 2 * (1 / (xs[i] - xs[i - 1]) + 1 / (xs[i + 1] - xs[i]))
        A[i][i + 1] = 1 / (xs[i + 1] - xs[i])
        A[i][n + 1] = (
            3 * (
                (ys[i] - ys[i - 1]) / (
                    (xs[i] - xs[i - 1]) * (xs[i] - xs[i - 1])
                ) + (ys[i + 1] - ys[i]) / (
                    (xs[i + 1] - xs[i]) * (xs[i + 1] - xs[i])
                )
            )
        )
    }

    A[0][0] = 2 / (xs[1] - xs[0])
    A[0][1] = 1 / (xs[1] - xs[0])
    A[0][n + 1] = 3 * (ys[1] - ys[0]) / ((xs[1] - xs[0]) * (xs[1] - xs[0]))

    A[n][n - 1] = 1 / (xs[n] - xs[n - 1])
    A[n][n] = 2 / (xs[n] - xs[n - 1])
    A[n][n + 1] = (
        3 * (
            ys[n] - ys[n - 1]
        ) / (
            (xs[n] - xs[n - 1]) * (xs[n] - xs[n - 1])
        )
    )

    CSPL._gaussJ.solve(A, ks)
}

CSPL.evalSpline = function (x, xs, ys, ks) {
    var i = 1
    while (xs[i] < x) i++

    var t = (x - xs[i - 1]) / (xs[i] - xs[i - 1])

    var a = ks[i - 1] * (xs[i] - xs[i - 1]) - (ys[i] - ys[i - 1])
    var b = -ks[i] * (xs[i] - xs[i - 1]) + (ys[i] - ys[i - 1])

    var q = (
        (1 - t) * ys[i - 1] + t * ys[i] + t * (1 - t) * (a * (1 - t) + b * t)
    )
    return q
}
