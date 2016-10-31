/*
dat.gui AddOn: window.app
GUI and DATA Controls

@author leroyron / http://leroy.ron@gmail.com
*/
(function (gui) {
    gui.addon.app = {};
    var that = gui.addon.app;
    var _onupdate = function() 
    {
    }

    gui.fullScreenEventHandler = 
    typeof document.fullscreenElement != 'undefined' ? 
    "fullscreenchange": 
    typeof document.mozFullScreenElement != 'undefined' ? 
    "mozfullscreenchange": 
    typeof document.webkitFullscreenElement != 'undefined' ? 
    "webkitFullscreenElement": 
    "fullscreenchange";
    document.addEventListener(gui.fullScreenEventHandler, function (){
    gui.fullscreenEnabled = document.fullscreen || document.mozFullScreen || document.webkitFullscreen;
    gui.fullscreenEnabled = gui.fullscreenEnabled != true ? false : true;
    that.fullscreen.setValue(gui.fullscreenEnabled);
    window.setTimeout(window.onresize(), 1000);  
    });

    gui.controls = 
    {
        recording: gui.addFolder('Recordings<span class="rec off">&bull;</span> Segment <span class="rec seg">0</span>', true), 
        settings: gui.addFolder('Settings')
    }

    //Adjustments---
    gui.controls.recording.addFolder('Adjustments');
    //Resolutions

    that.resolution = gui.controls.settings.add(window.app, 'resolution', 
        { 
        r2160p: [3840,2160], 
        r1440p: [2560,1440], 
        r1080p: [1920,1080],
        r720p: [1280,720],
        r480p: [854,480],
        r360p: [640,360],
        r240p: [426,240]
        });
    that.resolution.onFinishChange(function(value) {
        var width_height = value.split(',');
        this.object[this.property] = {width: parseInt(width_height[0]), height: parseInt(width_height[1])};
        window.onresize();
    });
    that.resolution.setValue(window.app.resolution);//Set default
    gui.remember(that.resolution);

    //FullScreen
    that.fullscreen = gui.controls.settings.add(window.app, 'fullscreen');
    that.fullscreen.onFinishChange(function(value) {
        window.toggleFullscreen(value, document.documentElement);
    });
    that.fullscreen.setValue(window.app.fullscreen);//Set default

    //Touch
    that.touch = gui.controls.settings.add(window.app, 'touch');
    that.touch.onFinishChange(function(value) {
        
    });
    that.touch.setValue(window.app.touch);//Set default

    //Sound
    that.sound = gui.controls.settings.add(window.app, 'sound');
    that.sound.onFinishChange(function(value) {
        
    });
    that.sound.setValue(window.app.sound);//Set default
})(gui);