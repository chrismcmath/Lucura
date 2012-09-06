goog.provide('lu.MultiLabel');

goog.require('lime.Label');

lu.MultiLabel = function() {
    lime.Label.call(this);
    this.choice = 0;
    this.options = 3;
};
goog.inherits(lu.MultiLabel, lime.Label);

lu.MultiLabel.prototype.updateText = function()
{
    this.setText(this.getParent().goalDescription[this.choice]);
};

lu.MultiLabel.prototype.cycleText = function()
{
    this.choice = (this.choice + 1) % this.options;
    this.setText(this.getParent().goalDescription[this.choice]);
};

lu.MultiLabel.prototype.antiCycleText = function()
{
	if(this.choice == 0)
		this.choice = 2;
	else
	    this.choice = Math.abs(this.choice + -1) % this.options;
    this.setText(this.getParent().goalDescription[this.choice]);
};