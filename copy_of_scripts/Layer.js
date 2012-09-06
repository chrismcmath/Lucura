goog.provide('lu.Layer');

goog.require('lime.Sprite');
goog.require('lu.LayerClickQuery');
goog.require('lu.LayerProperties');

// DEFAULT_BLOCK_FILL = 'http://4.bp.blogspot.com/-BS699TjLlUg/TgXSb72PpAI/AAAAAAAAAJc/ffrfU3CNIEs/s1600/190px-Smiley_head_happy_square.svg.png';
DEFAULT_BLOCK_FILL = '#fff';

lu.Layer = function(ID) {
	lime.Sprite.call(this);
    this.ID = ID;
    this.isActive_ = false;
    this.luBlocks = new Array();
    this.blockNo = 0;
    this.instruction = 'edit this instruction';
    this.goal = 0;
    this.pointTarget = 1;
    this.timeLimit = 5;
    this.gravX = 0;
    this.gravY = 10;
    this.setFill('#a4c4c3');
    // this.background = 0;

    this.query = new lu.LayerClickQuery();
    this.props = new lu.LayerProperties();

    // this.setFill('#0ff').setOpacity(0.3);

    // textBox = document.createElement('input');
    // debugger;
    // this.appendChild(textBox);

    this.appendChild(this.query);
    this.appendChild(this.props);
};
goog.inherits(lu.Layer, lime.Sprite);

lu.Layer.prototype.setActive = function(bool){
    this.isActive_ = bool;
};

lu.Layer.prototype.getActive = function(){
    return this.isActive_;
};

lu.Layer.createLayer = function(layerNo){
    return new lu.Layer(layerNo).setSize(builder.WIDTH,builder.HEIGHT).setAnchorPoint(0,0);
};

lu.Layer.addNewLayer = function(layers, layerNo){
    //return for chaining
    return layers[layerNo] = lu.Layer.createLayer(layerNo);
}

lu.Layer.prototype.click = function(e){
    if(!this.props.active)
    {
        this.query.pop(util.getRelativeXCoord(e), util.getRelativeYCoord(e));
    }
};

lu.Layer.prototype.newBlock = function(x,y){
    return new lu.Block(this.blockNo++, this.ID).setSize(100,100).setPosition(x,y).setFill(DEFAULT_BLOCK_FILL);
};

lu.Layer.prototype.addBlock = function(x,y){
    tempBlock = this.luBlocks[this.blockNo] = this.newBlock(x,y);
    this.appendChild(tempBlock);
    //Give new blocks interactiivty
    lu.Layer.luBlockEvents(this);

    //Reappend menu so that it's on top
    this.reappendQuery();
};

lu.Layer.prototype.loadBlock = function(ID, bType, position, size, rotation, scale, fill, points, movement, nodeData, isTarget, text, fontFamily, fontSize, fontColour,pID){
    tempBlock = this.luBlocks[this.blockNo] = new lu.Block(ID,pID)
        .setPosition(position.x, position.y)
        .setSize(size.width,size.height)
        .setRotation(rotation)
        .setScale(scale.x,scale.y)
        .setFill(fill)
        .setText(text)
        .setFontFamily(fontFamily)
        .setFontSize(fontSize)
        .setFontColor(fontColour);
    tempBlock.nodeData = nodeData;
    tempBlock.isTarget = isTarget;
    tempBlock.movement = movement;
    tempBlock.type = bType;
    tempBlock.points = points;
    this.blockNo++;
    this.appendChild(tempBlock);
    lu.Layer.luBlockEvents(this);
};

// lu.Layer.prototype.newStartBlock = function(){
//     return new lu.Block(this.blockNo++).setSize(100,100).setPosition(100,100).setFill('http://4.bp.blogspot.com/-BS699TjLlUg/TgXSb72PpAI/AAAAAAAAAJc/ffrfU3CNIEs/s1600/190px-Smiley_head_happy_square.svg.png');
// };

lu.Layer.prototype.panelPosition = function(offset){
    this.setPosition((-1*offset), -400);
    this.runAction(ani.deActivateLayer(100*(this.ID+1)+10,10));
};

lu.Layer.prototype.activePosition = function(offset){
    this.setPosition(this.getPosition().x + offset,410);
    this.runAction(ani.activateLayer());
};

lu.Layer.prototype.serializeBlocks = function(){
    blockArray = new Array();
    parent = this;
    IDcounter = 0;
    goog.array.forEach(this.luBlocks, function(block, index) {
        //for all blocks
        if(!block.isDeleted)
        {
            var back = '';
            if(block.getFill().image_)
                back = block.getFill().image_.src;
            else
                back = block.getFill().str;

            blockArray[IDcounter] = {
                'ID': IDcounter,
                'Position': goog.json.serialize(block.getPosition()),
                'Size': goog.json.serialize(block.getSize()),
                'Scale': goog.json.serialize(block.getScale()),
                'Rotation': goog.json.serialize(block.getRotation()),
                'Type': goog.json.serialize(block.type),
                'IsTarget': goog.json.serialize(block.isTarget),
                'NodeData': goog.json.serialize(block.nodeData),
                'Movement': goog.json.serialize(block.movement),
                'Points': block.points,
                'Fill': goog.json.serialize(back),
                'ParentLayer' : parent.ID,
                'Text': goog.json.serialize(block.getText()),
                'FontFamily': goog.json.serialize(block.getFontFamily()),
                'FontSize': block.getFontSize(),
                'FontColour': goog.json.serialize(block.getFontColor())
            };
            IDcounter++;
        }
    });
    return blockArray;
};

// lu.Layer.prototype.refreshListeners = function()
// {
//     for (i = 0; i<this.luBlocks.length; i++)
//     {
//         (function (i) {
//             goog.events.listen(this.luBlocks[i], ['mousedown', 'touchstart'], lu.BlockClick);
//         }) (i);
//     }
// };

lu.Layer.luBlockEvents = function(layer)
{
    for (j = 0; j<layer.luBlocks.length; j++)
    {
        (function (j) {
            goog.events.listen(layer.luBlocks[j], ['mousedown', 'touchstart'], lu.BlockClick);
        }) (j);
    };
};

lu.Layer.prototype.reappendQuery = function()
{
    this.removeChild(this.query);
    this.appendChild(this.query);
};

lu.Layer.prototype.reappendProps = function()
{
    this.removeChild(this.props);
    this.appendChild(this.props);
};


lu.Layer.prototype.cloneBlock = function(clone)
{
    tempBlock = this.luBlocks[this.blockNo] = this.newBlock(builder.WIDTH/2,builder.HEIGHT/2);
    tempBlock
        .setSize(clone.getSize())
        .setScale(clone.getScale())
        .setFill(clone.getFill())
        .setFontFamily(clone.getFontFamily())
        .setFontColor(clone.getFontColor())
        .setFontSize(clone.getFontSize())
        .setRotation(clone.getRotation())
        .setText(clone.getText());
    tempBlock.type = clone.type;
    tempBlock.movement = clone.movement;
    tempBlock.points = clone.points;
    this.appendChild(tempBlock);
    //Give new blocks interactiivty
    lu.Layer.luBlockEvents(this);

    //Reappend menu so that it's on top
    this.reappendQuery();
};














