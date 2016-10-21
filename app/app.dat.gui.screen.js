window.app =
{
    stream: {
        access: {continuance: true, skip: 0, tCount: 0, revert: true, mCount: 0, leap: -999, reset: false},
        runtime: {thrust: 0, measure: 0},
        timeframe: {running: true, lapse: 10}, // lapse is good while recording accuracy
        buffer: {evals: 0}
    },
    storyboard: {duration: 'ms', segment: 0, actionETA: 0},
    charts: 'gifImage',
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: '1280,720',
    fullscreen: true,
    touch: false,
    pointers: {inUse: false},
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
    sound: true
}
window.canvases = []
window.createCanvas
window.container
window.info// Added info for app output(Remove at will)
window.stats// Added stats for app output(Remove at will)
// init App inside of a container
window.init = function (parent, child)
{
    container = document.getElementById(parent)
    info = document.getElementById(child)// Added info for app output(Remove at will)
    stats = new Stats()// Added stats for app output(Remove at will)
    stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    info.appendChild(stats.dom)// Added stats for app output(Remove at will)
    createCanvas = function (option)
    {
        var canvas = {}
        if (option != '3d')
        {
            canvas.node = document.createElement('canvas')
            canvas.context = canvas.node.getContext('2d')
        }
        else
        {
            canvas.renderer = new THREE.WebGLRenderer()
            canvas.renderer.setSize(app.resolution.width, app.resolution.height)
            canvas.renderer.setClearColor(0x061928)
            canvas.renderer.context.scene = new THREE.Scene()
          // canvas.renderer.context.scene.fog = new THREE.FogExp2( 0x061928, 0.025 );
            canvas.renderer.context.camera = new THREE.PerspectiveCamera(100, app.width / app.height, 1, 100000)
            canvas.context = canvas.renderer.context
            canvas.node = canvas.renderer.domElement
            canvas.node.tabindex = '1'
        }
        canvas.node.width = app.resolution.width
        canvas.node.height = app.resolution.height
        canvas.node.style.width = app.width + 'px'
        canvas.node.style.height = app.height + 'px'
        container.appendChild(canvas.node)
        window.canvases.push(canvas)
        return canvas
    }
}
// resize App inside of container
window.onresize = function onresize ()
{
    app.width = window.innerWidth
    app.height = window.innerHeight
    if (window.canvases.length > 0)// Resize all canvases
        { for (var cvi = 0, cvslen = canvases.length; cvi < cvslen; cvi++)
        {
            if (canvases[cvi].renderer) {
                canvases[cvi].renderer.setSize(app.resolution.width, app.resolution.height)
                canvases[cvi].renderer.render(canvases[cvi].context.scene, canvases[cvi].context.camera)
                canvases[cvi].context.camera.updateProjectionMatrix()
            }
            canvases[cvi].node.width = app.resolution.width
            canvases[cvi].node.height = app.resolution.height
            canvases[cvi].node.style.width = app.width + 'px'
            canvases[cvi].node.style.height = app.height + 'px'
            canvases[cvi].app.resolution(window.app)
        } }
    responsive()
}

window.responsive = function () {
    storyboard.style.width = (app.width - 375) + 'px'
}

window.launchFullscreen = function (element)
{
    if (element.requestFullscreen)
  {
        element.requestFullscreen()
    }
    else if (element.mozRequestFullScreen)
  {
        element.mozRequestFullScreen()
    }
    else if (element.webkitRequestFullscreen)
  {
        element.webkitRequestFullscreen()
    }
    else if (element.msRequestFullscreen)
  {
        element.msRequestFullscreen()
    }
}
window.exitFullscreen = function (element)
{
    if (document.exitFullscreen)
  {
        document.exitFullscreen()
    }
    else if (document.mozCancelFullScreen)
  {
        document.mozCancelFullScreen()
    }
    else if (document.webkitExitFullscreen)
  {
        document.webkitExitFullscreen()
    }
}
window.toggleFullscreen = function (bool, elem)
{
    if (!bool)
    {
        window.exitFullscreen()
    }
    else
    {
        window.launchFullscreen(elem)
    }
    window.setTimeout(window.onresize(), 1000)
}

var gui = new dat.GUI({
    load: JSON,
    preset: 'Chrome'
})
gui.controls =
{
    recording: gui.addFolder('Recordings<span class="rec off">&bull;</span> Segment <span class="rec seg">0</span>', true),
    storyboard: gui.addFolder('StoryBoard'),
    stream: gui.addFolder('Stream'),
    settings: gui.addFolder('Settings'),
    charts: gui.addFolder('Charts')
}

// //RECORDING RUNTIME////
// Adjustments---
gui.controls.recording.addFolder('Adjustments')
// Resolutions
gui.appResolution = gui.controls.recording.__folders.Adjustments.add(window.app, 'resolution',
    {
        auto: [1280, 720],
        r2160p: [3840, 2160],
        r1440p: [2560, 1440],
        r1080p: [1920, 1080],
        r720p: [1280, 720],
        r480p: [854, 480],
        r360p: [640, 360],
        r240p: [426, 240]
    })
gui.appResolution.onFinishChange(function (value) {
    var width_height = value.split(',')
    this.object[this.property] = {width: parseInt(width_height[0]), height: parseInt(width_height[1])}
    window.onresize()
})
gui.appResolution.setValue(window.app.resolution)// Set default
gui.remember(gui.appResolution)

// MotionBlur
gui.controls.recording.addFolder('MotionBlur')
gui.controls.recording.__folders.MotionBlur.add(window.app.motionblur, 'shutterspeed', 0, 100)
gui.controls.recording.__folders.MotionBlur.add(window.app.motionblur, 'influence', 0, 100)

// Uniforms
gui.controls.recording.addFolder('Uniforms')
gui.controls.recording.__folders.Uniforms.add(window.app.uniforms, 'godray_amount', 0, 100)
gui.controls.recording.__folders.Uniforms.add(window.app.uniforms, 'screenshadow_alpha', 0, 100)
gui.controls.recording.__folders.Uniforms.add(window.app.uniforms, 'ash_direction', 0, 9)
// //RECORDING////

// //STORYBOARD////
gui.appSBDuration = gui.controls.storyboard.add(window.app.storyboard, 'duration')
gui.appSBSegment = gui.controls.storyboard.add(window.app.storyboard, 'segment')
gui.appSBActionETA = gui.controls.storyboard.add(window.app.storyboard, 'actionETA')
gui.controls.storyboard.open()
// //STORYBOARD////

// //STREAM////
// //STREAM ARGUMENTS////
// Information
// stream: {runtime:'Thrust/Measure: 0/0', buffer:'Evals: 0', setup:{continuance:true,skip:0,tCount:0,revert:true,mCount:0,leap:-999,reset:false}},
// Stream
gui.controls.stream.addFolder('arguments')
gui.appSArg0 = gui.controls.stream.__folders.arguments.add(window.app.stream.access, 'continuance')
gui.appSArg1 = gui.controls.stream.__folders.arguments.add(window.app.stream.access, 'skip')
gui.appSArg2 = gui.controls.stream.__folders.arguments.add(window.app.stream.access, 'tCount')
gui.appSArg3 = gui.controls.stream.__folders.arguments.add(window.app.stream.access, 'revert')
gui.appSArg4 = gui.controls.stream.__folders.arguments.add(window.app.stream.access, 'mCount')
gui.appSArg5 = gui.controls.stream.__folders.arguments.add(window.app.stream.access, 'leap')
gui.appSArg6 = gui.controls.stream.__folders.arguments.add(window.app.stream.access, 'reset')

gui.controls.stream.addFolder('timeframe')
gui.appSTimeframeRunning = gui.controls.stream.__folders.timeframe.add(window.app.stream.timeframe, 'running')
gui.appSTimeframeLapse = gui.controls.stream.__folders.timeframe.add(window.app.stream.timeframe, 'lapse')

gui.controls.stream.addFolder('runtime')
gui.appSRuntimeThrust = gui.controls.stream.__folders.runtime.add(window.app.stream.runtime, 'thrust')
gui.appSRuntimeMeasure = gui.controls.stream.__folders.runtime.add(window.app.stream.runtime, 'measure')
gui.controls.stream.addFolder('buffer')

gui.appSBufferEvals = gui.controls.stream.__folders.buffer.add(window.app.stream.buffer, 'evals')
gui.controls.stream.open()
// //STREAM////

var seek = document.getElementsByClassName('seek')[0]

var actions = document.getElementsByClassName('action')
var alen = actions.length
var actionsPos = new Int32Array(new ArrayBuffer(alen * 4))
for (var a = 0; a < alen; a++) {
    actionsPos[a] = parseInt(actions[a].style.left)
}

var segments = document.getElementsByClassName('segment')
var slen = segments.length
var segmentsPos = new Int32Array(new ArrayBuffer(slen * 4))
for (var s = 0; s < slen; s++) {
    segmentsPos[s] = parseInt(segments[s].style.left)
}

var rec = document.getElementsByClassName('rec')
window.setInterval(function () {
    for (var r = 0; r < rec.length; r++) {
        if (rec[r].className == 'rec on')
        { rec[r].className = 'rec off' }
        else if (rec[r].className == 'rec off')
        { rec[r].className = 'rec on' }
        else if (rec[r].className == 'rec seg')
        { rec[r].innerHTML = gui.appSBSegment.getValue() }
    }

    var seekLeft = parseInt(seek.style.left)
    var passSegment = 0
    for (var s = 0; s < slen; s++) {
        if (seekLeft >= segmentsPos[s])
        { passSegment++ }
    }
    gui.appSBSegment.setValue(passSegment)

    for (var a = 0; a < alen; a++) {
        if (seekLeft <= actionsPos[a]) {
            gui.appSBActionETA.setValue(actionsPos[a] - seekLeft)
            break
        }
    }
}
, 1000)

// FullScreen
gui.appFullscreen = gui.controls.settings.add(window.app, 'fullscreen')
gui.appFullscreen.onFinishChange(function (value) {
    window.toggleFullscreen(value, document.documentElement)
})
gui.appFullscreen.setValue(window.app.fullscreen)// Set default

// Touch
gui.appTouch = gui.controls.settings.add(window.app, 'touch')
gui.appTouch.onFinishChange(function (value) {

})
gui.appTouch.setValue(window.app.touch)// Set default

// Sound
gui.appSound = gui.controls.settings.add(window.app, 'sound')
gui.appSound.onFinishChange(function (value) {

})
gui.appSound.setValue(window.app.sound)// Set default

// Charts//charts:'gifImage',

gui.fullScreenEventHandler =
typeof document.fullscreenElement != 'undefined' ?
'fullscreenchange' :
typeof document.mozFullScreenElement != 'undefined' ?
'mozfullscreenchange' :
typeof document.webkitFullscreenElement != 'undefined' ?
'webkitFullscreenElement' :
'fullscreenchange'
document.addEventListener(gui.fullScreenEventHandler, function () {
    gui.fullscreenEnabled = document.fullscreen || document.mozFullScreen || document.webkitFullscreen
    gui.fullscreenEnabled = gui.fullscreenEnabled != true ? false : true
    gui.appFullscreen.setValue(gui.fullscreenEnabled)
    window.setTimeout(window.onresize(), 1000)
})
