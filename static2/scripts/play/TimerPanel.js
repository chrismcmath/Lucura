goog.provide('cu.TimerPanel');

goog.require('lime.Layer');
goog.require('lime.Label');
goog.require('lime.RoundedRect');
goog.require('cu.Layer');

var gameFunc = function(dt) {
    this.gameTime += dt;
    this.gameTimeLabel.setText(Math.round(this.gameTime/1000));
};

var roundFunc = function(dt) {
    this.roundTime -= dt;
    this.roundTimeLabel.setText(Math.round(this.roundTime/1000));
    if(this.roundTime <= 0)
	{
		scene.timeOut();
		this.getParent().pointsPanel.fail();
	}
}

cu.TimerPanel = function() {
	lime.RoundedRect.call(this);
	this.setSize(100,80).setAnchorPoint(1,1)
		.setFill('#fff').setStroke(5,'#000');
	this.gameTime = 0;
	this.gameTimeLabel = new lime.Label().setSize(100,100).setFontSize(20).setPosition(-10,-25);
	this.roundTime = 0;
	this.roundTimeLabel = new lime.Label().setSize(100,100).setFontSize(50).setFontFamily('lot').setPosition(-50,-10);


	this.appendChild(this.gameTimeLabel);
	this.appendChild(this.roundTimeLabel);
};
goog.inherits(cu.TimerPanel, lime.RoundedRect);



cu.TimerPanel.prototype.startGameClock = function()
{
	lime.scheduleManager.schedule(gameFunc,this);
};

cu.TimerPanel.prototype.stopGameClock = function()
{	
	console.log('stop the clock!!!!');
	lime.scheduleManager.unschedule(gameFunc,this);
};

cu.TimerPanel.prototype.startRoundTimer = function(time)
{
	this.roundTime = time*1000;

	lime.scheduleManager.schedule(roundFunc,this);
};

cu.TimerPanel.prototype.stopRoundTimer = function()
{
	lime.scheduleManager.unschedule(roundFunc,this);
};

cu.TimerPanel.prototype.resetRoundTimer = function(time)
{
	this.roundTime = time*1000;
};

cu.TimerPanel.prototype.endGameDisplay = function(time)
{
	this.runAction(new lime.animation.ScaleTo(3,1));
	this.roundTimeLabel.runAction(new lime.animation.Spawn(
		new lime.animation.MoveTo(this.roundTimeLabel.getPosition().x, this.roundTimeLabel.getPosition().y + 120),
		new lime.animation.FadeTo(0)));
	this.gameTimeLabel.runAction(new lime.animation.Spawn(
		new lime.animation.MoveTo(this.gameTimeLabel.getPosition().x - 55,120),
		new lime.animation.ScaleTo(1.4,4)));

	seconds = new lime.Label('seconds',16).setFontSize(13).setSize(200,100).setScale(1,3).setPosition(-27, 100).setOpacity(0);
	this.appendChild(seconds);
	seconds.runAction(new lime.animation.FadeTo(1).setDuration(2));
};


