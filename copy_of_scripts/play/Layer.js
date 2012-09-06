goog.provide('cu.Layer');

goog.require('lime.Sprite');
goog.require('cu.Block');
goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.CircleShape');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');
goog.require('lime.audio.Audio'); 

goog.require('box2d.World');

cu.Layer = function(ID, background,goal,instruction,target,timeLimit,xg,yg) {
	lime.Sprite.call(this);
    this.setSize(player.WIDTH, player.HEIGHT);
    this.ID = ID;
    this.setFill(background);
    this.isActive_ = false;
    this.luBlocks = new Array();
    this.blockNo = 0;
    this.instruction = instruction;
    this.timeLimit = timeLimit;
    this.goal = goal;
    this.pointTarget = target;
    this.setAnchorPoint(0,0).setPosition(player.WIDTH*2.5, 0);
    this.targetQueue = new Array();
    this.levelActive = true;
    this.correctSFX = new lime.audio.Audio('http://54.245.123.112/static/sfx/CorrectSfx.mp3');
    this.wrongSFX = new lime.audio.Audio('http://54.245.123.112/static/sfx/LucuraWrongSfx.mp3');
    // this.setFill('#0ff').setOpacity(0.3);

    //Box2d
    var gravity = new box2d.Vec2(xg, yg);
    var bounds = new box2d.AABB();
    bounds.minVertex.Set(0,0);
    bounds.maxVertex.Set(640,600);
    this.world = new box2d.World(bounds, gravity, false);

    /*Events*/
    layerInstance = this;
    // (function (layerInstance) {
    //     goog.events.listen(this, ['mousedown', 'touchstart'], function(e) {
            
    //         for(var i = 0; i < layerInstance.luBlocks.length; i++)
    //         {
    //             if(layerInstance.luBlocks[i].movement == "FOLLOW")
    //             {
    //                 var followAni = new lime.animation.MoveTo(e.position.x,e.position.y);
    //                 layerInstance.luBlocks[i].runAction(followAni);
    //                 (function (i) {
    //                     goog.events.listen(followAni,"stop",function(){
    //                         layerInstance.checkTarget(layerInstance.luBlocks[i]);
    //                     });
    //                 }) (i);
    //             }
    //         }
    //     });
    // }) (layerInstance);

    goog.events.listen(this, ['mousedown', 'touchstart'], function(e) {
        this.layerClick(e);
    });

};
goog.inherits(cu.Layer, lime.Sprite);

cu.Layer.prototype.layerClick = function(e){
    for(var i = 0; i < this.luBlocks.length; i++)
    {
        if(this.luBlocks[i].movement == "FOLLOW")
        {
            var followAni = new lime.animation.MoveTo(e.position.x,e.position.y);
            this.luBlocks[i].runAction(followAni);
            layerInstance = this;
            followBlock = this.luBlocks[i];
            goog.events.listen(followAni,"stop",function(){
                layerInstance.checkTarget(followBlock);
            });
        }
    }
};

cu.Layer.prototype.loadBlock = function(ID, bType, position, size, rotation, scale, fill, points, movement, nodeData, isTarget, text, fontFamily, fontSize, fontColour,pID){
    tempBlock = this.luBlocks[this.blockNo] = new cu.Block(ID,this.world, bType, nodeData, movement, points, position,size,scale)
        .setRotation(rotation)
        .setFill(fill)
        .setText(text)
        .setFontFamily(fontFamily)
        .setFontSize(fontSize)
        .setFontColor(fontColour);
    this.blockNo++;
    this.submitPointReserve = 0;
    this.appendChild(tempBlock);

    if(bType == 'TARGET'){
        //Push onto the target list
        this.targetQueue.push(tempBlock);
    }
};

cu.Layer.prototype.onLoad = function(){
    //load physics
    for(var i = 0; i < this.luBlocks.length; i++)
    {
        if(this.luBlocks[i].movement == "RIGID")
        {
            lime.scheduleManager.schedule(function(dt) {
            this.world.Step(dt / 1000, 3);
            var pos = this.ground_body.GetCenterPosition().clone();
            this.setPosition(pos);
             },this.luBlocks[i]);
        }
    }
};

cu.Layer.prototype.checkGoals = function(){
    switch(this.goal)
    {
        case 0 :
            if(statLayer.pointsPanel.roundPoints >= this.pointTarget  && this.levelActive){
                this.passLevel();
                this.levelActive = false;
            }
            break;
        case 1 :
            //Checked upon submit
            break;
        case 2 :
            var countSelected = 0;
            for(i = 0; i < this.luBlocks.length; i++)
            {
                if(this.luBlocks[i].isSelected)
                    countSelected++;
            }
            if(countSelected >= this.pointTarget && this.levelActive){
                if(this.submitPointReserve > 0)
                    this.passLevel();
                else
                    this.failLevel();
                this.levelActive = false;
            }
            break;
    }
    
};

cu.Layer.prototype.checkTarget = function(followBlock){
    
    //Check block against all layer's targets
    for(var i = 0; i < this.targetQueue.length;i++)
    {
        if(followBlock.getPosition().x > (this.targetQueue[i].getPosition().x - ((this.targetQueue[i].getSize().width/2)*(this.targetQueue[i].getScale().x))))
        {
            if(followBlock.getPosition().x < (this.targetQueue[i].getPosition().x + ((this.targetQueue[i].getSize().width/2)*(this.targetQueue[i].getScale().x))))
            {
                if(followBlock.getPosition().y > (this.targetQueue[i].getPosition().y - ((this.targetQueue[i].getSize().width/2)*(this.targetQueue[i].getScale().y))))
                {
                    if(followBlock.getPosition().y < (this.targetQueue[i].getPosition().y + ((this.targetQueue[i].getSize().width/2)*(this.targetQueue[i].getScale().y))))
                    {
                        switch(followBlock.type)
                        {
                            case 'INSTANT':
                                statLayer.pointsPanel.addRoundPoints(followBlock.points);
                                break;
                            case 'SELECT':
                                if(this.isSelected)
                                {
                                    followBlock.isSelected = !followBlock.isSelected;
                                    this.subSubmitPoints(this.points);
                                }
                                else
                                {
                                    followBlock.isSelected = !followBlock.isSelected;
                                    this.addSubmitPoints(followBlock.points);
                                }
                                break;
                        }

                        //Stop block from being moved again
                        followBlock.type = '';
                    }
                }
            }
        }
    }

    this.checkGoals();
};

cu.Layer.prototype.submitPressed = function(){
    //Submit buttons will only work if layer is in submit mode
    if(this.levelActive)
    {
        if(this.goal == 1)
        {
            if(this.submitPointReserve >= this.pointTarget)
                this.passLevel();
            else
                this.failLevel();
            this.levelActive=false;
        }
    }
};

cu.Layer.prototype.passLevel = function(){
    if(!gameOver){
        statLayer.pointsPanel.pass();
        this.getParent().getParent().nextLevel();
        this.correctSFX.play();
    }
};

cu.Layer.prototype.failLevel = function(){
    if(this.levelActive){
        statLayer.pointsPanel.fail();
        this.getParent().getParent().nextLevel();
        this.wrongSFX.play();
    }
};

cu.Layer.prototype.addSubmitPoints = function(points){
    this.submitPointReserve += points;
};

cu.Layer.prototype.subSubmitPoints = function(points){
    this.submitPointReserve -= points;
};