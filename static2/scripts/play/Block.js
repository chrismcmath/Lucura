goog.provide('cu.Block');

goog.require('util');
goog.require('lime.Label');
goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.CircleShape');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');

goog.require('box2d.World');


cu.Block = function(ID,world, type, nodeData, movement,points,position,size,scale) {
	lime.Label.call(this);
	this.ID = ID;
    this.type = type;
    this.nodeData = nodeData;
    this.movement = movement;
    this.points = points;
    this.isSelected = false;
    this.setPosition(position.x, position.y).setSize(size.width,size.height).setScale(scale.x,scale.y).setAnchorPoint(0.5,0.5);
    this.world = world;

    var leftX = -((size.width/2)*scale.x);
    var rightX = ((size.width/2)*scale.x);
    var topY = -((size.height/2)*scale.y);
    var botY = ((size.height/2)*scale.y);

    if(this.movement == "RIGID")
    {
        var ground = new box2d.PolyDef;
        ground.restitution = .9;
        ground.density = 1; // 0 for no movement!
        ground.friction = 1;
        ground.SetVertices([[leftX,topY],[rightX,topY],[rightX,botY],[leftX,botY]]);

        var gbodyDef = new box2d.BodyDef;
        gbodyDef.position.Set(position.x, position.y);
        gbodyDef.AddShape(ground);

        this.ground_body = world.CreateBody(gbodyDef);
    }

    this.setupBlockEvents();

};
goog.inherits(cu.Block, lime.Label);

cu.Block.prototype.setupBlockEvents = function(e){
    if(this.type == 'TARGET')
        return;
    goog.events.listen(this, ['mousedown', 'touchstart'], function(e) {
        console.log('block click');

        switch(this.type)
        {
            case 'INSTANT':
                statLayer.pointsPanel.addRoundPoints(this.points);
                break;
            case 'ONCE':
                statLayer.pointsPanel.addRoundPoints(this.points);
                this.getParent().checkGoals();
                this.getParent().removeChild(this);
                break;
            case 'SELECT':
                if(this.isSelected)
                {
                    this.isSelected = !this.isSelected;
                    this.setStroke(null); 
                    this.getParent().subSubmitPoints(this.points);
                }
                else
                {
                    this.isSelected = !this.isSelected;
                    this.setStroke(5,'#0f3');
                    this.getParent().addSubmitPoints(this.points);
                }
                break;
            case 'SUBMIT':
                this.getParent().submitPressed();
                break;             
        }
        this.getParent().checkGoals();
        e.event.stopPropagation();

        if(this.movement == "DRAG")
        {
            e.swallow(['touchmove', 'mousemove'], function(e) {
                //SERIOUS PROBLEMS WITH DRAGGING FUNCTIONALITY
                // console.log('dragging');
                // //DRAG BLOCK : rotate back to normal first
                // tempRotate = this.getRotation();
                // this.setRotation(0);
                // this.setPosition(util.moveObjectByScreenCoordsPlay(e,this));
                // this.setRotation(tempRotate);
                // util.updateMouseScreenCoords(e);
                // e.event.stopPropagation();
                // return;
            })
        }

        e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
            console.log('block release');
            e.event.stopPropagation();
        });
    });
};






















