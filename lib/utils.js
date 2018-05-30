var Utils = {}

Utils.userSelectDropDown = function (dropdownSelect) {
    var userSelect = dropdownSelect
    userSelect.addEventListener('change', function () {
        window.localStorage.setItem('storedSelect', [this.selectedIndex, this.options[this.selectedIndex].value])
        window.location.reload()
    })
    var storedSelect = window.localStorage.getItem('storedSelect')
    if (storedSelect) {
        storedSelect = storedSelect.split(',')
        userSelect.selectedIndex = storedSelect[0]
        userSelect = storedSelect[1]
    } else userSelect = undefined
    return userSelect || dropdownSelect.options[dropdownSelect.selectedIndex].value
}

Utils.vscodeSelectDropDown = function (vsCodesetting, dropdownSelect) {
    var vscodeSelect
    for (let i = 0; i < dropdownSelect.length; i++) {
        if (dropdownSelect[i].value === vsCodesetting) {
            dropdownSelect[i].selected = true
            vscodeSelect = dropdownSelect.options[i].value
            break
        }
    }
    return vscodeSelect
}

Utils.Blend = {}
Utils.Blend.src = [ 'ZeroFactor', 'OneFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor', 'DstColorFactor', 'OneMinusDstColorFactor', 'SrcAlphaSaturateFactor' ]
        //          '200'         '201'        '204'             '205'                     '206'             '207'                     '208'             '209'                     '210'
Utils.Blend.dst = [ 'ZeroFactor', 'OneFactor', 'SrcColorFactor', 'OneMinusSrcColorFactor', 'SrcAlphaFactor', 'OneMinusSrcAlphaFactor', 'DstAlphaFactor', 'OneMinusDstAlphaFactor' ]
        //          '200'         '201'        '208'             '203'                     '204'             '205'                     '206'             '207'
Utils.Blend.blending = 'CustomBlending'

Utils.flagBut = false
// BINDING AND UNBINDING BUTTONS AND KEYS
Utils.bindButtonUseFunction = function (button, func, args) {
    if (typeof (button) == 'undefined') { return }
    var clickTouch = function (e) {
        e.preventDefault()
        if (!Utils.flagBut) {
            Utils.flagBut = true
            setTimeout(function () { Utils.flagBut = false }, 100)

            if (arguments.length > 0) { func.apply(this, args) } else { func() }
        }
        return false
    }
    button.addEventListener('click', clickTouch)
    button.addEventListener('touchstart', clickTouch)
}
Utils.unBindButton = function (button) {
    if (typeof (button) == 'undefined') { return }
    button.removeEventListener('click')
    button.removeEventListener('touchstart')
}

Utils.bindButtonAndKeyPressUseFunction = function (button, key, func, args) {
    if (typeof (button) == 'undefined') { return }
    var clickTouch = function (e) {
        e.preventDefault()
        if (!Utils.flagBut) {
            Utils.flagBut = true
            setTimeout(function () { Utils.flagBut = false }, 100)

            if (arguments.length > 0) { func.apply(this, args) } else { func() }
        }
        return false
    }
    var keyPress = function (e) {
        // e.preventDefault()
        if (Utils.keyBindings[e.keyCode].args.length > 0) { Utils.keyBindings[e.keyCode].func.apply(this, Utils.keyBindings[e.keyCode].args) } else { Utils.keyBindings[e.keyCode].func() }
        return false
    }
    button.addEventListener('click', clickTouch)
    button.addEventListener('touchstart', clickTouch)
    Utils.keyBindings[Utils.keyMapping[key]] = {keyPress: keyPress, func: func, key: key, args: args}
    window.addEventListener('keypress', Utils.keyBindings[Utils.keyMapping[key]].keyPress)
}
Utils.unBindButtonAndKeyPress = function (button, key) {
    if (typeof (button) == 'undefined') { return }
    button.removeEventListener('click')
    button.removeEventListener('touchstart')
    window.removeEventListener('keypress', Utils.keyBindings[Utils.keyMapping[key]].keyPress)
}

Utils.bindKeyPressUseFunction = function (key, func, args) {
    var keyPress = function (e) {
        e.preventDefault()
        if (!Utils.flagBut) {
            Utils.flagBut = true
            setTimeout(function () { Utils.flagBut = false }, 100)
            if (Utils.keyBindings[e.keyCode].args.length > 0) { Utils.keyBindings[e.keyCode].func.apply(this, Utils.keyBindings[e.keyCode].args) } else { Utils.keyBindings[e.keyCode].func() }
        }
        return false
    }
    Utils.keyBindings[Utils.keyMapping[key]] = {keyPress: keyPress, func: func, key: key, args: args}
    window.addEventListener('keypress', Utils.keyBindings[Utils.keyMapping[key]].keyPress)
}
Utils.unBindKeyPress = function (key) {
    window.removeEventListener('keypress', Utils.keyBindings[Utils.keyMapping[key]].keyPress)
}

Utils.bindKeyUpDownUseFunction = function (key, func1, func2, args, hold) {
    var flagBut = false
    var keyDown = function (code) {
        if (hold && func1) {
            if (!flagBut) {
                flagBut = true
            } else return false
            keyState[code] = undefined
        }
        if (args.length > 0) func1.apply(this, args); else func1()
        return false
    }

    var keyUp = function (code) {
        if (hold && func2) {
            if (flagBut) {
                flagBut = false
            } else return false
            keyState[code] = undefined
        }
        if (args.length > 0) func2.apply(this, args); else func2()
        return false
    }

    Utils.keyBindings[Utils.keyMapping[key]] = {
        keyDown: keyDown, keyUp: keyUp
    }
}

// keyState loop (non-thread blocking)
var keyState = []
Utils.bindKeyStateLoop = function () {
    for (let code = 0; code < keyState.length; code++) if (keyState[code]) keyState[code][0][keyState[code][1]](code)
}

window.addEventListener('keydown', function (e) {
    // e.preventDefault()
    keyState[e.keyCode || e.which] = Utils.keyBindings[e.keyCode || e.which] ? [Utils.keyBindings[e.keyCode || e.which], 'keyDown'] : undefined
}, true)

window.addEventListener('keyup', function (e) {
    // e.preventDefault()
    keyState[e.keyCode || e.which] = Utils.keyBindings[e.keyCode || e.which] ? [Utils.keyBindings[e.keyCode || e.which], 'keyUp'] : undefined
}, true)

Utils.unBindKeyUpDown = function (key) {
    Utils.keyBindings[Utils.keyMapping[key]] = undefined
}

Utils.keyBindings = {}
Utils.keyMapping = {
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
    '0': 48,
    '-': 189,
    '=': 187,
    '\\': 220,
    'q': 81,
    'w': 87,
    'e': 69,
    'r': 82,
    't': 84,
    'y': 89,
    'u': 85,
    'i': 73,
    'o': 79,
    'p': 80,
    '[': 219,
    ']': 221,
    'a': 65,
    's': 83,
    'd': 68,
    'f': 70,
    'g': 71,
    'h': 72,
    'j': 74,
    'k': 75,
    'l': 76,
    ';': 186,
    '\'': 222,
    'z': 90,
    'x': 88,
    'c': 67,
    'v': 86,
    'b': 66,
    'n': 78,
    'm': 77,
    ',': 188,
    '.': 190,
    '/': 191
}

for (var char in Utils.keyMapping) {
    Utils.keyMapping[char] = char.charCodeAt(0)
}

Utils.Optimize = {}

Utils.loadJSON = function loadJSON (url, callback) {
    var xobj = new window.XMLHttpRequest()
    xobj.overrideMimeType('application/json')
    xobj.open('GET', url, true)
    xobj.callback = callback
    xobj.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == '200') {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            this.callback(JSON.parse(this.responseText))
        }
    }
    xobj.send(null)
}

Utils.Optimize.UVSpritesFromJSON = function (geometry, url) {
    var uvPayloadIDs = function (data) {
        var param = []
        for (let sprite in data) {
            param[param.length] = param.length / 5
            param[param.length] = data[sprite].uin
            param[param.length] = data[sprite].uout
            param[param.length] = data[sprite].vin
            param[param.length] = data[sprite].vout
        }
        var alen = param.length
        // use Float Buffer
        var fParam = new Float32Array(new ArrayBuffer(alen * 4))
        for (let bDI = 0; bDI < alen; bDI++) {
            fParam[bDI] = param[bDI]
        }

        // collect params into buffer
        var uvsprite = []
        for (let uv = 0; uv < geometry.attributes.uv.array.length; uv++) {
            let u = geometry.attributes.uv.array[uv]
            uv++
            let v = geometry.attributes.uv.array[uv]
            for (let p = 0, s = 0; p < fParam.length; s++) {
                if (!uvsprite[param[p]]) {
                    uvsprite[param[p]] = {
                        Uin: param[p + 1],
                        Uout: param[p + 2],
                        Udelta: 0,
                        Vin: param[p + 3],
                        Vout: param[p + 4],
                        Vdelta: 0,
                        array: [],
                        current: {},
                        change: {mode: 'all', in: 0, out: 0},
                        target: geometry.attributes.uv.array,
                        get U () {
                            return this.current[this.change.mode][0]
                        },
                        set U (num) {
                            var sub = this.Uin - this.Uout
                            sub *= num - this.current[this.change.mode][0]
                            for (let u = this.change.in; u < this.change.out; u++) {
                                this.target[this.array[u] + 1] -= sub
                            }
                            this.current[this.change.mode][0] = num
                        },
                        get V () {
                            return this.current[this.change.mode][1]
                        },
                        set V (num) {
                            var sub = this.Vin - this.Vout
                            sub *= num - this.current[this.change.mode][1]
                            for (let v = this.change.in; v < this.change.out; v++) {
                                this.target[this.array[v]] -= sub
                            }
                            this.current[this.change.mode][1] = num
                        },
                        get effect () { // all, left, right
                            return this.change.mode
                        },
                        set effect (str) {
                            this.change.mode = str
                            this.change.in = 0
                            this.change.out = this.array.length
                            switch (str) {
                            case 'left' :
                                this.change.out = this.array.length / 2
                                break
                            case 'right' :
                                this.change.in = this.array.length / 2
                                break
                            default:
                                this.change.mode = 'all'
                            }

                            if (!this.current[this.change.mode]) this.current[this.change.mode] = [0, 0]
                        }
                    }
                }

                if ((u >= fParam[p + 1] && u <= fParam[p + 2]) && (v <= fParam[p + 3] && v >= fParam[p + 4])) uvsprite[fParam[p]].array[uvsprite[fParam[p]].array.length] = uv // id "U" position in the buffer,
                p += 5

                // To-Do add to new uvsprite object buffer and save as file... find out how to save arrayFloatBuffer and check compatibility, use arrayFloatBuffer and arrayInt32Buffer file for save and loading across entire library.
            }
        }

        for (let data in uvsprite) {
            var dlen = uvsprite[data].array.length
            // use Int Buffer
            var spriteData = new Float32Array(new ArrayBuffer(dlen * 4))
            for (let bDI = 0; bDI < dlen; bDI++) {
                spriteData[bDI] = uvsprite[data].array[bDI]
            }
            uvsprite[data].array = spriteData
            uvsprite[data].effect = 'all'
        }
        geometry.attributes.uv.sprite = uvsprite
        geometry.attributes.uv.sprite.target = geometry.attributes.uv.array
    }

    Utils.loadJSON(url, uvPayloadIDs)
}
