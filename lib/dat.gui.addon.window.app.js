/**
 * dat.gui AddOn: window.app
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (gui) {
    gui.addon.app = {}
    var that = gui.addon.app
    var _onupdate = function () {
    }
    _onupdate()

    gui.fullScreenHandler =
    typeof document.fullscreenElement != 'undefined'
    ? {event: 'fullscreenChange', state: 'fullscreen'}
    : typeof document.msFullscreenElement != 'undefined'
    ? {event: 'MSFullscreenChange', state: 'fullscreen'}
    : typeof document.mozFullScreenElement != 'undefined'
    ? {event: 'mozfullscreenchange', state: 'mozFullScreen'}
    : typeof document.webkitFullscreenElement != 'undefined'
    ? {event: 'webkitfullscreenchange', state: 'webkitIsFullScreen'}
    : {event: 'fullscreenchange', state: 'fullscreen'}

    document.addEventListener(gui.fullScreenHandler.event, function (e) {
        e.preventDefault()
        gui.fullscreenEnabled = document[gui.fullScreenHandler.state]
        that.fullscreen.setValue(gui.fullscreenEnabled)
        window.setTimeout(window.onresize(), 1000)
    }, false)

    gui.controls =
    {
        recording: gui.addHtmlFolder('Recordings<span class="rec off">&bull;</span> Segment <span class="rec seg">0</span>'),
        settings: gui.addFolder('Settings')
    }

    var _guiRecordingLightCss = document.createElement('style')
    _guiRecordingLightCss.innerHTML = '.dg .on {color:#FF0000;}\n    .dg .off {color:#000;}'
    document.head.appendChild(_guiRecordingLightCss)

    // Adjustments---
    gui.controls.recording.addFolder('Adjustments')
    // Resolutions

    that.resolution = gui.controls.settings.add(window.app, 'resolution',
        {
            r2160p: [3840, 2160],
            r1440p: [2560, 1440],
            r1080p: [1920, 1080],
            r720p: [1280, 720],
            r480p: [854, 480],
            r360p: [640, 360],
            r240p: [426, 240]
        })
    that.resolution.onFinishChange(function (value) {
        var widthHeight = value.split(',')
        this.object[this.property] = {width: parseInt(widthHeight[0]), height: parseInt(widthHeight[1])}
        window.setTimeout(window.onresize(), 1000)
    })
    that.resolution.setValue(window.app.resolution)// Set default
    gui.remember(that.resolution)

    // FullScreen
    that.fullscreen = gui.controls.settings.add(window.app, 'fullscreen')
    that.fullscreen.onFinishChange(function (value) {
        window.toggleFullscreen(value, document.documentElement)
    })
    that.fullscreen.setValue(window.app.fullscreen)// Set default

    // Touch
    that.touch = gui.controls.settings.add(window.app, 'touch')
    that.touch.onFinishChange(function (value) {

    })
    that.touch.setValue(window.app.touch)// Set default

    // Sound
    that.sound = gui.controls.settings.add(window.app, 'sound')
    that.sound.onFinishChange(function (value) {

    })
    that.sound.setValue(window.app.sound)// Set default
})(this.gui = this.gui || {})
