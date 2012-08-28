goog.provide('cu.InstructionBox');

goog.require('lime.Label');
goog.require('lime.Sprite');
goog.require('lime.RoundedRect');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.ColorTo');
goog.require('cu.Layer');


cu.InstructionBox = function() {
	lime.RoundedRect.call(this);
	this.setSize(player.WIDTH,150).setAnchorPoint(0.5,0.5).setPosition(player.WIDTH/2,player.HEIGHT + 100).setStroke(5,'#000');

	this.back = new lime.Sprite().setSize(this.getSize()).setFill('#fff').setOpacity(0.9);

	this.label = new lime.Label().setSize(this.getSize().width - 10, this.getSize().height -10)
		.setFontFamily('lot')
		.setFontSize(40)
		.setPadding(10)
		.setAlign('center')
		.setLineHeight(1.15)
		.setText('Here is a lot of text to decide whether I should make the box bigger');

	this.appendChild(this.back);
	this.appendChild(this.label);
};
goog.inherits(cu.InstructionBox, lime.RoundedRect);


cu.InstructionBox.prototype.show = function()
{
	this.runAction(new lime.animation.MoveTo(player.WIDTH/2,player.HEIGHT/2));
	this.runAction(new lime.animation.ScaleTo(1));
};

cu.InstructionBox.prototype.hide = function()
{
	this.runAction(new lime.animation.MoveTo(player.WIDTH/2,player.HEIGHT+100));
};

cu.InstructionBox.prototype.animate = function()
{
	this.runAction(new lime.animation.Sequence(
		new lime.animation.Spawn(
			new lime.animation.MoveTo(player.WIDTH/2,player.HEIGHT/2),
			new lime.animation.ScaleTo(1)).setDuration(0.1),
		new lime.animation.ScaleTo(1.05).setDuration(0.5),	
		new lime.animation.Spawn(
			new lime.animation.MoveTo(player.WIDTH/2 + 10,player.HEIGHT-48),
			new lime.animation.ScaleTo(0.5)).setDuration(0.1)
		));
};

cu.InstructionBox.prototype.showNewInstruction = function(instruction)
{
	this.animate();
	this.label.setText(instruction);
};





