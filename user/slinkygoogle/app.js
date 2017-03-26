this.canvas.app = new function (app, canvas, ctx) {
    // Public
    this.width = 680
    this.height = 225
    this.resolution = function (app) {
        // Screen resize adjustments
        canvas.node.width = this.width = app.width = 680
        canvas.node.height = this.height = app.height = 225
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
        stretch: .25
    };
    this.size = 0.8;
    this.lineWidth = 5
    this.freq = 100;
    this.split = 19; // 37, 21
    this.onChangeProp = function () { 
        persp = this.persp;
        x = this.x;
        y = this.y;
        spring = this.spring;
        size = this.size;
        lineWidth = this.lineWidth;
        freq = this.freq;
        split = this.split; // 37, 21
    }
    var slinky = this.slinky, persp, x, y, spring, size, lineWidth, freq, split;
    this.onChangeProp()

    // Private
    var coilX = 0;
    var coilY = 0;
    var course = spring.coil / (split * 2);
    var rgb = [
        { pos: slinky.length, val: 0, qual: 0 },
        { pos: slinky.length / 2, val: 0, qual: 1 },
        { pos: slinky.length, val: 0, qual: 1 }
    ]
    var imgs = [[0,7], [6,0]];
    function init () {
        
        for (let ii=0; ii<imgs.length; ii++) {
            let x = imgs[ii][0]
            let y = imgs[ii][1]
            imgs[ii] = new Image();
            imgs[ii].xPos = x
            imgs[ii].yPos = y
            imgs[ii].onload = function() {
                ctx.drawImage(this, this.xPos, this.yPos);
            }
            imgs[ii].src = app.fileLocAssets + 'googletitle.png';
        }        
    }
    this.rangeINOUT = function(elem, obj, vari) {
        obj[vari] = parseFloat(elem.value);
        this.onChangeProp()
    }

    ctx.timeline.addon.timeframe.invoke = function () {
        ctx.calc()// before render
        ctx.rendering()
        ctx.compute()// after render
    }

    ctx.calc = function () {
        
    }

    ctx.rendering = function () {
        this.globalCompositeOperation = 'destination-over';
        var circ = {r: 50 * size, c: 100 * size}
        this.save();
        this.clearRect(0, 0, app.width, app.height);
        this.scale(1, persp);
        this.lineWidth = lineWidth;
        spring.val = 0;
        for (let ci = 0; ci < slinky.length + 1; ci++) {
            spring.val += 
            spring.coil >= spring.mid 
            ?
                ci > spring.coil 
                ? (1 - (ci - spring.coil) / spring.coil) * spring.stretch
                : (1 - (spring.coil - ci) / spring.coil) * spring.stretch
            :
                ci > spring.coil 
                ? -((1 - (ci - (spring.coil + spring.mid)) / (spring.coil + spring.mid)) * spring.stretch)
                : -((1 - ((spring.coil + spring.mid) - ci) / (spring.coil + spring.mid)) * spring.stretch)

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

            this.beginPath();
            coilY = ci == 0 ? spring.val-5 : spring.val;
            this.moveTo(x + (circ.r + coilX), y + (0 + coilY));
            
            this.strokeStyle = 'rgb(' + rgb[0].val + ', ' + rgb[1].val + ', ' + rgb[2].val + ')';
            
            this.arcTo(
                x + (0 + coilX),
                y + (0 + coilY),
                x + (0 + coilX),
                y + (circ.c + coilY),
                circ.r);

            coilY = 0.75 * spring.stretch + spring.val;
            this.arcTo(
                x + (0 + coilX),
                y + (circ.c + coilY),
                x + (circ.c + coilX),
                y + (circ.c + coilY),
                circ.r);

            coilY = 0.5 * spring.stretch + spring.val;
            this.arcTo(
                x + (circ.c + coilX),
                y + (circ.c + coilY),
                x + (circ.c + coilX),
                y + (circ.r + coilY),
                circ.r);

            coilY = spring.val;
            this.arcTo(
                x + (circ.c + coilX),
                y + (0 + coilY),
                x + (circ.r  + coilX),
                y + (0 + coilY),
                circ.r);

            this.stroke();
        }
        this.restore();
        for (let ii=0; ii<imgs.length; ii++) {
            ctx.drawImage(imgs[ii], imgs[ii].xPos, imgs[ii].yPos);
        }
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
        var elems = [
            ['Coil: ', 'springCoil', 'range', '0', '0', '0', '1', 'canvas.app.spring', 'coil', canvas.app.spring],

            ['X: ', 'na0', 'range', '248', '-100', '680', '1', 'canvas.app', 'x', canvas.app],

            ['Y: ', 'na1', 'range', '76', '-500', '500', '1', 'canvas.app', 'y', canvas.app],

            ['Persp: ', 'na2', 'range', '1', '0.01', '1', '0.01', 'canvas.app', 'persp', canvas.app],

            ['Frequency: ', 'na3', 'range', '100', '0', '100', '1', 'canvas.app', 'freq', canvas.app],

            ['Split: ', 'na4', 'range', '19', '0', '200', '1', 'canvas.app', 'split', canvas.app],

            ['Stretch: ', 'na5', 'range', '0.25', '0', '100', '0.25', 'canvas.app.spring', 'stretch', canvas.app.spring],

            ['Size: ', 'na6', 'range', '0.8', '0', '1', '0.01', 'canvas.app', 'size', canvas.app],

            ['LineWidth: ', 'na7', 'range', '5', '0', '10', '0.25', 'canvas.app', 'lineWidth', canvas.app]
        ]
        var div = document.getElementById("info");
            div.style.position = 'absolute'
            div.style.width = '100%'
            div.style.bottom = '33%'
        for (let ei=0; ei<elems.length; ei++) {
            let lable = document.createElement("lable");// Create a <lable>
                lable.innerHTML = elems[ei][0]
            let input = document.createElement("input");// Create a <input> element
                input.id = elems[ei][1]
                input.type = elems[ei][2]
                if (input.id =="springCoil") {
                    input.min = 0;
                    input.max = slinky.length;
                    input.value = spring.coil;
                } else {
                    input.value = elems[ei][3]
                    input.min = elems[ei][4]
                    input.max = elems[ei][5]
                }
                input.step = elems[ei][6]
                input.setAttribute('oninput', 'canvas.app.rangeINOUT(this, '+elems[ei][7]+', "'+elems[ei][8]+'");');
                input.setAttribute('onchange', 'canvas.app.rangeINOUT(this, '+elems[ei][7]+', "'+elems[ei][8]+'");');

                //// Simple Bind and Buffering
                bind(stream, [
                [elems[ei][9], 801 + ei]
                ],
                    [
                    [elems[ei][8], elems[ei][3]]
                    ],
                [800],
                false)
            lable.appendChild(input);
            div.appendChild(lable);
        }
        // //TimeLine
        var divInfoStyle = document.createElement('style');
        divInfoStyle.id = 'infoStyle';
        divInfoStyle.innerHTML = 'body { background: #fff; } input, lable { float: right; } lable { color: #000; padding: 2px 0 0 0; }';
        div.appendChild(divInfoStyle);
        
        /*buffer.eval('timeline',
        [
            [
                [element.position], [[['x', 1000]]], [['linear', 2200]]
            ]
        ],
        false)*/
        
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