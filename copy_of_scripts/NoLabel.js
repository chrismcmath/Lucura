goog.provide('lu.NoLabel');

goog.require('lime.Label');

lu.NoLabel = function() {
    lime.Label.call(this);
    this.number = 0;
    this.setText('0');
};
goog.inherits(lu.NoLabel, lime.Label);

lu.NoLabel.prototype.increment = function()
{
    this.number++;
    this.setText(this.number.toString());
};

lu.NoLabel.prototype.decrement = function()
{
    this.number--;
    this.setText(this.number.toString());
};

lu.NoLabel.prototype.setNumber = function(newNumber)
{
    if(newNumber){
        this.number = newNumber;
        this.setText(this.number.toString());
    }
    else if(newNumber == 0)
    {
        this.number = newNumber;
        this.setText(this.number.toString());
    }
};

lu.NoLabel.prototype.getNumber = function()
{
    return this.number;
};

lu.NoLabel.prototype.updateNumber = function()
{
    this.number = parseInt(this.getText());
};