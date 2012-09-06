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
        .setFontFamily('impact').setFontColor('#eee').setFontSize(30)
        .setFill('#000').setStroke(1,'#62151F').setPosition(0,(j*50)-50);
    };

    this.labels[0].setText('ADD BLOCK');
    this.labels[1].setText('RULES');
    this.labels[2].setText('NEVERMIND');

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

			       		//Individual button action
			       		switch(j)
			       		{
			       			case 0:
			       			//Layer adds a block
			       			lQ.getParent().addBlock(lQ.getPosition().x - LAYER_QUERY_WIDTH/2, lQ.getPosition().y)
			       			break;
			       			case 1:
			       			//Access the rules
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
	if(this.active)
	{
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












