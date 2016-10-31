//Streaming for javascripts linear parallelity 
var streaming = function () {
    this.open = function () 
    {
        this.build = function ( stream ) {
            var bindings = this.runtime[stream];

            this.stream = bindings.stream;
            this.nodesPerStream = bindings.nodesPerStream;
            this.propsPerNode = bindings.propsPerNode;
            this.propDataLength = bindings.propDataLength;
            this.continuancePosVal_data0 = 1;
            this.data0PropDataLength = this.continuancePosVal_data0 + this.propDataLength;
            this.nodeDataLength = this.data0PropDataLength * this.propsPerNode + this.propsPerNode + 1;

            //buff up the stream with data
            this.data = this._prebuff( bindings.data );
            
            bindings.stream = bindings.nodesPerStream = bindings.propsPerNode = bindings.propDataLength = bindings.data = null;
            delete bindings.stream;
            delete bindings.nodesPerStream;
            delete bindings.propsPerNode;
            delete bindings.propDataLength;
            delete bindings.data;

            this._finalize();
        },
        this.access = function ( continuance, skip, tCount, revert, mCount, leap, reset ) 
        {
            //stream reading enviornment vars
            var continuance = continuance, skip = skip, tCount = tCount, revert = revert, mCount = mCount, leap = leap, reset = reset,
            _accessed = false;
            //changable
            this.tCount = 0;
            this.mCount = 0;
            this.runtimeCalls = [];
            this.rclen = 0;
            this.runtimeCallbacks = function () {
                for ( var r=0; r<this.rclen; r++ ) {
                    this.runtimeCalls[r][1](this.runtimeCalls[r][0]);
                }
            }
            this.update = function( setcontinuance, setskip, settCount, setrevert, setmCount, setleap, setreset ) 
            {
                continuance = setcontinuance, skip = setskip, tCount = settCount, revert = setrevert, mCount = setmCount, leap = setleap, reset = setreset;
                this.updateCallbacks();
            }
            this.updateCalls = [];
            this.uclen = 0;
            this.updateCallbacks = function () {
                for ( var c=0; c<this.uclen; c++ ) {
                    this.updateCalls[c][1](this.updateCalls[c][0]);
                }
            }
            
            //stream runtime vars
            var stream, nodesPerStream, propsPerNode, propDataLength, continuancePosVal_data0, data0PropDataLength, nodeDataLength, streamDataLength;
            this._finalize = function() 
            {
                //Initialization from build
                stream = this.stream;
                nodesPerStream = this.nodesPerStream;
                propsPerNode = this.propsPerNode;
                propDataLength = this.propDataLength;
                continuancePosVal_data0 = this.continuancePosVal_data0;
                data0PropDataLength = this.data0PropDataLength;
                nodeDataLength = this.nodeDataLength;

                this.stream = this.nodesPerStream = this.propsPerNode = this.propDataLength = this.continuancePosVal_data0 = this.data0PropDataLength = this.nodeDataLength = null;
                delete this.stream;
                delete this.nodesPerStream;
                delete this.propsPerNode;
                delete this.propDataLength;
                delete this.continuancePosVal_data0;
                delete this.data0PropDataLength;
                delete this.nodeDataLength;

                delete this.__proto__.addon;
                //delete this.__proto__.runtime;
                //FOR PRODUCTION
                //!!!IMPORTANT hide data (private)... replace this.data with var data;-->
                //var data = this.data;
                //delete this.data;

                streamDataLength = this.data.length;
                this.updateCallbacks();
            }
            
            //thrust and measure methods
            this.thrust = function ( val, option ) 
            {
                this.tCount = val + tCount;
                this.runtimeCallbacks();
                switch ( option ) {
                    case 'all':
                        this._thrustAll( this.tCount );
                        break;
                    case 'nodes':
                        this._thrustNodes( this.tCount, arguments[2] );
                        break;
                    case 'properties':
                        this._thrustProperties( this.tCount, arguments[2] );
                        break;
                    case 'mix':
                        this._thrustMix( this.tCount, arguments[2] );
                        break;
                    default:
                        this._thrustAll( this.tCount );
                        break;
                }
            },
            this.measure = function ( val, option )//ToDo - use webworker
            {
                this.mCount = val + mCount;
                this.runtimeCallbacks();
                switch (option) {
                    case 'all':
                        return [this._measureAll( this.mCount )];
                    case 'nodes':
                        return [this._measureNodes( this.mCount, arguments[2] )];
                    case 'properties':
                        return [this._measureProperties( this.mCount, arguments[2] )];
                    case 'mix':
                        return [this._measureMix( this.mCount, arguments[2] )];
                    default:
                        return [this._measureAll( this.mCount )];
                }
            }

            ////Common Vars and _functions that are used for thrust and measuring
            //underscore i (_i) indicates data index 
            //s_i is the position in stream array
            //cursor counts up start for offset reads
            //reads counts up for data reads
            var s_i = 0, cursor = 0, reads = 0, chunkStart_i = 0;
            var dataPos, data0Pos, data0Pos_i, endPos_i;
            this._checkInContinuance = function () 
            {
                if ( !continuance )
                    return s_i;
                s_i += this.data[data0Pos_i];
                this._updateDataPos( s_i );
                return s_i;
            }
            this._updateDataPos = function () 
            {
                dataPos = ( ( s_i - cursor ) - chunkStart_i );
                data0Pos_i = s_i - dataPos;
            }
            this._checkOutRevert = function () 
            {
                if ( !revert )
                    return s_i;
                var reverancy = ( ( this.data[data0Pos_i]+skip ) /propDataLength ) << 0;
                var revertPos = ( ( this.data[data0Pos_i]+skip ) - ( propDataLength*reverancy ) + continuancePosVal_data0 ) ;
                var revertPosI = data0Pos_i+revertPos;
                if ( reverancy >= 1 ) 
                {
                    this.data[data0Pos_i] = revertPos;
                    this._updateDataPos( revertPosI );
                    return revertPosI;
                }
                else 
                {
                    s_i += skip;
                    this._updateDataPos( s_i );
                    return s_i;
                }
            }
            ////
            
            ////Thrusting stores dataoffsets and zeros out data
            this._thrustAll = function ( tCount ) 
            {
                for ( 
                    s_i = 0,
                    cursor = 0,
                    reads = 0; 
                    s_i < streamDataLength; 
                    s_i++ 
                    ) 
                {
                    //Node Level//
                    if ( s_i % nodeDataLength == 0 ) 
                    {
                        //var node_i = s_i/nodeDataLength;//node index number
                        //->> Node Selection > buffer identifyer
                        var node_bi = this.data[s_i];
                        s_i++;
                        cursor = 1;
                        reads++;
                    }

                    //Property Level//
                    if ( ( s_i-reads ) % data0PropDataLength == 0 ) 
                    {
                        chunkStart_i = ( s_i - cursor );
                        //var prop = ((s_i-reads) - ( data0PropDataLength * propsPerNode * node_i)) / data0PropDataLength;//property index number of chunk
                        //->> Property Selection > buffer identifyer

                        var prop_bi = this.data[s_i];
                        s_i++;
                        cursor++;
                        reads++;

                        dataPos = ( ( s_i - cursor ) - chunkStart_i );
                        data0Pos = dataPos;
                        data0Pos_i = s_i - data0Pos;
                        var endPos = ( data0PropDataLength - data0Pos )-1;
                        endPos_i = data0Pos_i + endPos;
                        
                        if ( reset )
                            this.data[data0Pos_i] = continuancePosVal_data0;

                        s_i = this._checkInContinuance( s_i, continuance );
                        s_i = this._checkOutRevert( s_i, skip, revert );
                    }

                    //Data Level//
                    if ( tCount > 0 ) 
                    {
                        var tSums = this._dataSum( tCount );

                        var setBind = this.runtime[stream].ids["_bi"+node_bi];
                        var setBindProperty = setBind[prop_bi]
                        setBindProperty.value += tSums;
                        setBind.node[setBindProperty.binding] = setBindProperty.value;
                    }
                    else 
                    {
                        return;
                    }
                }
            }
            this._dataSum = function ( count ) 
            {
                sums = 0;
                for ( var d = 0; d < count; d++ ) 
                {
                    var next = 1;
                    var nextPos = dataPos+next;
                    var nextPos_i = data0Pos_i+nextPos;
                    if ( nextPos > propDataLength ) 
                    {
                        if ( !revert ) 
                        {
                            break;
                        } 
                        else 
                        {
                            d--;
                            s_i=data0Pos_i+continuancePosVal_data0;
                            this._updateDataPos( s_i );
                            this.data[data0Pos_i] = dataPos;//a.store offset
                        }
                    }
                    else if ( this.data[nextPos_i] == leap ) 
                    {
                        if ( continuance ) 
                        {
                            this.data[data0Pos_i] = nextPos;//a.
                        }
                        this.data[nextPos_i] = 0;//b.Zero out data
                        s_i=endPos_i;
                        this._updateDataPos( s_i );
                        break;
                    }    
                    else 
                    {
                        s_i = nextPos_i;
                        this._updateDataPos( s_i );
                        this.data[data0Pos_i] = dataPos;//a.
                        sums += this.data[s_i];
                        this.data[s_i] = 0;//b.
                    }
                }
                s_i=endPos_i;
                this._updateDataPos( s_i );
                return sums;
            };
            ////thrust

            ////Measuring gathers data for use
            var m_i = 0, measureData;
            this._measureAll = function ( mCount ) //ToDo - for webworker
            {
                measureData = new Int32Array( new ArrayBuffer( mCount * propsPerNode + propsPerNode + 1 * nodesPerStream * 4 ) );
                for ( 
                    m_i = 0,
                    s_i = 0,
                    cursor = 0,
                    reads = 0; 
                    s_i < streamDataLength; 
                    s_i++ 
                    ) 
                {
                    //Node Level//
                    if ( s_i % nodeDataLength == 0 ) 
                    {
                        //var node_i = s_i/nodeDataLength;//node index number
                        //->> Node Selection > buffer identifyer in stream
                        var node_bi = this.data[s_i];
                        measureData[m_i++] = node_bi;
                        s_i++;
                        cursor = 1;
                        reads++;
                    }

                    //Property Level//
                    if ( ( s_i-reads ) % data0PropDataLength == 0 ) 
                    {
                        chunkStart_i = ( s_i - cursor );
                        //var prop = ((s_i-reads) - ( data0PropDataLength * propsPerNode * node_i)) / data0PropDataLength;//property index number of chunk
                        //->> Property Selection > buffer identifyer

                        var prop_bi = this.data[s_i];
                        measureData[m_i++] = prop_bi;
                        s_i++;
                        cursor++;
                        reads++;

                        dataPos = ( ( s_i - cursor ) - chunkStart_i );
                        data0Pos = dataPos;
                        data0Pos_i = s_i - data0Pos;
                        var endPos = ( data0PropDataLength - data0Pos )-1;
                        endPos_i = data0Pos_i + endPos;
                        
                        if ( reset )
                            this.data[data0Pos_i] = continuancePosVal_data0;

                        s_i = this._checkInContinuance( s_i, continuance );
                        s_i = this._checkOutRevert( s_i, skip, revert );
                    }

                    //Data Level//
                    if ( mCount > 0 ) 
                    {
                        this._dataReturn( mCount, measureData );
                    }
                    else 
                    {
                        return;
                    }
                }
                return measureData;
            }
            this._dataReturn = function ( count, measureData ) 
            {
                for ( var d = 0; d < count; d++ ) 
                {
                    var next = 1;
                    var nextPos = dataPos+next;
                    var nextPos_i = data0Pos_i+nextPos;
                    if ( nextPos > propDataLength ) 
                    {
                        if ( !revert ) 
                        {
                            break;
                        } 
                        else 
                        {
                            d--;
                            s_i=data0Pos_i+continuancePosVal_data0;
                            this._updateDataPos( s_i );
                        }
                    }
                    else if ( this.data[nextPos_i] == leap ) 
                    {
                        s_i=endPos_i;
                        this._updateDataPos( s_i );
                        break;
                    }    
                    else 
                    {
                        s_i = nextPos_i;
                        this._updateDataPos( s_i );
                        measureData[m_i++] = this.data[s_i];
                    }
                }
                s_i=endPos_i;
                this._updateDataPos( s_i );
                return measureData;
            };
            ////measure
            
            _accessed = true;
            this.arguments = {continuance: continuance, skip: skip, tCount: tCount, revert: revert, mCount: mCount, leap: leap, reset: reset,
            _accessed: _accessed};
            return {_finalize: this.attach()};
        },

        this._prebuff = function( arr ) 
        {
            var alen = arr.length;
            var data = new Int32Array( new ArrayBuffer(alen * 4) );
            for ( var b_di=0; b_di<alen; b_di++ )
                data[b_di] = arr[b_di];
            return data;
        }
    }

    //aquire the stream length once from = new streaming(number);
    this.__proto__.length = this.__proto__.length || arguments[0];

    this.attach();
}