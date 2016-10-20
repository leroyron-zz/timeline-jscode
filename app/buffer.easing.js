//Time-baised Chained Easing >>
//These easing tables will sacrifice memory for performance.
//Leroy R. Thompson
//Minimal function passing used this way, and for time based gaming.
//Fixed Array of integers is better for performance
//Value disturbution == ?
//Int32Array buffer
//Limit easing to 6 seconds//Buffer restricted 32Bit Int memory positioning
//>>
//new Int32Array(result_arraySize * 10);//For position offsets x, y, z
//allows mixtures of easing, time zeros out buffer position in buffer, 
//if buffer dsen't have enough to place the next ease set, allocation is done
//TO-DO check if http://easings.net/ is using FPS enhancement/adjust FPS
var easeingBuffer = function() {
    var marginPercent = 100;
    var marginDuration = 100;
    var easeTypes = 
    {
        linear:
        {
            CP:[{"x":0,"y":100},{"x":50,"y":50},{"x":100,"y":0}]
        },
        //Sine
        easeInSine:
        {
            CP:[{"x":0,"y":100},{"x":17,"y":96},{"x":100,"y":0}]
        },
        easeOutSine:
        {
            CP:[{"x":0,"y":100},{"x":83,"y":3},{"x":100,"y":0}]
        },
        easeInOutSine:
        {
            CP:[{"x":0,"y":100},{"x":19,"y":92},{"x":81,"y":8},{"x":100,"y":0}] 
        },
        //Quad
        easeInQuad:
        {
            CP:[{"x":0,"y":100},{"x":32,"y":89},{"x":75,"y":44},{"x":100,"y":0}] 
        },
        easeOutQuad:
        {
            CP:[{"x":0,"y":100},{"x":17,"y":69},{"x":74,"y":6},{"x":100,"y":0}] 
        },
        easeInOutQuad:
        {
            CP:[{"x":0,"y":100},{"x":17,"y":93},{"x":35,"y":75},{"x":55,"y":40},{"x":80,"y":7},{"x":100,"y":0}] 
        },
        //Cubic
        easeInCubic:
        {
            CP:[{"x":0,"y":100},{"x":17,"y":99},{"x":42,"y":92},{"x":66,"y":71},{"x":86,"y":35},{"x":100,"y":0}] 
        },
        easeOutCubic:
        {
            CP:[{"x":0,"y":100},{"x":15,"y":59},{"x":33,"y":30},{"x":57,"y":8},{"x":83,"y":0},{"x":100,"y":0}] 
        },
        easeInOutCubic:
        {
            CP:[{"x":0,"y":100},{"x":22,"y":96},{"x":38,"y":77},{"x":50,"y":50},{"x":64,"y":18},{"x":82,"y":2},{"x":100,"y":0}]  
        },
        //Quart
        easeInQuart:
        {
            CP:[{"x":0,"y":100},{"x":21,"y":100},{"x":42,"y":96},{"x":63,"y":84},{"x":82,"y":54},{"x":92,"y":28},{"x":100,"y":0}] 
        },
        easeOutQuart:
        {
            CP:[{"x":0,"y":100},{"x":12,"y":58},{"x":27,"y":28},{"x":45,"y":9},{"x":66,"y":1},{"x":81,"y":0},{"x":100,"y":0}] 
        },
        easeInOutQuart:
        {
            CP:[{"x":0,"y":100},{"x":15,"y":100},{"x":28,"y":94},{"x":41,"y":76},{"x":50,"y":49},{"x":57,"y":26},{"x":68,"y":8},{"x":84,"y":0},{"x":100,"y":0}] 
        },
        //Quint
        easeInQuint:
        {
            CP:[{"x":0,"y":100},{"x":24,"y":100},{"x":43,"y":98},{"x":64,"y":89},{"x":81,"y":64},{"x":93,"y":28},{"x":100,"y":0}] 
        },
        easeOutQuint:
        {
            CP:[{"x":0,"y":100},{"x":9,"y":61},{"x":23,"y":26},{"x":37,"y":10},{"x":59,"y":1},{"x":78,"y":0},{"x":100,"y":0}] 
        },
        easeInOutQuint:
        {
            CP:[{"x":0,"y":100},{"x":16,"y":99},{"x":28,"y":96},{"x":45,"y":70},{"x":52,"y":39},{"x":60,"y":17},{"x":75,"y":1},{"x":88,"y":0},{"x":100,"y":0}]  
        },
        //Expo
        easeInExpo:
        {
            CP:[{"x":0,"y":100},{"x":9,"y":99},{"x":56,"y":94},{"x":72,"y":85},{"x":83,"y":69},{"x":92,"y":42},{"x":100,"y":0}] 
        },
        easeOutExpo:
        {
            CP:[{"x":0,"y":100},{"x":5,"y":70},{"x":22,"y":21},{"x":48,"y":3},{"x":64,"y":1},{"x":93,"y":0},{"x":100,"y":0}]
        },
        easeInOutExpo:
        {
            CP:[{"x":0,"y":100},{"x":11,"y":99},{"x":21,"y":99},{"x":30,"y":96},{"x":38,"y":90},{"x":47,"y":67},{"x":53,"y":33},{"x":60,"y":12},{"x":72,"y":2},{"x":79,"y":0},{"x":85,"y":0},{"x":100,"y":0}]
        },
        //Circ
        easeInCirc:
        {
            CP:[{"x":0,"y":100},{"x":33,"y":94},{"x":54,"y":83},{"x":81,"y":58},{"x":94,"y":35},{"x":99,"y":10},{"x":100,"y":0}]
        },
        easeOutCirc:
        {
            CP:[{"x":0,"y":100},{"x":1,"y":90},{"x":6,"y":66},{"x":14,"y":48},{"x":26,"y":32},{"x":41,"y":19},{"x":60,"y":8},{"x":79,"y":2},{"x":100,"y":0}] 
        },
        easeInOutCirc:
        {
            CP:[{"x":0,"y":100},{"x":17,"y":97},{"x":27,"y":92},{"x":37,"y":83},{"x":44,"y":74},{"x":47,"y":67},{"x":49,"y":60},{"x":50,"y":50},{"x":51,"y":41},{"x":53,"y":31},{"x":57,"y":22},{"x":62,"y":17},{"x":71,"y":9},{"x":82,"y":3},{"x":100,"y":0}]
        },
        //Back
        easeInBack:
        {
            CP:[{"x":0,"y":100},{"x":4,"y":100},{"x":64,"y":100},{"x":86,"y":53},{"x":100,"y":0}]
        },
        easeOutBack:
        {
            CP:[{"x":0,"y":100},{"x":3,"y":86},{"x":35,"y":1},{"x":95,"y":0},{"x":100,"y":0}]
        },
        easeInOutBack:
        {
            CP:[{"x":0,"y":100},{"x":3,"y":100},{"x":46,"y":69},{"x":51,"y":44},{"x":56,"y":22},{"x":97,"y":0},{"x":100,"y":0}]
        },
        //Elastic
        easeInElastic:
        {
            CP:[{"x":0,"y":100},{"x":8,"y":99},{"x":15,"y":99},{"x":22,"y":100},{"x":32,"y":100},{"x":41,"y":98},{"x":47,"y":99},{"x":63,"y":99},{"x":74,"y":90},{"x":93,"y":93},{"x":95,"y":60},{"x":100,"y":0}]
        },
        easeOutElastic:
        {
            CP:[{"x":0,"y":100},{"x":3,"y":65},{"x":7,"y":2},{"x":26,"y":11},{"x":38,"y":0},{"x":56,"y":1},{"x":69,"y":0},{"x":75,"y":0},{"x":83,"y":0},{"x":90,"y":0},{"x":100,"y":0}]
        },
        easeInOutElastic:
        {
            CP:[{"x":0,"y":100},{"x":13,"y":100},{"x":23,"y":99},{"x":33,"y":99},{"x":45,"y":95},{"x":48,"y":67},{"x":51,"y":41},{"x":55,"y":4},{"x":67,"y":0},{"x":78,"y":0},{"x":87,"y":0},{"x":100,"y":0}]
        },
        //Bounce
        easeInBounce:
        {
            CP:[{"x":0,"y":100},{"x":4,"y":98},{"x":8,"y":100},{"x":12,"y":96},{"x":23,"y":97},{"x":26,"y":100},{"x":28,"y":96},{"x":60,"y":95},{"x":63,"y":100},{"x":68,"y":80},{"x":87,"y":13},{"x":100,"y":0}]  
        },
        easeOutBounce:
        {
            CP:[{"x":0,"y":100},{"x":15,"y":83},{"x":28,"y":40},{"x":33,"y":17},{"x":36,"y":2},{"x":38,"y":4},{"x":71,"y":4},{"x":73,"y":0},{"x":77,"y":4},{"x":88,"y":3},{"x":91,"y":0},{"x":94,"y":1},{"x":100,"y":0}]
        },
        easeInOutBounce:
        {
            CP:[{"x":0,"y":100},{"x":3,"y":98},{"x":5,"y":99},{"x":9,"y":97},{"x":13,"y":99},{"x":16,"y":94},{"x":28,"y":94},{"x":31,"y":98},{"x":37,"y":77},{"x":44,"y":55},{"x":55,"y":46},{"x":64,"y":19},{"x":68,"y":1},{"x":72,"y":6},{"x":82,"y":7},{"x":86,"y":0},{"x":91,"y":3},{"x":95,"y":0},{"x":97,"y":1},{"x":100,"y":0}]
        }
    }
    
    var measureData = function(type, duration) 
    {
        var CP = easeTypes[type].CP;
        
        var delta = marginDuration;
        //scaling the spline control points
        for(var i=0; i<CP.length; i++)
        {
            var curXFrac = CP[i].x/delta;
            CP[i].x = duration*curXFrac;
        }

        //CP.sort(function(a,b){return a.x-b.x;});
        var xs = [], ys = [], ks = [];
        for(var i=0; i<CP.length; i++)
        {
            var d = CP[i];
            xs[i] = d.x; ys[i] = d.y; ks[i] = 1;
        }
        CSPL.getNaturalKs(xs, ys, ks);
        
        var minx = CP[0].x;
        var maxx = CP[CP.length-1].x;
        
        var alen = CP.length;
        var data = new Int32Array(new ArrayBuffer(maxx * 4));
        for(var i=minx; i<=maxx; i++) 
        {
            data[i] = CSPL.evalSpline(i, xs, ys, ks);//Scale numbers 
        }

        return data;
    };

    this.buff = function(options, duration) 
    {
        var easeData = measureData(options[4], duration);
        
        var obj = options[0];
        var runtime = options[1];
        var stream = options[2];
        var prop = options[3];
        var objBind = obj[stream];
        var objBindProp = objBind[prop];
        var data0Position_i = objBindProp.data0Position_i;
        //byteOffset grabbed from the buffer
        var byteOffset = runtime[stream].data[data0Position_i];//RunTime
        var datalimit = runtime[stream].datalimit;

        var moveProp = options[5];

        //Check if it fills the buffer beyond its current position
        var length = easeData.length;
        var sum = 0;
        for (var ew = 1; ew < length; ew++) 
        {
            var dataPos = byteOffset + ew;
            var dataPosI = data0Position_i+dataPos;
            var reverancy = (dataPos)/datalimit << 0;//bitwise Math.Floor alt
            var revertPos = (dataPos)-(datalimit*reverancy);
            var revertPosI = data0Position_i+revertPos;
            if (reverancy >= 1) 
                dataPosI = revertPosI;
            
            if (objBind.relative) {
                runtime[stream].data[dataPosI+1] += (easeData[ew - 1] - easeData[ew]) / (marginPercent / moveProp);
            }
        }
    }
}


