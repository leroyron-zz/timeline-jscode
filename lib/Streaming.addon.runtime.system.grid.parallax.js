/**
 * AddOn: runtime system.grid.parallax
 * //Systems grid system parallax matrix
 * //allowing parallax optimization
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Streaming) {
    var _struct = Streaming.prototype
    var _runtime = _struct.addon.runtime
    var _system = _runtime.system
    var _grid = _system.grid
    var That = _grid.parallax = function () {
        var grid
        this.update = function () {

            return this
        }
        this.field = function () {
            grid = arguments[0]
            return this
        }
        this.separation = function () {

            return this
        }
        this.update = function () {

            return this
        }
        this.func = function () {
            
            return this
        }
        this.move = function () {
            
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
