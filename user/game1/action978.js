var Authority = new function (app, THREE, camera, canvas, ctx) {
    this.actionID = 978
    var duration = 1000 // move to segment Authority duration// have access to current segment authorty in action
                        // segment = segment.Authority
    var buffer = ctx.timeline.addon.buffer

    var craft = ctx.scene.nodes.craft1

    craft.ctrl = {
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
            vertical: 50, // 50 center  right/left(*99)
            horizontal: 50, // up/down(*99) -
            code: 1000005050, // max ArrayBuffer integer digit limit for 32Bit
            codeLength: 10
            // ^https://en.wikipedia.org/wiki/2147483647_(number) 10 digits max javascript could take in 32 Int ArrayBuffer
        }
    }
    // the playstates for craft will br recorded and sent to the stream
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
    Math.Cache.store('nines', cacheNines, craft.ctrl.playstate.codeLength)// optimizing runtime Math
    cacheNines = null
    var playCode = function (node) {
        for (let p = 0; p < craft.ctrl.playstate.codeLength; ++p) {
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

    camera.orbital.reticle.tee.persision = function (x, y) {
        craft.ctrl.playstate.vertical = x = 50 - 50 * x << 0
        craft.ctrl.playstate.horizontal = y = 50 - 50 * y << 0

        x = ((x - 50) / -50)
        y = ((y - 50) / -50)
        // Joy mode
        let d = Math.sqrt(x * x + y * y)
        if (d > 0.25) {
            this.position.fromArray([
                x * (d - 0.2),
                y * (d - 0.2),
                0
            ])
            var s = Math.atan2(y, x)
            this.rotation.z = s
            if (!camera.orbital.reticle.tee.dir) {
                camera.orbital.reticle.tee.material.uniforms.texture.value = camera.orbital.reticle.tee.sprites[1]
                camera.orbital.reticle.tee.dir = true
            }
        } else {
            if (camera.orbital.reticle.tee.dir) {
                camera.orbital.reticle.tee.material.uniforms.texture.value = camera.orbital.reticle.tee.sprites[0]
                camera.orbital.reticle.tee.dir = false
            }

            this.position.fromArray([
                0,
                0,
                0
            ])
        }

        // Persision mode
        /* this.position.fromArray([
            x > 0.25 ? x - 0.25 : x < -0.25 ? x + 0.25 : 0,
            y > 0.25 ? y - 0.25 : y < -0.25 ? y + 0.25 : 0,
            0
        ]) */
    }
    craft.rotation.onChange(function () {
        if (!this.blockCallback) {
            this.blockCallback = true
            craft.quaternion.setFromEuler(this, false)
        }
    })

    camera.controls = (function (camera, target, node) {
        // var staticMoving = false
        var rotateSpeed = 0.05

        var axis = new THREE.Vector3()
        var quaternion = new THREE.Quaternion()
        var eyeDirection = new THREE.Vector3()
        var objectUpDirection = new THREE.Vector3()
        var objectSidewaysDirection = new THREE.Vector3()
        var moveDirection = new THREE.Vector3()
        var angle

        var _eye = new THREE.Vector3()

        return new function (camera, target, node) {
            this.active = node
            this.rotateCamera = function (screenVector, node) {
                _eye.subVectors(this.active, target)

                moveDirection.set(screenVector.x, screenVector.y, 0)
                angle = moveDirection.length()

                if (angle) {
                    _eye.copy(this.active).sub(target)

                    eyeDirection.copy(_eye).normalize()
                    objectUpDirection.copy(camera.up).normalize()
                    objectSidewaysDirection.crossVectors(objectUpDirection, eyeDirection).normalize()

                    objectUpDirection.setLength(screenVector.y)
                    objectSidewaysDirection.setLength(screenVector.x)

                    moveDirection.copy(objectUpDirection.add(objectSidewaysDirection))

                    axis.crossVectors(moveDirection, _eye).normalize()

                    angle *= rotateSpeed
                    quaternion.setFromAxisAngle(axis, angle)

                    _eye.applyQuaternion(quaternion)
                    camera.up.applyQuaternion(quaternion)
                }

                this.active.addVectors(target, _eye)

                camera.lookAt(target)
            }
        }(camera, target, node)
    }(camera, camera.orbital.position, camera.move))

    // // MAIN
    this.main = function () {
        camera.ease = 0.005
        // before render
        ctx.calc = function () {
            ctx.scene.nodes.starwall.material.materials[0].map.offset.x += 0.002
            craft.nodes.LTorch.material.materials[0].map.offset.x =
            craft.nodes.RTorch.material.materials[0].map.offset.x =
            craft.nodes.CTorch.material.materials[0].map.offset.x -= 0.11
            craft.nodes.CTorch.scale.z = craft.nodes.CTorch.scale.z == 0.90 ? 1 : 0.90
            // craft.nodes.LTorch.material.materials[0].map.offset.y = camera.orbital.reticle.tee.position.x * 0.90
            // craft.nodes.RTorch.material.materials[0].map.offset.y = camera.orbital.reticle.tee.position.x * 0.90

            camera.direction.fromArray([0, 0, -1]).applyQuaternion(camera.quaternion)
            camera.offset.fromArray(camera.orbital.offset).multiply(camera.direction)
            if (camera.ease == 1) {
                camera.position.copy(camera.orbital.position)
                camera.position.add(camera.offset)
                camera.controls.rotateCamera(camera.orbital.reticle.tee.position)

                let thrustSide = (camera.orbital.reticle.tee.position.x + (camera.orbital.reticle.position.x * 0.1))
                let thrustTop = (camera.orbital.reticle.tee.position.y + (camera.orbital.reticle.position.y * 0.1)) + 0.25
                craft.direction.fromArray([
                    -1 * thrustSide,
                    -1 * thrustTop,
                    -1]).applyQuaternion(camera.quaternion)
                craft.nodes.LTorch.scale.x = thrustSide * 5
                craft.nodes.RTorch.scale.x = thrustSide * -5
                craft.offset.fromArray(craft.orbital.offset).multiply(craft.direction)
                craft.position.copy(camera.position)
                craft.move.add(craft.offset.sub(craft.move).multiplyScalar(0.05))
                craft.position.sub(craft.move)
                craft.quaternion.copy(camera.quaternion)
                craft.rotation.z -= 1.1 * camera.orbital.reticle.position.x //* camera.ease
                craft.rotation.blockCallback = false
            } else {
                camera.ease += 0.01
                camera.move.copy(camera.orbital.position)
                camera.move.add(camera.offset)
                camera.move.sub(camera.position)
                camera.move.multiplyScalar(camera.ease)
                camera.position.add(camera.move)

                camera.orbital.reticle.material.uniforms.alpha.value = camera.ease
                camera.orbital.reticle.tee.material.uniforms.alpha.value = camera.ease

                if (camera.ease >= 1) {
                    camera.ease = 1
                    camera.controls.active = camera.position
                    camera.controls.rotateCamera(camera.orbital.reticle.tee.position)
                } else {
                    camera.controls.rotateCamera(camera.orbital.reticle.tee.position)
                }
            }
        }

         // after render
        ctx.compute = function () {

        }
        playCode(craft)

        canvas.node.onmousemove = canvas.node.ontouchmove = function (e) {
            e.preventDefault()
            if (!app.pointers.inUse) {
                if (typeof e.changedTouches == 'undefined') {
                    app.pointers[0] = touch(e)
                    let x = (((app.pointers[0].pageX - this.offsetLeft) / this.clientWidth) * 2 - 1)
                    let y = (-((app.pointers[0].pageY - this.offsetTop) / this.clientHeight) * 2 + 1)
                    camera.orbital.reticle.position.fromArray([x, y, 0])
                    camera.orbital.reticle.tee.persision(x, y)
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
            // playCode(craft)
        }

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
                craft.reticle.mid.multiply({x: -1, y: -1, z: -1})
                craft.lookAt(craft.reticle.mid)
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
            // playCode(craft)
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
            // playCode(craft)
        }

        function optimizeConstruct (o) {
            for (let p in o) {
                if (p != 'position' && p != 'rotation' && p != 'quaternion' && p != 'up' && p != 'lookAt') {
                    o[p] = null
                    delete o[p]
                }
            }
            return o
        }
        function cameraRotationToReticle () {
            var view = craft.reticle.looking.view.rotation
            return {x: (view.x - camera.rotation.x) * 0.15, y: (view.y - camera.rotation.y) * 0.15, z: (view.z - camera.rotation.z) * 0.15}
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

    var drive = new THREE.Vector3()
    function driveLow (node) {
        // get direction vector of craft
        // buff stream for a duration between segments (978 - 1978 = 1000) from the current timeframe position
        // allow reverting
        // buff x, y, z in that direction depending on speed
        drive.fromArray([200, 200, 200])
        // node.move.copy(craft.reticle.far)
        node.direction.fromArray([0, 0, -1])
        node.direction.applyQuaternion(node.quaternion)
        drive.multiply(node.direction)

        camera.easing = {in: 0.15, out: 0.85} // determine distance from camera percent to fillin easing frames
        camera.easing.position = buffer.eval('timeline',
            [
                [
                    [camera.orbital.position], [
                        [['x', drive.x]],
                        [['y', drive.y]],
                        [['z', drive.z]]],
                        [['linear', duration]]// start from current frame
                ]
            ],
        true, undefined, duration * camera.easing.in)// get values
    }

    return this
}(this.app, this.THREE, this.ctx.camera, this.canvas, this.ctx)
