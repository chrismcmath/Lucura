goog.provide('lu.TextBox');

goog.require('lime.Label');

lu.TextBox = function() {
	lime.Label.call(this); //call the 'base class'
	this.scaleFactor = 1;
};
goog.inherits(lu.TextBox, lime.Label);

lu.TextBox.prototype.setText = function(text)
{
	if(text)
	{
		if(text.length <= 7)
		{
			this.setFontSize(8*this.scaleFactor);
		}
		else if (text.length <= 13)
		{
			this.setFontSize(7*this.scaleFactor);
		}
		else if (text.length <= 20)
		{
			this.setFontSize(5*this.scaleFactor);
		}
		else
		{
			this.setFontSize(1*this.scaleFactor);
		}
	}
	goog.base(this, 'setText', text);
	return this;
};

lu.TextBox.prototype.makeLarger = function()
{
	this.scaleFactor = 3;
}