/*
dat.gui AddOn

@author leroyron / http://leroy.ron@gmail.com
//handels callbacks
*/
var gui = new dat.GUI({
    load: JSON,
    preset: 'Chrome'
});

gui.addon = {};

gui.addon.onchange = function(controller, func) 
{
    controller.onChange(function(val) {
        //ToDo - !!do val check!!
        func(this);
    });
}

gui.addon.onupdate = function( controller, update, func ) 
{
    update.updateCalls.push([controller, func]);
    update.uclen++;
}

gui.addon.onruntime = function( controller, runtime, func ) 
{
    runtime.runtimeCalls.push([controller, func]);
    runtime.rclen++;
}

gui.addon.onpass = function( controller, pass, func ) 
{
    pass.passCalls.push([controller, func]);
    pass.pclen++;
}