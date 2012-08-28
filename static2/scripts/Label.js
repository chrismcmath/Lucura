goog.provide('builder.Label');

goog.require('lime.Label');
goog.require('lime.Sprite');


builder.Label = function(x,y) {
	lime.Label.call(this);
	this.inactive = true;
	this.googText = 0;
	this.back = new lime.Sprite().setSize(500,500).setFill('#f00').setOpacity(1).setPosition(100,100);
	this.setSize(x,y);

	this.appendChild(this.back);
};
goog.inherits(builder.Label, lime.Label)

/**
* Make state
* @private
* @return {lime.Label} state.
*/
builder.Label.prototype.makeState_ = function() {

};


// gameJS.Button.prototype.makeState_ = function() {
// 	var state = new lime.RoundedRect().setFill('#00AFFF').setRadius(0);
// 	state.inner = new lime.RoundedRect().setRadius(0);
// 	state.label = new lime.Label().setAlign('center').setFontColor('#00AFFF').setFontSize(25).setSize(250, 35);

// 	state.appendChild(state.inner);
// 	state.inner.appendChild(state.label);
// 	return state;
// };