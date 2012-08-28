goog.provide('lime.Scene');


goog.require('lime');
goog.require('lime.Node');

/**
 * Scene object
 * @constructor
 * @extends lime.Node
 */
lime.Scene = function() {
    lime.Node.call(this);

    this.setAnchorPoint(0, 0);

    this.domClassName = goog.getCssName('lime-scene');
    this.createDomElement();

};
goog.inherits(lime.Scene, lime.Node);

/** @inheritDoc */
lime.Scene.prototype.getScene = function() {
    return this;
};

/** @inheritDoc */
lime.Scene.prototype.measureContents = function() {
    return this.getFrame();
}


/**
 Test for correctly dispatching mouseover/mouseout for LimeJS objects
 
 Usage: scene.listenOverOut(shape,function(e){ console.log('over'); }, function(e){ console.log('out'); });
 
 Advice welcome about how to have the same result with more LimeJS/Closure style API.
 
*/
lime.Scene.prototype.listenOverOut = (function(){

    var moveHandler = function(e){
        for(var i in this.registeredOverOut_){ //for all items we're listening to
            var item = this.registeredOverOut_[i];
            var shape = item[0]; //i.e. [shape,over,out]
            if(!shape.inTree_) continue; //??
            var insideShape = shape.hitTest(e);//boolean
            //insideShape is our current var, saved (to compare) as shape.insid..
            if(!shape.insideShape_ && insideShape && goog.isFunction(item[1])){
                item[1].call(shape,e);
            }
            if(shape.insideShape_ && !insideShape && goog.isFunction(item[2])){
                item[2].call(shape,e);
            }
            shape.insideShape_ = insideShape;
        }
    };

    return function(shape,over,out){ //The target shape, over behaviour and out bhv
        //defensive
        if(shape==this) return; //scene itself is always full

        if(!this.registeredOverOut_){ //if this doesn't exist yet (first time called)
             this.registeredOverOut_ = {};// let's make the array
        }

        var uuid = goog.getUid(shape); //Unique id of our target

        if(!over && !out) //if it's the first time (empty)
            delete this.registeredOverOut_[uuid]; //delete this shape's slot

        if(!this.isListeningOverOut_){ //So that this only runs once
            goog.events.listen(this,"mousemove",moveHandler,false,this);
            this.isListeningOverOut_ = true;
        }

        this.registeredOverOut_[uuid] = [shape,over,out]; //store for the future
    }
})();