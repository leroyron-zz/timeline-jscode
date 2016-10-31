/*
AddOn: runtime binding
Object and property binding
binding nodes and their properties to the stream data
allowing pre-buffing and sub-node collections and their properties

@author leroyron / http://leroy.ron@gmail.com
_struct.addon: modifies, enhances and accesses
*/
(function (streaming) {
    var _struct = streaming.prototype;
    var _runtime = _struct.addon.runtime;    
    var that = _struct.addon;
    that.binding = function ()
    {
        _runtime[arguments[0]] = _runtime[arguments[0]] || 
        {
            stream: arguments[0],
            data: [],
            nodesPerStream: 0,
            propsPerNode: arguments[3].length,
            propDataLength: arguments[4]
        }
        _runtime[arguments[0]].nodesPerStream += arguments[1].length;

        var streamClass = arguments[0];
        var streamObj = _runtime[streamClass];
        streamObj['length'] = streamObj['length'] || arguments[4];
        streamObj['ids'] = streamObj['ids'] || {};
        var objs = arguments[1];
        var propDataLength = arguments[4];
        var relative = arguments[5];

        var nodes = [];
        while (objs.length > 0) 
        {
            var props = arguments[2].concat(),
            pkeys = arguments[3].concat();
            streamObj['ids']['_bi' + objs[0][1]] = new(function( pkeys ) 
            {
                objs[0][0] = objs[0][0] || {};
                objs[0][0][streamClass] = 
                {
                    binding: '_bi'+objs[0][1],
                    position: streamObj.data.length,
                    relative: relative
                }; //Relavate values for offsets, sum up
                streamObj.data.push(objs[0][1]);//For the node slot
                while ( pkeys.length > 0 ) 
                {
                    this[pkeys[0]] = new(function( props ) 
                    {
                        this['binding'] = props[0][0];
                        this['value'] = objs[0][0][props[0][0]] = props[0][1];//Assign starting value to both stream value and node property
                                        objs[0][0][streamClass][props[0][0]] = 
                                        {
                                            binding: pkeys[0],
                                            data0Position_i: streamObj.data.length+1
                                        };
                        streamObj.data.push( pkeys[0] );
                        streamObj.data.push( 1 );//(propDataLength) one extra slot for data0Position_i and continuancePosVal_data0 in stream set a default Data position 1
                        props[0][2] -= props[0][1];
                        for ( var b_di=0, alen=propDataLength; b_di<alen; b_di++ )
                            if ( props[0][2] )
                                streamObj.data.push( props[0][2]/propDataLength );
                            else
                                streamObj.data.push( 0 );
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
    };
})(streaming);