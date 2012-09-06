goog.provide('lu.UILayer');

goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lu.Layer');
goog.require('lu.Panel');
goog.require('lu.SceneArrows');

lu.UILayer = function(x,y) {
	lime.Sprite.call(this);

	this.layerLayer = new lime.Layer().setAnchorPoint(0,0);
	this.selectedLayer = new lime.Layer().setAnchorPoint(0,0);
	this.panel = new lu.Panel(x,y);
	this.leftListener = new lu.SceneArrows().setSize(40,40).setAnchorPoint(0.5,0.5)
		.setPosition(20,443);
	this.rightListener = new lu.SceneArrows().setSize(40,40).setAnchorPoint(0.5,0.5)
		.setPosition(600,443).setRotation(180);

	this.setSize(x,y);

	goog.events.listen(this.leftListener, ['mousedown', 'touchstart'], function(e) {
	    e.event.stopPropagation();

	    e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
	    	this.getParent().panel.shiftRight();
	    });
    });

    goog.events.listen(this.rightListener, ['mousedown', 'touchstart'], function(e) {
	    e.event.stopPropagation();

	    e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
	    	this.getParent().panel.shiftLeft();
	    });
    });

	this.appendChild(this.layerLayer);
	// this.layerLayer.appendChild(this.panel.layers[0]);
	this.appendChild(this.selectedLayer);
		this.selectedLayer.appendChild(mouseMenu);
	this.appendChild(this.panel);
	this.appendChild(this.leftListener);
	this.appendChild(this.rightListener);

};
goog.inherits(lu.UILayer, lime.Layer);

lu.UILayer.click = function(e)
{
	//Click functionality
};