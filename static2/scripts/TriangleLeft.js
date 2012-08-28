goog.provide('lu.TriangleLeft');

goog.require('lime.Polygon');

lu.TriangleLeft = function(fill) {
    lime.Polygon.call(this);
    // this.addPoints(0,-1, .5,.5, -.5,.5);
    this.addPoints(-130, -130, -130, 130, -190, 0).setPosition(200, 200).setStroke(5,fill);
};
goog.inherits(lu.TriangleLeft, lime.Polygon);