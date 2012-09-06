goog.provide('lu.PullMenu');

goog.require('lime.RoundedRect');
goog.require('lime.Label');
goog.require('lime.Sprite');
goog.require('lu.TriangleLeft');
goog.require('lu.TextBox');
goog.require('lime.Polygon');

BLUE_BOX_FONT = 'Impact';
BLUE_BUTTON_BACKGROUND = '#3C5E96';

lu.PullMenu = function(fill) {
	lime.RoundedRect.call(this);
    this.setAnchorPoint(0.5,1).setScale(1,0).setPosition(0,-10).setFill('#000').setStroke(5,fill).setRadius(20);
};
goog.inherits(lu.PullMenu, lime.RoundedRect);

lu.PullMenu.prototype.click = function() {

};

lu.PullMenu.prototype.disappear = function() {

};

lu.PullMenu.prototype.loadTargetDetails = function() {

};



