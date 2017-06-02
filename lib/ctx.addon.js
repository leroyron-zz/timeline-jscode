// coordinate system according to GLSL viewport [+1, -1] for easy migration between 2d and 3d context
// convert viewport to normal x: pointer.viewport.x / 2 + 0.5, y: -pointer.viewport.y / 2 + 0.5
// convert normal to viewport x: pointer.normal.x * 2 - 1, y: -pointer.normal.y * 2 + 1
this.ctx.discoverRenderer = function (method) {
    return method.constructor.name == 'CanvasRenderingContext2D' ? '2d' : '3d'
}

this.ctx.sprite = function (src, x, y, z, width, height, rotate, scale, alpha, sprite, properties, callback, args) {
    var mode = this.discoverRenderer(this)
    if (mode == '2d') {
        this.sprite = function (src, x, y, width, height, rotate, scale, alpha, sprite, properties, callback, args) {
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
                arguments[11]]
            return this.Image.apply(this, pass)
        }
    } else {
        this.sprite = function (src, x, y, z, width, height, rotate, scale, alpha, sprite, properties, callback, args) {
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
                arguments[12]]
            return this.Image.apply(this, pass)
        }
    }

    return this.sprite.apply(this, arguments)
}

this.ctx.Image = function (src, x, y, z, width, height, rotate, scale, alpha, sprite, properties, callback, args) {
    // 2D Canvas
    var coords = this.coords({x: x, y: y, width: width, height: height})
    var img = new window.Image()
    img.name = /^(.+?)(\w*)(?:(\.[^.]*$)|$)/g.exec(src)[2] // http://regexr.com/3g2qj
    img.position = {x: coords.x, y: coords.y, z: z}
    img.measure = {width: coords.width, height: coords.height}
    img.rotate = rotate || 0
    img.scale = scale || 0
    img.alpha = alpha || 0
    img.sprite = sprite || 0
    img.callback = callback
    img.args = args
    for (var pi = 0; pi < properties.length; pi++) {
        img[properties[pi][0]] = properties[pi][1]
    }
    img.onload = function () {
        if (this.args.length > 0) { this.callback.apply(this, this.args) } else { this.callback() }
        this.callback = this.onload = undefined
    }
    img.src = src
    return img

    // TO-DO
    // THREEJS Particle
    // THREEJS GLSL
}

// check if viewport value
this.ctx.inView = function (val) {
    return val <= 1 && val >= -1
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

