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
    if(activeLayer){
    	//Active layer has been clicked
        activeLayer.click(e);
		builder.mouseMenu.prototype.disappear();
    }
};

lu.EventLayer.setActiveLayer = function(layer)
{
	activeLayer = layer;
};