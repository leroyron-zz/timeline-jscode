/*
dat.gui.streaming AddOn: buffer

@author leroyron / http://leroy.ron@gmail.com
*/
(function ( gui ) {
    var that = gui.addon.streaming.buffer;
    var _onupdate = function( controller ) 
    {
        controller.updateDisplay();
    }
    var _onchange = function( controller, change ) 
    {
    }
    var _onruntime = function( controller ) 
    {
    }

    var _bufferFolder = gui.controls.streaming.addFolder('buffer');
    var _evals = gui.controls.streaming.__folders.buffer.add(that, 'evals');
        gui.addon.onupdate( _evals, that, _onupdate );
        _bufferFolder.open();
})(gui);