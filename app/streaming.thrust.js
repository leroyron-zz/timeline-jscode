//Buffering for javascripts linear parallelity 
var streaming = function () {
    this.buffer = function () 
    {
        this.setup = function ( data ) {
            //this.nodes = data.nodeCount;
            this.buffer = data.buffer;
            this.propset = data.propsetCount;//How many properties
            this.datalimit = data.datalimit;//The whole ArraySize
            this.continuancePosVal_data0 = 1;//Data zero of each property data chunck//stores byteoffset for continuance
            this.perlimit = this.continuancePosVal_data0 + this.datalimit;//Property ArraySize DataZero + DataSize
            this.nodePerBuffer = this.perlimit * this.propset + this.propset + 1;//The whole chunk of ArraySize//properties and data

            this.data = this.fill( data.data );
            data.buffer = data.nodeCount = data.propsetCount = data.datalimit = data.data = null;
            delete data.buffer;
            delete data.nodeCount;
            delete data.propsetCount;
            delete data.datalimit;
            delete data.data;
        },
        this.access = function ( continuance, skip, tCount, revert, mCount, leap, reset ) 
        {
            var buffer = this.buffer;
            //Initialization from setup
            var datalimit = this.datalimit;
            delete this.datalimit;
            var continuancePosVal_data0 = this.continuancePosVal_data0;
            delete this.continuancePosVal_data0;
            var perlimit = this.perlimit;
            delete this.perlimit;
            var nodePerBuffer = this.nodePerBuffer;
            delete this.nodePerBuffer;
            var propset = this.propset;
            delete this.propset;
            
            //FOR PRODUCTION
            //!!!IMPORTANT hide data... replace this.data with var data;-->
            //var data = this.data;
            //delete this.data;

            var dataLength = this.data.length;

            //Option that are changable for reading the stream
            var continuance = continuance, skip = skip, tCount = tCount, revert = revert, mCount = mCount, leap = leap, reset = reset;

            //Vars and functions that are used for thrust and measuring
            //underscore i (_i) indicates data index 
            var dataPos, data0Pos, data0Pos_i;
            this._checkInContinuance = function () 
            {
                if ( !continuance )
                    return b_i;
                b_i += this.data[data0Pos_i];
                this._updateDataPos( b_i );
                return b_i;
            }
            this._updateDataPos = function () 
            {
                dataPos = ( ( b_i - cursor ) - chunkStart_i );
                data0Pos_i = b_i - dataPos;
            }
            this._checkOutRevert = function () 
            {
                if ( !revert )
                    return b_i;
                var reverancy = ( ( this.data[data0Pos_i]+skip ) /datalimit ) << 0;
                var revertPos = ( ( this.data[data0Pos_i]+skip ) - ( datalimit*reverancy ) + continuancePosVal_data0 ) ;
                var revertPosI = data0Pos_i+revertPos;
                if ( reverancy >= 1 ) 
                {
                    this.data[data0Pos_i] = revertPos;
                    this._updateDataPos( revertPosI );
                    return revertPosI;
                }
                else 
                {
                    b_i += skip;
                    this._updateDataPos( b_i );
                    return b_i;
                }
            }

            //b_i is the position in buffer array
            //cursor is the start point/chunk offset count
            //reads counts the fragments of the chunk
            var b_i = 0, cursor = 0, reads = 0, chunkStart_i = 0;
            this.thrust = function ( tCount ) 
            {
                for ( b_i = cursor = reads = 0; b_i < dataLength; b_i++ ) 
                {
                    //Node Level//
                    if ( b_i % nodePerBuffer == 0 ) 
                    {
                        //var node = b_i/this.nodePerBuffer;//node index number
                        //->> Node Selection > buffer identifyer
                        var node_bi = this.data[b_i];
                        b_i++;
                        cursor = 1;
                        reads++;
                    }
                    //Property Level//
                    if ( ( b_i-reads ) % perlimit == 0 ) 
                    {
                        chunkStart_i = ( b_i - cursor );
                        //var prop = ((b_i-reads) - (this.perlimit * this.propset * node)) / this.perlimit;//property index number of chunk
                        //->> Property Selection > buffer identifyer

                        var prop_bi = this.data[b_i];
                        b_i++;
                        cursor++;
                        reads++;

                        dataPos = ( ( b_i - cursor ) - chunkStart_i );
                        data0Pos = dataPos;
                        data0Pos_i = b_i - data0Pos;
                        var endPos = (perlimit - data0Pos)-1;
                        var endPos_i = data0Pos_i + endPos;
                        
                        if ( reset )
                            this.data[data0Pos_i] = continuancePosVal_data0;

                        b_i = this._checkInContinuance( b_i, continuance );
                        b_i = this._checkOutRevert( b_i, skip, revert );
                    }

                    //Data Level
                    var tSums = 0;
                    if ( tCount > 0 ) 
                    {
                        for ( var t = 0; t < tCount; t++ ) 
                        {
                            var next = 1;
                            var nextPos = dataPos+next;
                            var nextPos_i = data0Pos_i+nextPos;
                            if ( nextPos > datalimit ) 
                            {
                                if ( !revert ) 
                                {
                                    break;
                                } 
                                else 
                                {
                                    t--;
                                    b_i=data0Pos_i+continuancePosVal_data0;
                                    this._updateDataPos( b_i );
                                    this.data[data0Pos_i] = dataPos;
                                }
                            }
                            else if ( this.data[nextPos_i] == leap/* || this.data[nextPos_i] == 0*/ ) 
                            {
                                //->> ADD VALUES TO PROPERTY BEFORE LEAPING?
                                //Should do Binding here?
                                //*
                                if ( continuance ) 
                                {
                                    this.data[data0Pos_i] = nextPos;
                                }
                                this.data[nextPos_i] = 0;//Zero out data
                                b_i=endPos_i;
                                this._updateDataPos( b_i );
                                break;
                            }    
                            else 
                            {
                                //->> ADD/SUM UP VALUES TO PROPERTY DURING THRUST *before <>?
                                b_i = nextPos_i;
                                this._updateDataPos( b_i );
                                this.data[data0Pos_i] = dataPos;
                                tSums += this.data[b_i];
                                this.data[b_i] = 0;//Zero out data
                                //->> OR ADD/SUM UP VALUES TO PROPERTY DURING THRUST *after <>?
                            }
                        }
                        //->> ADD VALUES TO PROPERTY BEFORE EXIT THRUST?
                        //Should do Binding here?
                        //*
                        b_i=endPos_i;
                        this._updateDataPos( b_i );
                    }
                    else 
                    {
                        return;
                    }
                    
                    //Should do Binding here?
                    //*
                    //Binding
                    //if (tCount > 10 && prop_bi == 805)
                        //debugger;
                    var setBind = this.runtime[buffer].ids["_bi"+node_bi];
                    var setBindProperty = setBind[prop_bi]
                    setBindProperty.value += tSums;
                    setBind.node[setBindProperty.binding] = setBindProperty.value;

                //->> ADD/SUM UP VALUES TO PROPERTY BEFORE NEXT NODE/PROPERTY/CHUNK?
                }
            }
        },
        this.fill = function( arr ) 
        {
            var alen = arr.length;
            var data = new Int32Array( new ArrayBuffer(alen * 4) );
            for ( var b_di=0; b_di<alen; b_di++ )
                data[b_di] = arr[b_di];
            return data;
        },
        this.bindings = function ()//SETUP NODE BINDINGS PROPERTIES and ARRAY FOR BUFFERING
        {
            this['runtime'] = this['runtime'] || {
            };
            this['runtime'][arguments[0]] = this['runtime'][arguments[0]] || 
            {
                buffer: arguments[0],
                data: [],
                nodeCount: 0,
                propsetCount: arguments[3].length,
                datalimit: arguments[4]
            }
            this['runtime'][arguments[0]].nodeCount += arguments[1].length;

            var bufferClass = arguments[0];
            var bufferObj = this['runtime'][bufferClass];
            bufferObj['ids'] = bufferObj['ids'] || {};
            var objs = arguments[1];
            var props = arguments[2],
                pkeys = arguments[3];
            var perlimit = arguments[4];
            var relative = arguments[5];

            var nodes = [];
            while (objs.length > 0) 
            {
                bufferObj['ids']['_bi' + objs[0][1]] = new(function( pkeys ) 
                {
                    objs[0][0] = objs[0][0] || {};
                    objs[0][0][bufferClass] = 
                    {
                        binding: '_bi'+objs[0][1],
                        position: bufferObj.data.length,
                        relative: relative
                    }; //Relavate values for offsets, sum up
                    bufferObj.data.push(objs[0][1]);//For the node slot
                    while ( pkeys.length > 0 ) 
                    {
                        this[pkeys[0]] = new(function( props ) 
                        {
                            this['binding'] = props[0][0];
                            this['value'] = objs[0][0][props[0][0]] = props[0][1];//Assign starting value to both buffer value and node property
                                            objs[0][0][bufferClass][props[0][0]] = 
                                            {
                                                binding: pkeys[0],
                                                data0Position_i: bufferObj.data.length+1
                                            };
                            bufferObj.data.push( pkeys[0] );
                            bufferObj.data.push( 1 );//(perlimit) one extra slot for data0Position_i and continuancePosVal_data0 in buffer set a default Data position 1
                            props[0][2] -= props[0][1];
                            for ( var b_di=0, alen=perlimit; b_di<alen; b_di++ )
                                if ( props[0][2] )
                                    bufferObj.data.push( props[0][2]/perlimit );
                                else
                                    bufferObj.data.push( 0 );
                        })( props );

                        pkeys.shift();
                        props.shift();
                    }

                    this.node = objs[0][0];
                    nodes.push( this.node );
                })( pkeys );

                objs.shift();
            }

            return nodes;
        }
    },
    this.running = false, this.update = undefined, this.lapse = 10,
    this.runtimeframes = function(stream){
        if (!this.running) {
            this.running = true;
            time = {thrusting:stream,_then: Date.now(), _duration: 0, _resi: 0, lapse: this.lapse};//time lapse should be the same number as the minimal buffer length of the smallets data perlimit/segment
            time.update = this.update;
            time.running = this.running;
            frame();
        }
    },
    this.stoptimeframes = function(){
        if (this.running) {
            this.running = false;
            window.cancelAnimationFrame(time.animationFrameLoop);
        }
    }
    var time = undefined;
    var frame = function() 
    {
        window.stats.begin();
        time.now = Date.now();
        time._delta = time.now - time._then + time._resi;
        time._deltaTimeFrame = time._delta / 10 << 0;
        time._resi = time._delta - (time._deltaTimeFrame * 10);//get remainder for percision
        time._duration += time._deltaTimeFrame;
        time._then = time.now;
        if (time._deltaTimeFrame > 0 && time._deltaTimeFrame < time.lapse && time.running) 
        {
            //app.streaming = false;//Streaming shutoffs are determined in the buffer scope
            ctx.camera.streams.thrust(time._deltaTimeFrame);//<-Buffer Scope enter thrusting/measuring or both
            //values summed up overtime and passed to node properties
        }
        time.update(time._deltaTimeFrame);
        time.animationFrameLoop = window.requestAnimationFrame(frame);
        window.stats.end();
    }
}

//buffering.setup(arr);

//OPTIONS////////////////////////////////////////////////////////////////////////////////////////
//^buffer, continuance, skip, tCount, revert, mCount, leap, reset
//
//buffer - choosen buffer to stream
//continuance - start all chunks from its Data 0 Position Value//default = (continuancePosVal_data0 = 1)
//skip - skip over *Data then start - with continuance
//tCount - thrust over *Data - with continuance
//revert - thrust or measure would continue to go over *Data from start when it reaches the end of the chunk 
//mCount - measure over *Data - without continuance
//leap - leap to next chunk if the *Data Value matches
//reset - reset all Data 0 Position Value//default = (continuancePosVal_data0 = 1)

//USE CASE1////////////////////////////////////////////////////////////////////////////////////////
//^buffer, continuance, skip, tCount, revert, mCount, leap, reset
//Ex. The example below of Time Frame calculation - thrusting data sums over time:-->
//buffering.stream(buff, true, 0, timeFramesPerMs, true, 0, -999, false);<--*
//^
//This example will thrust calculations to quantize values over time 
//to keep up with timeFramesPerMs (qualified frame counts per milliseconds)
//
//With continuance enabled the frames will continue on With no skipping, 
//will thrust - summing up values just incase a comupet is slow or freezing
//the thursting will continue applying until the timeFramesPerMs is satisfied
//no need for measuring summing up additional values
//leaping depending on the value//Important for performance//something outside the range of values (unique)-999 phasing out calculations
//and no resetting continuance to the start data the start data position

//USE CASE2////////////////////////////////////////////////////////////////////////////////////////
//^buffer, continuance, skip, tCount, revert, mCount, leap, reset
//Ex. The example below overdrives trusting for mapping prediction data 
//possibly in another process like a webworker - measuring large dataset:-->
//buffering.stream(buff, true, 0, nearPredictionPerMs, true, 1200, -999, false);<--*
//^
//This example will measure calculations and quantize values for prediction such as mapping/data/trajectorys
//
//and no resetting continuance to the start data the start data position

//USE CASE3////////////////////////////////////////////////////////////////////////////////////////
//^buffer, continuance, skip, tCount, revert, mCount, leap, reset
//Ex. The example below will allow leaping over the remaining chunk of data if a data value
//matches 500 
//buffering.stream(buff, true, 0, nearPredictionPerMs, true, 1200, 500, false);<--*
//^
//This will gain performance if used well

//USE CASE4////////////////////////////////////////////////////////////////////////////////////////
//^buffer, continuance, skip, tCount, revert, mCount, leap, reset
//Ex. The example below will extract chunks of data up to value 500 cut off
//buffering.stream(buff, true, 0, extractUpTo, true, 1200, 500, false);<--*
//^