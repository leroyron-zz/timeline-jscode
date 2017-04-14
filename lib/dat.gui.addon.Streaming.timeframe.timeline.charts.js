/**
 * dat.gui.Streaming.timeframe.timeline AddOn: charts
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (gui, app) {
    var _timeline = gui.addon.Streaming.timeframe.timeline
    var that = _timeline.charts = {}
    var _onupdate = function (controller) {
        var seeksegPos = (_timeline.seek.position - _timeline.prevSegmentPos) / (_timeline.segmentPos - _timeline.prevSegmentPos) * 100

        controller.style.left = seeksegPos + '%'
    }
    var _onchange = function (controller, change) {
    }
    _onchange()
    var _onruntime = function (controller) {
    }
    _onruntime()
    var _onpass = function (controller) {
        controller.style.left = (app.width - 395) * (_timeline.prevSegmentPos / 100) + 'px'
        controller.style.width = (app.width - 395) * ((_timeline.segmentPos / 100) - (_timeline.prevSegmentPos / 100)) + 'px'
        controller.innerHTML = 'Segment ' + _timeline.passSegment
    }
    var _resize = function () {
        divCharts.style.width = (app.width - 375) + 'px'
        divCharts.style.paddingRight = 20 + 'px'
        divCsegment.style.left = (app.width - 395) * (_timeline.prevSegmentPos / 100) + 'px'
        divCsegment.style.width = (app.width - 395) * ((_timeline.segmentPos / 100) - (_timeline.prevSegmentPos / 100)) + 'px'
    }

    var divApp = app.element

     // //Charts
    var divChartsStyle = document.createElement('style')
    divChartsStyle.innerHTML = '#charts, .CH div {float: left; position: absolute; width: 100%;}                #charts {color: #fff; font: 11px "Lucida Grande",sans-serif; height: 100%; left: 80px; text-indent: 5px; top: 85px; width: 75%; z-index: 21;}                .CH .name {width: 10%;}                .CH .blocks, .CH .segline {width: 90%;}                .CH div {height: 14px;}                .CH .node, .CH .buffers, .CH .properties {height: auto;}                .CH .set {height: auto;}                .CH .block {background: #ff0000;}                .CH .block:hover {border: #ff0000 1px solid; margin: -1px; z-index: 1}                .CH .csegment {position: relative; color: #222; background: #dad5cb; height: 30px; left: 10%; margin-left: 26px; top: -33px; width: 29%; word-break: break-all; overflow: hidden;}                .CH .data {position: relative; background: #dad5cb; height: 100%; left: 25px; top: -33px; width: 100%; overflow: auto;}                .CH .node {background: #1a1a1a; float: left; padding: 5px 0px; position: relative; top: 10px;width: 100%;}                .CH .node div {position: relative;}                .CH .segseek, .CH .seekwidth, .CH .seekseg, .CH .segline {background: #aaa; width: 1px; z-index: 1;}                .CH .segseek {height: 5px; left: 1%;}                .CH .seekwidth {height: 1px; top: 5px;}                .CH .seekseg {height: 13808px; top: 5px;}                .CH .segline {background: none; width: 90%; height: 1px;}                #coords {color:#fff; position: relative; bottom: 0px; left: 0px; z-index: 1;}                #coords {color: #000};                input {right: left;}                #splinecanvas {position: relative; top: 0px; left: 0px; width:100%; height:120px}             text {font-size: 12px; fill: #bbb}                path, line {stroke: #aaa; fill: #FFF;}'
    divApp.appendChild(divChartsStyle)

    var divCharts = document.createElement('div')
    divCharts.id = 'charts'
    divCharts.style.display = 'none'
    divCharts.setAttribute('class', 'CH')

    var divSeekseg = document.createElement('div')
    divSeekseg.style.left = '11%'
    divSeekseg.setAttribute('class', 'seekseg')

    var divSegline = document.createElement('div')
    divSegline.style.left = '10%'
    divSegline.setAttribute('class', 'segline')
    divSegline.appendChild(divSeekseg)

    var divSegseek = document.createElement('div')
    divSegseek.style.left = '0%'
    divSegseek.setAttribute('class', 'segseek')

    var divData = document.createElement('div')
    divData.setAttribute('class', 'data')
    divData.appendChild(divSegseek)
    divData.appendChild(divSegline)

    var divCsegment = document.createElement('div')
    divCsegment.style.left = '0%'
    divCsegment.style.width = '29%'
    divCsegment.setAttribute('class', 'csegment')
    divCsegment.innerHTML = 'Segment0'

    divCharts.appendChild(divCsegment)
    divCharts.appendChild(divData)

    divApp.appendChild(divCharts)
    // //

    // //Chart fake data
    var divNodes = ['Adjustments', 'MotionBlur', 'Uniforms']

    var properties = {}
    properties.Adjustments = [
        ['value',
            [['resolution',
            [6200, 'auto']]]
        ]
    ]
    properties.MotionBlur = [
        ['value',
            [['shutterspeed',
            [6200, 2]],
            ['influence',
            [6200, 10]]]
        ]
    ]
    properties.Uniforms = [
        ['value',
            [['godray_amount',
            [6200, 15]],
            ['screenshadow_alpha',
            [6200, 1]],
            ['ash_direction',
            [6200, 3]]]
        ]
    ]
    properties.translations = [
        ['position',
            [['x'// ,
            // [6200,100]
            ],
            ['y'// ,
            // [6200,100]
            ],
            ['z'// ,
            // [6200,100]
            ]]
        ],
        ['rotation',
            [['x'],
            ['y'],
            ['z']]
        ]
    ]

    var randFromTo = function (nfrom, nto) { // To fake the values
        return Math.floor((Math.random() * (nto - nfrom) + 1) + nfrom)
    }
    var randFromToString = function (nfrom, nto) { // To fake the values
        var ranNum = Math.floor((Math.random() * (nto - nfrom) + 1) + nfrom)
        ranNum = ranNum < 0 ? ranNum : '+' + ranNum
        return ranNum
    }
    genBlocks(divNodes)
    genBlocks(100, 'tri')

    function genBlocks (gen, genName) {
        var nlen = 0
        var isNum = !isNaN(gen)
        if (isNum) {
            nlen = gen
        } else {
            nlen = gen.length
        }

        for (let n = 0; n < nlen; n++) {
            let divNode = document.createElement('div')
            divNode.setAttribute('class', 'node')

            let divName = document.createElement('div')
            divName.className = 'name'
            if (isNum) {
                divName.innerHTML = genName + n
            } else {
                divName.innerHTML = gen[n]
            }

            let divBlocks = document.createElement('div')
            divBlocks.setAttribute('class', 'blocks')

            let divBuffers = document.createElement('div')
            divBuffers.setAttribute('class', 'buffers')

            let divProperties = document.createElement('div')
            divProperties.setAttribute('class', 'properties')

            divNode.appendChild(divName)
            divNode.appendChild(divBlocks)

            let prop
            if (isNum) {
                prop = properties.translations
            } else {
                prop = properties[gen[n]]
            }

            for (let p = 0; p < prop.length; p++) {
                let divSet = document.createElement('div')
                divSet.setAttribute('class', 'set')

                divName = document.createElement('div')
                divName.className = 'name'
                divName.innerHTML = prop[p][0]
                divSet.appendChild(divName)
                for (let s = 0; s < prop[p][1].length; s++) {
                    let divProp = document.createElement('div')
                    divProp.setAttribute('class', 'prop')

                    divName = document.createElement('div')
                    divName.className = 'name'
                    divName.innerHTML = prop[p][1][s][0]
                    divProp.appendChild(divName)

                    divBlocks = document.createElement('div')
                    divBlocks.setAttribute('class', 'blocks')

                    let segment4length = 6200// gui.nextSegmentPos - gui.segmentPos;//At segment 4 22000 - 15800

                    if (isNum) {
                        let sumCheck = 0
                        let fNum = 0
                        prop[p][1][s] = [prop[p][1][s][0]]
                        for (let fs = segment4length; fs > 0; fs -= fNum) { // Randomize fake data
                            fNum = randFromTo(2000, 5000)
                            sumCheck += fNum
                            if (sumCheck > segment4length) {
                                fNum -= (sumCheck - segment4length)
                            }
                            prop[p][1][s].push([fNum, randFromToString(-1000, 1000)])
                        }
                    }

                    for (let b = 1; b < prop[p][1][s].length; b++) {
                        let divBlock = document.createElement('div')
                        divBlock.setAttribute('class', 'block')
                        divBlock.setAttribute('data-value', parseInt(prop[p][1][s][b][1]))
                        divBlock.setAttribute('data-length', prop[p][1][s][b][0])
                            // divBlock.setAttribute('data-length', prop[p][1][s][b][0]);
                        divBlock.style.width = prop[p][1][s][b][0] / segment4length * 100/* (prop[p][1][s][b][0]/(gui.nextSegmentPos - gui.segmentPos)*100) */+ '%'
                        divBlock.style.background = 'rgb(' + parseInt(225 - 255 * (prop[p][1][s][b][0] / segment4length)) + ',50,' + parseInt(455 * (prop[p][1][s][b][0] / segment4length)) + ')'
                        divBlock.innerHTML = prop[p][1][s][b][1]
                            // divBlock.addEventListener('click', showGraph)
                        divBlocks.appendChild(divBlock)
                    }

                    divProp.appendChild(divBlocks)

                    divSet.appendChild(divProp)
                }

                divProperties.appendChild(divSet)
            }

            divBuffers.appendChild(divProperties)

            divNode.appendChild(divBuffers)

            divData.appendChild(divNode)
        }
    }

    // GUI
    gui.controls.charts = gui.addFolder('Charts')
    var chartsOpen = false
    that.openToggleCharts = function () {
        if (chartsOpen) {
            divCharts.style.display = 'none'
            chartsOpen = false
        } else {
            divCharts.style.display = 'inline'
            chartsOpen = true
            _timeline.checkPassSegment()
        }
    }

    gui.addon.bind.onupdate(divSeekseg, _timeline, _onupdate)

    gui.addon.bind.onpass(divCsegment, _timeline, _onpass)

    gui.controls.charts.onopenFolder(that.openToggleCharts)

    _resize()
    window.resizeCalls.push(_resize)
})(this.gui, this.app)
