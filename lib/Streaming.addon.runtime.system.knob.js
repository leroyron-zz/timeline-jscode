/**
 * To-Do Comment
 * STILL WORKING ON THIS
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Streaming) {
    var _struct = Streaming.prototype
    var _runtime = _struct.addon.runtime
    var _system = _runtime.system
    var That = _system.knob = function () {
        var pointers = {}
        var element = {}
        var result = {}
        var leftJoy = {}
        var rightJoy = {}

        this.bind = function (appPointers, appElement) {
            pointers = appPointers
            element = appElement
            let game1Assets = '/user/game1/assets/'
            ctx.controller = {
                joy: {
                    left: {id: 0, x: 0, y: 0, pad: window.ctx.sprite(game1Assets + 'LRevolving.png', -0.66, -0.66, 0.43, 0.43, 'center', true), knob: window.ctx.sprite(game1Assets + 'knob.png', -0.66, -0.66, 0.25, 0.25, 'center', true)},
                    right: {id: 1, x: 0, y: 0, pad: window.ctx.sprite(game1Assets + 'RShifting.png', 0.66, -0.66, 0.43, 0.43, 'center', true), knob: window.ctx.sprite(game1Assets + 'knob.png', 0.66, -0.66, 0.25, 0.25, 'center', true)}
                }
            }
            leftJoy = ctx.controller.joy.left
            rightJoy = ctx.controller.joy.right
            leftJoy.pad.alpha.value =
            leftJoy.knob.alpha.value =
            rightJoy.pad.alpha.value =
            rightJoy.knob.alpha.value = 0
            
            return this
        }
        this.result = function (callForward) {
            result = callForward
            return this
        }
        this.leftKnob = function () {
            
            return this
        }
        this.rightKnob = function () {
            
            return this
        }

        this.init = function () {
            element.onmousedown = element.ontouchstart = function (e) {
                e.preventDefault(); if (!pointers.enabled) return
                if (!e.changedTouches) {
                    touch(false, pointers, 0, e, this, function (pointer) {
                        result(joys(pointer, [leftJoy, rightJoy], pointer.normal.x, pointer.normal.y))
                    })
                } else {
                    for (let ts = 0, dlen = e.changedTouches.length; ts < dlen; ts++) {
                        let id = e.changedTouches[ts].identifier
                        touch(true, pointers, id, e, this, function (pointer) {
                            result(joys(pointer, [leftJoy, rightJoy], pointer.normal.x, pointer.normal.y))
                        })
                    }
                }
            }

            var joys = function (pointer, joys, x, y) {
                for (let ji = 0; ji < joys.length; ji++) {
                    let jX = joys[ji].knob.clip.normal.x
                    let jY = joys[ji].knob.clip.normal.y
                    joys[ji].x = x - jX
                    joys[ji].y = y - jY

                    // mouse down
                    if (!pointer.joy) {
                        let d = Math.sqrt(joys[ji].x * joys[ji].x + joys[ji].y * joys[ji].y)
                        if (d < 0.2) {
                            pointer.joy = joys[ji]
                            joys[ji].knob.position.fromArray([
                                jX + joys[ji].x,
                                jY + joys[ji].y,
                                0
                            ])
                        }
                    }
                }
                return pointer.joy
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
                        // camera.orbital.reticle.position.fromArray([lx, ly, 0])
                        // camera.orbital.reticle.tee.persision(lx, ly)
                        pointer.joy.knob.position.fromArray([
                            pointer.joy.knob.clip.normal.x + pointer.joy.x,
                            pointer.joy.knob.clip.normal.y + pointer.joy.y,
                            0
                        ])
                    } else {
                        let a = Math.atan2(y - jY, x - jX) * 180 / Math.PI + 270
                        let r = Math.rotateFromPoint(jX, jY, jX, jY + 0.2, a, true)
                        let lx = (r.x - jX) / 0.2
                        let ly = (r.y - jY - 0.2) / 0.2
                        // camera.orbital.reticle.position.fromArray([lx, ly, 0])
                        // camera.orbital.reticle.tee.persision(lx, ly)
                        pointer.joy.knob.position.fromArray([
                            r.x,
                            r.y - 0.2,
                            0
                        ])
                    }
                }
            }

            // // CONTROLLER
            element.onmousemove = element.ontouchmove = function (e) {
                e.preventDefault()
                // FREEFORM
                if (!pointers.inUse) {
                    if (!e.changedTouches) {
                        // mouse freeform
                        touch(false, pointers, 0, e, this, function (pointer) {
                            result(pointer)
                        }, true)
                    }
                    //
                } else if (!e.changedTouches) {
                    touch(false, pointers, 0, e, this, function (pointer) {
                        result(moveKnob(pointer))
                    }, true)
                } else {
                    for (let tm = 0, dlen = e.changedTouches.length; tm < dlen; tm++) {
                        let id = e.changedTouches[tm].identifier
                        touch(true, pointers, id, e, this, function (pointer) {
                            result(moveKnob(pointer))
                        }, true)
                    }
                }
            }

            element.onmouseup = element.ontouchend = function (e) {
                e.preventDefault(); if (!pointers.enabled) return

                if (!e.changedTouches) {
                    touch(false, pointers, 0, e, this, function (pointer) {
                        result(pointer)
                    })
                    pointers.inUse = false

                    delete pointers[0]
                } else {
                    for (let te = 0, dlen = e.changedTouches.length; te < dlen; te++) {
                        if (!touchExists(e.targetTouches, e.changedTouches[te].identifier)) {
                            let id = e.changedTouches[te].identifier
                            touch(true, pointers, id, e, this, function (pointer) {
                                result(pointer)
                            })

                            delete pointers[id]
                        }
                    }
                }
            }
            return this
        }

        var touch = function (use, touches, id, e, canvas, callback, optimize) {
            touches[id] = e
            touches[id].normal = {}
            touches[id].viewport = {}

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

            // TO-DO optimize select
            touches[id].normal.x = ((active.pageX - canvas.offsetLeft) / canvas.clientWidth)
            touches[id].normal.y = ((active.pageY - canvas.offsetTop) / canvas.clientHeight)
            touches[id].viewport.x = touches[id].normal.x * 2 - 1
            touches[id].viewport.y = -touches[id].normal.y * 2 + 1

            callback(touches[id])
            if (optimize) return

            if (e.type == 'mousedown' || e.type == 'touchstart') pointers.inUse = true
            if (e.type == 'mouseup' || e.type == 'touchend') pointers.inUse = false

            if (use) {
                pointers.multi = false
                if (active.length == 0) {
                    pointers.inUse = false
                } else if (active.length > 1) {
                    pointers.multi = true
                }
            }
            touches[id].area = active.pageX > 0 ? 'right' : 'left'
        }

        var touchExists = function (touchArr, match) {
            for (let ct = 0, tlen = touchArr.length; ct < tlen; ct++) {
                if (touchArr[ct].identifier === match) return true
            }
            return false
        }

        if (this instanceof That) {
            return this.That
        } else {
            return new That()
        }
    }
})(this.Streaming)
