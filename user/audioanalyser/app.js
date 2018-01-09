this.canvas.app = new function (app, canvas, ctx) {
    // Public
    this.width = 680
    this.height = 225
    this.aspect = Math.aspectRatio(this.height, this.width)
    this.resolution = function (app) {
        // Screen resize adjustments
        canvas.node.width = this.width = app.width
        canvas.node.height = this.height = this.aspect * this.width
        canvas.node.style.width = canvas.node.width + 'px'
        canvas.node.style.height = canvas.node.height + 'px'

        this.resX = 680 / this.width
        this.resY = 225 / this.height
    }
    this.resolution(app)

    // Private
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    var audio, audioSrc, analyser, bufferLength, audioFreqData, audioUrl
    var inject = false

    var tickSound

    function init () {
        audioUrl = '/user/Beta-audiofeaturealizer/assets/' + 'features.mp3'
        var tickUrl = app.fileLocAssets + 'Tick.mp3'
        tickSound = new window.Audio(tickUrl)

        document.getElementsByTagName('link')[0].href = app.codeLoc + '/style.css?v=1.0'
    }

    ctx.timeline.addon.timeframe.process = function () {
        ctx.process(this.access, this.frame._duration, this._timeFrame, this.lapse)// before timeFrame process
    }

    var intermediateFrame = 0
    var deltaDuration = 0
    ctx.process = function (access, duration, timeFrame, lapse) {
        window.Utils.bindKeyStateLoop()
        if (inject) {
            if (inject.dynamicData) {
                inject.data = inject.dynamicData(inject.effector)
                if (inject.data.length > 1) {
                    let writeFrame = timeFrame + (lapse / 2) // cut lapse in half for fast CPU better visibility
                    if (duration > intermediateFrame) {
                        intermediateFrame = duration + writeFrame - (duration - deltaDuration)// rework injections after each write end for visibility during runtime
                        if (access == 'read') {
                            this.timeline.addon.buffer.injectData(inject.stream, inject.nodes, inject.props, inject.data, writeFrame, true, inject.min, inject.max)// add lapse to see real time change
                        } else {
                            this.timeline.addon.buffer.injectData(inject.stream, inject.nodes, inject.props, Math.Ploy.subtract('poly', inject.data, inject.deltaData), true, inject.min, inject.max)// add lapse to see real time change
                            inject.deltaData = inject.data.concat()
                        }
                    }
                    deltaDuration = duration
                    return
                }
                inject = false
            } else {
                // the effects of these injections here are not visible during runtime but accurate
                analyser.getByteFrequencyData(audioFreqData)
                inject.data = audioFreqData
                if (inject.data.length > 1) {
                    if (access == 'read') {
                        this.timeline.addon.buffer.injectData(inject.stream, inject.nodes, inject.props, inject.data, timeFrame)
                    } else {
                        this.timeline.addon.buffer.injectData(inject.stream, inject.nodes, inject.props, Math.Ploy.subtract('poly', inject.data, inject.deltaData), timeFrame)
                        inject.deltaData = inject.data.concat()
                    }
                    return
                }
                inject = false
            }
        }
    }

    ctx.timeline.addon.timeframe.invoke = function () {
        ctx.calc(this.lapse, this.access)// before render
        ctx.rendering(this._timeFrame)
        ctx.compute()// after render
    }

    ctx.calc = function (lapse, access) {

    }

    var loadedFromFile = false
    ctx.rendering = function (timeFrame) {
        this.clearRect(0, 0, canvas.app.width, canvas.app.height)
        var frequencyWidth = (canvas.app.width / bufferLength)
        var frequencyHeight = 0
        var x = 0

        if (loadedFromFile) {
            for (let increment = 0; increment < bufferLength; increment++) {
                frequencyHeight = (audio.frequency[increment] * (1 + audio.enhancement[increment])) * (canvas.app.height * 0.002) + (20 * audio.enhancement[increment])
                this.fillStyle = 'rgba(0,255,0,0.5)'
                this.fillRect(x, canvas.app.height - frequencyHeight, frequencyWidth, frequencyHeight)

                frequencyHeight = audio.frequency[increment] * (canvas.app.height * 0.002)
                this.fillStyle = 'rgba(255,0,0,0.5)'
                this.fillRect(x, canvas.app.height - frequencyHeight, frequencyWidth, frequencyHeight)

                x += frequencyWidth
            }
        } else
        if (inject) {
            for (let increment = 0; increment < bufferLength; increment++) {
                // MP3 data
                frequencyHeight = (audioFreqData[increment] * (1 + audio.enhancement[increment])) * (canvas.app.height * 0.002) + (20 * audio.enhancement[increment])
                this.fillStyle = 'rgba(0,255,0,0.5)'
                this.fillRect(x, canvas.app.height - frequencyHeight, frequencyWidth, frequencyHeight)

                frequencyHeight = audioFreqData[increment] * (canvas.app.height * 0.002)
                this.fillStyle = 'rgba(0,0,255,0.5)'
                this.fillRect(x, canvas.app.height - frequencyHeight, frequencyWidth, frequencyHeight)

                x += frequencyWidth
            }
        } else {
            for (let increment = 0; increment < bufferLength; increment++) {
                // Streaming data

                frequencyHeight = (audio.frequency[increment] * (1 + audio.enhancement[increment])) * (canvas.app.height * 0.002) + (20 * audio.enhancement[increment])
                this.fillStyle = 'rgba(0,255,0,0.5)'
                this.fillRect(x, canvas.app.height - frequencyHeight, frequencyWidth, frequencyHeight)

                frequencyHeight = audio.frequency[increment] * (canvas.app.height * 0.002)
                this.fillStyle = 'rgba(255,0,0,0.5)'
                this.fillRect(x, canvas.app.height - frequencyHeight, frequencyWidth, frequencyHeight)

                x += frequencyWidth
            }
        }
    }

    ctx.compute = function () {

    }

    this.SetupContextBindsForStreamAndBuildAfterLoad = function () {
        app.codeLoc = 'user/' + app.codesetting
        app.fileLocAssets = app.vscode._fileLocal + app.codeLoc + '/assets/'
        init()
        createGFXBindNodesToStream('timeline')
    }

    function createGFXBindNodesToStream (stream) {
        console.log('Loading audio and binding to stream - Starting')
        var bind = ctx[stream].addon.binding

        var div = document.getElementById('info')

        // var lineupDiv = document.getElementById('lineup')

        var audioRequest = new window.XMLHttpRequest()
        audioRequest.open('GET', audioUrl, true)
        audioRequest.responseType = 'blob'

        audioRequest.onload = function () {
            audio = new window.Audio(window.URL.createObjectURL(audioRequest.response))
            audioSrc = audioCtx.createMediaElementSource(audio)
            analyser = audioCtx.createAnalyser()
            analyser.maxDecibels = 0
            analyser.minDecibels = -120
            analyser.fftSize = 64
            analyser.fftHalfSize = analyser.fftSize / 2
            analyser.fftSizePiece = analyser.fftHalfSize * 0.1 + 2 << 0
            analyser.effect = 0
            audioSrc.connect(analyser)
            analyser.connect(audioCtx.destination)

            bufferLength = analyser.frequencyBinCount
            audioFreqData = new Uint8Array(bufferLength)

            // // Simple Bind and Buffering
            bind.init(stream, [
            [audio.frequency = {'poly': []}, 800]
            ],
                [
                ['poly', audioFreqData]
                ],
            [802],
            false,
            1) // 0 - 255

            bind.init(stream, [
            [audio.enhancement = {'poly': []}, 801]
            ],
                [
                ['poly', audioFreqData]
                ],
            [802],
            false,
            100) // 0 - 100
            // enhance precision

            buildStream()

            // injectRecordBut.click()
            loadEnhancementDataBut.click()
            loadMp3DataBut.click()
            autoSyncBut.click()
            audio.play()
            // ctx.timeline.addon.timeframe.goTo(23500)
            // audio.currentTime = ctx.timeline.addon.timeframe.duration / 100
        }
        audioRequest.send()

        var divElem = document.createElement('div')
        var parentNode = canvas.node.parentNode

        var textKeyUpNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
        var textKeyUpAlpha = ['l', 'k', 'j', 'h', 'g', 'f', 'd', 's', 'a', 'z']
        var textKeyDownAlpha = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
        for (let i = 0; i < 10; i++) {
            var freqDiv = document.createElement('div')
            freqDiv.className = 'freqDiv'

            var freqUp = document.createElement('div')
            freqUp.className = 'freqUp'
            freqUp.dataset.tenthRange = i

            var genFreqUpGain = function (elem) {
                // ctx.timeline.addon.timeframe.goTo(audio.currentTime * 100 << 0)
                function dynamicData (effector) {
                    // TO-DO - add effector
                    analyser.effect += effector
                    analyser.effect = analyser.effect > inject.max ? inject.max : analyser.effect

                    if (!inject.output) {
                        let midEase = Math.Poly.Medium.midEase(analyser.fftSizePiece * 2)
                        let offset = analyser.fftSizePiece * inject.tenthRange - (inject.tenthRange * 1.5) << 0
                        offset -= analyser.fftSizePiece * 2 / 2
                        inject.output = new Array(analyser.fftHalfSize).fill(0).map(function (x, i) {
                            return midEase[-offset + i] ? midEase[-offset + i] : 0
                        })
                    }

                    return inject.output.map(function (x) {
                        return x * analyser.effect
                    })
                }
                inject = {stream: stream, nodes: [audio.enhancement], props: ['poly'], data: [], deltaData: [], dynamicData: dynamicData, effector: 0.4, tenthRange: (elem.dataset ? elem.dataset.tenthRange : elem.currentTarget.dataset.tenthRange) << 0, min: 0, max: 1}

                injectRecordBut.className = 'rec'
                injectRecordBut.innerHTML = 'Inject Audio Frequency Data &bull; Segment <span class="rec seg">0</span>'
            }
            freqUp.addEventListener('mousedown', genFreqUpGain)

            var genFreqUpDrain = function () {
                // ctx.timeline.addon.timeframe.goTo(audio.currentTime * 100 << 0)
                function dynamicData (effector) {
                    analyser.effect -= effector
                    analyser.effect = analyser.effect < inject.min ? inject.min : analyser.effect

                    // TO-DO - add effector
                    if (analyser.effect <= inject.min || !inject.output) { inject.output = []; return inject.output }

                    return inject.output.map(function (x) {
                        return x * analyser.effect
                    })
                }
                inject.dynamicData = dynamicData
                inject.effector = 0.18

                injectRecordBut.className = 'rec'
                injectRecordBut.innerHTML = 'Inject Audio Frequency Data &bull; Segment <span class="rec seg">0</span>'
            }
            freqUp.addEventListener('mouseup', genFreqUpDrain)

            var freqCut = document.createElement('div')
            freqCut.className = 'freqCut'
            freqCut.dataset.tenthRange = i

            var genFreqCut = function (elem) {
                // ctx.timeline.addon.timeframe.goTo(audio.currentTime * 100 << 0)
                function dynamicData (effector) {
                    // TO-DO - add effector
                    if (!inject.output) {
                        let midEase = Math.Poly.Medium.midEase(analyser.fftSizePiece * 2)
                        let offset = analyser.fftSizePiece * inject.tenthRange - (inject.tenthRange * 1.5) << 0
                        offset -= analyser.fftSizePiece * 2 / 2
                        inject.output = new Array(analyser.fftHalfSize).fill(0).map(function (x, i) {
                            return midEase[-offset + i] ? -9 : 0
                        })
                    }

                    return inject.output
                }
                inject = {stream: stream, nodes: [audio.enhancement], props: ['poly'], data: [], deltaData: [], dynamicData: dynamicData, effector: 0, tenthRange: (elem.dataset ? elem.dataset.tenthRange : elem.currentTarget.dataset.tenthRange) << 0, min: 0, max: 1}

                injectRecordBut.className = 'rec'
                injectRecordBut.innerHTML = 'Inject Audio Frequency Data &bull; Segment <span class="rec seg">0</span>'
            }
            freqCut.addEventListener('mousedown', genFreqCut)
            freqCut.addEventListener('mouseup', genFreqUpDrain)

            var freqDown = document.createElement('div')
            freqDown.className = 'freqDown'
            freqDown.dataset.tenthRange = i

            var genFreqDownGain = function (elem) {
                // ctx.timeline.addon.timeframe.goTo(audio.currentTime * 100 << 0)
                function dynamicData (effector) {
                    analyser.effect -= effector
                    analyser.effect = analyser.effect < inject.min ? inject.min : analyser.effect

                    if (!inject.output) {
                        let midEase = Math.Poly.Medium.midEase(analyser.fftSizePiece * 2)
                        let offset = analyser.fftSizePiece * inject.tenthRange - (inject.tenthRange * 1.5) << 0
                        offset -= analyser.fftSizePiece * 2 / 2
                        inject.output = new Array(analyser.fftHalfSize).fill(0).map(function (x, i) {
                            return midEase[-offset + i] ? midEase[-offset + i] : 0
                        })
                    }

                    return inject.output.map(function (x) {
                        return x * analyser.effect
                    })
                }
                inject = {stream: stream, nodes: [audio.enhancement], props: ['poly'], data: [], deltaData: [], dynamicData: dynamicData, effector: 0.4, tenthRange: (elem.dataset ? elem.dataset.tenthRange : elem.currentTarget.dataset.tenthRange) << 0, min: -1, max: 0}

                injectRecordBut.className = 'rec'
                injectRecordBut.innerHTML = 'Inject Audio Frequency Data &bull; Segment <span class="rec seg">0</span>'
            }
            freqDown.addEventListener('mousedown', genFreqDownGain)

            var genFreqDownDrain = function () {
                // ctx.timeline.addon.timeframe.goTo(audio.currentTime * 100 << 0)
                function dynamicData (effector) {
                    analyser.effect += effector
                    analyser.effect = analyser.effect > inject.max ? inject.max : analyser.effect

                    if (analyser.effect >= inject.max || !inject.output) { inject.output = []; return inject.output }

                    return inject.output.map(function (x) {
                        return x * analyser.effect
                    })
                }
                inject.dynamicData = dynamicData
                inject.effector = 0.18

                injectRecordBut.className = 'rec'
                injectRecordBut.innerHTML = 'Inject Audio Frequency Data &bull; Segment <span class="rec seg">0</span>'
            }
            freqDown.addEventListener('mouseup', genFreqDownDrain)

            let topLeftKey = document.createElement('div')
            topLeftKey.innerHTML = textKeyUpNum[i]
            topLeftKey.style.width = '50%'
            topLeftKey.style.textAlign = 'left'
            topLeftKey.style.paddingBottom = '50%'
            freqUp.appendChild(topLeftKey)
            window.Utils.bindKeyUpDownUseFunction(textKeyUpNum[i], genFreqUpGain, genFreqUpDrain, [topLeftKey], true)

            let topRightKey = document.createElement('div')
            topRightKey.innerHTML = textKeyUpAlpha[i]
            topRightKey.style.width = '50%'
            topRightKey.style.textAlign = 'right'
            topRightKey.style.paddingBottom = '50%'
            freqUp.appendChild(topRightKey)
            window.Utils.bindKeyUpDownUseFunction(textKeyUpAlpha[i], genFreqUpGain, genFreqUpDrain, [topRightKey], true)

            let bottomLeftKey = document.createElement('div')
            bottomLeftKey.innerHTML = textKeyDownAlpha[i]
            bottomLeftKey.style.width = '50%'
            bottomLeftKey.style.textAlign = 'left'
            bottomLeftKey.style.paddingTop = '50%'
            freqDown.appendChild(bottomLeftKey)
            window.Utils.bindKeyUpDownUseFunction(textKeyDownAlpha[i], genFreqDownGain, genFreqDownDrain, [bottomLeftKey], true)

            topLeftKey.dataset.tenthRange = topRightKey.dataset.tenthRange = bottomLeftKey.dataset.tenthRange = freqUp.dataset.tenthRange = freqDown.dataset.tenthRange = i

            freqDiv.appendChild(freqUp)
            freqDiv.appendChild(freqCut)
            freqDiv.appendChild(freqDown)
            parentNode.insertBefore(freqDiv, canvas.node.nextSibling)
        }

        var playBut = document.createElement('button')
        playBut.innerHTML = 'Play the Audio'
        playBut.addEventListener('click', function () {
            audio.play()
        })
        divElem.appendChild(playBut)

        var pauseBut = document.createElement('button')
        pauseBut.innerHTML = 'Pause the Audio'
        pauseBut.addEventListener('click', function () {
            audio.pause()
        })
        divElem.appendChild(pauseBut)

        var increaseBut = document.createElement('button')
        increaseBut.innerHTML = 'Increase Volume'
        increaseBut.addEventListener('click', function () {
            audio.volume += 0.1
        })
        divElem.appendChild(increaseBut)

        var decreaseBut = document.createElement('button')
        decreaseBut.innerHTML = 'Decrease Volume'
        decreaseBut.addEventListener('click', function () {
            audio.volume -= 0.1
        })
        divElem.appendChild(decreaseBut)

        // injection of MP3 frequency: sync first then inject
        var injectRecordBut = document.createElement('button')
        injectRecordBut.id = 'freqRec'
        injectRecordBut.className = 'rec'
        injectRecordBut.innerHTML = 'Inject Audio Frequency Data &bull; Segment <span class="rec seg">0</span>'
        injectRecordBut.addEventListener('click', function () {
            // sync first
            ctx.timeline.addon.timeframe.goTo(audio.currentTime * 100 << 0)
            // start injection
            inject = !inject ? {stream: stream, nodes: [audio.frequency], props: ['poly'], data: [], deltaData: []} : false
            // Global record/segment class rec *
            this.className = (this.className == 'rec off' || this.className == 'rec on') ? 'rec' : 'rec off'
            this.innerHTML = this.className == 'rec' ? 'Inject Audio Frequency Data &bull; Segment <span class="rec seg">0</span>' : 'Recording <span class="bull">&bull;</span> Segment <span class="rec seg">0</span> (Stop this, Seek back on TimeLine, Then - Sync MP3 with TimeLine)'
        })
        divElem.appendChild(injectRecordBut)

        var autoSyncBut = document.createElement('button')
        autoSyncBut.innerHTML = 'Auto TimeLine Syncing (Every 2th bar):'
        autoSyncBut.addEventListener('click', function () {
            ctx.timeline.addon.timeframe.timeline.destroy()
            var bar4th = autoSyncBpm.value
            var barLength = autoSyncLength.value / bar4th

            var segmentAuth = new function (timeframe) {
                this.main = function () {
                    timeframe.goTo(audio.currentTime * 100 << 0)
                    tickSound.play()
                }
                return this
            }(ctx.timeline.addon.timeframe)

            var data = {segment: {}}
            for (let bi = 0; bi < autoSyncLength.value; bi += barLength) {
                data.segment[bi << 0] = {Authority: segmentAuth}
            }
            ctx.timeline.addon.timeframe.timeline.seek.insert.insertAuthorities(data)
        })
        divElem.appendChild(autoSyncBut)

        var autoSyncLength = document.createElement('span')
        autoSyncLength.innerHTML = 'Duration:'// audio.duration * 100 << 0
        divElem.appendChild(autoSyncLength)
        autoSyncLength = document.createElement('input')
        autoSyncLength.value = 29876// audio.duration * 100 << 0
        divElem.appendChild(autoSyncLength)

        var autoSyncBpm = document.createElement('span')
        autoSyncBpm.innerHTML = 'BPM:'// audio.duration * 100 << 0
        divElem.appendChild(autoSyncBpm)
        autoSyncBpm = document.createElement('input')
        autoSyncBpm.value = 145
        divElem.appendChild(autoSyncBpm)

        var syncMP3But = document.createElement('button')
        syncMP3But.innerHTML = 'Sync MP3 with TimeLine'
        syncMP3But.addEventListener('click', function () {
            ctx.timeline.addon.timeframe.timeline.destroy()
            audio.currentTime = ctx.timeline.addon.timeframe.duration / 100
        })
        divElem.appendChild(syncMP3But)

        var syncTimeLineBut = document.createElement('button')
        syncTimeLineBut.innerHTML = 'Sync TimeLine with MP3'
        syncTimeLineBut.addEventListener('click', function () {
            ctx.timeline.addon.timeframe.timeline.destroy()
            ctx.timeline.addon.timeframe.goTo(audio.currentTime * 100 << 0)
        })
        divElem.appendChild(syncTimeLineBut)

        var saveMp3DataBut = document.createElement('button')
        saveMp3DataBut.innerHTML = 'Save MP3 Recorded Data'
        saveMp3DataBut.addEventListener('click', function () {
            var data = ctx.timeline.addon.buffer.getData('timeline', [audio.frequency] /* propSet[default: all] <-from(default: 0) to(default: propDataLength = 29876) , 956097, 29876 */)
            ctx.timeline.addon.buffer.saveData(data, 'mp3.js')
        })
        divElem.appendChild(saveMp3DataBut)

        var loadMp3DataBut = document.createElement('button')
        loadMp3DataBut.innerHTML = 'Load MP3 Recorded Data'
        loadMp3DataBut.addEventListener('click', function () {
            loadedFromFile = true
            ctx.timeline.addon.buffer.loadData('timeline', '/user/Beta-audiofeaturealizer/assets/' + 'mp3Data956097_29876.js', 0 /* <-offset(default: 0) , 956097, 29876 */)
        })
        divElem.appendChild(loadMp3DataBut)

        var saveEnhancementDataBut = document.createElement('button')
        saveEnhancementDataBut.innerHTML = 'Save Enhancement Recorded Data'
        saveEnhancementDataBut.addEventListener('click', function () {
            var data = ctx.timeline.addon.buffer.getData('timeline', [audio.enhancement] /* propSet[default: all] <-from(default: 0) to(default: propDataLength = 29876) , 956097, 29876 */)
            ctx.timeline.addon.buffer.saveData(data, 'enhancement.js')
        })
        divElem.appendChild(saveEnhancementDataBut)

        var loadEnhancementDataBut = document.createElement('button')
        loadEnhancementDataBut.innerHTML = 'Load Enhancement Recorded Data'
        loadEnhancementDataBut.addEventListener('click', function () {
            ctx.timeline.addon.buffer.loadData('timeline', '/user/Beta-audiofeaturealizer/assets/' + 'enhancementData956097_29876.js', 0 /* , 956097, 29876 */)
        })
        divElem.appendChild(loadEnhancementDataBut)

        var divInfoStyle = document.createElement('style')
        divInfoStyle.innerHTML = 'body {background: #FFF}                #info {color:#000}                #info button {display:block}#freqRec.rec.on{border-color: #FFFFFF}                #freqRec.rec.on{border-color: #FF0000}                #freqRec.rec.on .bull {color:#FFFFFF;}                #freqRec.rec.on .bull {color:#FF0000;}'
        div.appendChild(divInfoStyle)
        div.appendChild(divElem)
    }

    function buildStream (stream) {
        // build stream and prebuff from the binding DATA
        console.log('Finished Binding audio to stream - Building')
        ctx.timeline.build(function () {
            console.log('Finished Building - Initializing')
            ctx.timeline.addon.timeframe._init(window) // timeframe init has to be set to true for additional scripts to load
        })
    }
}(this.app, this.canvas, this.ctx)
