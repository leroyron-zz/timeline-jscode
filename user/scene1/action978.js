var Authority = function (app = window.app || {}, THREE = window.THREE || {}, canvas = window.canvas || {}, ctx = window.ctx || {}) {
    this.actionID = 978

    var thrust = function (velocity) {
        // Three.js var lat = 90 - (Math.acos(y / sphereRadius)) * 180 / Math.PI;
        // var lon = ((270 + (Math.atan2(x , y)) * 180 / Math.PI) % 360) -180;
        // Three.js var lon = ((270 + (Math.atan2(x , z)) * 180 / Math.PI) % 360) -180;
        return false
    }

    ctx.scene.nodes.craft1.properties = {
        velocity:
        {
            vector: {x: -1, y: 1, z: 0},
            rotation: {x: 1, y: -1, z: 1}
        },
        speed:
        {
            vector: {x: 1, y: 1, z: 0},
            rotation: {x: 10, y: 5, z: 22}
        },
        thrusts:
        {
            forwardthrust: {vector: {x: 1, y: 1, z: 0}, thurst: function () { thrust(this.vector) }},
            backwardsthrust: {vector: {x: 1, y: 1, z: 0}, thurst: function () { thrust(this.vector) }}
        }
    }

    this.main = function () {

    }
    return this
}
