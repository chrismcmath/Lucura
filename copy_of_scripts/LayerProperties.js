goog.provide('lu.LayerProperties');

goog.require('lime.RoundedRect');
goog.require('lime.animation.ScaleTo');
goog.require('lu.MultiLabel');
goog.require('lu.NoLabel');

PROP_QUERY_COLOUR = '#62151F';
PROP_COMPLEMENT = '#9DEAE0';
PROP_QUERY_WIDTH = 250;
PROP_QUERY_FONT = 'Impact';

lu.LayerProperties = function() {
    lime.RoundedRect.call(this);
    this.setFill('#fff').setStroke(5,'#62151F').setRadius(20).setPosition(builder.WIDTH/2, builder.HEIGHT/2 - 25)
    .setSize(builder.WIDTH, builder.HEIGHT-100).setAnchorPoint(0.5,0.5).setScale(0,0);

    this.active = false;

    /*Title*/
    this.title = new lime.Label('level properties',20).setSize(builder.HEIGHT-100,40).setRotation(90)
        .setFontFamily('LOT').setFontColor('#000').setFontSize(50).setPosition(-280,0);


    var pos1 = -60;
    var pos2 = 60;
    var pos3 = 220;

    /*Descriptive labels*/
    this.labels = new Array();
    for (j = 0; j<6; j++)
    {
        this.labels[j] = new lime.Label().setSize(200,50)
        .setFontFamily('LOT').setFontColor('#000').setFontSize(20).setPadding(0,0,0,0)
        .setPosition(0,(j*70)-150);
    };

    this.labels[0].setText('Goal');
    this.labels[1].setText('Time Limit').setPosition(pos3,this.labels[1].getPosition().y);
    this.labels[2].setText('Instruction').setPosition(0,this.labels[2].getPosition().y);;
    this.labels[3].setText('Background').setPosition(0,this.labels[3].getPosition().y);;
    this.labels[4].setText('x-Gravity-y').setPosition(0,this.labels[1].getPosition().y);
    this.labels[5].setText('Target').setPosition(pos3, -150);

    /*Changeable numbers*/
    this.noLabels = new Array();
    for (j = 0; j<4; j++)
    {
        this.noLabels[j] = new lu.NoLabel().setSize(50,30)
        .setFontFamily(PROP_QUERY_FONT).setFontColor('#000').setFontSize(20)
        .setFill('#fff').setStroke(5,'#62151F').setPosition(220,(j*70)-135);
    };

    this.loadBackButton = new lime.Label().setSize(100,30)
        .setFontFamily('LOT').setFontColor('#000').setFontSize(30)
        .setFill('#fff').setStroke(5,'#62151F')
        .setText('Load').setPosition(220,75);

    /*multilabels*/
    this.goalDescription = new Array(
    	'Number of points earned has reached...',
    	'Submit button pressed, and points at least...',
    	'Number of answers selected has reached...');

        this.goalBox = new lu.MultiLabel().setSize(300,40).setPadding(10)
        .setFontFamily(PROP_QUERY_FONT).setFontColor('#555').setFontSize(14)
        .setFill('#fff').setStroke(5,'#62151F').setPosition(0,-135);

    /*Background*/

    this.instructionBox = new lime.Label('click to edit instruction',20).setSize(300,40).setPadding(1)
        .setFontFamily('miso-bold').setFontColor('#000').setFontSize(13)
        .setFill('#fff').setStroke(5,'#62151F').setPosition(0,5);

    this.backField = new lu.TextBox().setSize(300,40).setPadding(6)
        .setFontFamily(PROP_QUERY_FONT).setFontColor('#000').setFontSize(12)
        .setFill('#fff').setStroke(5,'#62151F').setPosition(0,75);
    this.backField.makeLarger();
    // this.whiteCover = new lime.Sprite().setFill('#fff').setAnchorPoint(0,0.5).setSize(167,40).setPosition(150,50);

    this.closeButton = new lime.Label('close',20).setSize(420,40)
        .setFontFamily('LOT').setFontColor('#a90329').setFontSize(35)
        .setFill('#6d0019').setStroke(5,'#62151F').setPosition(pos2,145);

        /*Arrows for centre fields */
    this.lArrow = new lime.Polygon(-14, -14, -14, 14, -30, 0).setPosition(-140, -135).setStroke(1,PROP_QUERY_COLOUR);
    
    this.rArrow = new lime.Polygon(14, 14, 14, -14, 30, 0).setPosition(140, -135).setStroke(1,PROP_QUERY_COLOUR);
    
    /*Arrows for number fields*/
    this.nLArrows = new Array();
    this.nRArrows = new Array();
    for (j = 0; j<4; j++)
    {
        this.nLArrows[j] = new lime.Polygon(-14, -14, -14, 14, -30, 0).setPosition(205, -135+(j*70)).setStroke(1,PROP_QUERY_COLOUR);
    };

    this.nRArrows = new Array();
    for (j = 0; j<4; j++)
    {
        this.nRArrows[j] = new lime.Polygon(14, 14, 14, -14, 30, 0).setPosition(235, -135+(j*70)).setStroke(1,PROP_QUERY_COLOUR);
    };

    

    this.nLArrows[2].setPosition(pos1-15,-65);
    this.nRArrows[2].setPosition(pos1+15,-65);
    this.nLArrows[3].setPosition(pos2-15,-65);
    this.nRArrows[3].setPosition(pos2+15,-65);
    this.nLArrows[1].setPosition(pos3-15,-65);
    this.nRArrows[1].setPosition(pos3+15,-65);
    this.noLabels[2].setPosition(pos1, -65);
    this.noLabels[3].setPosition(pos2, -65);
    this.noLabels[1].setPosition(pos3, -65);


    /*Events*/
    // this.setupMultiLabelEvents();
    this.setupNoArrowEvents();
    goog.events.listen(this, ['mousedown', 'touchstart'], function(e) {
        e.event.stopPropagation();
    });
    goog.events.listen(this.backField, ['mousedown', 'touchstart'], function(e) {
	    textQuery.pop(this);
	    e.event.stopPropagation();
    });
    goog.events.listen(this.instructionBox, ['mousedown', 'touchstart'], function(e) {
        textQuery.pop(this);
        e.event.stopPropagation();
    });
    goog.events.listen(this.closeButton, ['mousedown', 'touchstart'], function(e) {
	    this.getParent().disappear();
   		// this.setFontColor(PROP_QUERY_COLOUR);
	    e.event.stopPropagation();

		e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
			// this.setFontColor('#000');
			e.event.stopPropagation();
		});
    });
    goog.events.listen(this.loadBackButton, ['mousedown', 'touchstart'], function(e) {
	    this.getParent().updateLayer();
	    e.event.stopPropagation();
    });

    /*Appends*/
    this.appendChild(this.title);
    for (j = 0; j<this.labels.length; j++)
    {
        this.appendChild(this.labels[j]);
    };
    this.appendChild(this.goalBox);
    this.appendChild(this.backField);
    // this.appendChild(this.whiteCover);
    this.appendChild(this.instructionBox);
    this.appendChild(this.closeButton);
     for (j = 0; j<this.noLabels.length; j++)
    {
        this.appendChild(this.noLabels[j]);
    };
    // this.appendChild(this.loadBackButton);
    

    this.appendChild(this.lArrow);
    this.appendChild(this.rArrow);

    for (j = 0; j<this.nLArrows.length; j++)
    {
        this.appendChild(this.nLArrows[j]);
        this.appendChild(this.nRArrows[j]);
    };

    //Beginning text
    this.goalBox.updateText();
    // this.multiLabels[2].setText('#fff');
    // this.multiLabels[3].setText('Close');
};
goog.inherits(lu.LayerProperties, lime.RoundedRect);


lu.LayerProperties.prototype.disappear = function()
{
	if(this.active)
	{
		this.runAction(new lime.animation.ScaleTo(0,0).setDuration(0.1));
        this.updateLayer();
		this.active = false;
	}
};

lu.LayerProperties.prototype.pop = function()
{
	if(this.active)
	{
		this.runAction(new ani.layerTextSpinTo(x+PROP_QUERY_WIDTH/2,y));
	}
	else
	{
		this.active = true;
        this.loadLayerProperties();
		this.runAction(new lime.animation.ScaleTo(1,1).setDuration(0.1));
	}
	this.getParent().reappendProps();
	this.active = true;
};

lu.LayerProperties.prototype.setupNoArrowEvents = function(){
    propDialog = this;
    for (j = 0; j<this.nLArrows.length; j++)
    {
    	//setup events
        (function (j,propDialog) {
            goog.events.listen(propDialog.nLArrows[j], ['mousedown', 'touchstart'], function(e)
            	{
            		this.runAction(new lime.animation.ColorTo(PROP_COMPLEMENT).setDuration(0.1));
            		e.event.stopPropagation();

            		 e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
			        	this.runAction(new lime.animation.ColorTo('#fff').setDuration(0.1));
			        	e.event.stopPropagation();
			       		//Individual button action
			       		propDialog.noLabels[j].decrement();
				    });
            	});
            goog.events.listen(propDialog.nRArrows[j], ['mousedown', 'touchstart'], function(e)
            	{
            		this.runAction(new lime.animation.ColorTo(PROP_COMPLEMENT).setDuration(0.1));
            		e.event.stopPropagation();

            		 e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
			        	this.runAction(new lime.animation.ColorTo('#fff').setDuration(0.1));
			        	e.event.stopPropagation();
			       		//Individual button action
			       		propDialog.noLabels[j].increment();
				    });
            	});
            goog.events.listen(propDialog.lArrow, ['mousedown', 'touchstart'], function(e)
                {
                    this.runAction(new lime.animation.ColorTo(PROP_COMPLEMENT).setDuration(0.1));
                    e.event.stopPropagation();

                     e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
                        this.runAction(new lime.animation.ColorTo('#fff').setDuration(0.1));
                        e.event.stopPropagation();
                        //Individual button action
                        switch(j)
                        {
                            case 0:
                            //Cycle through text
                            propDialog.goalBox.antiCycleText();
                            break;
                            case 1:
                            //Rule set
                            break;
                        }
                    });
                });
            goog.events.listen(propDialog.rArrow, ['mousedown', 'touchstart'], function(e)
                {
                    this.runAction(new lime.animation.ColorTo(PROP_COMPLEMENT).setDuration(0.1));
                    e.event.stopPropagation();

                     e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
                        this.runAction(new lime.animation.ColorTo('#fff').setDuration(0.1));
                        e.event.stopPropagation();
                        //Individual button action
                        switch(j)
                        {
                            case 0:
                            //Cycle through text
                            propDialog.goalBox.cycleText();
                            break;
                            case 1:
                            //Rules set
                            break;
                        }
                    });
                });
        }) (j,propDialog);
    };
};

lu.LayerProperties.prototype.loadLayerProperties = function()
{

    this.goalBox.choice = this.getParent().goal;
    this.goalBox.updateText();
    this.noLabels[0].setNumber(this.getParent().pointTarget);
    this.noLabels[1].setNumber(this.getParent().timeLimit);
    this.noLabels[2].setNumber(this.getParent().gravX);
    this.noLabels[3].setNumber(this.getParent().gravY);
    this.instructionBox.setText(this.getParent().instruction);
    if(this.getParent().getFill())
    {
        if(this.getParent().getFill().image_)
            this.backField.setText(this.getParent().getFill().image_.src);
        else
            this.backField.setText(this.getParent().getFill().str);
    }
    else
        this.backField.setText('click to enter fill');
};

lu.LayerProperties.prototype.updateLayer = function()
{
    this.getParent().setFill(this.backField.getText());
    this.getParent().instruction = this.instructionBox.getText();
    this.getParent().pointTarget = this.noLabels[0].getNumber();
    this.getParent().timeLimit = this.noLabels[1].getNumber();
    this.getParent().gravX = this.noLabels[2].getNumber();
    this.getParent().gravY = this.noLabels[3].getNumber();
    this.getParent().goal = this.goalBox.choice;
};





