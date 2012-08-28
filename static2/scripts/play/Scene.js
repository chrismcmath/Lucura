goog.provide('cu.Scene');

goog.require('lime.Layer');
goog.require('lime.Scene');
goog.require('lime.animation.MoveTo')
goog.require('cu.Layer');
goog.require("cu.TitleLayer");
goog.require("cu.FinishLayer");
goog.require("cu.InstructionBox");

LAYER_CHANGE_SPEED = 0.4;

cu.Scene = function(game) {
	lime.Scene.call(this);
	this.layerCount = 0;
	this.nextLevelID = 0;

	this.titleLayer = new cu.TitleLayer(game);
	this.finishLayer = new cu.FinishLayer(game);
	this.instructionBox = new cu.InstructionBox();

	this.layersLayer = new lime.Layer();
	this.layers = new Array();

	this.appendChild(this.layersLayer);
	this.appendChild(this.titleLayer);
	this.appendChild(this.finishLayer);
	this.appendChild(this.instructionBox);
};
goog.inherits(cu.Scene, lime.Scene);

cu.Scene.prototype.nextLevel = function()
{	
	this.layers[this.nextLevelID].runAction(new lime.animation.MoveTo(-(player.WIDTH*2),0).setDuration(LAYER_CHANGE_SPEED));
	this.nextLevelID++;
	console.log('nextLevelID: ' + this.nextLevelID + ' layerCount: ' + this.layerCount);
	if(this.nextLevelID < this.layerCount)
	{
		this.instructionBox.showNewInstruction(this.layers[this.nextLevelID].instruction);
		this.layers[this.nextLevelID].runAction(new lime.animation.MoveTo(0,0).setDuration(LAYER_CHANGE_SPEED));
		this.layers[this.nextLevelID].onLoad();
		statLayer.nextRound(this.layers[this.nextLevelID].timeLimit);
	}
	else //Levels all completed
	{
		this.finishLayer.runAction(new lime.animation.MoveTo(0,0).setDuration(LAYER_CHANGE_SPEED));
		this.instructionBox.hide();
		statLayer.endGameDisplay();
	}
};

cu.Scene.prototype.loadLayer = function(background,goal,instruction,target,timeLimit,xg,yg)
{
	this.layers[this.layerCount] = new cu.Layer(this.layerCount,background,goal,instruction,target,timeLimit,xg,yg);
	this.layersLayer.appendChild(this.layers[this.layerCount]);
	this.layerCount++;
};

cu.Scene.prototype.beginGame = function()
{
	this.titleLayer.runAction(new lime.animation.MoveTo(-(player.WIDTH*2),0).setDuration(LAYER_CHANGE_SPEED));
	this.layers[this.nextLevelID].runAction(new lime.animation.MoveTo(0,0).setDuration(LAYER_CHANGE_SPEED));
	this.layers[this.nextLevelID].onLoad();

	this.instructionBox.showNewInstruction(this.layers[this.nextLevelID].instruction);

	statLayer.beginGame(this.layers[this.nextLevelID].timeLimit);
};

cu.Scene.prototype.timeOut = function()
{
	this.nextLevel();
};








