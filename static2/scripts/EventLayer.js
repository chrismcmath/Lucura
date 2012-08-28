goog.provide('lu.EventLayer');

goog.require('lime.Sprite');

var activeLayer = 0;

lu.EventLayer = function() {
	lime.Sprite.call(this);

    this.setFill('#777');
};
goog.inherits(lu.EventLayer, lime.Sprite);

lu.EventLayer.click = function(e)
{
    console.log('event click');
    if(activeLayer){
    	console.log('layer ' + activeLayer.ID + ' clicked');
        activeLayer.click(e);
		builder.mouseMenu.prototype.disappear();
    }
};

lu.EventLayer.prototype.newFunction = function(){
	console.log('new');
};

lu.EventLayer.setActiveLayer = function(layer)
{
	activeLayer = layer;
};