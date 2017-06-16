/**
 * To-Do 
 * STILL WORKING ON THIS
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Streaming) {
    var _struct = Streaming.prototype
    var _runtime = _struct.addon.runtime
    var _system = _runtime.system
    var _grid = _system.grid
    var _parallax = _grid.parallax
    var That = _parallax.physic = function () {
        var element = {}
        var result = {}

        this.bind = function () {

            return this
        }
        this.result = function (callForward) {
            result = callForward
            return this
        }
        this.init = function () {
            
            return this
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
})(this.Streaming)
