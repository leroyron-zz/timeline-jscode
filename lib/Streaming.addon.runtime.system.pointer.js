/**
 * To-Do Comment
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Streaming) {
    var _struct = Streaming.prototype
    var _runtime = _struct.addon.runtime
    var _system = _runtime.system
    var That = _system.pointer = function () {
        var pointers = {}
        var element = {}
        var result = {}

        this.bind = function (appPointers, appElement) {
            pointers = appPointers
            element = appElement
            return this
        }
        this.result = function (callForward) {
            result = callForward
            return this
        }
        this.init = function () {
            element.onmousedown = element.ontouchstart = function (e) {
                e.preventDefault(); if (!pointers.enabled) return
                if (!e.changedTouches) {
                    touch(false, pointers, 0, e, this, function (pointer) {
                        result(pointer)
                    })
                } else {
                    for (let ts = 0, dlen = e.changedTouches.length; ts < dlen; ts++) {
                        let id = e.changedTouches[ts].identifier
                        touch(true, pointers, id, e, this, function (pointer) {
                            result(pointer)
                        })
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
                        result(pointer)
                    }, true)
                } else {
                    for (let tm = 0, dlen = e.changedTouches.length; tm < dlen; tm++) {
                        let id = e.changedTouches[tm].identifier
                        touch(true, pointers, id, e, this, function (pointer) {
                            result(pointer)
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
