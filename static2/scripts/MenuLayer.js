goog.provide('lu.MenuLayer');

goog.require('lime.Sprite');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.ColorTo');
goog.require('lime.animation.FadeTo');
goog.require('util');
goog.require('lu.Clicker');
goog.require('lu.Stats');
goog.require('lu.Title');

var MENU_SPEED = 0.3;

lu.MenuLayer = function(game,x,y) {
	lime.Sprite.call(this);

	/*Background*/
	// var backGrad = new lime.fill.LinearGradient().
 //        setDirection(0,1,0,0). // 45' angle 
 //        addColorStop(0,98, 21, 31,1). // start from red color
 //        addColorStop(0.5,125.00, 31.00, 40.00,1).
 //        addColorStop(0.94,153, 40, 52,1).
 //        addColorStop(0.96,255, 255, 255,1);
 var backGrad = new lime.fill.LinearGradient().
        setDirection(0,1,0,0). // 45' angle 
        addColorStop(0,'#a90329'). // start from red color
        addColorStop(0.44,'#8f0222').
        addColorStop(1,'#6d0019');
var fadeGrad = new lime.fill.LinearGradient().
        setDirection(0,1,0,0). // 45' angle 
        addColorStop(0,'#6d0019'). // start from red color
        addColorStop(0.44,'#8f0222').
        addColorStop(1,'#a90329');

	this.back = new lime.Sprite().setSize(x,y-20).setFill('#a90329').setAnchorPoint(0,0);

    /*Handle*/
    this.handle = new lime.Sprite().setSize(builder.WIDTH, 20).setAnchorPoint(0,0).setFill('#6d0019').setPosition(0,builder.HEIGHT);
    this.fader = new lime.Sprite().setSize(builder.WIDTH, 20).setAnchorPoint(0,0).setFill(fadeGrad).setPosition(0,builder.HEIGHT-19);
    this.topFader = new lime.Sprite().setSize(builder.WIDTH, 50).setAnchorPoint(0,0).setFill(backGrad).setPosition(0,0);

    /*Save Button*/

    var saveButton = new lu.Clicker('Update Game').setPosition(50,420);
    goog.events.listen(saveButton, ['mousedown', 'touchstart'], function(e) {
    	this.click();
        console.log('click');
        e.event.stopPropagation();
        e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
        	builder.saveGame();
        	this.release();
	    });
    });

     var cloneButton = new lu.Clicker('Clone Game').setPosition(200,420);
    goog.events.listen(cloneButton, ['mousedown', 'touchstart'], function(e) {
        this.click();
        e.event.stopPropagation();
        e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
        	this.release();
	    });
    });

    /*Labels*/
    this.titleBox = new lime.RoundedRect().setSize(200,150).setPosition(50,80).setFill('#b7dad9').setRadius(30).setStroke(5,'#a4c4c3').setAnchorPoint(0,0);

    this.titleLabel = new lu.Title('title',30).setPosition(10,10);

    this.descBox = new lime.RoundedRect().setSize(270,150).setPosition(50,250).setFill('#b7dad9').setRadius(30).setStroke(5,'#a4c4c3').setAnchorPoint(0,0);

    this.descLabel = new lu.Title('description',30).setPosition(10,10);

    // this.statsLabel = new lu.Title('details',20).setPosition(350,80);

    this.statsBox = new lime.RoundedRect().setSize(270,323).setPosition(350,80).setFill('#b7dad9').setRadius(30).setStroke(5,'#a4c4c3').setAnchorPoint(0,0);

    this.statsLabel = new lu.Title('details',30).setPosition(10,10);


    /*Input Fields*/
    this.inputFields = new Array();
    this.inputFields[0] = new builder.Label(180,100).setAnchorPoint(0,0).setPosition(10,50).setFontFamily('Impact').
    setFontColor('#000').setFontSize(26).setFontWeight('bold').setText(game.title);
    this.inputFields[0].getDeepestDomElement().setAttribute('id','titleInput');
    this.inputFields[1] = new builder.Label(255,100).setAnchorPoint(0,0).setPosition(10,50).setFontFamily('Impact').
    setFontColor('#000').setFontSize(26).setFontWeight('bold').setText(game.description);
    this.inputFields[1].getDeepestDomElement().setAttribute('id','descriptionInput');

    /**/

    this.statsField = new lu.Stats().setPosition(350, 100);
    this.lastEditLabel = new builder.Label(180,100).setAnchorPoint(0,0).setPosition(10,50).setFontFamily('Impact').
    setFontColor('#000').setFontSize(26).setFontWeight('bold').setText('Lasted edited ' + game.lastEditDate);
    this.pubDateLabel = new builder.Label(180,100).setAnchorPoint(0,0).setPosition(10,200).setFontFamily('Impact').
    setFontColor('#000').setFontSize(26).setFontWeight('bold').setText('Game created ' + game.pubDate);


    /*THIS state*/
    this.setAnchorPoint(0,0).setSize(x,y);

    menu = this;
     for (i = 0; i<this.inputFields.length; i++)
    {
        (function (i) {
             if(menu.inputFields[i].inactive){ //this doesn't work
                goog.events.listen(menu.inputFields[i], ['mousedown', 'touchstart'], function(e) {
                // util.makeTextBox(menu.inputFields[i]);
                // menu.inputFields[i].inactive = false;
                textQuery.pop(menu.inputFields[i]);

                e.event.stopPropagation();
                console.log(i);
                });
            }
        }) (i);
    }

    /*this event listener*/
    goog.events.listen(this, ['mousedown', 'touchstart'], function(e) {
	    console.log('dropdown click');

	    e.event.stopPropagation();
    });

    /*State*/
    this.isDown = false;

    this.appendChild(this.back);
    // for (i = 0; i<this.inputFields.length; i++)
    // {
    //     this.appendChild(this.inputFields[i]);
    // }
    this.titleBox.appendChild(this.titleLabel);
    this.titleBox.appendChild(this.inputFields[0]);
    this.descBox.appendChild(this.descLabel);
    this.descBox.appendChild(this.inputFields[1]);
    this.statsBox.appendChild(this.statsLabel);
    this.statsBox.appendChild(this.lastEditLabel);
    this.statsBox.appendChild(this.pubDateLabel);

    this.appendChild(this.fader);
    this.appendChild(this.topFader);
    this.appendChild(this.titleBox);
    this.appendChild(this.descBox);
    // this.appendChild(this.statsLabel);
    this.appendChild(this.statsBox);
    this.appendChild(saveButton);
    this.appendChild(cloneButton);
    this.appendChild(this.handle);

    // this.appendChild(this.inputFields[0].back)
};
goog.inherits(lu.MenuLayer, lime.Sprite);

lu.MenuLayer.prototype.click = function(e)
{
    obj = this;
    console.log('dropdown pull click');
    if(obj.isDown)
    {
    	obj.runAction(new lime.animation.MoveTo(0,-builder.HEIGHT).setDuration(MENU_SPEED));
    	obj.isDown = false;
    }
    else
    {
    	obj.runAction(new lime.animation.MoveTo(0,-20).setDuration(MENU_SPEED));
    	obj.isDown = true;
    }
    e.event.stopPropagation();
};

lu.MenuLayer.prototype.newFunction = function(){
	console.log('new');
};

lu.MenuLayer.prototype.setupEvents = function(){
	parent = this;
	goog.events.listen(this.handle, ['mousedown', 'touchstart'], function(e){
        console.log('in the handles handler');
    	 this.getParent().click(e);}
		 );
};
