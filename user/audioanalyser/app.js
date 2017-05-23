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
        audioUrl = '/user/audiofeaturealizer/assets/' + 'features.mp3'
        var tickUrl = app.fileLocAssets + 'Tick.mp3'
        tickSound = new window.Audio(tickUrl)
    }

    ctx.timeline.addon.timeframe.process = function () {
        ctx.process(this.access, this._timeFrame, this.lapse)// before timeFrame process
    }

    ctx.process = function (access, timeFrame, lapse) {
        if (inject) {
            if (inject.dynamicData) {
                inject.data = inject.dynamicData(inject.effector)
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
            } else {
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

    ctx.rendering = function (timeFrame) {
        this.clearRect(0, 0, canvas.app.width, canvas.app.height)
        var frequencyWidth = (canvas.app.width / bufferLength)
        var frequencyHeight = 0
        var x = 0

        if (inject) {
            for (let increment = 0; increment < bufferLength; increment++) {
                // MP3 data
                frequencyHeight = (audioFreqData[increment] + audio.enhancement[increment]) * (canvas.app.height * 0.002)
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

                frequencyHeight = (audioFreqData[increment] + audio.enhancement[increment]) * (canvas.app.height * 0.002)
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
            analyser.fftSizePiece = analyser.fftSize * 0.1 + 2 << 0
            analyser.effect = 0
            audioSrc.connect(analyser)
            analyser.connect(audioCtx.destination)

            bufferLength = analyser.frequencyBinCount
            audioFreqData = new Uint8Array(bufferLength)

            // // Simple Bind and Buffering
            bind(stream, [
            [audio.frequency = {'poly': []}, 800]
            ],
                [
                ['poly', audioFreqData]
                ],
            [802],
            false,
            1)

            bind(stream, [
            [audio.enhancement = {'poly': []}, 801]
            ],
                [
                ['poly', audioFreqData]
                ],
            [802],
            false,
            1)
            // keep precision

            buildStream()

            audio.play()

            injectRecordBut.click()
        }
        audioRequest.send()

        var divElem = document.createElement('div')
        var parentNode = canvas.node.parentNode

        for (let i = 0; i < 10; i++) {
            var freqDiv = document.createElement('div')
            freqDiv.className = 'freqDiv'

            var freqUp = document.createElement('div')
            freqUp.className = 'freqUp'
            freqUp.dataset.tenthRange = i
            freqUp.addEventListener('mousedown', function () {
                ctx.timeline.addon.timeframe.goTo(audio.currentTime * 100 << 0)
                function dynamicData (effector) {
                    if (!inject.output) {
                        let midEase = Math.Poly.Medium.midEase(analyser.fftSizePiece * 2)
                        let offset = analyser.fftSizePiece * inject.tenthRange
                        offset -= analyser.fftSizePiece * 2 / 2
                        let output = new Array(analyser.fftSize)
                        if (offset < 0) {
                            midEase.splice(0, analyser.fftSizePiece)
                            output.splice(0, analyser.fftSizePiece, midEase)
                        } else if (offset == analyser.fftSize) {
                            midEase.splice(-analyser.fftSizePiece)
                            output.splice(analyser.fftSize - analyser.fftSizePiece, analyser.fftSizePiece, midEase)
                        } else {
                            output.splice(midEase)
                            output.splice(offset - analyser.fftSizePiece, analyser.fftSizePiece, midEase)
                        }
                        inject.output = output
                    }

                    // TO-DO - add effector
                    analyser.effect += effector
                    analyser.effect = analyser.effect > 1 ? 1 : analyser.effect

                    return inject.output
                }
                inject = {stream: stream, nodes: [audio.enhancement], props: ['poly'], data: [], deltaData: [], dynamicData: dynamicData, effector: 0.4, tenthRange: this.dataset.tenthRange << 0}

                injectRecordBut.className = 'rec'
                injectRecordBut.innerHTML = 'Inject Audio Frequency Data &bull; Segment <span class="rec seg">0</span>'
            })

            freqUp.addEventListener('mouseup', function () {
                ctx.timeline.addon.timeframe.goTo(audio.currentTime * 100 << 0)
                function dynamicData (effector) {
                    analyser.effect -= effector
                    analyser.effect = analyser.effect < 0 ? 0 : analyser.effect

                    // TO-DO - add effector
                    if (analyser.effect == 0) { inject.output = [] }

                    return inject.output
                }
                inject = {stream: stream, nodes: [audio.enhancement], props: ['poly'], data: [], deltaData: [], dynamicData: dynamicData, effector: 0.18, tenthRange: this.dataset.tenthRange << 0}

                injectRecordBut.className = 'rec'
                injectRecordBut.innerHTML = 'Inject Audio Frequency Data &bull; Segment <span class="rec seg">0</span>'
            })

            var freqDown = document.createElement('div')
            freqDown.className = 'freqDown'
            freqDown.dataset.tenthRange = i
            freqDown.addEventListener('mousedown', function () {
                ctx.timeline.addon.timeframe.goTo(audio.currentTime * 100 << 0)
                function dynamicData (effector) {
                    analyser.effect -= effector
                    analyser.effect = analyser.effect < -1 ? -1 : analyser.effect
                    
                    console.log(analyser.effect)
                    return [0, 10, 30, 40, 50, 40, 30, 20, 10, 0]
                }
                inject = {stream: stream, nodes: [audio.enhancement], props: ['poly'], data: [], deltaData: [], dynamicData: dynamicData, effector: 0.4, tenthRange: this.dataset.tenthRange << 0}

                injectRecordBut.className = 'rec'
                injectRecordBut.innerHTML = 'Inject Audio Frequency Data &bull; Segment <span class="rec seg">0</span>'
            })

            freqDown.addEventListener('mouseup', function () {
                ctx.timeline.addon.timeframe.goTo(audio.currentTime * 100 << 0)
                function dynamicData (effector) {
                    analyser.effect += effector
                    analyser.effect = analyser.effect > 0 ? 0 : analyser.effect
                    
                    console.log(analyser.effect)
                    if (analyser.effect == 0) { return [] }
                    
                    return [0, 10, 30, 40, 50, 40, 30, 20, 10, 0]
                }
                inject = {stream: stream, nodes: [audio.enhancement], props: ['poly'], data: [], deltaData: [], dynamicData: dynamicData, effector: 0.18, tenthRange: this.dataset.tenthRange << 0}

                injectRecordBut.className = 'rec'
                injectRecordBut.innerHTML = 'Inject Audio Frequency Data &bull; Segment <span class="rec seg">0</span>'
            })


            freqDiv.appendChild(freqUp)
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
            var saveData = (function () {
                var a = document.createElement('a')
                document.body.appendChild(a)
                a.style = 'display: none'
                return function (data, fileName) {
                    var json = [data]
                    var blob = new window.Blob([json], {type: 'octet/stream'})
                    var url = window.URL.createObjectURL(blob)
                    a.href = url
                    a.download = fileName
                    a.click()
                    window.URL.revokeObjectURL(url)
                }
            }())

            var data = ctx.timeline.data
            var fileName = 'mp3.json'

            saveData(data, fileName)
        })
        divElem.appendChild(saveMp3DataBut)

        var saveEnhancementDataBut = document.createElement('button')
        saveEnhancementDataBut.innerHTML = 'Save Enhancement Recorded Data'
        saveEnhancementDataBut.addEventListener('click', function () {
            var saveData = (function () {
                var a = document.createElement('a')
                document.body.appendChild(a)
                a.style = 'display: none'
                return function (data, fileName) {
                    var json = [data]
                    var blob = new window.Blob([json], {type: 'octet/stream'})
                    var url = window.URL.createObjectURL(blob)
                    a.href = url
                    a.download = fileName
                    a.click()
                    window.URL.revokeObjectURL(url)
                }
            }())

            var data = ctx.timeline.data
            var fileName = 'enhancement.json'

            saveData(data, fileName)
        })
        divElem.appendChild(saveEnhancementDataBut)

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
