/**
 * //windowInfo: Window/Dom/WebGL/System Information
 * //For debugging and statistic
 * @author leroyron / http://leroy.ron@gmail.com
 */
window.getChromeVersionPerfomanceGL = function (canvas) {
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)

    var performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {}

    console.log('Performance--------')
    for (var value in performance) {
        console.log(value)
    }

    if (!canvas.context.getParameter) {
        console.log('2D Context--------')
        return raw ? parseInt(raw[2], 10) : false
    }
    else
        console.log('OpenGL--------')

    var gl = canvas.context

    console.log(gl.getParameter(gl.RENDERER))
    console.log(gl.getParameter(gl.VENDOR))
    console.log(getUnmaskedInfo(gl).vendor)
    console.log(getUnmaskedInfo(gl).renderer)

    function getUnmaskedInfo (gl) {
        var unMaskedInfo = {
            renderer: '',
            vendor: ''
        }

        var dbgRenderInfo = gl.getExtension('WEBGL_debug_renderer_info')
        if (dbgRenderInfo != null) {
            unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL)
            unMaskedInfo.vendor = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL)
        }

        return unMaskedInfo
    }

    return raw ? parseInt(raw[2], 10) : false
}
