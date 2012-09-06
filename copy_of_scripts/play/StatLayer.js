goog.provide('cu.StatLayer');

goog.require("goog.json.Serializer");
goog.require("goog.net.XhrIo");

goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.ScaleTo');
goog.require('cu.PointsPanel');
goog.require('cu.TimerPanel');

cu.StatLayer = function() {
	lime.Sprite.call(this);

	this.setPosition(0,player.HEIGHT/2);

	this.setSize(player.WIDTH,player.HEIGHT);

	this.pointsPanel = new cu.PointsPanel().setPosition(1,player.HEIGHT-10);
	this.timerPanel = new cu.TimerPanel().setPosition(player.WIDTH-10,player.HEIGHT-10);

	this.appendChild(this.pointsPanel);
	this.appendChild(this.timerPanel);
};
goog.inherits(cu.StatLayer, lime.Layer);

cu.StatLayer.prototype.beginGame = function(time)
{
	this.runAction(new lime.animation.MoveTo(0,0));
	this.timerPanel.startGameClock();
	this.timerPanel.startRoundTimer(time);
};

cu.StatLayer.prototype.endGameDisplay = function()
{
	this.pointsPanel.runAction(new lime.animation.Spawn(
		new lime.animation.MoveTo(160,player.HEIGHT-160),
		new lime.animation.ScaleTo(2)));
	this.pointsPanel.endGameDisplay();
	this.timerPanel.endGameDisplay();
	this.timerPanel.runAction(new lime.animation.MoveTo(470,player.HEIGHT-10));
	this.timerPanel.stopRoundTimer();
	this.timerPanel.stopGameClock();
	this.postScore();
};

cu.StatLayer.prototype.nextRound = function(time)
{
	this.timerPanel.resetRoundTimer(time);
};

cu.StatLayer.prototype.postScore = function()
{
	if(this.pointsPanel.gamePoints == 0)
	{
		pert = 0;
	}
	else if (this.pointsPanel.failTally == 0)
	{
		pert = 100;
	}
	else
	{
		pert = Math.round(((this.pointsPanel.gamePoints)/(this.pointsPanel.failTally+this.pointsPanel.gamePoints))*100);
	}

	scores = {
		'percentage': pert,
		'time': Math.round(this.timerPanel.gameTime),
		'gameID': player.gameID};


	request = new goog.net.XhrIo(); 
    goog.events.listen(request, 'complete', function(){
      if(request.isSuccess()){
        //Successfully posted score
      } else {
        alert('Could not save game. Please check your connection.');
      }
    });

	request.send('/post_score/', 'POST', goog.json.serialize(scores), {'content-type':'application/json'});
};

