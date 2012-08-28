goog.provide('lu.TextBox');

goog.require('lime.Label');

lu.TextBox = function() {
	lime.Label.call(this); //call the 'base class'
};
goog.inherits(lu.Text, lime.Label);

lu.TextBox.prototype.setText = function(text)
{
	goog.base(this, 'setText', text);
};
