this.canvas.app = new function (app, canvas, ctx) {
    // Public
    this.width = 680
    this.height = 225
    this.resolution = function (app) {
        // Screen resize adjustments
        canvas.node.width = this.width = 680
        canvas.node.height = this.height = 225
        canvas.node.style.width = canvas.node.width+'px'
        canvas.node.style.height = canvas.node.height+'px'
    }

    // Public 
    this.slinky = new Array(25);
    this.persp = 1;
    this.x = 248;
    this.y = 76;
    this.spring = {
        coil: this.slinky.length / 2,
        mid: this.slinky.length / 2,
        val: 0,
        stretch: .25,
        sample: 1 / this.slinky.length,
        tminus: 0,
        secms: 50
    };
    this.size = 0.8;
    this.lineWidth = 5;
    this.freq = 5;
    this.split = 19; // 37, 21
    this.onChangeProp = function (node, prop) {
        //if (node && prop) { [prop] = node[prop]; return; }
        persp = this.persp.value || this.persp;
        x = this.x.value || this.x;
        y = this.y.value || this.y;
        size = this.size.value || this.size;
        lineWidth = this.lineWidth.value || this.lineWidth;
        freq = this.freq.value || this.freq;
        split = this.split.value || this.split; // 37, 21
        spring.r = 50 * size;
        spring.c = 100 * size;
    }
    var slinky = this.slinky, spring = this.spring, persp, x, y, size, lineWidth, freq, split;
    this.onChangeProp()

    // Private
    var coilX = 0;
    var coilY = 0;
    var course = spring.coil / (split * 2);
    var buildSlinky = function () {
        var fallout = 0
        for (let si=0; si<slinky.length; si++) {
            let flux = (1 - si / slinky.length);
                flux = flux < 0.12 ? 0.12 - (fallout += 0.01) : flux;
            slinky[si] = {x: 0, y: 0, y1: 0, y2: 0, y3: 0, flux: flux}
        }
    }
    buildSlinky()

    var rgb = [
        { pos: slinky.length, val: 0, qual: 0 },
        { pos: slinky.length / 2, val: 0, qual: 1 },
        { pos: slinky.length, val: 0, qual: 1 }
    ];
    var imgs = [[0,7], [6,0]];
    function init () {
        for (let ii=0; ii<imgs.length; ii++) {
            let x = imgs[ii][0]
            let y = imgs[ii][1]
            imgs[ii] = new Image();
            imgs[ii].xPos = x
            imgs[ii].yPos = y
            imgs[ii].onload = function() {
                ctx.drawImage(this, this.xPos, this.yPos)
            }
            imgs[ii].src = app.fileLocAssets + 'googletitle.png';
        }        
    }

    var hold
    this.rangeINOUT = function(stream, elem, obj, prop) {
        obj[prop].value = parseFloat(elem.value)
        hold = {stream: stream, node: obj[prop], prop: 'value', elem: elem, 
        phase: {nodes: [spring.secms, spring.tminus], prop: 'value', secms: 50, duration: ctx.timeline.addon.timeframe.duration} }
        elem.title = elem.value
    }

    ctx.timeline.addon.timeframe.invoke = function () {
        canvas.app.calc(this.lapse)// before render
        ctx.rendering(this._deltaTimeFrame)
        ctx.compute()// after render
    }

    this.calc = function (lapse) {
        if (hold) {
            ctx.timeline.addon.buffer.injectDataVal(hold.stream, hold.node, hold.prop, hold.elem.value, lapse)
            ctx.timeline.addon.buffer.injectDataVal(hold.stream, hold.phase.nodes[0], hold.phase.prop, (hold.phase.secms + hold.phase.duration), lapse)
            ctx.timeline.addon.buffer.injectDataVal(hold.stream, hold.phase.nodes[1], hold.phase.prop, hold.phase.duration, lapse)
        }
        persp = this.persp.value
        x = this.x.value
        y = this.y.value
        size = this.size.value
        spring.r = 50 * size;
        spring.c = 100 * size;
        lineWidth = this.lineWidth.value
        freq = this.freq.value
        split = this.split.value
    }
    
    var start = 1
    ctx.rendering = function (timeFrame) {
        //console.clear();
        this.globalCompositeOperation = 'destination-over';
        this.save();
        this.clearRect(0, 0, app.width, app.height);
        this.scale(1, persp);
        this.lineWidth = lineWidth;
        var outPut = 'outPut---\n'
        spring.val = 0;

        

        for (let ci = 0; ci < slinky.length + 1; ci++) {
            spring.val += 
            spring.coil.value >= spring.mid 
            ?
                ci > spring.coil.value 
                ? (1 - (ci - spring.coil.value) / spring.coil.value) * spring.stretch.value
                : (1 - (spring.coil.value - ci) / spring.coil.value) * spring.stretch.value
            :
                ci > spring.coil.value 
                ? -((1 - (ci - (spring.coil.value + spring.mid)) / (spring.coil.value + spring.mid)) * spring.stretch.value)
                : -((1 - ((spring.coil.value + spring.mid) - ci) / (spring.coil.value + spring.mid)) * spring.stretch.value)

            let cross = ci % (spring.mid / split)
            coilX = cross > course 
            ? (1 - (cross - course) / course) * freq
            : (1 - (course - cross) / course) * freq

            if (spring.val == Infinity) {
                spring.val = 0
            }

            for (let c = 0; c < rgb.length; c++) {
                rgb[c].val = ci > rgb[c].pos 
                ? ((ci - rgb[c].pos) / rgb[c].pos) * 1
                : ((rgb[c].pos - ci) / rgb[c].pos) * 1;
                
                rgb[c].val = rgb[c].qual == 0 
                ? rgb[c].val - rgb[c].qual
                : rgb[c].qual - rgb[c].val

                rgb[c].val *= 255 << 0
                rgb[c].val = rgb[c].val << 0
            }

            coilY = ci == 0 ? spring.val-5 : spring.val;

            if (!slinky[ci]) break

            let flux = start || slinky[ci].flux
            let xX = coilX + x
            let yY = coilY + y
            let icx = spring.c
            let icy = ((lineWidth) * ci)

            xX = xX > 680-icx ? 680-icx : xX < 0 ? 0 : xX;
            Math.lerpProp(slinky[ci], 'x', xX, flux);

            yY = yY > 350+icy ? 350+icy : yY;
            Math.lerpProp(slinky[ci], 'y', yY, flux);
            yY = 0.75 * spring.stretch.value + spring.val + y;
            yY = yY > 350+icy ? 350+icy : yY;
            Math.lerpProp(slinky[ci], 'y1', yY, flux);
            yY = 0.5 * spring.stretch.value + spring.val + y;
            yY = yY > 350+icy ? 350+icy : yY;
            Math.lerpProp(slinky[ci], 'y2', yY, flux);
            yY = spring.val + y;
            yY = yY > 350+icy ? 350+icy : yY;
            Math.lerpProp(slinky[ci], 'y3', yY, flux);

            this.beginPath();
            this.moveTo(slinky[ci].x + spring.r, slinky[ci].y);
            

            // create the rainbow linear-gradient
            let gradient = ctx.createLinearGradient(slinky[ci].x + 200, slinky[ci].y + 400, 50, 50);
            gradient.addColorStop(0.49, 'rgb(' + rgb[0].val + ', ' + rgb[1].val + ', ' + rgb[2].val + ')');
            gradient.addColorStop(0.5, 'rgb(255, 255, 255)');
            gradient.addColorStop(0.51, 'rgb(' + rgb[0].val + ', ' + rgb[1].val + ', ' + rgb[2].val + ')');
            // change composite so source is applied within the shadow-blur
            //ctx.globalCompositeOperation = "source-atop";

            this.strokeStyle = gradient
            
            this.arcTo(
                slinky[ci].x,
                slinky[ci].y,
                slinky[ci].x,
                slinky[ci].y + spring.c,
                spring.r);
            
            this.arcTo(
                slinky[ci].x,
                slinky[ci].y1 + spring.c,
                slinky[ci].x + spring.c,
                slinky[ci].y1 + spring.c,
                spring.r);

            this.arcTo(
                slinky[ci].x + spring.c,
                slinky[ci].y2 + spring.c,
                slinky[ci].x + spring.c,
                slinky[ci].y2 + spring.r,
                spring.r);
            
            this.arcTo(
                slinky[ci].x + spring.c,
                slinky[ci].y3,
                slinky[ci].x + spring.r,
                slinky[ci].y3,
                spring.r);

            this.stroke();
        }
        this.restore();
        for (let ii=0; ii<imgs.length; ii++) {
            ctx.drawImage(imgs[ii], imgs[ii].xPos, imgs[ii].yPos);
        }
        start = undefined
        
    }

    ctx.compute = function () {
        
    }

    this.SetupContextBindsForStreamAndBuildAfterLoad = function () {
        app.codeLoc = 'user/' + app.codesetting
        app.fileLocAssets = app._fileLocal + app.codeLoc + '/assets/'
        init()
        createGFXBindNodesToStream('timeline')
        buildStream()
    }

    function createGFXBindNodesToStream(stream) {
        console.log('Binding objects to stream - Starting');

        var bind = ctx[stream].addon.binding
        var buffer = ctx.timeline.addon.buffer

        var body = document.body;
        var props = [
            ['SecMs: ', 'secms', 'range', '50', '0', ctx.timeline.addon.timeframe.duration, '1', 'canvas.app.spring', 'secms', canvas.app.spring],
            
            ['TMinus: ', 'tminus', 'range', '0', '0', ctx.timeline.addon.timeframe.duration, '1', 'canvas.app.spring', 'tminus', canvas.app.spring],

            ['Coil: ', 'coil', 'range', '17.69', '0', '1', '0.01', 'canvas.app.spring', 'coil', canvas.app.spring],

            ['X: ', 'x', 'range', '248', '-100', '680', '1', 'canvas.app', 'x', canvas.app],

            ['Y: ', 'y', 'range', '76', '-500', '500', '1', 'canvas.app', 'y', canvas.app],

            ['Persp: ', 'persp', 'range', '1', '0.01', '1', '0.01', 'canvas.app', 'persp', canvas.app],

            ['Frequency: ', 'freq', 'range', '100', '0', '100', '1', 'canvas.app', 'freq', canvas.app],

            ['Split: ', 'split', 'range', '19', '0', '200', '1', 'canvas.app', 'split', canvas.app],

            ['Stretch: ', 'stretch', 'range', '0.25', '0', '100', '0.25', 'canvas.app.spring', 'stretch', canvas.app.spring],

            ['Size: ', 'size', 'range', '0.8', '0', '1', '0.01', 'canvas.app', 'size', canvas.app],

            ['LineWidth: ', 'lineWidth', 'range', '5', '0', '10', '0.25', 'canvas.app', 'lineWidth', canvas.app]
        ]

        var div = document.getElementById("info");
            div.style.position = 'absolute'
            div.style.width = '100%'
            div.style.bottom = '33%'
        for (let ei=0; ei<props.length; ei++) {
            if (ei > 1) {
                let lable = document.createElement("lable");// Create a <lable>
                    lable.innerHTML = props[ei][0]
                var input = document.createElement("input");// Create a <input> element
                    input.id = props[ei][1]
                    input.title = props[ei][3]
                    input.type = props[ei][2]
                    input.onmouseup = input.ontouchend = function () {
                        hold = undefined
                        //this.value = canvas.app[this.id].value
                    }
                    if (input.id =="coil") {
                        input.min = 0;
                        input.max = slinky.length;
                        input.value = spring.coil;
                    } else {
                        input.value = props[ei][3]
                        input.min = props[ei][4]
                        input.max = props[ei][5]
                    }
                    input.step = props[ei][6]
                    input.setAttribute('oninput', 'canvas.app.rangeINOUT("'+stream+'", this, '+props[ei][7]+', "'+props[ei][8]+'");');
                    //input.setAttribute('onchange', 'canvas.app.rangeINOUT("'+stream+'", this, '+props[ei][7]+', "'+props[ei][8]+'");');
                    //// Binding
                    // doing this will keep overwriting timeline stream object on canvas.app / canvas.app.spring
                    // providing propsery length to 1 
                lable.appendChild(input);
                div.appendChild(lable);
            }
            bind(stream, [
            [props[ei][9][props[ei][8]] = {value: props[ei][3]}, 800 + ei]
            ],
                [
                ['value', props[ei][3]]
                ],
            [820],
            false)
            props[ei][9][props[ei][8]].elem = input
        }

        var divInfoStyle = document.createElement('style');
        divInfoStyle.id = 'infoStyle';
        divInfoStyle.innerHTML = 'body { background: #fff; } input, lable { float: right; } lable { color: #000; padding: 2px 0 0 0; }';
        div.appendChild(divInfoStyle);                                                    
    }
    function buildStream(stream) {
        // build stream and prebuff from the binding DATA
        console.log('Finished Binding to stream - Building')
        ctx.timeline.build(function () {
            console.log('Finished Building - Initializing')
            ctx.timeline.addon.timeframe._init() // timeframe init has to be set to true for additional scripts to load
        })
    }
}(this.app, this.canvas, this.ctx)