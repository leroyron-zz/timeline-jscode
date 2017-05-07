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
