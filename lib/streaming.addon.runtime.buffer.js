/*
AddOn: buffer
Time-baised easings
Changing node properties
by buffing the stream with values.

@author leroyron / http://leroy.ron@gmail.com
_struct.addon: modifies, enhances and accesses
*/
(function ( streaming ) 
{
    var _struct = streaming.prototype;
    var _runtime = _struct.addon.runtime;   
    var that = _struct.addon.buffer = {evals:0};
    that.update = function() 
    {
        this.updateCallbacks();
    }
    that.updateCalls = [];
    that.uclen = 0;
    that.updateCallbacks = function () {
        for ( var c=0; c<this.uclen; c++ ) {
            this.updateCalls[c][1](this.updateCalls[c][0]);
        }
    }

    that.presets = function(sets)
    {
        for (set in sets)
        {
            eval.presets[set] = sets[set];
        }
    },
    that.eval = function(stream, options, relative) 
    {
        var nodes = options[0];
        for (var n=0, nlen=nodes.length; n<nlen; n++) 
        {
            var node = nodes[n];

            var props = options[1];
            for (var p=0, plen=props.length; p<plen; p++) 
            {
                var prop = props[p];

                var getsets = options[2];
                for (var e=0, elen=getsets.length; e<elen; e++) 
                {
                    var getset = getsets[e];

                    buff( stream, node, prop, evalData( getset[0], getset[1] ), relative );
                }
            }
        }
        that.evals += nodes.length*nodes.length*getsets.length;
        that.update();
    }

    var buff = function( stream, node, prop, evalData, relative ) {
        var nodeBind = node[stream];
        var nodeBindProp = nodeBind[prop[0]];
        var data0Position_i = nodeBindProp.data0Position_i;
        //byteOffset grabbed from the stream
        var byteOffset = _runtime[stream].data[data0Position_i];
        var propDataLength = _runtime[stream].propDataLength;

        var valProp = prop[1];
        var data = evalData[0];
        var precision = evalData[1];
        //Check if it fills the stream beyond its current position
        var length = data.length;
        var sum = 0;
        for (var ew = 1; ew < length; ew++) 
        {
            var dataPos = byteOffset + ew;
            var dataPosI = data0Position_i+dataPos;
            var reverancy = (dataPos)/propDataLength << 0;//bitwise Math.Floor alt
            var revertPos = (dataPos)-(propDataLength*reverancy);
            var revertPosI = data0Position_i+revertPos;
            if (reverancy >= 1) 
                dataPosI = revertPosI;
            
            if (relative) {
                _runtime[stream].data[dataPosI+1] += (data[ew - 1] - data[ew]) / (precision / valProp)
            } else {
                _runtime[stream].data[dataPosI+1] += valProp - data[ew] / (precision / valProp);
            }
        }
        
        that.update();
    }
    
    //Private
    var eval = {presets: {}};
    var evalData = function(get, duration) 
    {
        var CPs = eval.presets[get].CPs;
        
        var evalDuration = eval.presets[get].duration;
        //scaling the spline control points time
        for(var cp=0; cp<CPs.length; cp++)
        {
            var curTFrac = CPs[cp].t/evalDuration;
            CPs[cp].t = duration*curTFrac;
        }

        //CPs.sort(function(a,b){return a.t-b.t;});
        var ts = [], ps = [], ks = [];
        for(var cp=0; cp<CPs.length; cp++)
        {
            var d = CPs[cp];
            ts[cp] = d.t; ps[cp] = d.p; ks[cp] = 1;
        }
        CSPL.getNaturalKs(ts, ps, ks);
        
        var minx = CPs[0].t;
        var maxx = CPs[CPs.length-1].t;
        
        var alen = CPs.length;
        var data = new Int32Array(new ArrayBuffer(maxx * 4));
        for(var i=minx; i<=maxx; i++) 
        {
            data[i] = CSPL.evalSpline(i, ts, ps, ks);//Scale numbers 
        }

        return [data, eval.presets[get].precision];
    };  
})(streaming);
