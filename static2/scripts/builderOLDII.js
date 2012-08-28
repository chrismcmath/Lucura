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
goog.require('lu.Scene');

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
var scenes = new Array();
gameData = 0;

//Test vars
var mouseOffsetX;
var mouseOffsetY;

//Globals
var mouseMenu;
var inputFields = new Array();
var request = 0;

// entrypoint
builder.start = function(gameID) {
    builder.director = new lime.Director(document.getElementById('gamecontainer'), builder.WIDTH, builder.HEIGHT);
    //builder.director.setAnchorPoint(0,0).setPosition(0,0);
    //builder.director.makeMobileWebAppCapable();
    lime.Label.defaultFont = 'Times';
    RENDERER= lime.Renderer.DOM;

    gameData = util.getGame(gameID, builder.loadGame); //calls the second argument with the received game data

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
    var gamePackage = goog.json.parse(gameJson);
    var gameObject = gamePackage[0];
    var game = gameObject.fields;

    /*Declarations*/
    var scene = lu.Scene.addNewScene(scenes);
    scene.setRenderer(RENDERER);
    builder.director.replaceScene(scene, lime.transitions.MoveInDown);
    lu.Scene.addNewScene(scenes);

    scene.luBlocks[0] = scene.newStartBlock();

    var layer = new lime.Layer().setPosition(builder.WIDTH * .5, 0);
    
    var background = new lime.Sprite().setAnchorPoint(0,0).setPosition(0,0).setSize(builder.WIDTH,builder.HEIGHT);
    var backGrad = new lime.fill.LinearGradient().
        setDirection(1,1,0,0).
        addColorStop(0,100,0,0,1).
        addColorStop(1,0,0,100,0.5); //(P,R,G,B,A)
    background.setFill(backGrad);

    //Header
    var header = new lime.Layer().setPosition(0,0);
    var titleText = game.description;
    var headerTitle = new lime.Label().setText((titleText).toUpperCase()).setFontSize(30).setAnchorPoint(.5, 0).setPosition(0, 0).setFontColor('#00afff');
    //Because the layer was set to the middle, be careful when changing the anchor
    var headerBG = new lime.Sprite().setPosition(0,0).setSize(builder.WIDTH,80);
    var headerBGF = new lime.fill.LinearGradient().
        setDirection(0,1,0,0).
        addColorStop(0,21,7,63,1).
        addColorStop(0.5,0,0,50,0); //(P,R,G,B,A)
    headerBG.setFill(headerBGF);
    
    header.appendChild(headerBG);
    header.appendChild(headerTitle);

    /*-----Difficulty-------*/

    var diffLayer = new lime.Layer().setPosition(-150, 150);
    var diffBox = new lime.RoundedRect().setAnchorPoint(0.5,0).setSize(200,200).setFill(headerBGF);
    var diffBox2 = new lime.RoundedRect().setAnchorPoint(0.5,0).setSize(202,202).setFill('#000').setPosition(-1,-1);
    var diffLabel = new lime.Label().setText(('Save File').toUpperCase()).setFontSize(30).setAnchorPoint(0.5,0).setPosition(0,0).setFontColor('#f00');
    var btnHard = new gameJS.Button('Send Title').setPosition(0, 300).setSize(100, 40);
    var btnEdit = new gameJS.Button('New Scene').setPosition(0, 200).setSize(100, 40);
    
    
    diffLayer.appendChild(diffBox2);
    diffLayer.appendChild(diffBox);
    diffLayer.appendChild(diffLabel);
    diffLayer.appendChild(btnHard);
    diffLayer.appendChild(btnEdit);

    /*-------------------------------------------------------------Picture---------------------------------------------------------------*/
    var picLayer = new lime.Layer().setPosition(150, 150);
    var picBox = new lime.RoundedRect().setAnchorPoint(0.5,0).setSize(200,200).setFill(headerBGF);
    var picBox2 = new lime.RoundedRect().setAnchorPoint(0.5,0).setSize(202,202).setFill('#000').setPosition(-1,-1);

    inputFields[0] = new builder.Label().setAnchorPoint(0.5,0).setPosition(0,0).setFill('#fff').setSize(200,50).setText('Click here to enter text');
    inputFields[0].getDeepestDomElement().setAttribute('id','titleInput');
    inputFields[1] = new builder.Label().setAnchorPoint(0.5,0).setPosition(0,100).setFill('#fff').setSize(200,50).setText('Click here to enter text');
    inputFields[1].getDeepestDomElement().setAttribute('id','descriptionInput');    



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

    //Input fields
    for (i = 0; i<inputFields.length; i++)
    {
        (function (i) {
             if(inputFields[i].inactive){ //this doesn't work
                goog.events.listen(inputFields[i], ['mousedown', 'touchstart'], function(e) {
                util.makeTextBox(inputFields[i]);
                inputFields[i].inactive = false;

                e.event.stopPropagation();
                console.log(i);
                });
            }
        }) (i);
    }

    //scene & block listener
    for (i = 0; i<scenes.length; i++)
    {
        (function (i) {
            goog.events.listen(scenes[i], ['mousedown', 'touchstart'], lu.Scene.click);
            lu.Scene.luBlockEvents(scenes[i]);
        }) (i);
    }


    goog.events.listen(btnHard, lime.Button.Event.CLICK, function() {
        builder.saveGame()
    });

    goog.events.listen(btnEdit, lime.Button.Event.CLICK, function(e) {
        lu.Scene.addNewScene(scenes);
        e.stopPropagation();
        console.log('button');
    });

    //mouseMenu events
    builder.mouseMenu.prototype.setupEvents();

    // Adding things
    // goog.events.listen(scene, lime.Button.Event.CLICK, function(e) {
    //     var temp = new lime.RoundedRect().setAnchorPoint(0.5,0.5).setSize(20,20).setFill('#fff').setPosition(util.getRelativeXCoord(e), util.getRelativeYCoord(e));
    //     scene.appendChild(temp);
    //      e.event.stopPropagation();
    // });

    // goog.events.listen(scene, ['mousedown', 'touchstart'], lu.Scene.click);

    goog.events.listen(scene, ['mousemove'], function(e) {
        util.updateMouseScreenCoords(e);
    });

    //Mouse stuff

    // goog.events.listen(scene, ['mousedown', 'touchstart'], builder.downHandler_, false, this);
    // goog.events.listen(scene, ['mousedown', 'touchstart',], builder.downHandler_, false, this);
    // goog.events.listen(scene, ['mousedown', 'touchstart', 'keydown'], builder.downHandler_, false, this);

    /*----APPENDS-----*/
    picLayer.appendChild(picBox2);
    picLayer.appendChild(picBox);
    for (i = 0; i<inputFields.length; i++)
    {
        picLayer.appendChild(inputFields[i]);
    }


    scene.appendChild(background);
    layer.appendChild(header);
    layer.appendChild(diffLayer);
    layer.appendChild(picLayer);
    scene.appendChild(layer);
    scene.appendChild(mouseMenu);

    for (i = 0; i<scene.luBlocks.length; i++)
    {
        scene.appendChild(scene.luBlocks[i]);
    }
};

builder.saveGame = function(){
    var serializedData = builder.serializeGame();
    // serializedData = {'title': inputFields[0].googText.getCleanContents(), 'description' : inputFields[1].googText.getCleanContents()};
        request.send('/save_game/', 'POST', goog.json.serialize(serializedData), {'content-type':'application/json'});
};

builder.serializeGame = function(){
    return gameData = {
        'title': inputFields[0].googText.getCleanContents(),
        'description' : inputFields[1].googText.getCleanContents(),
        'pointGoal' : 0,
        'scenes' : builder.serializeScenes()
    };
    // return gameData;
};

builder.serializeScenes = function(){
    sceneArray = new Array();
    goog.array.forEach(scenes, function(sc, index) {
        sceneArray[index] = {'ID': sc.ID};
    });
    return sceneArray;
};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('builder.start', builder.start);













