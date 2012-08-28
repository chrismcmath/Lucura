goog.provide('lu.Panel');

goog.require('lime.Sprite');
goog.require('lime.RoundedRect');
goog.require('lime.Label');
goog.require('lu.LayerBack');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.Loop');

TILE_WIDTH = 80;
TILE_HEIGHT = 60;
LAYER_BACK_WIDTH= 85;
LAYER_BACK_HEIGHT= 65;


lu.Panel = function(x,y) {
	lime.Sprite.call(this); //call the 'base class'

	/*Create listeners*/

	this.height = y-80;

	this.layerCount = 0;
	this.layers = new Array();

	//Create the backs to each layer
	this.layerBacks = new Array();
	this.layerBacks[this.layerCount] = new lu.LayerBack(this.layerCount).setSize(LAYER_BACK_WIDTH,LAYER_BACK_HEIGHT);
	this.layerBacks[this.layerCount].icon.setOpacity(1);

	//Add a default layer
	// lu.Layer.addNewLayer(this.layers, this.layerCount);
	// this.layers[this.layerCount].setActive(true);
	// this.layerCount++;
	// this.layerBacks[this.layerCount] = new lu.LayerBack(this.layerCount).setSize(TILE_WIDTH,TILE_HEIGHT);
	this.addNewLayerButton = new lime.Sprite().setSize(TILE_WIDTH,TILE_HEIGHT).setPosition(this.layerBacks[this.layerCount].getPosition()).setAnchorPoint(0,0);

	lilIcon = new lime.Label('New',20).setSize(20,20)
        .setFontFamily('LOT').setFontColor('#a90329').setFontSize(25)
        .setPosition(TILE_WIDTH/2-21,TILE_HEIGHT/2+2);
    lilIconBack = new lime.Label('New',20).setSize(20,20)
        .setFontFamily('LOT').setFontColor('#6d0019').setFontSize(25)
        .setPosition(TILE_WIDTH/2-23,TILE_HEIGHT/2);
    this.addNewLayerButton.appendChild(lilIconBack);
    this.addNewLayerButton.appendChild(lilIcon);

	//By default, our active layer is the first of panel's layers
	// this.activeLayer = this.layers[0];

	this.setSize(x,80).setAnchorPoint(0,0).setPosition(0,y-80);

	/*Events*/
	goog.events.listen(this.addNewLayerButton, ['mousedown', 'touchstart'], function(e) {
		this.getParent().createNewLayer();
		builder.mouseMenu.prototype.disappear();
		panel.activeLayer.query.disappear();
		panel.activeLayer.props.disappear();
		textQuery.disappear();
		console.log('should disapper');
	    e.event.stopPropagation();
    });

    goog.events.listen(this, ['mousedown', 'touchstart'], function(e) {
    	builder.mouseMenu.prototype.disappear();
	    // e.event.stopPropagation();
    });


	this.appendChild(this.layerBacks[0]);
	// this.appendChild(this.layerBacks[1]);
	this.appendChild(this.addNewLayerButton);
};
goog.inherits(lu.Panel, lime.Sprite);


lu.Panel.prototype.click = function()
{
	this.back.runAction(new lime.animation.FadeTo(1).setDuration(0.05));
};

lu.Panel.prototype.release = function()
{
	this.back.runAction(new lime.animation.FadeTo(0).setDuration(0.2));
};

lu.Panel.prototype.createNewLayer = function(){
	//Create a new layer
	lu.Layer.addNewLayer(this.layers, this.layerCount);

	//Set the layer's position to the current last layerBack box
	this.layers[this.layerCount].setPosition(100*(this.layers[this.layerCount].ID+1)+10,10).setScale(0.125).setAnchorPoint(0,0);

	this.layerCount++;

	//Make a new layerBack
	this.layerBacks[this.layerCount] = new lu.LayerBack(this.layerCount).setSize(LAYER_BACK_WIDTH,LAYER_BACK_HEIGHT);
	
	//Move the new box to this position
	this.addNewLayerButton.setPosition(this.layerBacks[this.layerCount].getPosition());

	this.appendChild(this.layerBacks[this.layerCount]);
	this.appendChild(this.layers[this.layerCount-1]);

	//Rerun setupEvents for the new layers
	this.setupEvents();
	
	console.log('create');
};

lu.Panel.prototype.loadLayer = function(background, goal, instruction, target, timeLimit,gx,gy)
{
	//Create a new layer
	lu.Layer.addNewLayer(this.layers, this.layerCount);

	//Set the layer's position to the current last layerBack box
	this.layers[this.layerCount].setPosition(100*(this.layers[this.layerCount].ID+1)+10,10).setScale(0.125).setAnchorPoint(0,0);

	//Load layer data
	if(background != '')
	this.layers[this.layerCount].setFill(background);
	this.layers[this.layerCount].goal = goal;
	this.layers[this.layerCount].instruction = instruction;
	this.layers[this.layerCount].pointTarget = target;
	this.layers[this.layerCount].timeLimit = timeLimit;
	this.layers[this.layerCount].gravX = gx;
	this.layers[this.layerCount].gravY = gy;

	this.layerCount++;

	//Make a new layerBack
	this.layerBacks[this.layerCount] = new lu.LayerBack(this.layerCount).setSize(LAYER_BACK_WIDTH,LAYER_BACK_HEIGHT);
	
	//Move the new box to this position
	this.addNewLayerButton.setPosition(this.layerBacks[this.layerCount].getPosition());

	this.appendChild(this.layerBacks[this.layerCount]);
	this.appendChild(this.layers[this.layerCount-1]);

	//Rerun setupEvents for the new layers
	this.setupEvents();
	
};

lu.Panel.prototype.setupEvents = function(){
	panel = this;
	for (i = 0; i<panel.layers.length; i++)
    {
        (function (i) {
            goog.events.listen(panel.layers[i], ['mousedown', 'touchstart'], function(e)
            	{
            		panel.layerClicked(this,e);
            	});
            //Setup up functionality for all blocks in all layers
            lu.Layer.luBlockEvents(panel.layers[i]);
            console.log('click');
        }) (i);
    }
};

lu.Panel.prototype.layerClicked = function(newLayer,e){
	if(newLayer.isActive_)
    {
        console.log('layer active');
    }
    else
    {
    	// debugger;
        console.log('layer inactive');
        //Remove mouse menu & other dialogs
		builder.mouseMenu.prototype.disappear();
		if(textQuery)
		textQuery.disappear();

        //Deal with old layer
        if(panel.activeLayer)
        {
        	//Remove dialogs
        	panel.activeLayer.query.disappear();
        	panel.activeLayer.props.disappear();

        	//Switch layers
	        panel.activeLayer.setActive(false);
	        panel.activeLayer.panelPosition(this.getPosition().x);
	        this.getParent().removeChild(panel.activeLayer);
	        panel.appendChild(panel.activeLayer);

	        //Fade out background icon
	        ID = panel.activeLayer.ID;
	        panel.layerBacks[ID].icon.runAction(new lime.animation.FadeTo(0).setDuration(0.3));
	    }

	    panel.promoteLayer(newLayer); 

        //Stop any other layer from activating
        if(e)
        e.event.stopPropagation();
    }
};

lu.Panel.prototype.promoteLayer = function(newLayer){
	//Promote selected layer
    newLayer.setActive(true);
    newLayer.activePosition(this.getPosition().x);
    panel.removeChild(newLayer);
    this.getParent().layerLayer.appendChild(newLayer);

    //Fade in background icon
    ID = newLayer.ID;
    panel.layerBacks[ID].icon.runAction(new lime.animation.FadeTo(1).setDuration(0.2));

    //Update the activeLayer
    this.activeLayer = newLayer;
    lu.EventLayer.setActiveLayer(newLayer);
};

lu.Panel.prototype.shiftRight = function(){
	//Make sure we're not moving off the screen
	if(this.getPosition().x < 0)
	this.runAction(new lime.animation.MoveTo(this.getPosition().x + 200,this.height).setDuration(0.1));
};

lu.Panel.prototype.shiftLeft = function(){
	//Make sure we're not moving off the screen
	if((this.layerBacks[this.layerCount].getPosition().x + this.getPosition().x) > (640 - 100)){
		this.runAction(new lime.animation.MoveTo(this.getPosition().x - 200,this.height).setDuration(0.1));
	}
};

















