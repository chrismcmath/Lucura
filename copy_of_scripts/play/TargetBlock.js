goog.provide('cu.TargetBlock');

cu.TargetBlock = function(position,size,scale) {
	this.position = position;
	this.size = size;
	this.scale = scale;
};

cu.TargetBlock.prototype.getLeft = function()
{
	return this.position.x - ((this.size.width/2)*this.scale.x);
}

cu.TargetBlock.prototype.getRight = function()
{
	return this.position.x + ((this.size.width/2)*this.scale.x);
}

cu.TargetBlock.prototype.getTop = function()
{
	return this.position.y - ((this.size.height/2)*this.scale.y);
}

cu.TargetBlock.prototype.getBottom = function()
{
	return this.position.y + ((this.size.height/2)*this.scale.y);
}



