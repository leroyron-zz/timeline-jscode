var Authority = new function (app, THREE, camera, canvas, ctx) {
    this.actionID = 350

    var buffer = ctx.timeline.addon.buffer

    this.main = function () {
        var slinky = canvas.app.slinky
        var spring = canvas.app.spring
        var persp, x, y, size, freq
        var swallow = 0.05
        var lineWidth = 5
        var split = canvas.app.split.value
        var coilX = 0
        var coilY = 0
        var course = spring.coil.value / (split * 2)
        var imgs = canvas.app.imgs
        var mX = 0
        var mY = 0

        var dropping = 0

        var start = false

        canvas.app.calc = function (lapse, access) {
            persp = this.persp.value
            x = mX + this.x.value
            y = mY + this.y.value
            size = this.size.value
            size = this.size.value = size < 0.7 ? clearSize() : size
            swallow = this.swallow.value
            swallow = swallow < -0.5 || swallow > 0.5 ? clearSwallow() : swallow
            spring.r = 50 * (size + swallow)
            spring.c = 100 * (size + swallow)
            // lineWidth = 5
            freq = this.freq.value
            split = this.split.value
            dropping = this.drop.value
            ctx.timeline.bindings.ids._bi800[820].value = ctx.timeline.bindings.ids._bi800.node.value = 0
        }

        var clearSize = function () {
            ctx.timeline.bindings.ids._bi811[820].value = 704
            buffer.zeroOut('timeline', 350, ctx.timeline.length, [canvas.app.size], ['value'])
            return 0.7
        }

        var clearSwallow = function () {
            ctx.timeline.bindings.ids._bi801[820].value = ctx.timeline.bindings.ids._bi801.node.value = 0.05
            ctx.timeline.bindings.ids._bi806[820].value = ctx.timeline.bindings.ids._bi806.node.value = 0
            buffer.zeroOut('timeline', 350, ctx.timeline.length, [canvas.app.swallow, canvas.app.y], ['value'])
            return 0.05
        }

        var ggeLetter = [{x: 150, y: 150, dis: 1000}, {x: 467, y: 100, dis: 1000}, {x: 578, y: 113, dis: 1000}]
        var modSplit = 0
        var modFreq = 0
        var modSize = 0
        var modCoil = 0
        var modSpeed = 1

        var addCoil = function () {
            modCoil--
        }
        var removeCoil = function () {
            modCoil++
        }
        var addSpeed = function () {
            modSpeed = modSpeed < 1 ? modSpeed + 0.1 : modSpeed
        }
        var removeSpeed = function () {
            modSpeed = modSpeed > 0.4 ? modSpeed - 0.1 : modSpeed
        }
        var grow = function () {
            if (modSize <= 0) {
                modSize = 0
                modFreq = 0
                modSplit = 0
            }
            buffer.eval('timeline',
                [
                    [
                    [canvas.app.size], [[['value', 0.5], ['value', -0.25], ['value', -0.1]]], [['easeInOutQuad', 30]], 10// give enough time so the leap won't zero out
                    ]
                ],
            true, undefined, undefined, function () {
                        // check this.size, this.actionID
                buffer.zeroOut('timeline', 350, ctx.timeline.length, [canvas.app.size], ['value'])
                buffer.eval('timeline',
                    [
                        [
                                [canvas.app.size], [[['value', 0.704 - canvas.app.size.value]]], [['linear', canvas.app.size.value * 400 << 0]]
                        ]
                    ],
                        true)
            }, true, true)
            modSize++
        }
        var shrink = {
            func: function () {
                modSize--
            },
            check: function () {

            }
        }
        var eat = function () {
            buffer.eval('timeline',
                [
                    [
                    [canvas.app.y], [[['value', -85], ['value', 77], ['value', 8]]], [['easeInOutQuad', 20]]// give enough time so the leap won't zero out
                    ]
                ],
            true)
            buffer.eval('timeline',
                [
                    [
                    [canvas.app.swallow], [[
                        ['value', (canvas.app.size.value * 1.1) - canvas.app.size.value],
                        ['value', canvas.app.size.value - (canvas.app.size.value * 1.45)],
                        ['value', (canvas.app.size.value * 1.25) - canvas.app.size.value],
                        ['value', (canvas.app.size.value * 1.1) - canvas.app.size.value]]], [['easeInOutQuad', 15]], 10// give enough time so the leap won't zero out
                    ]
                ],
            true, undefined, undefined, function () {
                buffer.zeroOut('timeline', 350, ctx.timeline.length, [canvas.app.y], ['value'])
                buffer.zeroOut('timeline', 350, ctx.timeline.length, [canvas.app.swallow], ['value'])
                ctx.timeline.bindings.ids._bi806[820].value = ctx.timeline.bindings.ids._bi806.node.value = 0
            }, true, true)
        }
        var nearBlue, nearYellow, nearRed
        ctx.rendering = function (timeFrame) {
            this.globalCompositeOperation = 'destination-over'
            this.save()
            this.clearRect(0, 0, app.width, app.height)
            this.scale(1, persp)
            this.lineWidth = lineWidth
            spring.val = 0

            nearBlue = ggeLetter[0].dis > 200 ? 1 : 200 / ggeLetter[0].dis

            nearYellow = ggeLetter[1].dis > 200 ? 1 : 200 / ggeLetter[1].dis

            nearRed = ggeLetter[2].dis > 200 ? 1 : 200 / ggeLetter[2].dis

            let comp = nearBlue + nearYellow + nearRed
            modFreq += comp > 10 ? 0.25 : -0.50
            modSplit += comp > 10 ? 0.50 : -0.50

            nearBlue > 10 && modSplit % 25 == 1 ? grow() : nearBlue < 10 && modSplit % 25 == 1 ? shrink.func() : shrink.check()

            if (nearYellow > 10) { nearYellow > 10 && modSplit % 25 == 1 ? addCoil() : nearYellow < 10 && modSplit % 25 == 1 ? removeCoil() : nearYellow } else if (nearRed > 10) { nearRed > 10 && modSplit % 25 == 1 ? addSpeed() : nearRed < 10 && modSplit % 25 == 1 ? removeSpeed() : nearRed }

            modSplit = modSplit < 0 ? 0 : modSplit > 200 ? 180 : modSplit
            modFreq = modFreq < 0 ? 0 : modFreq > 100 ? 90 : modFreq
            for (let ci = 0; ci < slinky.length + 1 - modCoil; ci++) {
                if (!slinky[ci]) break

                let r = slinky[ci].rgb[0]
                let g = slinky[ci].rgb[1]
                let b = slinky[ci].rgb[2]

                b = b * nearBlue << 0
                imgs[1].alpha = nearBlue - 1

                g = g * nearYellow << 0
                imgs[2].alpha = nearYellow - 1

                r = r * nearRed << 0
                imgs[3].alpha = nearRed - 1

                spring.val +=
                spring.coil.value >= spring.mid
                ? ci > spring.coil.value
                    ? (1 - (ci - spring.coil.value) / spring.coil.value) * spring.stretch.value
                    : (1 - (spring.coil.value - ci) / spring.coil.value) * spring.stretch.value
                : ci > spring.coil.value
                    ? -((1 - (ci - (spring.coil.value + spring.mid)) / (spring.coil.value + spring.mid)) * spring.stretch.value)
                    : -((1 - ((spring.coil.value + spring.mid) - ci) / (spring.coil.value + spring.mid)) * spring.stretch.value)

                let cross = ci % (spring.mid / (split + modSplit))
                coilX = cross > course
                ? (1 - (cross - course) / course) * (freq + modFreq)
                : (1 - (course - cross) / course) * (freq + modFreq)

                if (spring.val == Infinity) {
                    spring.val = 0
                }

                coilY = ci == 0 ? spring.val - 5 : spring.val

                let flux = slinky[ci].flux
                let xX = coilX + x
                let yY = coilY + y

                Math.lerpProp(slinky[ci], 'c', spring.c, flux)

                let icx = slinky[ci].c / 2
                let floor = 380 + (lineWidth * modCoil)
                let icy = ((lineWidth) * ci)

                xX = xX > 680 - icx ? 680 - icx : xX < 0 ? 0 : xX
                Math.lerpProp(slinky[ci], 'x', xX, flux)

                yY = yY > floor + icy ? floor + icy : yY
                Math.lerpProp(slinky[ci], 'y', yY, flux)
                yY = 0.75 * spring.stretch.value + spring.val + y
                yY = yY > floor + icy ? floor + icy : yY
                Math.lerpProp(slinky[ci], 'y1', yY, flux)
                yY = 0.5 * spring.stretch.value + spring.val + y
                yY = yY > floor + icy ? floor + icy : yY
                Math.lerpProp(slinky[ci], 'y2', yY, flux)
                yY = spring.val + y
                yY = yY > floor + icy ? floor + icy : yY
                Math.lerpProp(slinky[ci], 'y3', yY, flux)

                this.beginPath()
                this.moveTo(slinky[ci].x + slinky[ci].c / 2, slinky[ci].y)
                // create the rainbow linear-gradient
                let gradient = this.createLinearGradient(slinky[ci].x + 200, slinky[ci].y + 400, 50, 50)
                gradient.addColorStop(0.49, 'rgb(' + r + ', ' + g + ', ' + b + ')')
                gradient.addColorStop(0.5, 'rgb(255, 255, 255)')
                gradient.addColorStop(0.51, 'rgb(' + r + ', ' + g + ', ' + b + ')')

                this.strokeStyle = gradient
                this.arcTo(
                    slinky[ci].x,
                    slinky[ci].y,
                    slinky[ci].x,
                    slinky[ci].y + slinky[ci].c,
                    slinky[ci].c / 2)

                this.arcTo(
                    slinky[ci].x,
                    slinky[ci].y1 + slinky[ci].c,
                    slinky[ci].x + slinky[ci].c,
                    slinky[ci].y1 + slinky[ci].c,
                    slinky[ci].c / 2)

                this.arcTo(
                    slinky[ci].x + slinky[ci].c,
                    slinky[ci].y2 + slinky[ci].c,
                    slinky[ci].x + slinky[ci].c,
                    slinky[ci].y2 + slinky[ci].c / 2,
                    slinky[ci].c / 2)

                this.arcTo(
                    slinky[ci].x + slinky[ci].c,
                    slinky[ci].y3,
                    slinky[ci].x + slinky[ci].c / 2,
                    slinky[ci].y3,
                    slinky[ci].c / 2)

                this.stroke()
            }
            this.restore()
            for (let id = 0; id < canvas.app.drop.items.length; id++) {
                let item = canvas.app.drop.items[id]
                if (item) {
                    item.dis = Math.distance2({x: (item.x + 40), y: (item.y + 40)}, {x: mX, y: mY / 1.5})
                    if (item.y > 225) {
                        canvas.app.drop.items[id] = undefined
                        removeCoil()
                    }
                    if (!item.ate) {
                        if (item.dis < spring.c) {
                            canvas.app.drop.items[id].ate = true
                            eat()
                        }
                    } else {
                        this.globalAlpha = item.alpha -= 0.1
                        Math.lerpProp(item, 'x', mX, 1 - item.alpha)
                        if (item.alpha < 0.1) {
                            canvas.app.drop.items[id] = undefined
                        }
                    }

                    item.y += dropping
                    ctx.drawImage(item.img, (item.wSrc * item.sprite), 0, item.wSrc, item.hSrc, item.x, item.y, item.wSrc, item.hSrc)
                    this.globalAlpha = 1
                }
                    // ctx.drawImage(img, (img.wSrc * img.sprite), img.yPos, img.wSrc, img.hSrc, img.xPos, img.yPos, img.wSrc, img.hSrc)
            }
            for (let ii = 1; ii < imgs.length; ii++) {
                this.globalAlpha = imgs[ii].alpha
                ctx.drawImage(imgs[ii], imgs[ii].xPos, imgs[ii].yPos)
                this.globalAlpha = 1
            }
        }

        // To-Do
        // Shake Image
        //

        var setPosDistance = function (pX, pY) {
            mX = pX - spring.r
            mY = pY * 1.5
            ggeLetter[0].dis = Math.distance2(ggeLetter[0], {x: pX, y: pY})
            ggeLetter[1].dis = Math.distance2(ggeLetter[1], {x: pX, y: pY})
            ggeLetter[2].dis = Math.distance2(ggeLetter[2], {x: pX, y: pY})
        }

        canvas.node.onmousedown = canvas.node.ontouchstart = function (e) {
            e.preventDefault(); if (!app.pointers.enabled) return
            if (!e.changedTouches) {
                touch(false, app.pointers, 0, e, this, function (pointer) {
                    // let x = pointer.normal.x
                    // let y = pointer.normal.y

                    setPosDistance(pointer.mX, pointer.mY)
                    if (!start) {
                        canvas.app.x.value = canvas.app.x.elem.value = canvas.app.y.value = canvas.app.y.elem.value = 0
                        start = true
                    }
                })
            } else {
                for (let ts = 0, dlen = e.changedTouches.length; ts < dlen; ts++) {
                    let id = e.changedTouches[ts].identifier
                    touch(true, app.pointers, id, e, this, function (pointer) {
                        // let x = pointer.normal.x
                        // let y = pointer.normal.y
                        setPosDistance(pointer.mX, pointer.mY)
                        if (!start) {
                            canvas.app.x.value = canvas.app.x.elem.value = canvas.app.y.value = canvas.app.y.elem.value = 0
                            start = true
                        }
                    })
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
                        // let x = pointer.normal.x
                        // let y = pointer.normal.y
                        setPosDistance(pointer.mX, pointer.mY)
                        if (!start) {
                            canvas.app.x.value = canvas.app.x.elem.value = canvas.app.y.value = canvas.app.y.elem.value = 0
                            start = true
                        }
                    }, true)
                } else {
                    // touch freeform ??
                    for (let tm = 0, dlen = e.changedTouches.length; tm < dlen; tm++) {
                        let id = e.changedTouches[tm]
                        touch(true, app.pointers, id, e, this, function (pointer) {

                            // let x = pointer.normal.x
                            // let y = pointer.normal.y

                        })
                    }
                }

                //
            } else if (!e.changedTouches) {
                touch(false, app.pointers, 0, e, this, function (pointer) {
                    // let x = pointer.normal.x
                    // let y = pointer.normal.y
                    setPosDistance(pointer.mX, pointer.mY)
                    if (!start) {
                        canvas.app.x.value = canvas.app.x.elem.value = canvas.app.y.value = canvas.app.y.elem.value = 0
                        start = true
                    }
                }, true)
            } else {
                for (let tm = 0, dlen = e.changedTouches.length; tm < dlen; tm++) {
                    let id = e.changedTouches[tm].identifier
                    touch(true, app.pointers, id, e, this, function (pointer) {
                        // let x = pointer.normal.x
                        // let y = pointer.normal.y
                        setPosDistance(pointer.mX, pointer.mY)
                        if (!start) {
                            canvas.app.x.value = canvas.app.x.elem.value = canvas.app.y.value = canvas.app.y.elem.value = 0
                            start = true
                        }
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
                    // let x = pointer.normal.x
                    // let y = pointer.normal.y
                })
                delete app.pointers[0]
            } else {
                for (let te = 0, dlen = e.changedTouches.length; te < dlen; te++) {
                    if (!touchExists(e.targetTouches, e.changedTouches[te].identifier)) {
                        let id = e.changedTouches[te].identifier
                        touch(true, app.pointers, id, e, this, function (pointer) {
                            console.log(pointer.area)
                            // let x = pointer.normal.x
                            // let y = pointer.normal.y
                        })
                        delete app.pointers[id]
                    }
                }
            }
        }

        var touchExists = function (touchArr, match) {
            for (let ct = 0, tlen = touchArr.length; ct < tlen; ct++) {
                if (touchArr[ct].identifier === match) return true
            }
            return false
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

            touches[id].mX = pointerX = active.pageX
            touches[id].mY = pointerY = active.pageY

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
    }
    return this
}(this.app, this.THREE, this.ctx.camera, this.canvas, this.ctx)
