goog.provide('lu.CurrentLayerMarker');

goog.require('lime.Sprite');

lu.CurrentLayerMarker = function(ID) {
	lime.Sprite.call(this);

	this.lilIcon = new lime.Label('↑',20).setSize(20,20)
        .setFontFamily('LOT').setFontColor('#a90329').setFontSize(40)
        .setPosition(2,0);
    this.lilIconBack = new lime.Label('↑',20).setSize(20,20)
        .setFontFamily('LOT').setFontColor('#6d0019').setFontSize(40)
        .setPosition(0,-2);

    this.appendChild(this.lilIconBack);
    this.appendChild(this.lilIcon);

};
goog.inherits(lu.CurrentLayerMarker, lime.Sprite);