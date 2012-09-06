goog.provide('lu.LayerBack');

goog.require('lime.Sprite');
goog.require('lu.CurrentLayerMarker');

lu.LayerBack = function(ID) {
	lime.Sprite.call(this);
    this.ID = ID;
    // this.icon = new lime.Sprite().setFill('http://images.wikia.com/mcleodgaming/images/c/c2/Sonic_spring.gif').setSize(40,40).setPosition(40,30).setOpacity(0);
    this.icon = new lu.CurrentLayerMarker().setSize(40,40).setPosition(40,30).setOpacity(0);
    this.setAnchorPoint(0,0).setStroke(5,'#fff').setPosition(100*(this.ID+1)+10,10);

    this.appendChild(this.icon);
};
goog.inherits(lu.LayerBack, lime.Sprite);

lu.LayerBack.createLayer = function(){
    // return new lu.Layer(layerNo++).setSize(builder.WIDTH,builder.HEIGHT).setAnchorPoint(0,0);
};


lu.LayerBack.makeBackground = function(){
    this.setOpacity(1);
};