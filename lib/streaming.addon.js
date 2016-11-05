/**
 * AddOn attaching for open Streaming
 * @author leroyron / http://leroy.ron@gmail.com
 * //_struct.addon: attach to Streaming to give addons access to data
 */
(function (Streaming) {
    var _struct = Streaming.prototype
    _struct.addon = {}
    // open access
    // override open and access construct and attach access to
    // addons are carried down to access level
    // @Streaming this.open = this.open || func

    // base constructor override
    _struct.open = function () {
        var _openlevel = this.open.prototype
        _openlevel.addon = _struct.addon

        // remove base constructor override and refresh class
        _struct.open = undefined
        var openlevel = new Streaming()

        // access level
        // @Streaming // reference access base constructor
        openlevel._access = openlevel.access

        var _accesslevel = openlevel._access.prototype
        _accesslevel.addon = _openlevel.addon

        openlevel.access = function () {
            // run access and expose access to addons
            this.access = this._access
            var accesslevel = this.access.apply(this, arguments)

            for (var addon in this.addon) {
                for (var func in this.addon[addon]) {
                    if (func == 'access') {
                        this.addon[addon][func] = accesslevel
                    }
                }
            }

            return accesslevel
        }

        return openlevel
    }
})(this.Streaming)
