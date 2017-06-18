// coordinate system according to GLSL viewport [+1, -1] for easy migration between 2d and 3d context
// convert viewport to normal x: pointer.viewport.x / 2 + 0.5, y: -pointer.viewport.y / 2 + 0.5
// convert normal to viewport x: pointer.normal.x * 2 - 1, y: -pointer.normal.y * 2 + 1
this.ctx.discoverRenderer = function (method) {
    return method.constructor.name == 'CanvasRenderingContext2D' ? '2d' : '3d'
}

this.ctx.sprite = function (src, x, y, z, width, height, align, rotate, scale, alpha, sprite, properties, callback, args) {
    this.mode = this.discoverRenderer(this)
    if (this.mode == '2d') {
        this.sprite = function (src, x, y, width, height, align, rotate, scale, alpha, sprite, properties, callback, args) {
            var pass = [arguments[0],
                arguments[1],
                arguments[2],
                undefined,
                arguments[3],
                arguments[4],
                arguments[5],
                arguments[6],
                arguments[7],
                arguments[8],
                arguments[9],
                arguments[10],
                arguments[11],
                arguments[12]]
            return this.Image.apply(this, pass)
        }
    } else {
        this.sprite = function (src, x, y, z, width, height, align, rotate, scale, alpha, sprite, properties, callback, args) {
            var pass = [arguments[0],
                arguments[1],
                arguments[2],
                arguments[3],
                arguments[4],
                arguments[5],
                arguments[6],
                arguments[7],
                arguments[8],
                arguments[9],
                arguments[10],
                arguments[11],
                arguments[12],
                arguments[13]]
            return this.Image.apply(this, pass)
        }
    }

    return this.sprite.apply(this, arguments)
}
var Check = function (str, associate) {
    for (let ci = 0; ci < associate.length; ci++) {
        if (str == associate[ci]) return false
    }
    return true
}
var Optin = function (obj, associate) {
    var opt = {obj: obj}
    var deassociate = []
    for (let oi in opt.obj) {
        if (Check(oi, associate)) deassociate.push(oi)
    }
    for (let di = 0; di < deassociate.length; di++) {
        delete opt.obj[deassociate[di]]
    }
    return opt.obj
}

this.ctx.Image = function (src, x, y, z, width, height, align, rotate, scale, alpha, sprite, properties, callback, args) {
    // 2D Canvas
    var coords = this.coords({x: x, y: y, width: width, height: height})
    var img = new window.Image()
    img.name = /^(.+?)(\w*)(?:(\.[^.]*$)|$)/g.exec(src)[2] // http://regexr.com/3g2qj
    img.position = {x: coords.x, y: coords.y, z: z}
    img.measure = {width: coords.width, height: coords.height}
    img.position.offset =
    align == 'center' || align == 'CC' ? {left: coords.width / 2, top: coords.height / 2}
    : align == 'CL' ? {top: coords.width / 2, left: 0}
    : align == 'CR' ? {top: coords.width / 2, left: coords.width}
    : align == 'TL' ? {top: 0, left: 0}
    : align == 'TC' ? {top: 0, left: coords.width / 2}
    : align == 'TR' ? {top: 0, left: coords.width}
    : align == 'BL' ? {top: coords.height, left: 0}
    : align == 'BC' ? {top: coords.height, left: coords.width / 2}
    : align == 'BR' ? {top: coords.height, left: coords.width}
    : {left: 0, top: 0}

    img.rotate = {value: rotate || 0, type: 'rotation'}
    img.scale = {value: scale || 0.01} // 0 changed 0.01 for multiplicity during buffing
    img.alpha = {value: alpha || 0.01}
    img.sprite = {value: sprite || 0}
    if (properties) for (let pi = 0; pi < properties.length; pi++) img[properties[pi][0]] = properties[pi][1]
    img.callback = callback || function () {}
    img.args = args || []
    img.onload = function () {
        if (this.args.length > 0) { this.callback.apply(this, this.args) } else { this.callback() }
        this.callback = this.onload = undefined
    }
    img.src = src

    // TO-DO
    // THREEJS Particle
    // THREEJS GLSL
    /* for now /// */
    if (!img.material) {
        img.material = {
            attribute: {
                position: img.position,
                // rotation: img.rotation, 3d
                measure: img.measure
            }
        }
        img.material = {
            uniforms: {
                rotate: img.rotate, // 2d
                scale: img.scale,
                alpha: img.alpha,
                sprite: img.sprite
            }
        }
    }
    /**/
    return img
}

// check if viewport value
this.ctx.inView = function (val) {
    return val <= 1 && val >= -1 // universal, otherwise // (this.mode == '2d' && val <= 1 && val >= 0) || (this.mode == '3d' && val <= 1 && val >= -1)
}

this.ctx.coords = function (node) {
    let coords = ['x', 'y', 'width', 'height']
    for (let ci = 0; ci < coords.length; ci++) {
        if (node[coords[ci]]) {
            node[coords[ci]] =
            isNaN(node[coords[ci]])
            ? /\d+/gi.exec(node[coords[ci]]) << 0 // leave value as is eg. 100px => 100
            : !this.inView(node[coords[ci]]) && (coords[ci] == 'x' || coords[ci] == 'width')
            ? ((node[coords[ci]] / this.canvas.width) * 2 - 1)
            : !this.inView(node[coords[ci]]) && (coords[ci] == 'y' || coords[ci] == 'height')
            ? (-(node[coords[ci]] / this.canvas.height) * 2 + 1)
            : node[coords[ci]]
        }
    }
    return node
}

this.ctx.coords.prototype.viewport = function (normal) {
    normal.x = normal.x * 2 - 1
    normal.y = -normal.y * 2 + 1
}

this.ctx.coords.prototype.normal = function (viewport) {
    viewport.x = viewport.x / 2 + 0.5
    viewport.y = -viewport.y / 2 + 0.5
}

this.ctx.loadScript = function (src, callback) {
    src = src.constructor === Array ? src : [src]
    var batch = {source: src, callback: callback}
    var appendScript = function () {
        window.script = document.createElement('script')
        let script = window.script
        script.src = src[0] // THREE scene and stream bindings//
        script.batch = batch
        script.onload = function () {
            // setup binding data for Streaming for the canvas
            this.batch.source.shift()
            if (src.length > 0) appendScript(); else if (this.batch.callback) this.batch.callback()
        }
        document.body.appendChild(script) // or something of the likes
    }
    appendScript()
}
