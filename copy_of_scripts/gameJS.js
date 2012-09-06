//set main namespace
goog.provide('gameJS');


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

goog.require("goog.dom");
goog.require("goog.net.XhrIo");
goog.require("goog.structs.Map");
goog.require("goog.Uri.QueryData");

goog.require("goog.json.Serializer");


gameJS.WIDTH = 640; //This is all about ratio
gameJS.HEIGHT = 480; //A big no allows us to use reasonable numbers for the coordinate system
gameID = 0;
gameData = 0;

// entrypoint
gameJS.start = function(game_id) {

    gameJS.director = new lime.Director(document.getElementById('gamecontainer'), gameJS.WIDTH, gameJS.HEIGHT);
    //gameJS.director.setAnchorPoint(0,0).setPosition(0,0);
    //gameJS.director.makeMobileWebAppCapable();

    gameData = util.getGame(game_id, gameJS.loadGame);

    lime.Label.defaultFont = 'Times';

};

gameJS.loadGame = function(gameJson) {

    // var string = '{"name":"John"}';
    // var person = goog.json.parse(string);
    // console.log(string);
    // console.log('obj: ' + person);
    // console.log(person.name);



    var gamePackage = goog.json.parse(gameJson);
    var gameObject = gamePackage[0];
    var game = gameObject.fields;
    //debugger;
    console.log('String: ' + gameJson);
    console.log('Title: ' + game.title);
    console.log('description: ' + game.description);
    /*Declarations*/

    var scene = new lime.Scene();
    gameJS.director.replaceScene(scene, lime.transitions.MoveInDown);

    var layer = new lime.Layer().setPosition(gameJS.WIDTH * .5, 0);
    
    var background = new lime.Sprite().setAnchorPoint(0,0).setPosition(0,0).setSize(gameJS.WIDTH,gameJS.HEIGHT);
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
    var headerBG = new lime.Sprite().setPosition(0,0).setSize(gameJS.WIDTH,80);
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
    var diffLabel = new lime.Label().setText(('mode').toUpperCase()).setFontSize(30).setAnchorPoint(0.5,0).setPosition(0,0).setFontColor('#f00');
    var btnEasy = new gameJS.Button('EASY').setPosition(0, 50).setSize(100, 40);
    var btnMedium = new gameJS.Button('MEDIUM').setPosition(0, 100).setSize(100, 40);
    var btnHard = new gameJS.Button('HARD').setPosition(0, 150).setSize(100, 40);
    
    diffLayer.appendChild(diffBox2);
    diffLayer.appendChild(diffBox);
    diffLayer.appendChild(diffLabel);
    diffLayer.appendChild(btnEasy);
    diffLayer.appendChild(btnMedium);
    diffLayer.appendChild(btnHard);


    /*------Picture--------*/
    var picLayer = new lime.Layer().setPosition(150, 150);
    var picBox = new lime.RoundedRect().setAnchorPoint(0.5,0).setSize(200,200).setFill(headerBGF);
    var picBox2 = new lime.RoundedRect().setAnchorPoint(0.5,0).setSize(202,202).setFill('#000').setPosition(-1,-1);
    var picBig = new lime.Circle().setSize(100,100).setFill('#0ff').setPosition(0,100);

    picLayer.appendChild(picBox2);
    picLayer.appendChild(picBox);
    picLayer.appendChild(picBig);


     /*------Examples--------*/
    var exLayer = new lime.Layer().setPosition(150, 100);
    var exBox = new lime.RoundedRect().setAnchorPoint(0.5,0).setSize(300,300).setFill(headerBGF);
    var exBox2 = new lime.RoundedRect().setAnchorPoint(0.5,0).setSize(302,302).setFill('#000').setPosition(-1,-1);
    var exLabel = new lime.Label().setText('hello').setFontSize(50).setFontColor('#0ff').setPosition(0, 100);

    exLayer.appendChild(exBox2);
    exLayer.appendChild(exBox);
    exLayer.appendChild(exLabel);
    exLayer.setHidden(true);


    /*---------Listeners-------*/
    scene.listenOverOut(btnEasy,
        function(e){
            picLayer.setHidden(true);
            exLayer.setHidden(false);
            exLabel.setText('EASY EXAMPLE');
            },
        function(e){
            picLayer.setHidden(false);
            exLayer.setHidden(true);
            }
        );
    goog.events.listen(btnEasy, lime.Button.Event.CLICK, function() {
      gameJS.loadScene(1);
    });
    scene.listenOverOut(btnMedium,
        function(e){
            picLayer.setHidden(true);
            exLayer.setHidden(false);
            exLabel.setText('MEDIUM EXAMPLE');
            },
        function(e){
            picLayer.setHidden(false);
            exLayer.setHidden(true);
            }
        );
    goog.events.listen(btnMedium, lime.Button.Event.CLICK, function() {
      gameJS.loadGame(2);
    });
    scene.listenOverOut(btnHard,
        function(e){
            picLayer.setHidden(true);
            exLayer.setHidden(false);
            exLabel.setText('HARD EXAMPLE');
            },
        function(e){
            picLayer.setHidden(false);
            exLayer.setHidden(true);
            }
        );
    goog.events.listen(btnHard, lime.Button.Event.CLICK, function() {
      gameJS.loadGame(3);
    });

    /*----APPENDS-----*/
    scene.appendChild(background);
    layer.appendChild(header);
    layer.appendChild(diffLayer);
    layer.appendChild(exLayer);
    layer.appendChild(picLayer);
    scene.appendChild(layer);
    
};


gameJS.loadScene = function(level) {

};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('gameJS.start', gameJS.start);
