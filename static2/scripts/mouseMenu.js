goog.provide('builder.mouseMenu');

goog.require('lime.Circle');
goog.require('lime.RoundedRect');
goog.require('lime.Label');
goog.require('lime.Polygon');
goog.require('lime.animation.ColorTo');
goog.require('lime.animation.MoveTo');
goog.require('lu.YellowDrop');
goog.require('lu.BlueLift');

MENU_SIZE = 0.02; //the size of the menu relative
MASK_SIZE = 0.8; // how big the mask is compared to the full circle
BUTTON_PRESS_FADE = 0.1;

greenNeutral = '#54A356';
yellowNeutral = '#D09029';
yellowPressed = '#5D3714';
blueNeutral = '#3679D0';
bluePressed = '#3C5E96';
redNeutral = '#B03028';
greenBPressed = new lime.fill.LinearGradient().setDirection(0, 0,1,1).addColorStop(0, greenNeutral)
	        .addColorStop(.45, greenNeutral).addColorStop(0.49, '#333').addColorStop(0.50, '#000');
greenTPressed = new lime.fill.LinearGradient().setDirection(0, 1, 1, 0).addColorStop(0, greenNeutral)
	        .addColorStop(.45, greenNeutral).addColorStop(0.49, '#333').addColorStop(0.50, '#000');
redTPressed = new lime.fill.LinearGradient().setDirection(1, 1, 0, 0).addColorStop(0, redNeutral)
	        .addColorStop(0.45, redNeutral).addColorStop(0.49, '#333').addColorStop(0.5, '#000');
redBPressed = new lime.fill.LinearGradient().setDirection(1, 0, 0, 1).addColorStop(0, redNeutral)
	        .addColorStop(.45, redNeutral).addColorStop(0.49, '#333').addColorStop(0.50, '#000');

builder.mouseMenu = function(w,h) {
	lime.Circle.call(this);
	this.setSize(w,h);
	this.setPosition(100,100);
	// this.setOpacity(0);
	//Calculate sector length
	maskShift = Math.sqrt((w/2)*(w/2) + (h/2)*(h/2));

	this.circ = new lime.Circle().setSize(w*MASK_SIZE,h*MASK_SIZE).setFill('#000'); //these are kept, difference with using var??

	this.greenTEvent = new lime.Polygon(0,0,-w/2,0,-w/2,-h/2);
	this.greenBEvent = new lime.Polygon(0,0,-w/2,h/2,-w/2,0);
	this.yellowEvent = new lime.Polygon(0,0,w/2,h/2,-w/2,h/2);
	this.blueEvent = new lime.Polygon(0,0,w/2,-h/2,-w/2,-h/2);
	this.redEventT = new lime.Polygon(0,0,w/2,-h/2, w/2,0);
	this.redEventB = new lime.Polygon(0,0,w/2, 0, w/2,h/2);

	this.green = new lime.Circle().setSize(w,h).setFill(greenNeutral);
	this.red = new lime.Circle().setSize(w,h).setFill(redNeutral);
	this.blue = new lime.Circle().setSize(w,h).setFill(blueNeutral);
	this.yellow = new lime.Circle().setSize(w,h).setFill(yellowNeutral);

	gmask = new lime.Sprite().setSize(w,h).setPosition(-maskShift,0).setRotation(45);
	this.green.setMask(gmask);

	rmask = new lime.Sprite().setSize(w,h).setPosition(maskShift,0).setRotation(45.01);
	this.red.setMask(rmask);

	bmask = new lime.Sprite().setSize(w,h).setPosition(0,-maskShift).setRotation(45);
	this.blue.setMask(bmask);

	ymask = new lime.Sprite().setSize(w,h).setPosition(0,maskShift).setRotation(45);
	this.yellow.setMask(ymask);

	/*Drop Down*/
	this.dropDown = new lu.YellowDrop(yellowNeutral).setSize(w,160).setAnchorPoint(0.5,0).setScale(1,0).setPosition(0,-10).setFill('#000').setStroke(5,'#D09029').setRadius(20);
	this.blueLift = new lu.BlueLift(blueNeutral).setSize(w,150);

	this.selectedPosition = {x: 0, y: 0};
	this.selectedScale = {x: 1, y: 1};

	this.active = false;
	// this.setScale(0);
	this.appendChild(this.dropDown);
	this.appendChild(this.blueLift);
	this.appendChild(bmask);
	this.appendChild(ymask);
	this.appendChild(gmask);
	this.appendChild(rmask);
	this.appendChild(this.green);

	this.appendChild(this.red);
	this.appendChild(this.blue);
	this.appendChild(this.yellow);
	this.appendChild(this.circ);
	this.appendChild(this.greenTEvent);
	this.appendChild(this.greenBEvent);
	this.appendChild(this.yellowEvent);
	this.appendChild(this.blueEvent);
	this.appendChild(this.redEventT);
	this.appendChild(this.redEventB);
	this.target = 0;

	this.setRenderer(lime.Renderer.DOM);
};
goog.inherits(builder.mouseMenu, lime.Circle);

builder.mouseMenu.prototype.setupEvents = function(){

	//CLOCKWISE
    goog.events.listen(mouseMenu.greenTEvent, ['mousedown', 'touchstart'], function(e) {
        console.log('green');
        mouseMenu.green.setFill(greenTPressed);
        mouseMenu.target.runAction(ani.rotateClockwise(mouseMenu.target));
        textQuery.disappear();
        e.event.stopPropagation();
        mouseMenu.checkTarget();
        
        e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
	        mouseMenu.green.setFill(greenNeutral);
	        e.event.stopPropagation();
	        mouseMenu.checkTarget();
    	});
    });

    //ANTICLOCKWISE
    goog.events.listen(mouseMenu.greenBEvent, ['mousedown', 'touchstart'], function(e) {
        console.log('green');
        mouseMenu.green.setFill(greenBPressed);
        if(mouseMenu.target)
        mouseMenu.target.runAction(ani.rotateAntiClockwise(mouseMenu.target));
        textQuery.disappear();
        mouseMenu.checkTarget();

        e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
	        mouseMenu.green.setFill(greenNeutral);
	        mouseMenu.checkTarget();
    	});
    	e.event.stopPropagation();
    });

    //EXPAND
    goog.events.listen(mouseMenu.redEventT, ['mousedown', 'touchstart'], function(e) {
        console.log('redt');
        mouseMenu.red.setFill(redTPressed);
        if(mouseMenu.target)
        mouseMenu.target.runAction(ani.expand(mouseMenu.target));
        textQuery.disappear();
        e.event.stopPropagation();
        mouseMenu.checkTarget();

        e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
	        mouseMenu.red.setFill(redNeutral);
	        if(mouseMenu.target)
	        mouseMenu.runAction(ani.resizeMenu(mouseMenu.target));
	        mouseMenu.checkTarget();
    	});
        e.event.stopPropagation();
    });

    //SHRINK
    goog.events.listen(mouseMenu.redEventB, ['mousedown', 'touchstart'], function(e) {
        console.log('redb');
        mouseMenu.red.setFill(redBPressed);
        mouseMenu.target.runAction(ani.shrink(mouseMenu.target));
        textQuery.disappear();
        mouseMenu.checkTarget();

        e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
	        mouseMenu.red.setFill(redNeutral);
	        if(mouseMenu.target)
	        mouseMenu.runAction(ani.resizeMenu(mouseMenu.target));
	        mouseMenu.checkTarget();
    	});
        e.event.stopPropagation();
    });

    goog.events.listen(mouseMenu.yellowEvent, ['mousedown', 'touchstart'], function(e) {
        console.log('yellow');
        mouseMenu.yellow.setFill(yellowPressed);
        textQuery.disappear();
        e.event.stopPropagation();
        this.getParent().dropDown.click();
        mouseMenu.checkTarget();

         e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
	        mouseMenu.yellow.setFill(yellowNeutral);
	        if(mouseMenu.target){
		        mouseMenu.runAction(ani.resizeMenu(mouseMenu.target));
		    }
	        mouseMenu.checkTarget();
    	});
    });

    goog.events.listen(mouseMenu.blueEvent, ['mousedown', 'touchstart'], function(e) {
        console.log('blue');
        mouseMenu.blue.setFill(bluePressed);
        textQuery.disappear();
        e.event.stopPropagation();
        this.getParent().blueLift.click();
        mouseMenu.checkTarget();

         e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
	        mouseMenu.blue.setFill(blueNeutral);
	        if(mouseMenu.target)
	        {
		        mouseMenu.runAction(ani.resizeMenu(mouseMenu.target));
		    }
	        mouseMenu.checkTarget();
    	});
    });
};


builder.mouseMenu.prototype.spawn = function(x, y, obj){
	
	if(mouseMenu.target != obj)
	{
		if(mouseMenu.active)
		{
			console.log('reappear');
			mouseMenu.blueLift.disappear();
			mouseMenu.dropDown.disappear();
			quickRAni = ani.quickReappear(x, y, obj);
			mouseMenu.runAction(quickRAni);
			goog.events.listen(quickRAni,"stop",function(){mouseMenu.checkTarget()}); 
			//Move back to position
        	uiLayer.selectedLayer.runAction(new lime.animation.Spawn(
			new lime.animation.MoveTo(0,0),
			new lime.animation.ScaleTo(1)).setDuration(0)
			);
		}
		else
		{
			quickAAni = ani.quickAppear(x, y, obj);
			mouseMenu.runAction(quickAAni);
			goog.events.listen(quickAAni,"stop",function(){mouseMenu.checkTarget()});
			console.log("setActive");
			mouseMenu.active = true;
		}

		//Reappend the target
		// debugger;
		if(mouseMenu.target)
		{
			console.log('reappend');
			uiLayer.selectedLayer.removeChild(mouseMenu.target);
			uiLayer.panel.layers[mouseMenu.target.parentLayerID].appendChild(mouseMenu.target);
			mouseMenu.target.selected = false;
		}

		mouseMenu.target = obj;
	}

};

builder.mouseMenu.prototype.disappear = function(){
	if(mouseMenu.active){
        mouseMenu.active = false;
        console.log("setInactive");

        //Remove all dialogs
        mouseMenu.runAction(ani.quickDisappear());
        mouseMenu.blueLift.disappear();
        textQuery.disappear();
        // mouseMenu.YellowDrop.disappear();

        //Move back to position
        uiLayer.selectedLayer.runAction(new lime.animation.Spawn(
			new lime.animation.MoveTo(0,0),
			new lime.animation.ScaleTo(1)).setDuration(0)
			);


        if(mouseMenu.dropDown.menuDown)
		{
			mouseMenu.dropDown.runAction(ani.mouseLiftUp());
            mouseMenu.dropDown.menuDown = false;
		}

		if(mouseMenu.target)
		{
			//If the menu has a target, reappend it to the panel layer
			console.log('reappend DISAPPEAR and put target to false');
			uiLayer.selectedLayer.removeChild(mouseMenu.target);
			uiLayer.panel.layers[mouseMenu.target.parentLayerID].appendChild(mouseMenu.target);
			uiLayer.panel.layers[mouseMenu.target.parentLayerID].reappendQuery();
			mouseMenu.target.selected = false;
		}
		mouseMenu.target = 0;
    }
    else
    {
    	//Make sure mouse is hidden if it is not active (in the event of an animation failure)
    	mouseMenu.setScale(0,0);
    }
};

//If mouseMenu has no targets 
builder.mouseMenu.prototype.checkTarget = function(){
	console.log('checking');
	if(!mouseMenu.target)
	{
		mouseMenu.disappear();
	}
};

builder.mouseMenu.prototype.resize = function(){
	mouseMenu.runAction(ani.resize(target.size_.width, target.size._height));
};

builder.mouseMenu.prototype.reset = function(){
	mouseMenu.runAction(ani.resize(1/mouseMenu.target.size_.w, 1/mouseMenu.target.size_.h));
};

builder.mouseMenu.prototype.updateText = function()
{
	this.target.setFontSize(this.blueLift.labels[0].getText());
	this.target.setFontFamily(this.blueLift.labels[1].getText());
	this.target.setFontColor(this.blueLift.labels[2].getText());
};

builder.mouseMenu.prototype.cloneTarget = function()
{
	this.target.clone();
};

builder.mouseMenu.prototype.deleteBlock = function()
{
	this.target.getParent().removeChild(this.target);
	this.target.isDeleted = true;
	this.target = 0;
};

builder.mouseMenu.prototype.focusBlue = function()
{
	var scalar = 1/(this.target.getScale().x);
	console.log('scale is now: ' + scalar);
	if(scalar > 1)
		scalar = 1;
	var offsetFactor = 1 - scalar;

	uiLayer.selectedLayer.runAction(new lime.animation.Spawn(
		new lime.animation.MoveTo(
			(-(this.target.getPosition().x - (builder.WIDTH/2))) + (builder.WIDTH/2)*offsetFactor*0.5,
			(-(this.target.getPosition().y - (builder.HEIGHT/2)) + 120) + (builder.HEIGHT/2)*offsetFactor*0.5),
		new lime.animation.ScaleTo(scalar))
			);
};

builder.mouseMenu.prototype.focusYellow = function()
{
	console.log('focusYellow');
	// this.selectedPosition.x = this.target.getPosition().x;
	// this.selectedPosition.x = this.target.getPosition().y;
	// this.selectedScale.x = this.target.getScale().x;
	// this.selectedScale.y = this.target.getScale().y;

	// uiLayer.selectedLayer.runAction(new lime.animation.Spawn(
	// 	new lime.animation.MoveTo(builder.WIDTH/2,builder.HEIGHT/2),
	// 	new lime.animation.ScaleTo(1))
	// );
	
	var scalar = 1/(this.target.getScale().x);
	if(scalar > 1)
		scalar = 1;

	var offsetFactor = 1 - scalar;

	// this.target.runAction(new lime.animation.ScaleTo(1));
	// this.runAction(new lime.animation.ScaleTo(5));
	x = (-(this.target.getPosition().x - (builder.WIDTH/2))) + (builder.WIDTH/2)*offsetFactor*0.5;
	y = (-(this.target.getPosition().y - (builder.HEIGHT/2)) -120) + (builder.HEIGHT/2)*offsetFactor*0.5;

	console.log('move to x: ' + x + ' y: ' + y);

	uiLayer.selectedLayer.runAction(new lime.animation.Spawn(
		new lime.animation.MoveTo(x,y),
		new lime.animation.ScaleTo(scalar))
			);

};

builder.mouseMenu.insertCharacter = function(value)
{
	if(!mouseMenu.target)
		return false;

	mouseMenu.target.setText(value);
	mouseMenu.target.setFontSize(80);
	mouseMenu.target.setPadding(15,0);
	return true;
};

builder.mouseMenu.changeBlockColour = function(colour)
{
	if(!mouseMenu.target)
		return false;

	mouseMenu.target.setFill(colour);
	return true;
};

builder.mouseMenu.changeFontColour = function(colour)
{
	if(!mouseMenu.target)
		return false;

	mouseMenu.target.setFontColor(colour);
	return true;
};

builder.mouseMenu.makeSubmit = function()
{
	if(!mouseMenu.target)
		return false;

	mouseMenu.target.setText('Submit');
	mouseMenu.target.setFontSize(25);
	mouseMenu.target.setPadding(35,0);
	mouseMenu.target.type = 'SUBMIT';
	return true;
};

