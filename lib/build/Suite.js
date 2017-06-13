/**
 * //windowApp: Window and canvases dat.gui
 * //WINDOW, APP, GUI and DATA Controls
 * @author leroyron / http://leroy.ron@gmail.com
 */
window.app =
{
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: '1280,720',
    fullscreen: false,
    touch: false,
    popup: false,
    pointers: {enabled: true, inUse: false},
    marquee: {},
    motionblur:
    {
        shutterspeed: 2,
        influence: 10
    },
    uniforms:
    {
        godray_amount: 15,
        screenshadow_alpha: 1,
        ash_direction: 3
    },
    sound: true,
    ready: false
}

window.canvases = []
window.createCanvas = {}
window.container = {}
window.info = {}// Added info for app output(Remove at will)
window.stats = {}// Added stats for app output(Remove at will)
// context App inside of a container
window.context = function (parent, child) {
    var THREE = this.THREE
    var Stats = this.Stats
    this.container = document.getElementById(parent)
    this.info = document.getElementById(child)// Added info for app output(Remove at will)
    this.stats = Stats ? new Stats() : {showPanel: function () {}, begin: function () {}, end: function () {}}// Added stats for app output(Remove at will)
    this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    if (Stats) this.info.appendChild(this.stats.dom)// Added stats for app output(Remove at will)
    this.createCanvas = function (option) {
        var canvas = {}
        if (option !== '3d') {
            canvas.node = document.createElement('canvas')
            canvas.context = canvas.node.getContext('2d')
        } else {
            canvas.renderer = new THREE.WebGLRenderer()
            canvas.renderer.setSize(this.app.resolution.width, this.app.resolution.height)
            canvas.renderer.setClearColor(0x000000)
            canvas.renderer.context.scene = new THREE.Scene()
            // canvas.renderer.context.scene.fog = new THREE.FogExp2(0x000000, 0.025)
            canvas.renderer.context.camera = new THREE.PerspectiveCamera(100, this.app.width / this.app.height, 1, 100000)
            canvas.context = canvas.renderer.context
            canvas.node = canvas.renderer.domElement
            canvas.node.tabindex = '1'
        }
        canvas.node.width = this.app.resolution.width
        canvas.node.height = this.app.resolution.height
        canvas.node.style.width = this.app.width + 'px'
        canvas.node.style.height = this.app.height + 'px'

        this.app.element = this.container

        // for @ Streaming.addon.runtime.timeframe _init mode
        canvas.context.constructor.name = canvas.context.constructor.name || option == '2d' ? 'CanvasRenderingContext2D' : 'WebGLRenderingContext'

        this.container.appendChild(canvas.node)
        window.canvases.push(canvas)
        return canvas
    }
    this.buildContext = function (ctx, src, callback) {
        var script = document.createElement('script')
        script.src = src
        script.onload = function () {
            callback()
        }
        document.body.appendChild(script)
        return ctx
    }
}
// resize App inside of container
window.onresize = function onresize () {
    this.app.width = this.innerWidth
    this.app.height = this.innerHeight
    // Resize all canvases
    if (this.canvases.length > 0) {
        for (let cvi = 0, cvslen = this.canvases.length; cvi < cvslen; cvi++) {
            if (typeof this.canvases[cvi].id !== 'undefined') {
                continue
            }
            if (this.canvases[cvi].renderer) {
                this.canvases[cvi].renderer.setSize(this.app.resolution.width, this.app.resolution.height)
                this.canvases[cvi].renderer.render(this.canvases[cvi].context.scene, this.canvases[cvi].context.camera)
                this.canvases[cvi].context.camera.updateProjectionMatrix()
            }
            this.canvases[cvi].node.width = this.app.resolution.width
            this.canvases[cvi].node.height = this.app.resolution.height
            this.canvases[cvi].node.style.width = this.app.width + 'px'
            this.canvases[cvi].node.style.height = this.app.height + 'px'

            if (!this.app.ready) return
            if (this.canvases[cvi].app) { this.canvases[cvi].app.resolution(this.app) }

            if (window.ctx.calc) {
                window.ctx.calc()
            }
            if (window.ctx.rendering) {
                window.ctx.rendering()
            }
        }
    }
    this.resizeCallbacks()
}

window.launchFullscreen = function (element) {
    if (element.requestFullscreen) {
        element.requestFullscreen()
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
    }
}
window.exitFullscreen = function (element) {
    if (document.exitFullscreen) {
        document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
    }
}
window.toggleFullscreen = function (bool, elem) {
    if (!bool) {
        window.exitFullscreen()
    } else {
        window.launchFullscreen(elem)
    }
    window.setTimeout(window.onresize(), 1000)
}
window.update = function () {
    this.updateCallbacks()
}
window.resizeCalls = []
window.resizeCallbacks = function () {
    for (let r = 0; r < this.resizeCalls.length; r++) {
        if (this.resizeCalls[r]._resize) this.resizeCalls[r]._resize(); else this.resizeCalls[r]()
    }
}
window.changeResolution = function (res) {
    window.app.resolution = res
    window.setTimeout(window.onresize(), 1000)
}
window.popupCount = 0
window.popup = function () {
    var top = window.open('http://localhost:5000/', 'app' + window.popupCount, 'width=1024,height=768,toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=0,resizable=1')
    top.focus()
    window.popupCount++
}

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
    } else { console.log('OpenGL--------') }

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

/**
 * //windowApp: Visual Studio Code linkage for timeline.vscode.md
 * //VScode Command Palette iFrame window parent associating
 * @author leroyron / http://leroy.ron@gmail.com
 */
window.app.vscode = window.parent.Authority || window.top.Authority || {_fileLocal: ''}
