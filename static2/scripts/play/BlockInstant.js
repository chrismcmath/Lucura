goog.provide('cu.BlockInstant');

goog.require('cu.Label');
goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.CircleShape');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');

goog.require('box2d.World');


cu.BlockInstant = function(ID,world, type, nodeData, isTarget, movement,points) {
	lime.Label.call(this);
	this.ID = ID;
    this.type = 'block';
    this.nodeData = nodeData;
    this.isTarget = isTarget;
    this.movement = movement;
    this.points = points;

    //Test area
    // var ground = new box2d.PolyDef;
    // ground.restitution = .9;
    // ground.density = 1; // 0 for no movement!
    // ground.friction = 1;
    // ground.SetVertices([[-30,-5],[30,-10],[30,10],[-30,10]]);

    // var gbodyDef = new box2d.BodyDef;
    // gbodyDef.position.Set(220, 300);
    // gbodyDef.AddShape(ground);

    // var ground_body = world.CreateBody(gbodyDef);

    // lime.scheduleManager.schedule(function(dt) {
    //     world.Step(dt / 1000, 3);
    //     var pos = ground_body.GetCenterPosition().clone();
    //     this.setPosition(pos);
    // },this);

    this.setupBlockEvents();

};
goog.inherits(cu.Block, lime.Label);

cu.Block.prototype.setupBlockEvents = function(e){
    goog.events.listen(this, ['mousedown', 'touchstart'], function(e) {
        console.log('block click');

        if(this.type == 'SELECT')

        e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
            console.log('block release');

            if(this.movement == "DRAG")
            {
                e.swallow(['touchmove', 'mousemove'], function(e) {
                //DRAG BLOCK : rotate back to normal first
                tempRotate = this.getRotation();
                this.setRotation(0);
                this.setPosition(util.moveObjectByScreenCoords(e,this));
                this.setRotation(tempRotate);
                builder.mouseMenu.prototype.disappear();
                textQuery.disappear();
                util.updateMouseScreenCoords(e);
                return;
            }

            this.getParent().checkGoals();
        });
    });
};






















