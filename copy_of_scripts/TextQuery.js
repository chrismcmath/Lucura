goog.provide('lu.TextQuery');

goog.require('lime.RoundedRect');
goog.require('lime.animation.ColorTo')
goog.require('lime.animation.ScaleTo')

BUTTON_NUMBER = 3;
TEXT_QUERY_COLOUR = '#62151F';
TEXT_COMPLEMENT = '#9DEAE0';
TEXT_QUERY_WIDTH = 250;

lu.TextQuery = function(target) {
    lime.RoundedRect.call(this);
    this.setFill('#000').setStroke(5,'#62151F').setRadius(20).setSize(TEXT_QUERY_WIDTH,200).setPosition(200,150).setScale(0,1);

    this.active = false;
    this.labels = new Array();

    for (j = 0; j<BUTTON_NUMBER; j++)
    {
        this.labels[j] = new lime.Label().setSize(250,30)
        .setFontFamily('impact').setFontColor('#eee').setFontSize(30)
        .setFill('#000').setStroke(1,'#62151F').setPosition(0,(j*50)-50);
    };

    this.labels[0].setText('EDIT TEXT');
    this.labels[1].setText('REPLACE TEXT');
    this.labels[2].setText('NEVERMIND');

    tQ = this;
    for (j = 0; j<this.labels.length; j++)
    {
        (function (j) {
            goog.events.listen(tQ.labels[j], ['mousedown', 'touchstart'], function(e)
            	{
            		this.runAction(new lime.animation.ColorTo(TEXT_COMPLEMENT).setDuration(0.1));
            		this.setFontColor(TEXT_QUERY_COLOUR);
            		e.event.stopPropagation();

            		 e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
			        	this.runAction(new lime.animation.ColorTo('#000').setDuration(0.1));
			        	this.setFontColor('#fff');
			        	e.event.stopPropagation();

			       		//Individual button action
			       		switch(j)
			       		{
			       			case 0:
			       			//Edit
			       			jQuery('#inputCell').val(tQ.target.getText());
			       			break;
			       			case 1:
			       			//Replace from the input box
			       			tQ.target.setText(jQuery('#inputCell').val());
			       			//Update the layer if possible
			       			if(uiLayer.panel.activeLayer.props.active)
			       				uiLayer.panel.activeLayer.props.updateLayer();
			       			if(mouseMenu.blueLift.menuUp){
				       			mouseMenu.blueLift.labels[0].updateNumber();
				       			mouseMenu.updateText();
				       		}
			       			break;
			       		}
			       		tQ.disappear();
			       		tQ.active = false;
				    });
            	});
        }) (j);
    };

    for (j = 0; j<BUTTON_NUMBER; j++)
    {
        this.appendChild(this.labels[j]);
    };
};
goog.inherits(lu.TextQuery, lime.RoundedRect);


lu.TextQuery.prototype.disappear = function()
{
	// console.log('TEXT QUERY DISAPPEARING SLOWLY');
	// this.runAction(new ani.textOut(this.getPosition().x,this.getPosition().y));
	// this.active = false;

	this.quickDisappear();
};

lu.TextQuery.prototype.quickDisappear = function()
{
	this.setScale(0,1);
	this.setPosition(this.getPosition().x-(TEXT_QUERY_WIDTH/2),this.getPosition().y);
	this.active = false;
};

lu.TextQuery.prototype.pop = function(tgt)
{
	targetX = tgt.getPosition().x + tgt.getSize().width;
	targetY = tgt.getPosition().y + tgt.getSize().height + tgt.getParent().getPosition().y;

	targetX = (targetX > 400) ? 400 : targetX;
	targetY = (targetY > 350) ? 350 : targetY;
	targetX = (targetX < 0) ? 0 : targetX;
	targetY = (targetY < 0) ? 100 : targetY;

	if(this.active)
	{
		// this.runAction(new ani.textOutIn(
		// 	this.target.getPosition().x+this.target.getSize().width,
		// 	this.target.getPosition().y+this.target.getSize().height,
		// 	tgt.getPosition().x + tgt.getSize().width,
		// 	tgt.getPosition().y + tgt.getSize().height));
		this.runAction(new ani.textSpinTo(targetX,targetY));
	}
	else
	{
		this.setPosition(targetX,targetY);
		this.runAction(new ani.textIn(targetX, targetY));
		this.active = true;
	}
	this.target = tgt;
};

lu.TextQuery.prototype.popNumber = function(tgt)
{

}











