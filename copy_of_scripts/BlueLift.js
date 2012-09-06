goog.provide('lu.BlueLift');

goog.require('lime.RoundedRect');
goog.require('lime.Label');
goog.require('lime.Sprite');
goog.require('lu.TriangleLeft');
goog.require('lu.TextBox');
goog.require('lime.Polygon');

BLUE_BOX_FONT = 'Impact';
BLUE_BUTTON_BACKGROUND = '#3C5E96';

lu.BlueLift = function(fill) {
	lime.RoundedRect.call(this);
    this.setAnchorPoint(0.5,1).setScale(1,0).setPosition(0,-10).setFill('#000').setStroke(5,fill).setRadius(20);
    this.menuUp = false;

    this.labels = new Array();
    //Generic attributes
    this.labels[0] = new lu.NoLabel().setSize(25,17)
        .setFontFamily(BLUE_BOX_FONT).setFontColor('#fff')
        .setFill('#000').setStroke(1,fill).setPosition(0,-130);
    this.labels[1] = new lu.TextBox().setSize(50,17)
        .setFontFamily(BLUE_BOX_FONT).setFontColor('#fff').setPadding(2,0)
        .setFill('#000').setStroke(1,fill).setPosition(0,-110);
    this.labels[2] = new lu.TextBox().setSize(50,17)
        .setFontFamily(BLUE_BOX_FONT).setFontColor('#fff')
        .setFill('#000').setStroke(1,fill).setPosition(0,-90);
    this.labels[3] = new lime.Label().setSize(50,17)
        .setFontFamily(BLUE_BOX_FONT).setFontColor('#BDD8D8')
        .setFill(BLUE_BUTTON_BACKGROUND).setStroke(1,fill).setPosition(0,-70);

    this.labels[0].setNumber(10);
    this.labels[1].setText('font').setFontSize(7);
    this.labels[2].setText('COLOR').setFontSize(7).setPadding(2,0);
    this.labels[3].setText('UPDATE').setFontSize(9).setPadding(1,0);

    this.lArrow = new lime.Polygon(-7, -7, -7, 7, -14, 0).setPosition(-25, -130).setStroke(1,fill);
    this.rArrow = new lime.Polygon(7, 7, 7, -7, 14, 0).setPosition(25, -130).setStroke(1,fill);

    this.blackHider = new lime.Sprite().setFill('#000').setAnchorPoint(0,0.5).setSize(20,50).setPosition(26,-95);

    /*events*/
    bL = this;

    goog.events.listen(this.labels[0], ['mousedown', 'touchstart'], function(e) {
        textQuery.pop(this);
        e.event.stopPropagation();
    });

    goog.events.listen(this.labels[1], ['mousedown', 'touchstart'], function(e) {
        textQuery.pop(this);
        e.event.stopPropagation();
    });

    goog.events.listen(this.labels[2], ['mousedown', 'touchstart'], function(e) {
        textQuery.pop(this);
        e.event.stopPropagation();
    });
    goog.events.listen(this.labels[3], ['mousedown', 'touchstart'], function(e) {
        bL.getParent().updateText();
        e.event.stopPropagation();
    });

    goog.events.listen(this.lArrow, ['mousedown', 'touchstart'], function(e)
    {
        this.runAction(new lime.animation.ColorTo(PROP_COMPLEMENT).setDuration(0.1));
        e.event.stopPropagation();

         e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
            this.runAction(new lime.animation.ColorTo('#000').setDuration(0.1));
            e.event.stopPropagation();
            //Individual button action
            bL.labels[0].decrement();
            bL.getParent().updateText();
        });
    });

    goog.events.listen(this.rArrow, ['mousedown', 'touchstart'], function(e)
    {
        this.runAction(new lime.animation.ColorTo(PROP_COMPLEMENT).setDuration(0.1));
        e.event.stopPropagation();

         e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
            this.runAction(new lime.animation.ColorTo('#000').setDuration(0.1));
            e.event.stopPropagation();
            //Individual button action
            bL.labels[0].increment();
            bL.getParent().updateText();
        });
    });

    for (j = 0; j<this.labels.length; j++)
    {
        this.appendChild(this.labels[j]);
    };
    this.appendChild(this.lArrow);
    this.appendChild(this.rArrow);
    this.appendChild(this.blackHider);
};
goog.inherits(lu.BlueLift, lime.RoundedRect);

lu.BlueLift.prototype.click = function() {
    if(!this.menuUp)
        {
            this.runAction(ani.blueUp());
            this.loadTargetDetails();
            this.menuUp = true;

            if(mouseMenu.dropDown.menuDown)
            {
                this.getParent().dropDown.disappear();
                lime.scheduleManager.scheduleWithDelay(mouseMenu.focusBlue, mouseMenu, 200, 1);
            }
            else
            {
                mouseMenu.focusBlue();
            }
        }
        else
        {
            this.disappear();  
        }
};

lu.BlueLift.prototype.disappear = function() {
    if(this.menuUp)
    {
        this.runAction(ani.blueDown());
        this.menuUp = false;
        uiLayer.selectedLayer.runAction(new lime.animation.Spawn(
        new lime.animation.MoveTo(0,0),
            new lime.animation.ScaleTo(1)).setDuration(0.2)
        );      
    }
};

lu.BlueLift.prototype.loadTargetDetails = function() {
    this.labels[0].setNumber(this.getParent().target.getFontSize());
    this.labels[1].setText(this.getParent().target.getFontFamily());
    this.labels[2].setText(this.getParent().target.getFontColor());
};



