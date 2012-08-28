goog.provide('ani');

goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.RotateBy');


var fadehalf = new lime.animation.FadeTo(.5).setDuration(2);
MENU_SCALE_SPEED = 0.15;
LAYER_CHANGE_SPEED = 0.3;
ROTATE_SPEED = 9;

// var fadehalf = new lime.animation.FadeTo(.5).setDuration(2);

var quickFadeShrink = new lime.animation.Spawn(
	new lime.animation.ScaleTo(0),
	new lime.animation.FadeTo(0)
	).setDuration(MENU_SCALE_SPEED);

var quickFadeGrow = new lime.animation.Spawn(
	new lime.animation.ScaleTo(1),
	new lime.animation.FadeTo(1)
	).setDuration(MENU_SCALE_SPEED);

// var quickReappear = new lime.animation.Sequence(
// 	quickFadeShrink,
// 	quickFadeGrow
// 	).setDuration(0.2);

var moveOut = new lime.animation.MoveTo(0,-100);

ani.quickReappear = function(x,y, obj){
	// console.log('quickReappear, scale to w: ' + nw + ' h: ' + nh + ' from : ' + ow + ', ' + oh);
	return new lime.animation.Sequence(
		// quickFadeShrink,
		new lime.animation.ScaleTo(0,0).setDuration(MENU_SCALE_SPEED),
		new lime.animation.MoveTo(x,y).setDuration(0),
		// new lime.animation.ScaleTo(scaleh,scalew).setDuration(MENU_SCALE_SPEED),
		new lime.animation.Spawn(
			new lime.animation.ScaleTo(obj.size_.width*MENU_SIZE*obj.scale_.x,
			obj.size_.height*MENU_SIZE*obj.scale_.y)
			.setDuration(MENU_SCALE_SPEED),
			new lime.animation.RotateBy(360)).setDuration(MENU_SCALE_SPEED)
		);
};

ani.quickAppear = function(x,y,obj){
	console.log('quickAppear');
	return new lime.animation.Sequence(
		new lime.animation.MoveTo(x,y).setDuration(0),
		new lime.animation.ScaleTo(obj.size_.width*MENU_SIZE*obj.scale_.x,
			obj.size_.height*MENU_SIZE*obj.scale_.y)
			.setDuration(MENU_SCALE_SPEED),
		new lime.animation.RotateBy(360).setDuration(MENU_SCALE_SPEED)
		);
};

ani.quickDisappear = function(){
	console.log('quickDisappear');
	// debugger;
	return new lime.animation.ScaleTo(0,0).setDuration(MENU_SCALE_SPEED);
};

ani.resize = function (x,y,w,h) {
	return new lime.animation.ScaleTo(w,h);
};

ani.resizeMenu= function (obj) {
	if(obj)
	{
		return new lime.animation.ScaleTo(
			obj.size_.width*MENU_SIZE*obj.scale_.x,
			obj.size_.height*MENU_SIZE*obj.scale_.y)
			.setDuration(MENU_SCALE_SPEED);
	}
};

ani.expand = function (obj) {
	return new lime.animation.ScaleTo(obj.getScale().x*1.1, obj.getScale().y*1.1)
				.setDuration(MENU_SCALE_SPEED);
};

ani.shrink = function (obj) {
	return new lime.animation.ScaleTo(obj.getScale().x*0.91, obj.getScale().y*0.91)
				.setDuration(MENU_SCALE_SPEED);
};

ani.rotateClockwise = function(obj){
	return new lime.animation.RotateBy(-ROTATE_SPEED).setDuration(MENU_SCALE_SPEED);
};

ani.rotateAntiClockwise = function(obj){
	if(obj)
	{return new lime.animation.RotateBy(ROTATE_SPEED).setDuration(MENU_SCALE_SPEED);}
};

ani.activateLayer = function(){
	return new lime.animation.Spawn(
		new lime.animation.ScaleTo(1,1),
		new lime.animation.MoveTo(0,0)).setDuration(LAYER_CHANGE_SPEED);
};

ani.deActivateLayer = function(x,y){
	return new lime.animation.Spawn(
		new lime.animation.ScaleTo(0.125),
		new lime.animation.MoveTo(x,y)).setDuration(LAYER_CHANGE_SPEED);
};

ani.mouseLiftUp = function()
{
	return new lime.animation.Spawn(
		new lime.animation.ScaleTo(1, 0),
		new lime.animation.MoveTo(0,0)).setDuration(LAYER_CHANGE_SPEED);
}

ani.mouseDropDown = function()
{
	return new lime.animation.Spawn(
		new lime.animation.ScaleTo(1, 1),
		new lime.animation.MoveTo(0,-10)).setDuration(LAYER_CHANGE_SPEED);
}

ani.mouseLiftUp = function()
{
	return new lime.animation.Spawn(
		new lime.animation.ScaleTo(1, 0),
		new lime.animation.MoveTo(0,0)).setDuration(LAYER_CHANGE_SPEED);
}

ani.mouseDropDown = function()
{
	return new lime.animation.Spawn(
		new lime.animation.ScaleTo(1, 1),
		new lime.animation.MoveTo(0,-10)).setDuration(LAYER_CHANGE_SPEED);
}

ani.blueDown = function()
{
	return new lime.animation.Spawn(
		new lime.animation.ScaleTo(1, 0),
		new lime.animation.MoveTo(0,0)).setDuration(LAYER_CHANGE_SPEED);
}

ani.blueUp = function()
{
	return new lime.animation.Spawn(
		new lime.animation.ScaleTo(1, 1),
		new lime.animation.MoveTo(0,10)).setDuration(LAYER_CHANGE_SPEED);
}

ani.textIn = function(x,y)
{
	return new lime.animation.Spawn(
		new lime.animation.ScaleTo(1, 1),
		new lime.animation.MoveTo(x+TEXT_QUERY_WIDTH/2,y)).setDuration(MENU_SCALE_SPEED);
}
ani.textOut = function(x,y)
{
	return new lime.animation.Spawn(
		new lime.animation.ScaleTo(0, 1),
		new lime.animation.MoveTo(x-TEXT_QUERY_WIDTH/2,y)).setDuration(MENU_SCALE_SPEED);
}
ani.textOutIn = function(x,y,x2,y2)
{
	return new lime.animation.Sequence(
		ani.textOut(x,y),
		new lime.animation.MoveTo(x2,y2).setDuration(0),
		ani.textIn(x2,y2));
}

ani.textSpinTo = function(x,y)
{
	return new lime.animation.Spawn(
		new lime.animation.MoveTo(x+TEXT_QUERY_WIDTH/2,y),
		new lime.animation.RotateBy(360)).setDuration(MENU_SCALE_SPEED);
};

ani.layerTextSpinTo = function(x,y)
{
	return new lime.animation.Spawn(
		new lime.animation.MoveTo(x,y),
		new lime.animation.RotateBy(360)).setDuration(MENU_SCALE_SPEED);
};

ani.layerTextOut = function(x,y)
{
	return new lime.animation.Spawn(
		new lime.animation.ScaleTo(0, 1),
		new lime.animation.MoveTo(x+TEXT_QUERY_WIDTH/2,y)).setDuration(MENU_SCALE_SPEED);
}

ani.incrementPointDisplay = function(obj)
{
	console.log('in ani ');
	x = obj.getPosition().x;
	y = obj.getPosition().y;

	return new lime.animation.Sequence(
		new lime.animation.Spawn(
			new lime.animation.MoveTo(x,y-100),
			new lime.animation.ScaleTo(5),
			new lime.animation.RotateBy(180)).setDuration(0.1),
		new lime.animation.Spawn(
			new lime.animation.MoveTo(x,y),
			new lime.animation.ScaleTo(1),
			new lime.animation.RotateBy(180)).setDuration(0.1));
}







