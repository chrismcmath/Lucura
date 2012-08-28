goog.provide('lu.SceneArrows');

goog.require('lime.Sprite');

lu.SceneArrows = function(ID) {
	lime.Sprite.call(this);

	this.lilIcon = new lime.Label().setSize(20,20)
        .setFontFamily('LOT').setFontColor('#a90329').setFontSize(40)
        .setPosition(2,0).setText('<<').setFontSize(20);
    this.lilIconBack = new lime.Label().setSize(20,20)
        .setFontFamily('LOT').setFontColor('#6d0019').setFontSize(40)
        .setPosition(0,-2).setText('<<').setFontSize(20);

    this.appendChild(this.lilIconBack);
    this.appendChild(this.lilIcon);

};
goog.inherits(lu.SceneArrows, lime.Sprite);