goog.provide('lu.DropDown');

goog.require('lime.Sprite');

lu.DropDown = function() {
	lime.Sprite.call(this);
    this.activeLayer = 0;
};
goog.inherits(lu.DropDown, lime.Sprite);

lu.DropDown.click = function(e)
{
    console.log('event click');
    // debugger;
    if(this.activeLayer){
        this.activeLayer.addBlock(e);
    }
};

lu.DropDown.prototype.newFunction = function(){
	console.log('new');
};











// goog.provide('lu.DropDown');
// debugger;
// goog.require('lime.Sprite');

// lu.DropDown = function() {
// 	lime.Sprite.call(this);
// 	this.handle = new lime.Sprite().setSize(builder.WIDTH, 20).setAnchorPoint(0,0).setFill('#000').setPosition(0,builder.HEIGHT).setOpacity(1);

//     this.appendChild(this.handle);
// };
// goog.inherits(lu.DropDown, lime.Sprite);

// lu.DropDown.prototype.reset = function(){
// 	mouseMenu.runAction(ani.resize(1/mouseMenu.target.size_.w, 1/mouseMenu.target.size_.h));
// };

// lu.DropDown.prototype.newFunction = function(){
// 	console.log('new');
// };

// lu.DropDown.prototype.disappear = function(){
// 	console.log('works');
// };
// lu.DropDown.prototype.one = function(){
// 	console.log('works');
// };
// lu.DropDown.prototype.two = function(){
// 	console.log('works');
// };
// lu.DropDown.prototype.three = function(){
// 	console.log('works');
// };

// // lu.DropDown.click = function(e)
// // {
// //     console.log('dropdown click');
// //     e.event.stopPropagation();
// //     // debugger;
// // };

// // lu.DropDown.prototype.setupEvents = function(){
// // 	goog.events.listen(dropDown.handle, ['mousedown', 'touchstart'], lu.DropDown.click);
// // };

