window.Authority = new function (app, THREE, camera, canvas, ctx) {
    this.actionID = 978
    var duration = 1000 // move to segment Authority duration// have access to current segment authorty in action
                        // segment = segment.Authority
    var buffer = ctx.timeline.addon.buffer

    var craft = ctx.scene.nodes.craft1

    var leftJoy = ctx.controller.joy.left
    var rightJoy = ctx.controller.joy.right
    craft.view = {
        camera: ctx.view.camera,
        current: 'thirdclockpit',
        get change () {
            return this.current
        },
        set change (view) {
            this.current = view
            switch (this.current) {
            case 'clockpit' :
                this.reset()
                ctx.rendering = function () {
                    craft.view.fullClockpit()
                }
                break
            case 'third' :
                this.reset()
                ctx.rendering = function () {
                    craft.geometry.attributes.uv.sprite[0].V = craft.geometry.attributes.uv.sprite[0].V + 1
                    craft.geometry.attributes.uv.sprite[1].V = craft.geometry.attributes.uv.sprite[1].V + 1
                    craft.geometry.attributes.uv.sprite[2].V = craft.geometry.attributes.uv.sprite[2].V + 1
                    craft.geometry.attributes.uv.sprite[3].V = craft.geometry.attributes.uv.sprite[3].V + 1
                    craft.geometry.attributes.uv.sprite[4].V = craft.geometry.attributes.uv.sprite[4].V + 1
                    craft.geometry.attributes.uv.sprite[5].V = craft.geometry.attributes.uv.sprite[5].V + 1

                    craft.geometry.attributes.uv.needsUpdate = true

                    var proj = craft.view.toScreenPosition(ctx.scene.nodes.craft2, camera)

                    window.divElem.style.left = proj.x + 'px'
                    window.divElem.style.top = proj.y + 'px'

                    craft.view.fullThirdPreson()
                }
                break
            case 'thirdclockpit' :
                ctx.rendering = function () {
                    craft.view.reset()
                    craft.view.fullThirdPreson()
                    craft.view.mini()
                    craft.view.smallClockpit()
                }
                break
            case 'clockpitthird' :
                ctx.rendering = function () {
                    craft.view.reset()
                    craft.view.fullClockpit()
                    craft.view.mini()
                    craft.view.smallThirdPreson()
                }
                break
            default:
                this.current = 'clockpit'
                this.reset()
                ctx.rendering = function () {
                    craft.view.fullClockpit()
                }
            }
        },
        reset: function () {
            this.left = 0
            this.top = 0
            this.width = Math.floor(canvas.node.width)
            this.height = Math.floor(canvas.node.height)
            canvas.renderer.setViewport(this.left, this.top, this.width, this.height)
            canvas.renderer.setScissor(this.left, this.top, this.width, this.height)
            camera.orbital.reticle.material.uniforms.alpha.value =
            camera.orbital.reticle.tee.material.uniforms.alpha.value =
            leftJoy.pad.material.uniforms.alpha.value =
            leftJoy.knob.material.uniforms.alpha.value =
            rightJoy.pad.material.uniforms.alpha.value =
            rightJoy.knob.material.uniforms.alpha.value = camera.aspect = ctx.view.camera.aspect = 1
        },
        mini: function () {
            this.left = 0
            this.top = 0
            this.width = 0.35
            this.height = 0.35
            this.left = Math.floor(canvas.node.width * this.left)
            this.top = Math.floor(canvas.node.height * this.top)
            this.width = Math.floor(canvas.node.width * this.width)
            this.height = Math.floor(canvas.node.height * this.height)
            canvas.renderer.setViewport(this.left, this.top, this.width, this.height)
            canvas.renderer.setScissor(this.left, this.top, this.width, this.height)
            canvas.renderer.setScissorTest(true)

            camera.orbital.reticle.material.uniforms.alpha.value =
            camera.orbital.reticle.tee.material.uniforms.alpha.value =
            leftJoy.pad.material.uniforms.alpha.value =
            leftJoy.knob.material.uniforms.alpha.value =
            rightJoy.pad.material.uniforms.alpha.value =
            rightJoy.knob.material.uniforms.alpha.value = 0
        },
        fullClockpit: function () {
            canvas.renderer.render(ctx.scene, ctx.view.camera)
        },
        fullThirdPreson: function () {
            canvas.renderer.render(ctx.scene, camera)
        },
        smallClockpit: function () {
            // debugger
            ctx.view.camera.aspect = this.width / this.height
            ctx.view.camera.updateProjectionMatrix()
            canvas.renderer.render(ctx.scene, ctx.view.camera)
        },
        smallThirdPreson: function () {
            camera.aspect = this.width / this.height
            camera.updateProjectionMatrix()
            canvas.renderer.render(ctx.scene, camera)
        },
        projectVector: new THREE.Vector3(),
        toScreenPosition: function (obj, camera) {
            // TODO: need to update this when resize window
            var widthHalf = 0.5 * this.width
            var heightHalf = 0.5 * this.height

            obj.updateMatrixWorld()
            this.projectVector.setFromMatrixPosition(obj.matrixWorld)
            this.projectVector.project(camera)

            this.projectVector.x = (this.projectVector.x * widthHalf) + widthHalf
            this.projectVector.y = -(this.projectVector.y * heightHalf) + heightHalf

            return {
                x: this.projectVector.x,
                y: this.projectVector.y
            }
        }

    }

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
            leftthrust: {vector: {x: 0, y: 0, z: 0}, thurst: function () { thrust(this.velocity) }},
            rightthrust: {vector: {x: 0, y: 0, z: 0}, thurst: function () { thrust(this.velocity) }},
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

    var drive = new THREE.Vector3()
    function driveLow (craft) {
        // get direction vector of craft
        // buff stream for a duration between segments (978 - 1978 = 1000) from the current timeframe position
        // allow reverting
        // buff x, y, z in that direction depending on speed
        drive.fromArray([200, 200, 200])
        // node.move.copy(craft.reticle.far)
        craft.direction.fromArray([0, 0, -1])
        craft.direction.applyQuaternion(craft.quaternion)
        drive.multiply(craft.direction)

        buffer.eval('timeline',
            [
                [
                    [camera.orbital.position], [
                        [['x', drive.x]],
                        [['y', drive.y]],
                        [['z', drive.z]]],
                        [['linear', duration]]// start from current frame
                ]
            ],
        true)// get values
        // To-Do enable reverting
    }

    Math.Cache.store('nines', cacheNines, craft.ctrl.playstate.codeLength)// optimizing runtime Math
    cacheNines = null
    var playCode = function (craft) {
        for (let p = 0; p < craft.ctrl.playstate.codeLength; ++p) {
            let a = craft.ctrl.playstate.code
            if (a > Math.Cache.nines[p]) {
                while (a > Math.Cache.nines[p + 1]) {
                    a = (a / 10) << 0 // Use bitwise '<<' operator to force integer result.
                }
                a = a % 10

                switch (p) {
                case 0:// drive
                    switch (a) { // low(1), high(2), hyper(3), zero(4)
                    case 1: driveLow(craft); break
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

    camera.orbital.reticle.tee.persision = function (x, y, mode) {
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
            this.position.fromArray([
                0,
                0,
                0
            ])

            if (camera.orbital.reticle.tee.dir) {
                camera.orbital.reticle.tee.material.uniforms.texture.value = camera.orbital.reticle.tee.sprites[0]
                camera.orbital.reticle.tee.dir = false
            }
        }

        // Persision mode
        /*  */
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
        var viewChanged = false

        ctx.calc = function () {
            ctx.scene.nodes.starwall.material.materials[0].map.offset.x += 0.002
            craft.nodes.LTorch.material.materials[0].map.offset.x =
            craft.nodes.RTorch.material.materials[0].map.offset.x =
            craft.nodes.CTorch.material.materials[0].map.offset.x -= 0.11
            craft.nodes.CTorch.scale.z = craft.nodes.CTorch.scale.z == 0.90 ? 1 : 0.90

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
                if (!viewChanged) { craft.view.change = craft.view.current; viewChanged = true }
            } else {
                camera.ease += 0.01
                camera.move.copy(camera.orbital.position)
                camera.move.add(camera.offset)
                camera.move.sub(camera.position)
                camera.move.multiplyScalar(camera.ease)
                camera.position.add(camera.move)

                craft.move.copy(camera.orbital.position)
                craft.move.add(camera.offset)
                craft.move.sub(camera.position)
                // beginning clockpit mode
                craft.move.multiplyScalar(camera.ease + 0.12)
                // craft.move.multiplyScalar((camera.ease + 0.135))
                craft.position.add(craft.move)

                camera.orbital.reticle.material.uniforms.alpha.value =
                camera.orbital.reticle.tee.material.uniforms.alpha.value =
                leftJoy.pad.material.uniforms.alpha.value =
                leftJoy.knob.material.uniforms.alpha.value =
                rightJoy.pad.material.uniforms.alpha.value =
                rightJoy.knob.material.uniforms.alpha.value = camera.ease

                if (camera.ease >= 1) {
                    camera.ease = 1
                    camera.controls.active = camera.position
                    camera.controls.rotateCamera(camera.orbital.reticle.tee.position)
                } else {
                    camera.controls.rotateCamera(camera.orbital.reticle.tee.position)
                }
            }
        }

        window.divElem = document.createElement('div')
        window.divElem.innerHTML = '-'
        window.divElem.style.color = 'red'
        window.divElem.style.position = 'absolute'
        window.divElem.style.zIndex = 999
        document.body.appendChild(window.divElem)

         // after render
        ctx.compute = function () {

        }
        window.removeEventListener('keyup', window.keydown_space_pause)
        window.keydown_space_drive = function (e) {
            if (e) {
                if (e.keyCode != 32) {
                    return
                }
                playCode(craft)
            }
        }
        window.addEventListener('keyup', window.keydown_space_drive)

        playCode(craft)

        if (ctx.timeline.addon.timeframe.timeline.info) ctx.timeline.addon.timeframe.timeline.info.setValue('spacebar to boost')

        var joy = function (pointer, joy, x, y) {
            let jX = joy.knob.clip.normal.x
            let jY = joy.knob.clip.normal.y
            joy.x = x - jX
            joy.y = y - jY

            // mouse down
            if (!pointer.joy) {
                let d = Math.sqrt(joy.x * joy.x + joy.y * joy.y)
                if (d < 0.2) {
                    pointer.joy = joy
                    joy.knob.position.fromArray([
                        jX + joy.x,
                        jY + joy.y,
                        0
                    ])
                }
            }
        }

        var touch = function (use, touches, id, e, canvas, callback, optimize) {
            if (!touches[id]) {
                touches[id] = e
                touches[id].normal = {}
            }

            var pointerX = 0
            var pointerY = 0
            var active = {}
            if (use) {
                if (!e.targetTouches[id]) {
                    console.log('touch missed')
                    if (e.changedTouches[id]) {
                        active = e.changedTouches[id]
                    } else {
                        console.log('exiting')
                        return
                    }
                } else {
                    active = e.targetTouches[id]
                }
            } else {
                active = e
            }

            pointerX = active.pageX
            pointerY = active.pageY

            touches[id].normal.x = (((pointerX - canvas.offsetLeft) / canvas.clientWidth) * 2 - 1)
            touches[id].normal.y = (-((pointerY - canvas.offsetTop) / canvas.clientHeight) * 2 + 1)

            callback(touches[id])
            if (optimize) return

            if (e.type == 'mousedown' || e.type == 'touchstart') app.pointers.inUse = true
            if (e.type == 'mouseup' || e.type == 'touchend') app.pointers.inUse = false

            if (use) {
                app.pointers.multi = false
                if (active.length == 0) {
                    app.pointers.inUse = false
                } else if (active.length > 1) {
                    app.pointers.multi = true
                }
            }
            touches[id].area = pointerX > (canvas.clientWidth / 2) ? 'right' : 'left'
        }

        canvas.node.onmousedown = canvas.node.ontouchstart = function (e) {
            e.preventDefault(); if (!app.pointers.enabled) return
            if (!e.changedTouches) {
                touch(false, app.pointers, 0, e, this, function (pointer) {
                    let x = pointer.normal.x
                    let y = pointer.normal.y
                    joy(pointer, leftJoy, x, y)
                    joy(pointer, rightJoy, x, y)
                })
            } else {
                for (let ts = 0, dlen = e.changedTouches.length; ts < dlen; ts++) {
                    let id = e.changedTouches[ts].identifier
                    touch(true, app.pointers, id, e, this, function (pointer) {
                        let x = pointer.normal.x
                        let y = pointer.normal.y
                        joy(pointer, leftJoy, x, y)
                        joy(pointer, rightJoy, x, y)
                    })
                }
            }
        }

        var moveKnob = function (pointer) {
            let x = pointer.normal.x
            let y = pointer.normal.y
            if (pointer.joy) {
                let jX = pointer.joy.knob.clip.normal.x
                let jY = pointer.joy.knob.clip.normal.y
                pointer.joy.x = x - jX
                pointer.joy.y = y - jY
                let d = Math.sqrt(pointer.joy.x * pointer.joy.x + pointer.joy.y * pointer.joy.y)
                if (d < 0.2) {
                    let lx = pointer.joy.x / 0.2
                    let ly = pointer.joy.y / 0.2
                    camera.orbital.reticle.position.fromArray([lx, ly, 0])
                    camera.orbital.reticle.tee.persision(lx, ly)
                    pointer.joy.knob.position.fromArray([
                        pointer.joy.knob.clip.normal.x + pointer.joy.x,
                        pointer.joy.knob.clip.normal.y + pointer.joy.y,
                        0
                    ])
                } else {
                    let a = Math.atan2(y - jY, x - jX) * 180 / Math.PI + 270
                    let r = rotatePoint(jX, jY, jX, jY + 0.2, a, true)
                    let lx = (r.x - jX) / 0.2
                    let ly = (r.y - jY - 0.2) / 0.2
                    camera.orbital.reticle.position.fromArray([lx, ly, 0])
                    camera.orbital.reticle.tee.persision(lx, ly)
                    pointer.joy.knob.position.fromArray([
                        r.x,
                        r.y - 0.2,
                        0
                    ])
                }
            }
        }

        // // CONTROLLER
        canvas.node.onmousemove = canvas.node.ontouchmove = function (e) {
            e.preventDefault()
            // FREEFORM
            if (!app.pointers.inUse) {
                if (!e.changedTouches) {
                    // mouse freeform
                    touch(false, app.pointers, 0, e, this, function (pointer) {
                        let x = pointer.normal.x
                        let y = pointer.normal.y
                        camera.orbital.reticle.position.fromArray([x, y, 0])
                        camera.orbital.reticle.tee.persision(x, y)
                    }, true)
                } else {
                    // touch freeform ??
                    for (let tm = 0, dlen = e.changedTouches.length; tm < dlen; tm++) {
                        let id = e.changedTouches[tm]
                        touch(true, app.pointers, id, e, this, function (pointer) {

                        })
                    }
                }

                //
            } else if (!e.changedTouches) {
                touch(false, app.pointers, 0, e, this, function (pointer) {
                    moveKnob(pointer)
                }, true)
            } else {
                for (let tm = 0, dlen = e.changedTouches.length; tm < dlen; tm++) {
                    let id = e.changedTouches[tm].identifier
                    touch(true, app.pointers, id, e, this, function (pointer) {
                        moveKnob(pointer)
                    }, true)
                }
            }
            // playCode(craft)
        }

        canvas.node.onmouseup = canvas.node.ontouchend = function (e) {
            e.preventDefault(); if (!app.pointers.enabled) return

            if (!e.changedTouches) {
                app.pointers.inUse = false
                touch(false, app.pointers, 0, e, this, function (pointer) {
                    console.log(pointer.area)
                })
                delete app.pointers[0]
            } else {
                for (let te = 0, dlen = e.changedTouches.length; te < dlen; te++) {
                    if (!touchExists(e.targetTouches, e.changedTouches[te].identifier)) {
                        let id = e.changedTouches[te].identifier
                        touch(true, app.pointers, id, e, this, function (pointer) {
                            console.log(pointer.area)
                        })
                        delete app.pointers[id]
                    }
                }
            }
            // playCode(craft)
        }
        // // CONTROLLER
        var rotatePoint = function (pointX, pointY, originX, originY, angle, clockwise) {
            if (clockwise) angle -= 180.0
            angle = angle * Math.PI / 180.0
            return {
                x: Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
                y: Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY
            }
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

    return this
}(this.app, this.THREE, this.ctx.camera, this.canvas, this.ctx)
