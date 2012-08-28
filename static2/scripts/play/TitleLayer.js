goog.provide('cu.TitleLayer');

goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lime.Label');
goog.require('lime.animation.ColorTo');

START_BUTTON_COLOUR = '#aaa';

cu.TitleLayer = function(game) {
	lime.Sprite.call(this);

	this.setSize(player.WIDTH,player.HEIGHT).setAnchorPoint(0,0).setPosition(0,0);


	this.title = new lime.Label().setSize(600,50).setText(game.title)
		.setPosition(player.WIDTH/2,50)
		.setFontFamily('lot')
		.setFontSize(50)
		.setFontColor('#000');

	this.description = new lime.Label().setSize(600,50).setText(game.description)
		.setPosition(player.WIDTH/2,270)
		.setFontFamily('helvetica')
		.setFontSize(20)
		.setFontColor('#532324');

	this.startButton = new lime.Label().setSize(180,70)
		.setStroke(5,'#000').setPadding(10)
		.setFill(START_BUTTON_COLOUR).setPosition(player.WIDTH/2,400)
		.setFontFamily('lot')
		.setFontSize('40')
		.setText('start')
		;


	/*Setup event listeners*/
	tL = this;
    goog.events.listen(this.startButton, ['mousedown', 'touchstart'], function(e) {
        this.runAction(new lime.animation.ColorTo('#fff').setDuration(0.2));

        e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
        	this.runAction(new lime.animation.ColorTo(START_BUTTON_COLOUR).setDuration(0.2));
        	tL.getParent().beginGame();
        });
    });


	this.appendChild(this.startButton);
	this.appendChild(this.title);
	this.appendChild(this.description);
};
goog.inherits(cu.TitleLayer, lime.Layer);

cu.TitleLayer.click = function(e)
{
    console.log('ui click');
};