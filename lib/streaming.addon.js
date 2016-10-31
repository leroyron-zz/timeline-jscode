/*
AddOn Constructor

@author leroyron / http://leroy.ron@gmail.com
_struct.addon: attach Constructors to give access to addon
*/
(function ( streaming ) 
{
    var _struct = streaming.prototype;
    _struct.addon = {};
    _struct.addon.runtime = {};
    _struct.attach = (function ()
    {
        this.open.prototype.addon = this.addon;
        this.open.prototype.runtime = this.addon.runtime;
        
        delete this.__proto__.runtime;

        //all addons with access function is used as a flag
        //give access to each addon once streaming has opened
        var _struct = this.open.prototype;
        _struct.attach  = (function ()
        {
            for ( var addon in this.addon ) 
            {
                for ( var func in this.addon[addon] )
                {
                    if ( func == 'access' )
                        this.addon[addon][func] = this;
                }
            }
            return true;//class: streaming * return {_finalize: this.attach()}; true thrown to finalize stream
        });
    }); 
})( streaming );
