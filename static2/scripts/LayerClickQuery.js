goog.provide('lu.LayerClickQuery');

goog.require('lime.RoundedRect');
goog.require('lime.animation.ColorTo')
goog.require('lime.animation.ScaleTo')

BUTTON_NUMBER = 3;
LAYER_QUERY_COLOUR = '#62151F';
LAYER_COMPLEMENT = '#9DEAE0';
LAYER_QUERY_WIDTH = 250;

lu.LayerClickQuery = function() {
    lime.RoundedRect.call(this);
    this.setFill('#000').setStroke(5,'#62151F').setRadius(20).setSize(LAYER_QUERY_WIDTH,200).setPosition(200,150).setScale(0,1);

    this.active = false;
    this.labels = new Array();

    for (j = 0; j<BUTTON_NUMBER; j++)
    {
        this.labels[j] = new lime.Label().setSize(250,30)
        .setFontFamily('LOT').setFontColor('#fff').setFontSize(30)
        .setFill('#000').setStroke(1,'#62151F').setPosition(0,(j*50)-50);
    };

    this.labels[0].setText('add block');
    this.labels[1].setText('rules');
    this.labels[2].setText('nevermind');

    lQ = this;
    for (j = 0; j<this.labels.length; j++)
    {
        (function (j, lQ) {
            goog.events.listen(lQ.labels[j], ['mousedown', 'touchstart'], function(e)
            	{
            		this.runAction(new lime.animation.ColorTo(LAYER_COMPLEMENT).setDuration(0.1));
            		this.setFontColor(LAYER_QUERY_COLOUR);
            		e.event.stopPropagation();

            		 e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
			        	this.runAction(new lime.animation.ColorTo('#000').setDuration(0.1));
			        	this.setFontColor('#fff');
			        	e.event.stopPropagation();
			        	// debugger;
			       		//Individual button action
			       		switch(j)
			       		{
			       			case 0:
			       			console.log('layer ' + lQ.getParent().ID + ' adding block');
			       			lQ.getParent().addBlock(lQ.getPosition().x - LAYER_QUERY_WIDTH/2, lQ.getPosition().y)
			       			break;
			       			case 1:
			       			console.log('rules');
			       			lQ.getParent().props.pop();
			       			break;
			       		}
			       		lQ.disappear();
			       		lQ.active = false;
				    });
            	});
        }) (j,lQ);
    };

    for (j = 0; j<BUTTON_NUMBER; j++)
    {
        this.appendChild(this.labels[j]);
    };
};
goog.inherits(lu.LayerClickQuery, lime.RoundedRect);


lu.LayerClickQuery.prototype.disappear = function()
{
	if(this.active)
	{
		this.runAction(new ani.layerTextOut(this.getPosition().x,this.getPosition().y));
		this.active = false;
	};
};

lu.LayerClickQuery.prototype.pop = function(x,y)
{	
	console.log('x: ' + x + ' y: ' + y);
	if(this.active)
	{
		// this.runAction(new ani.textOutIn(
		// 	this.target.getPosition().x+this.target.getSize().width,
		// 	this.target.getPosition().y+this.target.getSize().height,
		// 	tgt.getPosition().x + tgt.getSize().width,
		// 	tgt.getPosition().y + tgt.getSize().height));
		// this.setPosition(x+LAYER_QUERY_WIDTH/2,y);
		this.runAction(new ani.layerTextSpinTo(x+LAYER_QUERY_WIDTH/2,y));
	}
	else
	{
		this.setPosition(x,y);
		this.runAction(new ani.textIn(x,y));
		this.active = true;
	}
	//Bring to front of layer
	this.getParent().reappendQuery();
};












