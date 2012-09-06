goog.provide('lu.Title');

goog.require('lime.Layer');
goog.require('lime.Label');


TITLE_SIZE_X = 50;
TITLE_SIZE_Y = 20;

lu.Title = function(txt,font) {
	lime.Layer.call(this); //call the 'base class'

	this.back = new lime.Label().setSize(TITLE_SIZE_X,TITLE_SIZE_Y).setAnchorPoint(0,0).setText(txt).setFontFamily('LOT').
    setFontColor('#000').setFontSize(font);

    this.front = new lime.Label().setSize(TITLE_SIZE_X,TITLE_SIZE_Y).setAnchorPoint(0,0).setText(txt).setFontFamily('LOT').
    setFontColor('#fff').setFontSize(font).setPosition(4,4);

	this.setSize(TITLE_SIZE_X,TITLE_SIZE_Y).setAnchorPoint(0,0);
	this.appendChild(this.back);
	this.appendChild(this.front);
};
goog.inherits(lu.Title, lime.Layer);