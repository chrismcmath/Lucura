goog.provide('cu.FinishLayer');

goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lime.Label');
goog.require('lime.animation.ColorTo');

START_BUTTON_COLOUR = '#aaa';

cu.FinishLayer = function(game) {
	lime.Sprite.call(this);

	this.setSize(player.WIDTH,player.HEIGHT).setAnchorPoint(0,0).setPosition(player.WIDTH,0);


	this.completed = new lime.Label().setSize(600,50).setText("You completed ")
		.setPosition(player.WIDTH/2,30)
		.setFontFamily('miso-bold')
		.setFontSize(20)
		.setFontColor('#532324');
	this.title = new lime.Label().setSize(600,60).setText(game.title)
		.setPosition(player.WIDTH/2,75)
		.setFontFamily('lot')
		.setFontSize(30)
		.setFontColor('#000');
	this.withLabel = new lime.Label().setSize(600,50).setText("with ")
		.setPosition(player.WIDTH/2,120)
		.setFontFamily('miso-bold')
		.setFontSize(20)
		.setFontColor('#532324');
	this.inLabel = new lime.Label().setSize(600,50).setText("in ")
		.setPosition(player.WIDTH/2,370)
		.setFontFamily('miso-bold')
		.setFontSize(20)
		.setFontColor('#532324');

	

	// this.startButton = new lime.Label().setSize(180,70)
	// 	.setStroke(5,'#000').setPadding(10)
	// 	.setFill(START_BUTTON_COLOUR).setPosition(player.WIDTH/2,400)
	// 	.setFontFamily('lot')
	// 	.setFontSize('40')
	// 	.setText('start')
	// 	;


	// /*Setup event listeners*/
	// tL = this;
 //    goog.events.listen(this.startButton, ['mousedown', 'touchstart'], function(e) {
 //        this.runAction(new lime.animation.ColorTo('#fff').setDuration(0.2));

 //        e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
 //        	this.runAction(new lime.animation.ColorTo(START_BUTTON_COLOUR).setDuration(0.2));
 //        	tL.getParent().beginGame();
 //        });
 //    });

	this.appendChild(this.completed);
	this.appendChild(this.withLabel);
	this.appendChild(this.inLabel);
	this.appendChild(this.title);
	
};
goog.inherits(cu.FinishLayer, lime.Layer);