goog.provide('lu.Stats');

goog.require('lime.Layer');
goog.require('lime.RoundedRect');
goog.require('lime.Label');

/**
* Regular button with border
* @param {string} txt Text on button
* @constructor
* @extends lime.Button
*/
STAT_SIZE_X = 200;
STAT_SIZE_Y = 350;

lu.Stats = function() {
	lime.Layer.call(this); //call the 'base class'

	this.back = new lime.RoundedRect().setSize(STAT_SIZE_X,STAT_SIZE_Y).setFill('#000').setOpacity(0.1).setRadius(30).setAnchorPoint(0,0);
	this.border = new lime.RoundedRect().setSize(STAT_SIZE_X,STAT_SIZE_Y).setStroke(5,'#aaa').setRadius(30).setAnchorPoint(0,0);
	this.text = new lime.Label().setSize(STAT_SIZE_X,STAT_SIZE_Y).setText('stats').setFontFamily('Verdana').
    setFontColor('#fff').setFontSize(15).setFontWeight('bold').setPosition(0,5);

	this.setSize(STAT_SIZE_X,STAT_SIZE_Y).setAnchorPoint(0,0);
	this.appendChild(this.back);
	this.appendChild(this.border);
	this.appendChild(this.text);

};
goog.inherits(lu.Stats, lime.Layer);