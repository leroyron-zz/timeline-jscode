/*
windowApp: Window and canvases dat.gui
WINDOW, APP, GUI and DATA Controls

@author leroyron / http://leroy.ron@gmail.com
*/
window.app = 
{
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: '1280,720',
    fullscreen: true,
    touch: false,
    pointers: {inUse: false},
    marquee: {},
    motionblur:
    {
      shutterspeed:2,
      influence: 10,
    },
    uniforms:
    {
      godray_amount: 15,
      screenshadow_alpha:1,
      ash_direction: 3
    },
    sound: true
}

window.canvases = [];
window.createCanvas;
window.container;
window.info;//Added info for app output(Remove at will)
window.stats;//Added stats for app output(Remove at will)
//context App inside of a container
window.context = function(parent, child) 
{
    container = document.getElementById(parent);
    info = document.getElementById(child);//Added info for app output(Remove at will)
    stats = new Stats();//Added stats for app output(Remove at will)
    stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
    info.appendChild( stats.dom );//Added stats for app output(Remove at will)
    createCanvas =  function(option) 
    {
        var canvas = {};
        if (option != '3d') 
        {
          canvas.node = document.createElement('canvas');
          canvas.context = canvas.node.getContext('2d');
        }
        else 
        {
          canvas.renderer = new THREE.WebGLRenderer();
          canvas.renderer.setSize(app.resolution.width, app.resolution.height);
          canvas.renderer.setClearColor(0x061928);
          canvas.renderer.context.scene = new THREE.Scene();
          //canvas.renderer.context.scene.fog = new THREE.FogExp2( 0x061928, 0.025 );
          canvas.renderer.context.camera = new THREE.PerspectiveCamera(100, app.width/app.height, 1, 100000);
          canvas.context = canvas.renderer.context;
          canvas.node = canvas.renderer.domElement;
          canvas.node.tabindex = "1";
        }
        canvas.node.width = app.resolution.width;
        canvas.node.height = app.resolution.height;
        canvas.node.style.width = app.width+'px';
        canvas.node.style.height = app.height+'px';
        container.appendChild(canvas.node);
        window.canvases.push(canvas);
        return canvas;
    }
}
//resize App inside of container
window.onresize = function onresize() 
{
	app.width = window.innerWidth;
	app.height = window.innerHeight;
    if (window.canvases.length > 0)//Resize all canvases
        for (var cvi=0,cvslen=canvases.length; cvi<cvslen; cvi++) 
        {
            if (typeof canvases[cvi].id != 'undefined')
              continue;
            if (canvases[cvi].renderer) {
              canvases[cvi].renderer.setSize(app.resolution.width, app.resolution.height);
              canvases[cvi].renderer.render(canvases[cvi].context.scene, canvases[cvi].context.camera);
              canvases[cvi].context.camera.updateProjectionMatrix();
            }
            canvases[cvi].node.width = app.resolution.width;
            canvases[cvi].node.height = app.resolution.height;
            canvases[cvi].node.style.width = app.width+'px';
            canvases[cvi].node.style.height = app.height+'px';
            canvases[cvi].app.resolution(window.app);
        }
  this.resizeCallbacks();
}

window.launchFullscreen = function(element) 
{
  if(element.requestFullscreen) 
  {
    element.requestFullscreen();
  } 
  else if(element.mozRequestFullScreen) 
  {
    element.mozRequestFullScreen();
  } 
  else if(element.webkitRequestFullscreen) 
  {
    element.webkitRequestFullscreen();
  } 
  else if(element.msRequestFullscreen) 
  {
    element.msRequestFullscreen();
  }
}
window.exitFullscreen = function(element) 
{
  if(document.exitFullscreen) 
  {
    document.exitFullscreen();
  } 
  else if(document.mozCancelFullScreen) 
  {
    document.mozCancelFullScreen();
  } 
  else if(document.webkitExitFullscreen) 
  {
    document.webkitExitFullscreen();
  }
}
window.toggleFullscreen = function(bool, elem) 
{
    if (!bool) 
    {
        window.exitFullscreen();
    } 
    else 
    {
        window.launchFullscreen(elem);
    }
    window.setTimeout(window.onresize(), 1000);  
}
window.update = function() 
{
    this.updateCallbacks();
}
window.resizeCalls = [];
window.resizeCallbacks = function () {
    for ( var r=0; r<resizeCalls.length; r++ ) {
        this.resizeCalls[r]();
    }
}