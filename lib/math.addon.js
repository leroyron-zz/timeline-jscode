// Converts from degrees to radians.
Math.radians = function (degrees) {
    return degrees * Math.PI / 180
}

// Converts from radians to degrees.
Math.degrees = function (radians) {
    return radians * 180 / Math.PI
}

// Returns a fraction of value.
Math.lerp = function (val, frac) {
    return val*frac
}

// Returns a fraction of two comparable value.
Math.lerpSubject = function (val1, val2, frac) {
    return this.lerp((val1-val2), frac)
    //Useage - obj.x += Math.lerpSubject(move, obj.x, obj.speed);
}

// Assigns value directly to object property
Math.lerpProp = function (obj, prop, val, frac) {
    obj[prop] += this.lerpSubject(val, obj[prop], frac)
    // Useage - Math.lerpProp(obj, 'x', move, obj.speed);
}

// Get distance
Math.distance2 = function (p1, p2) {
    var a = p1.x - p2.x
    var b = p1.y - p2.y
    return Math.sqrt( a*a + b*b );
}

// Random number from to
Math.randomFromTo = function(from, to) {
    return Math.floor((Math.random() * (to-from)) + from);
};