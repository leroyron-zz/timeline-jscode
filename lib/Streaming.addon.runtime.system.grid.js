/**
 * AddOn: runtime system.grid
 * //Systems grid system to copulate portions
 * //allowing each grid block to be rendererd for optimal performance
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Streaming) {
    var _struct = Streaming.prototype
    var _runtime = _struct.addon.runtime
    var _system = _runtime.system
    var That = _system.grid = function () {
        this.layers = {}
        var mode = ''
        var batches = []
        var offsets = []
        var count = 0
        var i = 0
        var column = 0
        var row = 0
        var properties = {}
        this.update = function () {
            return this
        }
        this.mode = function () {
            mode = arguments[0]
            return this
        }
        this.dir = function () {
            this.dir = arguments[0]
            return this
        }
        this.batches = function () {
            batches = arguments
            return this
        }
        this.offsets = function () {
            offsets = arguments
            return this
        }
        this.properties = function () {
            count = arguments[0].count
            this.name = arguments[0].name
            this.columns = arguments[0].columns
            this.rows = arguments[0].rows
            properties.width = arguments[0].width
            properties.height = arguments[0].height
            return this
        }
        this.syntax = function (callForward) {
            this.syntax = callForward
            return this
        }
        this.assign = function (callForward) {
            this.assign = callForward
            return this
        }
        this.init = function () {
            for (let bi = 0; bi < batches.length; bi++) {
                this.batch = {name: batches[bi], index: bi}
                this.layers[this.batch.name] = {offset: offsets[bi], update: this.update, grid: []}
                for (let i = 0; i < count; i++) {
                    let row = i / this.columns << 0
                    let column = i - (row * this.columns)
                    if (!this.layers[this.batch.name].grid[column]) this.layers[this.batch.name].grid[column] = []
                    this.layers[this.batch.name].grid[column][row] = {}
                    this.layers[this.batch.name].grid[column][row] = this.assign(this.syntax(i), i, this.batch, column, row, properties, this.layers[this.batch.name].grid[column][row])
                }
            }
            return this.layers
        }

        for (let construct in That) {
            this[construct] = That[construct]
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
})(this.Streaming)
