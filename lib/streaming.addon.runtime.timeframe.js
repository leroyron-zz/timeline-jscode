/*
AddOn: timeframe
Time-baised thrusting
TimeFrame thrust bit by bit through datasets in the stream
basied on CPU clock-time.

@author leroyron / http://leroy.ron@gmail.com
*/
(function (streaming) {
    var _struct = streaming.prototype;
    var _runtime = _struct.addon.runtime; 
    var that = _struct.addon.timeframe = {};
    that.stream = undefined,//setup to invoke a function each frame//new streaming.addon.timeframe.invoke = function () {}
    that.invoke = undefined,//setup to invoke a function each frame//new streaming.addon.timeframe.invoke = function () {}
    that.length = undefined,
    that.running = false,
    that.lapse = 10,
    that.duration = 0,
    that.thrust = 0; 
    that.runtime = function() 
    {
        this.runtimeCallbacks();
    }
    that.runtimeCalls = [];
    that.rclen = 0;
    that.runtimeCallbacks = function () {
        for ( var r=0; r<this.rclen; r++ ) {
            this.runtimeCalls[r][1](this.runtimeCalls[r][0]);
        }
    }
    that.update = function() 
    {
        time.invoke = this.invoke;
        time.length = this.length;
        time.running = this.running;
        time.lapse = this.lapse;
        this.updateCallbacks();
    }
    that.updateCalls = [];
    that.uclen = 0;
    that.updateCallbacks = function () {
        for ( var c=0; c<this.uclen; c++ ) {
            this.updateCalls[c][1](this.updateCalls[c][0]);
        }
    }

    that.run = function(stream)
    {
        if (!this.running) 
        {
            this.stream = stream;
            this.length = _runtime[stream].length;
            this.running = true;
            this.update();
            frame();
        }
    }
    that.stop = function()
    {
        if (this.running) 
        {
            this.running = false;
            this.update();
            window.cancelAnimationFrame(time.animationFrameLoop);
        }
    }
    that.keyPauseToggle = function(e) 
    {
        if (e) 
        {
            console.log('KeyCode:'+e.keyCode);
            if (e.keyCode != 32)
                return;
            if (this.running) 
            {
                this.stop();
            } else {
                this.run(this.stream);
            }
        }
    };

    //Private
    var time = {_then: Date.now(), _remain: 0, lapse: that.lapse};
    var frame = function() 
    {
        window.stats.begin();
        time.now = Date.now();
        time._delta = time.now - time._then + time._remain;
        that.thrust = time._deltaTimeFrame = time._delta / 10 << 0;
        time._remain = time._delta - (time._deltaTimeFrame * 10);//get remainder for percision
        time._then = time.now;
        if (time._deltaTimeFrame > 0 && time._deltaTimeFrame < time.lapse && time.running) 
        {
            //values summed up overtime and passed to node properties
            that.duration += time._deltaTimeFrame;
            _runtime.access.thrust(time._deltaTimeFrame);
            time.invoke();
            that.runtime();
            
        } else if (time._deltaTimeFrame > time.lapse) {
            //time.lapse; if CPU halts the streams for too long then stop process
        }
        time.animationFrameLoop = window.requestAnimationFrame(frame);
        window.stats.end();
    }
})(streaming);
