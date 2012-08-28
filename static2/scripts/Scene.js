goog.provide('lu.Scene');

goog.require('lime.Scene');

var sceneNo = 0;

lu.Scene = function(ID) {
	lime.Scene.call(this);
    this.ID = ID;
    this.luBlocks = new Array();
    this.blockNo = 0;
};
goog.inherits(lu.Scene, lime.Scene);

lu.Scene.createScene = function(){
    return new lu.Scene(sceneNo++);
};

lu.Scene.addNewScene = function(scenes){
    //return for chaining
    return scenes[sceneNo] = lu.Scene.createScene();
}

lu.Scene.prototype.newStartBlock = function(){
    return new lu.Block(this.blockNo++).setSize(100,100).setPosition(100,100).setFill('http://4.bp.blogspot.com/-BS699TjLlUg/TgXSb72PpAI/AAAAAAAAAJc/ffrfU3CNIEs/s1600/190px-Smiley_head_happy_square.svg.png');
};

lu.Scene.prototype.newBlock = function(e){
    return new lu.Block(this.blockNo++).setSize(100,100).setPosition(util.getRelativeXCoord(e), util.getRelativeYCoord(e)).setFill('http://4.bp.blogspot.com/-BS699TjLlUg/TgXSb72PpAI/AAAAAAAAAJc/ffrfU3CNIEs/s1600/190px-Smiley_head_happy_square.svg.png');
};

lu.Scene.prototype.serialize = function(){

};

lu.Scene.click = function(e)
{
    console.log('new block');
   tempBlock = this.luBlocks[this.blockNo] = this.newBlock(e);
   this.appendChild(tempBlock);
   lu.Scene.luBlockEvents(this);
};

lu.Scene.prototype.refreshListeners = function()
{
    for (i = 0; i<this.luBlocks.length; i++)
    {
        (function (i) {
            goog.events.listen(this.luBlocks[i], ['mousedown', 'touchstart'], lu.BlockClick);
        }) (i);
    }
};

lu.Scene.luBlockEvents = function(scene)
{
    for (i = 0; i<scene.luBlocks.length; i++)
    {
        (function (i) {
            goog.events.listen(scene.luBlocks[i], ['mousedown', 'touchstart'], lu.BlockClick);
        }) (i);
    }
};