/**
 * AddOn: runtime system
 * //System utilizing stream
 * //systems that undergo runtime commands and flow
 * //allowing each system to be controlled by runtime process through proxy stream
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Streaming) {
    var _struct = Streaming.prototype
    var _runtime = _struct.addon.runtime
    var That = _runtime.system = function () {
        var Pointer, Grid, Parallax
        this.update = function () {

            return this
        }
        this.proxy = function () {

            return this
        }
        this.init = function () {
            
            return this
        }

        this.Pointer = function () {
            Pointer = That.pointer
            this.Pointer = new Pointer()

            return this
        }

        this.Grid = function () {
            Grid = That.grid
            this.Grid = new Grid()

            return this
        }

        this.Parallax = function () {
            Parallax = Grid.parallax
            this.Parallax = new Parallax()

            return this
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
})(this.Streaming)
