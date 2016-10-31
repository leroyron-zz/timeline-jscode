/*
AddOn: ease
Time-baised easings
Changing node properties
by buffing the stream with values.

@author leroyron / http://leroy.ron@gmail.com
_struct.addon: modifies, enhances and accesses
*/
(function ( streaming ) 
{
    var _struct = streaming.prototype;
    var _buffer = _struct.addon.buffer;
    var that = _buffer.ease = {};
    that.precisions = 100;
    that.update = function() 
    {
        ease.precisions = this.precisions;
        ease.precisions = this.precisions;
        //scaling the spline control points percents
        var easePrecisions = easePresets.precisions;
        for (preset in easePresets)
        {
            for (cp in easePresets[preset].CPs)
            {
                var curPFrac = easePresets[preset].CPs[cp].p/easePrecisions;
                easePresets[preset].CPs[cp].p = ease.precisions*curPFrac;
            }
            easePresets[preset].duration = easePresets.durations;
            easePresets[preset].precision = ease.precisions;
        }
        easePresets.precisions = ease.precisions;
        _buffer.presets(easePresets);
        this.updateCallbacks();
    }
    that.updateCalls = [];
    that.uclen = 0;
    that.updateCallbacks = function () {
        for ( var c=0; c<this.uclen; c++ ) {
            this.updateCalls[c][1](this.updateCalls[c][0]);
        }
    }

    var ease = {precisions: that.precisions};
    var init = function() 
    { 
        that.update();
    }
    var easePresets = //t = time, p = percent/precision
    {
        durations: 100,
        precisions: 100,
        linear:
        {
            CPs:[{'t':0,'p':100},{'t':50,'p':50},{'t':100,'p':0}]
        },
        //Sine
        easeInSine:
        {
            CPs:[{'t':0,'p':100},{'t':17,'p':96},{'t':100,'p':0}]
        },
        easeOutSine:
        {
            CPs:[{'t':0,'p':100},{'t':83,'p':3},{'t':100,'p':0}]
        },
        easeInOutSine:
        {
            CPs:[{'t':0,'p':100},{'t':19,'p':92},{'t':81,'p':8},{'t':100,'p':0}] 
        },
        //Quad
        easeInQuad:
        {
            CPs:[{'t':0,'p':100},{'t':32,'p':89},{'t':75,'p':44},{'t':100,'p':0}] 
        },
        easeOutQuad:
        {
            CPs:[{'t':0,'p':100},{'t':17,'p':69},{'t':74,'p':6},{'t':100,'p':0}] 
        },
        easeInOutQuad:
        {
            CPs:[{'t':0,'p':100},{'t':17,'p':93},{'t':35,'p':75},{'t':55,'p':40},{'t':80,'p':7},{'t':100,'p':0}] 
        },
        //Cubic
        easeInCubic:
        {
            CPs:[{'t':0,'p':100},{'t':17,'p':99},{'t':42,'p':92},{'t':66,'p':71},{'t':86,'p':35},{'t':100,'p':0}] 
        },
        easeOutCubic:
        {
            CPs:[{'t':0,'p':100},{'t':15,'p':59},{'t':33,'p':30},{'t':57,'p':8},{'t':83,'p':0},{'t':100,'p':0}] 
        },
        easeInOutCubic:
        {
            CPs:[{'t':0,'p':100},{'t':22,'p':96},{'t':38,'p':77},{'t':50,'p':50},{'t':64,'p':18},{'t':82,'p':2},{'t':100,'p':0}]  
        },
        //Quart
        easeInQuart:
        {
            CPs:[{'t':0,'p':100},{'t':21,'p':100},{'t':42,'p':96},{'t':63,'p':84},{'t':82,'p':54},{'t':92,'p':28},{'t':100,'p':0}] 
        },
        easeOutQuart:
        {
            CPs:[{'t':0,'p':100},{'t':12,'p':58},{'t':27,'p':28},{'t':45,'p':9},{'t':66,'p':1},{'t':81,'p':0},{'t':100,'p':0}] 
        },
        easeInOutQuart:
        {
            CPs:[{'t':0,'p':100},{'t':15,'p':100},{'t':28,'p':94},{'t':41,'p':76},{'t':50,'p':49},{'t':57,'p':26},{'t':68,'p':8},{'t':84,'p':0},{'t':100,'p':0}] 
        },
        //Quint
        easeInQuint:
        {
            CPs:[{'t':0,'p':100},{'t':24,'p':100},{'t':43,'p':98},{'t':64,'p':89},{'t':81,'p':64},{'t':93,'p':28},{'t':100,'p':0}] 
        },
        easeOutQuint:
        {
            CPs:[{'t':0,'p':100},{'t':9,'p':61},{'t':23,'p':26},{'t':37,'p':10},{'t':59,'p':1},{'t':78,'p':0},{'t':100,'p':0}] 
        },
        easeInOutQuint:
        {
            CPs:[{'t':0,'p':100},{'t':16,'p':99},{'t':28,'p':96},{'t':45,'p':70},{'t':52,'p':39},{'t':60,'p':17},{'t':75,'p':1},{'t':88,'p':0},{'t':100,'p':0}]  
        },
        //Expo
        easeInExpo:
        {
            CPs:[{'t':0,'p':100},{'t':9,'p':99},{'t':56,'p':94},{'t':72,'p':85},{'t':83,'p':69},{'t':92,'p':42},{'t':100,'p':0}] 
        },
        easeOutExpo:
        {
            CPs:[{'t':0,'p':100},{'t':5,'p':70},{'t':22,'p':21},{'t':48,'p':3},{'t':64,'p':1},{'t':93,'p':0},{'t':100,'p':0}]
        },
        easeInOutExpo:
        {
            CPs:[{'t':0,'p':100},{'t':11,'p':99},{'t':21,'p':99},{'t':30,'p':96},{'t':38,'p':90},{'t':47,'p':67},{'t':53,'p':33},{'t':60,'p':12},{'t':72,'p':2},{'t':79,'p':0},{'t':85,'p':0},{'t':100,'p':0}]
        },
        //Circ
        easeInCirc:
        {
            CPs:[{'t':0,'p':100},{'t':33,'p':94},{'t':54,'p':83},{'t':81,'p':58},{'t':94,'p':35},{'t':99,'p':10},{'t':100,'p':0}]
        },
        easeOutCirc:
        {
            CPs:[{'t':0,'p':100},{'t':1,'p':90},{'t':6,'p':66},{'t':14,'p':48},{'t':26,'p':32},{'t':41,'p':19},{'t':60,'p':8},{'t':79,'p':2},{'t':100,'p':0}] 
        },
        easeInOutCirc:
        {
            CPs:[{'t':0,'p':100},{'t':17,'p':97},{'t':27,'p':92},{'t':37,'p':83},{'t':44,'p':74},{'t':47,'p':67},{'t':49,'p':60},{'t':50,'p':50},{'t':51,'p':41},{'t':53,'p':31},{'t':57,'p':22},{'t':62,'p':17},{'t':71,'p':9},{'t':82,'p':3},{'t':100,'p':0}]
        },
        //Back
        easeInBack:
        {
            CPs:[{'t':0,'p':100},{'t':4,'p':100},{'t':64,'p':100},{'t':86,'p':53},{'t':100,'p':0}]
        },
        easeOutBack:
        {
            CPs:[{'t':0,'p':100},{'t':3,'p':86},{'t':35,'p':1},{'t':95,'p':0},{'t':100,'p':0}]
        },
        easeInOutBack:
        {
            CPs:[{'t':0,'p':100},{'t':3,'p':100},{'t':46,'p':69},{'t':51,'p':44},{'t':56,'p':22},{'t':97,'p':0},{'t':100,'p':0}]
        },
        //Elastic
        easeInElastic:
        {
            CPs:[{'t':0,'p':100},{'t':8,'p':99},{'t':15,'p':99},{'t':22,'p':100},{'t':32,'p':100},{'t':41,'p':98},{'t':47,'p':99},{'t':63,'p':99},{'t':74,'p':90},{'t':93,'p':93},{'t':95,'p':60},{'t':100,'p':0}]
        },
        easeOutElastic:
        {
            CPs:[{'t':0,'p':100},{'t':3,'p':65},{'t':7,'p':2},{'t':26,'p':11},{'t':38,'p':0},{'t':56,'p':1},{'t':69,'p':0},{'t':75,'p':0},{'t':83,'p':0},{'t':90,'p':0},{'t':100,'p':0}]
        },
        easeInOutElastic:
        {
            CPs:[{'t':0,'p':100},{'t':13,'p':100},{'t':23,'p':99},{'t':33,'p':99},{'t':45,'p':95},{'t':48,'p':67},{'t':51,'p':41},{'t':55,'p':4},{'t':67,'p':0},{'t':78,'p':0},{'t':87,'p':0},{'t':100,'p':0}]
        },
        //Bounce
        easeInBounce:
        {
            CPs:[{'t':0,'p':100},{'t':4,'p':98},{'t':8,'p':100},{'t':12,'p':96},{'t':23,'p':97},{'t':26,'p':100},{'t':28,'p':96},{'t':60,'p':95},{'t':63,'p':100},{'t':68,'p':80},{'t':87,'p':13},{'t':100,'p':0}]  
        },
        easeOutBounce:
        {
            CPs:[{'t':0,'p':100},{'t':15,'p':83},{'t':28,'p':40},{'t':33,'p':17},{'t':36,'p':2},{'t':38,'p':4},{'t':71,'p':4},{'t':73,'p':0},{'t':77,'p':4},{'t':88,'p':3},{'t':91,'p':0},{'t':94,'p':1},{'t':100,'p':0}]
        },
        easeInOutBounce:
        {
            CPs:[{'t':0,'p':100},{'t':3,'p':98},{'t':5,'p':99},{'t':9,'p':97},{'t':13,'p':99},{'t':16,'p':94},{'t':28,'p':94},{'t':31,'p':98},{'t':37,'p':77},{'t':44,'p':55},{'t':55,'p':46},{'t':64,'p':19},{'t':68,'p':1},{'t':72,'p':6},{'t':82,'p':7},{'t':86,'p':0},{'t':91,'p':3},{'t':95,'p':0},{'t':97,'p':1},{'t':100,'p':0}]
        }
    }
    init();
})(streaming);
