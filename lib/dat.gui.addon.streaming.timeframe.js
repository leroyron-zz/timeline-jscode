/*
dat.gui.streaming AddOn: timeframe

@author leroyron / http://leroy.ron@gmail.com
*/
(function ( gui ) 
{
    var that = gui.addon.streaming.timeframe;
    var _onupdate = function( controller ) 
    {
        controller.updateDisplay();
    }
    var _onchange = function( controller, change ) 
    {
        that.update();
    }
    var _onruntime = function( controller ) 
    {
        controller.updateDisplay();
    }

    gui.controls.streaming.__folders.access.addFolder( 'timeframe' ).open();

    var _running = gui.controls.streaming.__folders.access.__folders.timeframe.add( that, 'running' );
        gui.addon.onchange( _running, _onchange );
        gui.addon.onupdate( _running, that, _onupdate );

    var _lapse = gui.controls.streaming.__folders.access.__folders.timeframe.add( that, 'lapse' );
        gui.addon.onchange( _lapse, _onchange );

    gui.controls.streaming.__folders.access.__folders.timeframe.addFolder( 'runtime' );
    var _thrust = gui.controls.streaming.__folders.access.__folders.timeframe.__folders.runtime.add( that, 'thrust');
        gui.addon.onruntime (_thrust, that, _onruntime );

})( gui );