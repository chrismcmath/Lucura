goog.provide('gameJS.Button');

goog.require('lime.GlossyButton');

/**
* Regular button with border
* @param {string} txt Text on button
* @constructor
* @extends lime.Button
*/
gameJS.Button = function(txt) {
	lime.GlossyButton.call(this, txt); //call the 'base class'

	this.borderWidth = 2;
	this.setColor('#000');
};
goog.inherits(gameJS.Button, lime.GlossyButton);

/**
* Make state
* @private
* @return {lime.RoundedRect} state.
*/
gameJS.Button.prototype.makeState_ = function() {
	var state = new lime.RoundedRect().setFill('#00AFFF').setRadius(0);
	state.inner = new lime.RoundedRect().setRadius(0);
	state.label = new lime.Label().setAlign('center').setFontColor('#00AFFF').setFontSize(25).setSize(250, 35);

	state.appendChild(state.inner);
	state.inner.appendChild(state.label);
	return state;
};

/**
* Set button base colour
* @param {mixed} clr New base colour.
* @return {lime.GlossyButton} object itself.
*/
gameJS.Button.prototype.setColor = function(clr) {
	clr = lime.fill.parse(clr);
	goog.array.forEach([this.upstate, this.downstate], function(s) {
		var c = s == this.downstate ? clr.clone().addBrightness(0.1) : clr;
		var c2 = c.clone().addBrightness(0.3);
		var grad = new lime.fill.LinearGradient().setDirection(0,0,0,1);
		grad.addColorStop(0,c2);
		grad.addColorStop(0.45,c);
		grad.addColorStop(0.55, c);
		grad.addColorStop(1, c2);
		s.inner.setFill(grad);
	},this);
	return this;
};