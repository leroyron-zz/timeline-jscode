Math.Cache = {}
// Storing math data/functions for access and performance
Math.Cache.store = function (prop, func, apply) {
    Math.Cache[prop] = func.apply(this, [apply])
}
