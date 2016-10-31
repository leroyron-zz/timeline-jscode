/*
dat.gui AddOn: streaming

@author leroyron / http://leroy.ron@gmail.com
*/
(function ( gui, streaming ) {
    var _attach = gui.addon.streaming = streaming.prototype.addon;
    var that = _attach.runtime.access;
    var _onupdate = function( controller ) 
    {
    }
    var _onchange = function( controller ) 
    {
        var c = controller.object;
        that.update( c.continuance, c.skip, c.tCount, c.revert, c.mCount, c.leap, c.reset );
    }
    var _onruntime = function( controller ) 
    {
        controller.updateDisplay();
    }
    
    gui.controls.streaming = gui.addFolder('Streaming');
    gui.controls.streaming.open();
    
    gui.controls.streaming.addFolder('access').open();
    var _continuance = gui.controls.streaming.__folders.access.add(that.arguments, 'continuance');
        gui.addon.onchange(_continuance, _onchange);
    var _skip = gui.controls.streaming.__folders.access.add(that.arguments, 'skip');
        gui.addon.onchange(_skip, _onchange);
    var _tCount = gui.controls.streaming.__folders.access.add(that.arguments, 'tCount');
        gui.addon.onchange(_tCount, _onchange);
    var _revert = gui.controls.streaming.__folders.access.add(that.arguments, 'revert');
        gui.addon.onchange(_revert, _onchange);
    var _mCount = gui.controls.streaming.__folders.access.add(that.arguments, 'mCount');
        gui.addon.onchange(_mCount, _onchange);
    var _leap = gui.controls.streaming.__folders.access.add(that.arguments, 'leap');
        gui.addon.onchange(_leap, _onchange);
    var _reset = gui.controls.streaming.__folders.access.add(that.arguments, 'reset');
        gui.addon.onchange(_reset, _onchange);

    gui.controls.streaming.__folders.access.addFolder('runtime');
    var _thrust = gui.controls.streaming.__folders.access.__folders.runtime.add(that, 'tCount');
        gui.addon.onruntime(_thrust, that, _onruntime);
    var _measure = gui.controls.streaming.__folders.access.__folders.runtime.add(that, 'mCount');
        gui.addon.onruntime(_measure, that, _onruntime);
})(gui, streaming);