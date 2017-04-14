canvas.node.onmousemove = canvas.node.ontouchmove = function (e) {
    e.preventDefault()
    if (!app.pointers.inUse) {
        return
    }

    if (typeof e.changedTouches == 'undefined') {
        app.pointers[0].update(e.pageX, e.pageY)
        console.log('press move: mouse')
    } else {
        for (var tm = 0, dlen = e.changedTouches.length; tm < dlen; tm++) {
            if (typeof app.pointers[e.changedTouches[tm].identifier] == 'undefined') { //  fail-safe
                app.pointers[e.changedTouches[tm].identifier] = e
            }
            console.log('press move: touch ' + e.changedTouches[tm].identifier)
        }
    }
}

canvas.node.onmousedown = canvas.node.ontouchstart = function (e) {
    e.preventDefault()
    if (!app.pointers.enabled) {
        return
    }

    app.pointers.inUse = true
    if (typeof e.changedTouches == 'undefined') {
        app.pointers[0] = e
        console.log('press down: mouse')
    } else {
        for (let ts = 0, dlen = e.changedTouches.length; ts < dlen; ts++) {
            app.pointers[e.changedTouches[ts].identifier] = e
            console.log('press down: touch')
            if (e.changedTouches[ts].identifier == 0) {
                console.log('touch: ' + e.changedTouches[ts].identifier)
            } else if (e.changedTouches[ts].identifier > 0) {
                app.pointers.multi = true
                console.log('touch: ' + e.changedTouches[ts].identifier + '(multi)')
            }
        }
    }
    console.log(JSON.stringify(app.pointers))
}

canvas.node.onmouseup = canvas.node.ontouchend = function (e) {
    e.preventDefault()
    if (!app.pointers.enabled) {
        return
    }

    if (typeof e.changedTouches == 'undefined') {
        app.pointers.inUse = false
        console.log('press up: mouse')
        delete app.pointers[0]
    } else {
        if (e.targetTouches.length == 0) {
            app.pointers.inUse = false
            console.log('press up: touch')
        }

        if (e.targetTouches.length < 2) {
            app.pointers.multi = false
            console.log('touch: (not-multi)')
        } else {
            console.log('touch: (multi)')
        }

        for (let te = 0, dlen = e.changedTouches.length; te < dlen; te++) {
            if (!touchExists(e.targetTouches, e.changedTouches[te].identifier)) {
                console.log('touch: ' + e.changedTouches[te].identifier)
                delete app.pointers[e.changedTouches[te].identifier]
            }
        }
    }
    console.log(JSON.stringify(app.pointers))
}
