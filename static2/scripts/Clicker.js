goog.provide('lu.Clicker');

goog.require('lime.Layer');
goog.require('lime.RoundedRect');

/**
* Regular button with border
* @param {string} txt Text on button
* @constructor
* @extends lime.Button
*/
BUT_SIZE_X = 100;
BUT_SIZE_Y = 50;

lu.Clicker = function(txt) {
	lime.Layer.call(this); //call the 'base class'

	this.back = new lime.RoundedRect().setSize(BUT_SIZE_X,BUT_SIZE_Y).setFill('#64C100').setOpacity(0).setRadius(30).setAnchorPoint(0,0);
	this.border = new lime.RoundedRect().setSize(BUT_SIZE_X,BUT_SIZE_Y).setStroke(5,'#aaa').setRadius(30).setAnchorPoint(0,0);
 	this.text = new lu.Title(txt,16).setPosition(15,10);

	this.setSize(BUT_SIZE_X,BUT_SIZE_Y).setAnchorPoint(0,0);
	this.appendChild(this.back);
	this.appendChild(this.border);
	this.appendChild(this.text);

};
goog.inherits(lu.Clicker, lime.Layer);


lu.Clicker.prototype.click = function()
{
	this.back.runAction(new lime.animation.FadeTo(1).setDuration(0.05));
};

lu.Clicker.prototype.release = function()
{
	this.back.runAction(new lime.animation.FadeTo(0).setDuration(0.2));
};