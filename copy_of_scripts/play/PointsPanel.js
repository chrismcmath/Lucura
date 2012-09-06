goog.provide('cu.PointsPanel');

goog.require('lime.Layer');
goog.require('lime.animation.FadeTo')
goog.require('lime.animation.MoveTo')
goog.require('lime.animation.ScaleTo')
goog.require('lime.Label');
goog.require('lime.RoundedRect');
goog.require('cu.Layer');
goog.require('ani');


cu.PointsPanel = function() {
	lime.RoundedRect.call(this);
	this.setSize(160,90).setAnchorPoint(0,1)
		.setFill('#000').setStroke(5,'#fff');

	this.roundPoints = 0;
	this.gamePoints = 0;
	this.failTally = 0;

	this.roundPointsLabel = new lime.Label().setSize(50,50).setText('0').setPosition(15,-40).setFontSize(80).setFontFamily('impact').setAnchorPoint(0,1).setFontColor('#FFEE6D');
	this.gamePointsLabel = new lime.Label().setSize(50,50).setText('0').setPosition(95,-25).setFontSize(40).setFontFamily('impact').setFontColor('#387071').setAnchorPoint(0.5,0.5);
	this.failTallyLabel = new lime.Label().setSize(50,50).setText('0').setPosition(135,-25).setFontSize(40).setFontFamily('impact').setFontColor('#AF3442').setAnchorPoint(0.5,0.5);

	this.appendChild(this.roundPointsLabel);
	this.appendChild(this.gamePointsLabel);
	this.appendChild(this.failTallyLabel);
};
goog.inherits(cu.PointsPanel, lime.RoundedRect);


cu.PointsPanel.prototype.addRoundPoints = function(number)
{
	this.roundPoints += number;
	this.roundPointsLabel.setText(this.roundPoints.toString());
};

cu.PointsPanel.prototype.setRoundPoints = function(number)
{
	this.roundPoints = number;
	this.roundPointsLabel.setText(this.roundPoints.toString());
};

cu.PointsPanel.prototype.pass = function()
{
	this.gamePoints++;
	this.gamePointsLabel.setText(this.gamePoints.toString());
	this.gamePointsLabel.runAction(ani.incrementPointDisplay(this.gamePointsLabel));
	this.setRoundPoints(0);
};

cu.PointsPanel.prototype.fail = function()
{
	this.failTally++;
	this.failTallyLabel.setText(this.failTally.toString());
	this.failTallyLabel.runAction(ani.incrementPointDisplay(this.failTallyLabel));
	this.setRoundPoints(0);
};

cu.PointsPanel.prototype.endGameDisplay = function()
{
	this.roundPointsLabel.runAction(new lime.animation.Spawn(
		new lime.animation.MoveTo(this.roundPointsLabel.getPosition().x, this.roundPointsLabel.getPosition().y + 100),
		new lime.animation.FadeTo(0)));

	dash = new lime.Sprite().setSize(20,5).setFill('#fff').setPosition(82,-50).setOpacity(0);
	passed = new lime.Label("PASSED",20).setFontColor('#387071').setFontFamily('impact').setPosition(45,-15).setOpacity(0);
	failed = new lime.Label("FAILED",20).setFontColor('#AF3442').setFontFamily('impact').setPosition(120,-15).setOpacity(0);
	this.appendChild(dash);
	this.appendChild(passed);
	this.appendChild(failed);

	dash.runAction(new lime.animation.FadeTo(1).setDuration(2));
	passed.runAction(new lime.animation.FadeTo(1).setDuration(2));
	failed.runAction(new lime.animation.FadeTo(1).setDuration(2));

	movePoints = function(){
		this.gamePointsLabel.runAction(new lime.animation.MoveTo(this.gamePointsLabel.getPosition().x-50, this.gamePointsLabel.getPosition().y-20));
		this.failTallyLabel.runAction(new lime.animation.MoveTo(this.failTallyLabel.getPosition().x-15, this.failTallyLabel.getPosition().y-20));
	};
	lime.scheduleManager.callAfter(movePoints, this, 500);

};


