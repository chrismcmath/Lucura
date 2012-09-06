goog.provide('lu.Block');

goog.require('lime.Label');

lu.Block = function(ID, lID) {
	lime.Label.call(this);
    this.setText('');
	
    this.parentLayerID = lID;
    this.selected = false;

    this.ID = ID;

    this.type = 'INSTANT';
    this.movement = 'STILL';
    this.points = 0;
    this.isDeleted = false;

    this.setText('0');
    this.setFontFamily('miso-bold');
    this.setFontSize(80);
    this.setAlign('center');

    this.nodeData = {
        'isNode': false,
        'nodeID': null,
        'nodeBlock': null
    };
    this.isTarget = false;
};
goog.inherits(lu.Block, lime.Label);

lu.BlockClick = function(e){
    //Only allow interaction if the layer is active
    if(uiLayer.panel.layers[this.parentLayerID].getActive())
    {
        if(!this.selected)
        {
            e.swallow(['touchmove', 'mousemove'], function(e) {
            	//DRAG BLOCK : rotate back to normal first
            	tempRotate = this.getRotation();
            	this.setRotation(0);
                this.setPosition(util.moveObjectByScreenCoords(e,this));
                this.setRotation(tempRotate);
                builder.mouseMenu.prototype.disappear();
                util.updateMouseScreenCoords(e);
                return;
            });

            e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
                if(!mouseMenu.target){
                    //Ensure mouseMenu is fully deactivated
                    builder.mouseMenu.prototype.disappear();
                }
            });

            //Get rid of any dialogs
            this.getParent().query.disappear();
            textQuery.quickDisappear();

            //Make mouseMenu, reappend target to selected layer
            builder.mouseMenu.prototype.spawn(this.position_.x, this.position_.y, this);
            this.getParent().removeChild(this);
            uiLayer.selectedLayer.appendChild(this);
        }
        else
        {
            if(textQuery.active)
                textQuery.quickDisappear();
            else
                textQuery.pop(this);

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
            });
        }

        this.selected = true;
        e.event.stopPropagation();
    }
};

lu.Block.prototype.clone = function(string)
{
    uiLayer.panel.layers[this.parentLayerID].cloneBlock(this);
};
