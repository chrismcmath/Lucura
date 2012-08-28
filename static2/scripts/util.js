goog.provide('util');

var mouseScreenX = 0;
var mouseScreenY = 0;

util.alert = function(){
	alert('works');
};

//Mouse Coords
util.getRelativeXCoord = function(e){
	return e.position.x;
};

util.getRelativeYCoord = function(e){
	return e.position.y;
};

util.getObjRelXCoord = function(e, obj){
    console.log('event Pos: ' + e.position.x + ' obj Pos: ' + obj.position_.x + ' parent Pos: ' + obj.parent_.position_.x);
    return e.position.x + obj.position_.x;
};

util.getObjRelYCoord = function(e, obj){
    return e.position.y + obj.position_.y;
};

util.getScreenXCoord = function(e){
    return e.screenPosition.x;
};

util.getScreenYCoord = function(e){
    return e.screenPosition.y;
};

util.updateMouseScreenCoords = function(e){
    mouseScreenX = util.getScreenXCoord(e);
    mouseScreenY = util.getScreenYCoord(e);
    // console.log('UTIL update mouse x: ' + mouseScreenX + ' mouse y: ' + mouseScreenY);
};

util.moveObjectByScreenCoords = function(e,obj){
    return new goog.math.Coordinate(obj.position_.x + util.getScreenXCoord(e) - mouseScreenX,obj.position_.y + util.getScreenYCoord(e) - mouseScreenY);
};

util.moveObjectByScreenCoordsPlay = function(e,obj){
    return new goog.math.Coordinate(obj.position_.x + (util.getScreenXCoord(e) - mouseScreenX),obj.position_.y + (util.getScreenYCoord(e) - mouseScreenY));
};


//Server comm
util.getGame = function(gameID, loader)
{
	var request = new goog.net.XhrIo(); 
    goog.events.listen(request, 'complete', function(){
        if(request.isSuccess()){
            gameData = request.getResponseJson();
            loader(gameData);
        } else {
            alert('error');
        }
    });

    url = '/get_game/'+gameID;
    request.send(url, 'GET');
};


//Text boxes
function updateFieldContents() {
    goog.dom.getElement('fieldContents').value = myField.getCleanContents();
};

util.makeTextBox = function(element) {
	//Avoid unnecessary refresh
	if(element.inactive){
	    textBox = new goog.editor.SeamlessField(element.getDeepestDomElement().getAttribute('id'));
	    textBox.setHtml(false, "Enter Text...");
        // textBox.isFixedHeight();
	    textBox.makeEditable();
	    element.inactive = false;
        element.googText = textBox;
	}
    //updateFieldContents(); //Need this?
};






