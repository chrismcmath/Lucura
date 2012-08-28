//set main namespace
goog.provide('builder');

//get requirements
goog.require('lime.Circle');
goog.require('lime.Director');
goog.require('lime.Label');
goog.require('lime.Layer');
goog.require('lime.Scene');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.Loop');
goog.require('lime.animation.MoveBy');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.Spawn');
goog.require('lime.transitions.MoveInUp');

goog.require('gameJS.Button');

goog.require('util');
goog.require('ani');

goog.require('lu.Block');
goog.require('lu.Layer');
goog.require('lu.EventLayer');
goog.require('lu.MenuLayer');
goog.require('lu.Clicker');
goog.require('lu.DropDown');
goog.require('lu.UILayer');


goog.require('builder.Label');
goog.require('builder.mouseMenu');

goog.require("goog.dom");
goog.require("goog.net.XhrIo");
goog.require("goog.structs.Map");
goog.require("goog.Uri.QueryData");

goog.require("goog.json.Serializer");
goog.require("goog.editor.Field");


goog.require('goog.dom');
goog.require('goog.editor.Command');
goog.require('goog.editor.Field');
goog.require('goog.editor.SeamlessField');
goog.require('goog.editor.plugins.BasicTextFormatter');
goog.require('goog.editor.plugins.EnterHandler');
goog.require('goog.editor.plugins.HeaderFormatter');
goog.require('goog.editor.plugins.LinkBubble');
goog.require('goog.editor.plugins.LinkDialogPlugin');
goog.require('goog.editor.plugins.ListTabHandler');
goog.require('goog.editor.plugins.LoremIpsum');
goog.require('goog.editor.plugins.RemoveFormatting');
goog.require('goog.editor.plugins.SpacesTabHandler');
goog.require('goog.editor.plugins.UndoRedo');
goog.require('goog.ui.editor.DefaultToolbar');
goog.require('goog.ui.editor.ToolbarController');


builder.WIDTH = 640; //This is all about ratio
builder.HEIGHT = 480; //A big no allows us to use reasonable numbers for the coordinate system

gameData = 0;
game_ID=0;

//Test vars
var mouseOffsetX;
var mouseOffsetY;

//Globals
var mouseMenu;
var request = 0;

// entrypoint
builder.start = function(gameID) {
    builder.director = new lime.Director(document.getElementById('gamecontainer'), builder.WIDTH, builder.HEIGHT);
    //builder.director.setAnchorPoint(0,0).setPosition(0,0);
    //builder.director.makeMobileWebAppCapable();
    lime.Label.defaultFont = 'Times';
    RENDERER= lime.Renderer.DOM;

    gameData = util.getGame(gameID, builder.loadGame); //calls the second argument with the received game data
    game_ID = gameID;

    mouseMenu = new builder.mouseMenu(100,100).setSize(100,100); //redundancy
};

/*-----------------------------------------------------------------------------Handlers------------------------------------------------------------------*/

builder.downHandler_ = function(e){

    mouseMenu.runAction(quickFadeGrow);
    mouseMenu.setPosition(util.getRelativeXCoord(e), util.getRelativeYCoord(e));

    e.swallow(['touchmove', 'mousemove'], function(e) {
    });

    e.swallow(['touchend', 'touchcancel', 'mouseup'], function(e) {
        mouseMenu.runAction(quickFadeShrink);
    });
};

builder.loadGame = function(gameJson) {

    /*Get game*/
    var gamePackage = goog.json.parse(gameJson);
    var gameObject = gamePackage[0];
    var game = gameObject.fields;

    /*Declarations*/
    var scene = new lime.Scene();
    scene.setRenderer(RENDERER);
    builder.director.replaceScene(scene, lime.transitions.MoveInDown);

    uiLayer = new lu.UILayer(builder.WIDTH, builder.HEIGHT).setAnchorPoint(0,0);
    eventLayer = new lu.EventLayer().setAnchorPoint(0,0).setSize(builder.WIDTH, builder.HEIGHT);
    lu.EventLayer.setActiveLayer(uiLayer.panel.layers[0]);

    menuLayer = new lu.MenuLayer(game,builder.WIDTH, builder.HEIGHT + 20).setPosition(0, -builder.HEIGHT);



    var layer = new lime.Layer().setPosition(builder.WIDTH * .5, 0);
    
    // var background = new lime.Sprite().setAnchorPoint(0,0).setPosition(0,0).setSize(builder.WIDTH,builder.HEIGHT);
    // var backGrad = new lime.fill.LinearGradient().
    //     setDirection(1,1,0,0).
    //     addColorStop(0,100,0,0,1).
    //     addColorStop(1,0,0,100,0.5); //(P,R,G,B,A)
    // background.setFill(backGrad);


    /*-------------------------------------------------------------Picture---------------------------------------------------------------*/


    //XHRIO CODE
    request = new goog.net.XhrIo(); 
    goog.events.listen(request, 'complete', function(){
      if(request.isSuccess()){
        var data = request.getResponseJson();
        console.log('Sent!' + data + ' also: ' + request.body);
      } else {
        //error
        alert('error');
      }
    });

    /*-----------------------------------------------------------------------EVENTS------------------------------------------------------------------*/

    //scene & block listener
    //Event layer
    goog.events.listen(eventLayer, ['mousedown', 'touchstart'], lu.EventLayer.click);

    uiLayer.panel.setupEvents();

    /*IMPORTANT*/
    // goog.events.listen(btnEdit, lime.Button.Event.CLICK, function(e) {
    //     lu.Layer.addNewLayer(layers);
    //     e.event.stopPropagation();
    //     console.log('button');
    // });

    //mouseMenu events
    mouseMenu.setupEvents();
    menuLayer.setupEvents();

    // Adding things
    // goog.events.listen(scene, lime.Button.Event.CLICK, function(e) {
    //     var temp = new lime.RoundedRect().setAnchorPoint(0.5,0.5).setSize(20,20).setFill('#fff').setPosition(util.getRelativeXCoord(e), util.getRelativeYCoord(e));
    //     scene.appendChild(temp);
    //      e.event.stopPropagation();
    // });

    // goog.events.listen(scene, ['mousedown', 'touchstart'], lu.Layer.click);

    goog.events.listen(scene, ['mousemove'], function(e) {
        util.updateMouseScreenCoords(e);
    });

    //Mouse stuff

    // goog.events.listen(scene, ['mousedown', 'touchstart'], builder.downHandler_, false, this);
    // goog.events.listen(scene, ['mousedown', 'touchstart',], builder.downHandler_, false, this);
    // goog.events.listen(scene, ['mousedown', 'touchstart', 'keydown'], builder.downHandler_, false, this);

    /*----APPENDS-----*/

    scene.appendChild(eventLayer);
    scene.appendChild(mouseMenu);
    scene.appendChild(uiLayer);
    scene.appendChild(menuLayer);
};

builder.saveGame = function(){
    var serializedData = builder.serializeGame();
    // serializedData = {'title': inputFields[0].googText.getCleanContents(), 'description' : inputFields[1].googText.getCleanContents()};
        request.send('/save_game/', 'POST', goog.json.serialize(serializedData), {'content-type':'application/json'});
};

builder.serializeGame = function(){
    return gameData = {
        'title': menuLayer.inputFields[0].googText.getCleanContents(),
        'description' : menuLayer.inputFields[1].googText.getCleanContents(),
        'ID' : game_ID,
        'pointGoal' : 0,
        'layers' : builder.serializeLayers()
    };
    // return gameData;
};

builder.serializeLayers = function(){
    layerArray = new Array();
    goog.array.forEach(uiLayer.panel.layers, function(l, ind) {
        layerArray[ind] = {
            'ID': l.ID,
            'Blocks': l.serializeBlocks()
        };
    });
    return layerArray;
};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('builder.start', builder.start);













