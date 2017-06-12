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
    for (var i = 0; i < dropdownSelect.length; i++) {
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
        // e.preventDefault()
        if (Utils.keyBindings[e.keyCode].args.length > 0) { Utils.keyBindings[e.keyCode].func.apply(this, Utils.keyBindings[e.keyCode].args) } else { Utils.keyBindings[e.keyCode].func() }
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
