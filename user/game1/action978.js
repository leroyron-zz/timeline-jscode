var Authority = new function (app, THREE, camera, canvas, ctx) {
    this.actionID = 978
    var duration = 1000 // move to segment Authority duration// have access to current segment authorty in action
                        // segment = segment.Authority

    var buffer = ctx.timeline.addon.buffer
    camera.targetOffset = new THREE.Vector3(0, 0, 0)
    camera.move = new THREE.Vector3(0, 0, 0)

    var heroCraft = ctx.scene.nodes.craft1
    heroCraft.move = new THREE.Vector3(0, 0, 0)
    heroCraft.direction = new THREE.Vector3(0, 0, -1).applyQuaternion(heroCraft.quaternion)
    heroCraft.hover = new THREE.Vector3(0, 1, -1).applyQuaternion(heroCraft.quaternion)
    heroCraft.ctrl = {
        velocity:
        {
            vector:
            {
                position: {x: 0, y: 0, z: 0},
                rotation: {x: 0, y: 0, z: 0}
            }
        },
        speed:
        {
            vector:
            {
                position: {x: 0, y: 0, z: 0},
                rotation: {x: 0, y: 0, z: 0}
            }
        },
        thrusts:
        {
            forwardthrust: {vector: {x: 0, y: 0, z: 0}, thurst: function () { thrust(this.velocity) }},
            backwardsthrust: {vector: {x: 0, y: 0, z: 0}, thurst: function () { thrust(this.velocity) }}
        },
        playstate:
        {
            drive: 'low', // low(1), high(2), hyper(3), zero(4)
            turning: 'no', // no(0), yes(1)
            shifting: 'no', // no, yes
            rolling: 'no', // no, in(1), out(2)
            looping: 'no', // no, in(1), out(2)
            shooting: 'no', // no, guns(1), missiles(2), combine(3)
            targeting: 'no', // no, yes
            targeted: 'no', // no, yes
            key: 0, // 0 // up(1) - right(3) - down(5) - left(7)
            code: 1000000000 // max ArrayBuffer integer digit limit for 32Bit
            // ^https://en.wikipedia.org/wiki/2147483647_(number) 10 digits max javascript could take in 32 Int ArrayBuffer
        }
    }

    var playcodeLen = heroCraft.ctrl.playstate.code.toString().length

    // the playstates for heroCraft will br recorded and sent to the stream
    // for accurate playback
    // it's is best to cache reoccuring values for performance
    // Math.Cache.nines*Array* is used to eval playstates digit by digit (1000000000)
    var cacheNines = function (digits) {
        var elevens = 0
        var bufferArray = new Int32Array(new ArrayBuffer(digits * 4))
        for (let d = 0; d < digits; ++d) {
            bufferArray[d] = 9 * elevens
            elevens += Math.pow(10, d)
        }
        return bufferArray
    }
    Math.Cache.store('nines', cacheNines, playcodeLen)// optimizing runtime Math
    cacheNines = null

    function driveLow (node) {
        // get direction vector of craft
        // buff stream for a duration between segments (978 - 1978 = 1000) from the current timeframe position
        // allow reverting
        // buff x, y, z in that direction depending on speed
        node.move.fromArray([200, 200, 200])
        // node.move.copy(heroCraft.reticle.far)
        node.direction.fromArray([0, 0, -1])
        node.direction.applyQuaternion(node.quaternion)
        node.move.multiply(node.direction)

        camera.easing = {in: 0.15, out: 0.85} // determine distance from camera percent to fillin easing frames
        camera.easing.position = buffer.eval('timeline',
            [
                [
                    [node.position], [
                        [['x', node.move.x]],
                        [['y', node.move.y]],
                        [['z', node.move.z]]],
                        [['linear', duration]]// start from current frame
                ]
            ],
        true, undefined, duration * camera.easing.in)// get values
    }
    var playCode = function (node) {
        for (let p = 0; p < playcodeLen; ++p) {
            let a = node.ctrl.playstate.code
            if (a > Math.Cache.nines[p]) {
                while (a > Math.Cache.nines[p + 1]) {
                    a = (a / 10) << 0 // Use bitwise '<<' operator to force integer result.
                }
                a = a % 10

                switch (p) {
                case 0:// drive
                    switch (a) { // low(1), high(2), hyper(3), zero(4)
                    case 1: driveLow(node); break
                    case 2: break
                    case 3: break
                    case 4:
                    default:
                        break
                    }
                    break
                case 1:// turning
                    switch (a) { // no(0), yes(1)
                    case 0:
                    case 1:
                    default:
                        break
                    }
                    break
                case 2:// shifting
                    switch (a) { // no, yes
                    case 0:
                    case 1:
                    default:
                        break
                    }
                    break
                case 3:// rolling
                    switch (a) { // no, in(1), out(2)
                    case 0:
                    case 1:
                    case 2:
                    default:
                        break
                    }
                    break
                case 4:// looping
                    switch (a) { // no, in(1), out(2)
                    case 0:
                    case 1:
                    case 2:
                    default:
                        break
                    }
                    break
                case 5:// shooting
                    switch (a) { // no, guns(1), missiles(2), combine(3)
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    default:
                        break
                    }
                    break
                case 6:// targeting
                    switch (a) { // no, yes
                    case 0:
                    case 1:
                    default:
                        break
                    }
                    break
                case 7:// targeted
                    switch (a) { // no, yes
                    case 0:
                    case 1:
                    default:
                        break
                    }
                    break
                case 8:// key
                    switch (a) {
                    default:
                        break
                    }
                    break
                default:
                    break
                }
                console.log(a % 10)
            } else {
                // Handle the cases where a has only one digit.
            }
        }
    }

    this.main = function () {
        camera.controls.enabled = false

        heroCraft.rotation.onChange(function () {
            if (!camera.controls.enabled && !this.blockCallback) {
                this.blockCallback = true
                heroCraft.quaternion.setFromEuler(this, false)
                // return
                if (!camera.easing)
                    return
                camera.move.copy(heroCraft.position)
                camera.move.sub(camera.position)// move camera to craft position
                camera.move.add(camera.easing.position)// move camera to craft position

                heroCraft.hover.fromArray([0, -0.25, -1])
                heroCraft.hover.applyQuaternion(heroCraft.quaternion)

                camera.targetOffset.fromArray([-15, -15, -15])
                // camera.targetOffset.multiply(heroCraft.direction)// then offset directly at the back
                camera.targetOffset.multiply(heroCraft.hover)// then offset directly over top

                camera.move.add(camera.targetOffset)// move camera to craft end position

                buffer.eval('timeline',
                    [
                        [
                            [camera.position], [
                                [['x', camera.move.x]],
                                [['y', camera.move.y]],
                                [['z', camera.move.z]]],
                                [['easeInQuint', duration * camera.easing.in]]
                        ]
                    ],
                true)

                camera.move.copy(heroCraft.move)// copy end position then subtract
                camera.move.sub(camera.easing.position)// relative values
                buffer.eval('timeline',
                    [
                        [
                            [camera.position], [
                                [['x', camera.move.x]],
                                [['y', camera.move.y]],
                                [['z', camera.move.z]]],
                                [['linear', duration * camera.easing.out]],
                            duration * camera.easing.in
                        ]
                    ],
                true)

                camera.lookAt(heroCraft.reticle.position)
            }
        })
        playCode(heroCraft)

        canvas.node.onmousemove = canvas.node.ontouchmove = function (e) {
            e.preventDefault()
            if (!app.pointers.inUse) {
                if (typeof e.changedTouches == 'undefined') {
                    app.pointers[0] = touch(e)
                    let x = app.pointers[0].pageX - this.offsetLeft
                    let y = app.pointers[0].pageY - this.offsetTop
                    raycaster.setFromCamera(new THREE.Vector2(((x / this.clientWidth) * 2 - 1), (-(y / this.clientHeight) * 2 + 1)), ctx.camera)
                    heroCraft.reticle.mid.fromArray([500, 500, 500])
                    heroCraft.reticle.mid.multiply(raycaster.ray.direction)
                    heroCraft.reticle.mid.add(camera.position)
                    heroCraft.reticle.position.copy(heroCraft.reticle.mid)
                } else {
                    for (let tm = 0, dlen = e.changedTouches.length; tm < dlen; tm++) {
                        let id = e.changedTouches[tm].identifier
                        app.pointers[id] = touch(e.changedTouches[tm])
                    }
                }
                return
            }

            if (typeof e.changedTouches == 'undefined') {
                app.pointers[0] = touch(e)
                console.log('press move: mouse' + app.pointers[0].pageX)
            } else {
                for (let tm = 0, dlen = e.changedTouches.length; tm < dlen; tm++) {
                    let id = e.changedTouches[tm].identifier
                    app.pointers[id] = touch(e.changedTouches[tm])
                    console.log('press move: touch ' + app.pointers[id].pageX)
                }
            }
            // playCode(heroCraft)
        }


        var raycaster = new THREE.Raycaster()
        canvas.node.onmousedown = canvas.node.ontouchstart = function (e) {
            e.preventDefault()
            if (!app.pointers.enabled) {
                return
            }

            app.pointers.inUse = true

            if (typeof e.changedTouches == 'undefined') {
                app.pointers[0] = touch(e)
                console.log('press down: mouse' + app.pointers[0].pageX)
                // debugger
                heroCraft.reticle.mid.multiply({x: -1, y: -1, z: -1})
                heroCraft.lookAt(heroCraft.reticle.mid)
            } else {
                for (let ts = 0, dlen = e.changedTouches.length; ts < dlen; ts++) {
                    let id = e.changedTouches[ts].identifier
                    app.pointers[id] = touch(e.changedTouches[ts])
                    console.log('press down: touch' + app.pointers[id].pageX)
                    if (e.changedTouches[ts].identifier == 0) {
                        // console.log('touch: ' + e.changedTouches[ts].identifier)
                    } else if (e.changedTouches[ts].identifier > 0) {
                        app.pointers.multi = true
                        // console.log('touch: ' + e.changedTouches[ts].identifier + '(multi)')
                    }
                }
            }
            // playCode(heroCraft)
            // console.log(JSON.stringify(app.pointers))
        }

        canvas.node.onmouseup = canvas.node.ontouchend = function (e) {
            e.preventDefault()
            if (!app.pointers.enabled) {
                return
            }

            if (typeof e.changedTouches == 'undefined') {
                app.pointers.inUse = false
                app.pointers[0] = touch(e)
                console.log('press up: mouse' + app.pointers[0].pageX)
                delete app.pointers[0]
            } else {
                if (e.targetTouches.length == 0) {
                    app.pointers.inUse = false
                    // console.log('press up: touch')
                }

                if (e.targetTouches.length < 2) {
                    app.pointers.multi = false
                    // console.log('touch: (not-multi)')
                } else {
                    // console.log('touch: (multi)')
                }

                for (let te = 0, dlen = e.changedTouches.length; te < dlen; te++) {
                    if (!touchExists(e.targetTouches, e.changedTouches[te].identifier)) {
                        let id = e.changedTouches[te].identifier
                        app.pointers[id] = touch(e.changedTouches[te])
                        console.log('touch: ' + id + ' ' + app.pointers[id].pageX)
                        delete app.pointers[id]
                    }
                }
            }
            // console.log(JSON.stringify(app.pointers))
            // playCode(heroCraft)
        }

        ctx.camera.controls.target = heroCraft.position
        heroCraft.reticle = createSprite(1, 0, 0, 0, app.fileLocAssets + 'sprites/reticle.png')[0]
        heroCraft.reticle.move = new THREE.Vector3(0, 0, 0)
        heroCraft.reticle.near = new THREE.Vector3(100, 100, 100)
        heroCraft.reticle.mid = new THREE.Vector3(500, 500, 500)
        heroCraft.reticle.far = new THREE.Vector3(1000, 1000, 1000)
        ctx.calc = function () {
            if (ctx.scene.nodes.starwall) {
                ctx.scene.nodes.starwall.material.materials[0].map.offset.x += 0.002
            }
            if (ctx.camera.controls.enabled) {
                ctx.camera.controls.update() // required if ctx.camera.controls.enableDamping = true, or if ctx.camera.controls.autoRotate = true
            } else {
                ctx.camera.lookAt(heroCraft.position)
            }
        }

        ctx.compute = function () {

        }
    }

    var touch = function (e) {
        e.area = e.pageX > canvas.width / 2 ? 'left' : 'right'
        return e
    }
    var touchExists = function (touchArr, match) {
        for (let ct = 0, tlen = touchArr.length; ct < tlen; ct++) {
            if (touchArr[ct].identifier === match) return true
        }
        return false
    }
    function thrust (velocity) {
        // Three.js var lat = 90 - (Math.acos(y / sphereRadius)) * 180 / Math.PI;
        // var lon = ((270 + (Math.atan2(x , y)) * 180 / Math.PI) % 360) -180;
        // Three.js var lon = ((270 + (Math.atan2(x , z)) * 180 / Math.PI) % 360) -180;
        return false
    }

    function createSprite (num, x, y, z, url) {
        var geometries = []
        var textureLoader = new THREE.TextureLoader()

        var sprite1 = textureLoader.load(url)
        geometries.push(vertices(num, x, y, z))

        function vertices (num, x, y, z) {
            var geometry = new THREE.Geometry()
            for (let i = 0; i < num; i++) {
                var vertex = new THREE.Vector3()
                vertex.x = x
                vertex.y = y
                vertex.z = z

                geometry.vertices.push(vertex)
            }
            return geometry
        }

        var parameters = [
            [ [1.0, 1.0, 1.0], sprite1, 100 ]
        ]

        var src = [ 'ZeroFactor', 'OneFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor', 'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor' ]
        //          '200'         '201'        '204'             '205'                     '206'             '207'                     '208'             '209'                     '210'
        var dst = [ 'ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor' ]
        //          '200'         '201'        '208'             '203'                     '204'             '205'                     '206'             '207'
        var blending = 'CustomBlending'

        var materials = []
        for (let i = 0; i < parameters.length; i++) {
            let color = parameters[i][0]
            let sprite = parameters[i][1]
            let size = parameters[i][2]
            materials[i] = new THREE.PointsMaterial({
                size: size,
                map: sprite,
                blending: THREE[blending],
                blendSrc: THREE[src[2]],
                blendDst: THREE[dst[6]],
                blendEquation: THREE.AddEquation,
                depthTest: false,
                depthWrite: false,
                transparent: true
            })
            materials[i].color.setHSL(color[0], color[1], color[2])

            var gfx = new THREE.Points(geometries[i], materials[i])
            gfx.sortParticles = true
            geometries[i] = gfx
            ctx.scene.add(gfx)
        }

        return geometries
    }

    return this
}(this.app, this.THREE, this.ctx.camera, this.canvas, this.ctx)
