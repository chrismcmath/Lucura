goog.provide('lu.YellowDrop');

goog.require('lime.RoundedRect');
goog.require('lime.Label');
goog.require('lime.Sprite');
goog.require('lu.TriangleLeft');
goog.require('lime.Polygon');
goog.require('lu.NoLabel');
goog.require('lu.TextBox');

ITEM_NUMBER = 7;
YELLOW_BOX_COMP = '#386FC6';
YELLOW_BOX_FONT = 'Impact';
BUTTON_BACKGROUND = '#5D3714';

lu.YellowDrop = function(fill) {
	lime.RoundedRect.call(this);
    this.menuDown = false;

    this.labels = new Array();
    //Generic attributes
    for (j = 0; j<ITEM_NUMBER; j++)
    {
        if(j == 1)
            continue;
        if(j == 4)
        {
            this.labels[j] = new lu.TextBox().setSize(50,14)
            .setFontFamily(YELLOW_BOX_FONT).setFontColor('#fff')
            .setFill('#000').setStroke(1,fill).setPosition(0,70+(j*15));
            continue;
        }
        this.labels[j] = new lime.Label().setSize(50,14)
        .setFontFamily(YELLOW_BOX_FONT).setFontColor('#fff')
        .setFill('#000').setStroke(1,fill).setPosition(0,70+(j*15));
    };

    this.labels[1] = new lu.NoLabel().setSize(25,14).setFontFamily(YELLOW_BOX_FONT).setFontColor('#fff')
        .setFill('#000').setStroke(1,fill).setPosition(0,85);

    this.labels[0].setText('INSTANT').setFontSize(8).setPadding(2,0);
    this.labels[1].setFontSize(8).setPadding(1,0).setNumber(1);
    this.labels[2].setText('STILL').setFontSize(8).setPadding(2,0);
    this.labels[3].setText('CLONE').setFontSize(8).setPosition(0,130).setPadding(1,0).setFontFamily('lot').setFill(BUTTON_BACKGROUND).setFontColor('#D8D8BD');
    this.labels[4].setText('COLOR').setFontSize(10).setPosition(0,115).setFontFamily(YELLOW_BOX_FONT).setPadding(2,0);
    this.labels[5].setText('UPDATE').setFontSize(6).setSize(32,14).setPosition(-20,145).setPadding(3,0).setFontFamily('lot').setFill(BUTTON_BACKGROUND).setFontColor('#D8D8BD');;
    this.labels[6].setText('DELETE').setFontSize(6).setSize(32,14).setPosition(20,145).setPadding(3,0).setFontFamily('lot').setFill(BUTTON_BACKGROUND).setFontColor('#D8D8BD');;

    this.textBox = new lu.TextBox();

    this.lArrows = new Array();
    for (j = 0; j<3; j++)
    {
        this.lArrows[j] = new lime.Polygon(-7, -7, -7, 7, -14, 0).setPosition(-25, 70+(j*15)).setStroke(1,fill);
    };

    this.rArrows = new Array();
    for (j = 0; j<3; j++)
    {
        this.rArrows[j] = new lime.Polygon(7, 7, 7, -7, 14, 0).setPosition(25, 70+(j*15)).setStroke(1,fill);
    }


    /*Events*/
    this.setupNoArrowEvents();
    goog.events.listen(this, ['mousedown', 'touchstart'], function(e) {
            e.event.stopPropagation();
            console.log('stop prop');
            });
    goog.events.listen(this.labels[3], ['mousedown', 'touchstart'], function(e) {
            console.log('clone');
            mouseMenu.cloneTarget();
            mouseMenu.disappear();
            e.event.stopPropagation();
            });
    goog.events.listen(this.labels[4], ['mousedown', 'touchstart'], function(e) {
            textQuery.pop(this);;
            e.event.stopPropagation();
            });
    yB = this;
    goog.events.listen(this.labels[5], ['mousedown', 'touchstart'], function(e) {
            yB.updateTarget();
            e.event.stopPropagation();
            });
    goog.events.listen(this.labels[6], ['mousedown', 'touchstart'], function(e) {
            mouseMenu.deleteBlock();
            mouseMenu.disappear();
            e.event.stopPropagation();
    });


    for (j = 0; j<this.labels.length; j++)
    {
        this.appendChild(this.labels[j]);
    };
    //As every left arrow has a pair, we can  combine them
     for (j = 0; j<this.lArrows.length; j++)
    {
        this.appendChild(this.lArrows[j]);
        this.appendChild(this.rArrows[j]);
    };
};
goog.inherits(lu.YellowDrop, lime.RoundedRect);

lu.YellowDrop.prototype.setupNoArrowEvents = function(){
    yellowD = this;
    for (j = 0; j<this.lArrows.length; j++)
    {
        console.log('making events');
        (function (j,yellowD) {
            goog.events.listen(yellowD.lArrows[j], ['mousedown', 'touchstart'], function(e)
                {
                    this.runAction(new lime.animation.ColorTo(YELLOW_BOX_COMP ).setDuration(0.1));
                    e.event.stopPropagation();

                     e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
                        this.runAction(new lime.animation.ColorTo('#000').setDuration(0.1));
                        e.event.stopPropagation();
                        //Individual button action
                        yellowD.decrementLabel(j);
                    });
                });
            goog.events.listen(yellowD.rArrows[j], ['mousedown', 'touchstart'], function(e)
                {
                    this.runAction(new lime.animation.ColorTo(YELLOW_BOX_COMP ).setDuration(0.1));
                    e.event.stopPropagation();

                     e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
                        this.runAction(new lime.animation.ColorTo('#000').setDuration(0.1));
                        e.event.stopPropagation();
                        //Individual button action
                        yellowD.incrementLabel(j);
                    });
                });
        }) (j,yellowD);
    };
};

lu.YellowDrop.prototype.incrementLabel = function(j){
    console.log('inc label');
    switch(j){
        case 0:
            this.incType();
            break;
        case 1:
            this.labels[j].increment();
            break;
        case 2:
            this.incMovement();
            break;
    }
    this.updateTarget();
};

lu.YellowDrop.prototype.decrementLabel = function(j){
    console.log('dec label');
    switch(j){
        case 0:
            this.decType();
            break;
        case 1:
            this.labels[j].decrement();
            break;
        case 2:
            this.decMovement();
            break;
    }
    this.updateTarget();
};

lu.YellowDrop.prototype.incType = function(){
    console.log('incType');
    switch(this.labels[0].getText())
    {
        case 'ONCE':
            this.labels[0].setText('INSTANT');
            break;
        case 'INSTANT':
            this.labels[0].setText('SELECT');
            break;
        case 'SELECT':
            this.labels[0].setText('SUBMIT');
            break;
        case 'SUBMIT':
            this.labels[0].setText('TARGET');
            break;
        case 'TARGET':
            this.labels[0].setText('ONCE');
            break;
    }
    this.updateTarget();
};

lu.YellowDrop.prototype.decType = function(){
    console.log('incType');
    switch(this.labels[0].getText())
    {   
        case 'ONCE':
            this.labels[0].setText('TARGET');
            break;
        case 'INSTANT':
            this.labels[0].setText('ONCE');
            break;
        case 'SELECT':
            this.labels[0].setText('INSTANT');
            break;
        case 'SUBMIT':
            this.labels[0].setText('SELECT');
            break;
        case 'TARGET':
            this.labels[0].setText('SUBMIT');
            break;
    }
};

lu.YellowDrop.prototype.incMovement = function(){
    console.log('incMove');
    switch(this.labels[2].getText())
    {
        case 'STILL':
            this.labels[2].setText('FOLLOW');
            break;
        // case 'SLOW':
        //     this.labels[2].setText('MEDIUM');
        //     break;
        // case 'MEDIUM':
        //     this.labels[2].setText('FAST');
        //     break;
        // case 'FAST':
        //     this.labels[2].setText('DRAG');
        //     break;
        // case 'DRAG':
        //     this.labels[2].setText('FOLLOW');
        //     break;
        case 'FOLLOW':
            this.labels[2].setText('RIGID');
            break;
        case 'RIGID':
            this.labels[2].setText('STILL');
            break;
    }
};

lu.YellowDrop.prototype.decMovement = function(){
    console.log('incMove');
    switch(this.labels[2].getText())
    {
        case 'STILL':
            this.labels[2].setText('RIGID');
            break;
        // case 'SLOW':
        //     this.labels[2].setText('STILL');
        //     break;
        // case 'MEDIUM':
        //     this.labels[2].setText('SLOW');
        //     break;
        // case 'FAST':
        //     this.labels[2].setText('MEDIUM');
        //     break;
        // case 'DRAG':
        //     this.labels[2].setText('FAST');
        //     break;
        case 'FOLLOW':
            this.labels[2].setText('STILL');
            break;
        case 'RIGID':
            this.labels[2].setText('FOLLOW');
            break;
    }
};

lu.YellowDrop.prototype.click = function() {
    if(this.menuDown)
        {
            this.disappear();
        }
        else
        {
            this.runAction(ani.mouseDropDown());
            this.getParent().blueLift.disappear();
            this.loadTargetDetails();
            this.menuDown = true;
            mouseMenu.focusYellow();
        }
};

lu.YellowDrop.prototype.disappear = function() {
    if(this.menuDown)
    {
        this.runAction(ani.mouseLiftUp());
        this.menuDown = false; 
        uiLayer.selectedLayer.runAction(new lime.animation.Spawn(
        new lime.animation.MoveTo(0,0),
            new lime.animation.ScaleTo(1)).setDuration(0.2)
        );   
    }
    
};

lu.YellowDrop.prototype.updateTarget = function() {
    if(this.getParent().target)
    {
        this.getParent().target.type = this.labels[0].getText();
        this.getParent().target.points = this.labels[1].number;
        this.getParent().target.movement = this.labels[2].getText();
        this.getParent().target.setFill(this.labels[4].getText());
    }
};

lu.YellowDrop.prototype.loadTargetDetails = function() {
    this.labels[0].setText(this.getParent().target.type);
    this.labels[1].setNumber(this.getParent().target.points);
    this.labels[2].setText(this.getParent().target.movement);
    if(this.getParent().target)
    {
        if(this.getParent().target.getFill().str)
            this.labels[4].setText(this.getParent().target.getFill().str);
        else
            this.labels[4].setText(this.getParent().target.getFill().image_.src);
    }
};

