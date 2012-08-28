//set main namespace
goog.provide('player');


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
goog.require('util');

goog.require("cu.StatLayer");
goog.require("cu.Scene");

goog.require("goog.dom");
goog.require("goog.net.XhrIo");
goog.require("goog.structs.Map");
goog.require("goog.Uri.QueryData");

goog.require("goog.json.Serializer");


player.WIDTH = 640; //This is all about ratio
player.HEIGHT = 480; //A big no allows us to use reasonable numbers for the coordinate system
player.gameID = 0;
gameData = 0;

/*GLOBALS*/
statLayer = '';
scene = '';

// entrypoint
player.start = function(game_id) {

    player.director = new lime.Director(document.getElementById('gamecontainer'), player.WIDTH, player.HEIGHT);
    //player.director.makeMobileWebAppCapable();
    player.director.setDisplayFPS(false);

    player.gameID = game_id;
    gameData = util.getGame(game_id, player.loadGame);

    lime.Label.defaultFont = 'Times';

};

player.loadGame = function(gameJson) {

    var gamePackage = goog.json.parse(gameJson);
    var gameObject = gamePackage[0];
    var game = gameObject.fields;

    scene = new cu.Scene(game);
    player.director.replaceScene(scene, lime.transitions.MoveInDown);

    /*Call relevant functions to load game components*/
    for (var i = 1; i < gamePackage.length; i++)
    {
        switch(gamePackage[i].model)
        {
            case "games.layer":
                console.log('ISA layer');
                scene.loadLayer(
                    goog.json.parse(gamePackage[i].fields.background),
                    gamePackage[i].fields.goal,
                    goog.json.parse(gamePackage[i].fields.instruction),
                    gamePackage[i].fields.target,
                    gamePackage[i].fields.timeLimit,
                    gamePackage[i].fields.xGrav,
                    gamePackage[i].fields.yGrav);
                if(gamePackage[i].pk == 1)
                {
                    console.log('is primary')
                }
                break;
            case "games.block":
                console.log('ISA block');
                scene.layers[gamePackage[i].fields.parentLayer].loadBlock(
                    gamePackage[i].fields.blockID,
                    goog.json.parse(gamePackage[i].fields.blockType),
                    goog.json.parse(gamePackage[i].fields.position),
                    goog.json.parse(gamePackage[i].fields.size),
                    goog.json.parse(gamePackage[i].fields.rotation),
                    goog.json.parse(gamePackage[i].fields.scale),
                    goog.json.parse(gamePackage[i].fields.fill),
                    gamePackage[i].fields.points,
                    goog.json.parse(gamePackage[i].fields.movement),
                    goog.json.parse(gamePackage[i].fields.nodeData),
                    gamePackage[i].fields.isTarget,
                    goog.json.parse(gamePackage[i].fields.text),
                    goog.json.parse(gamePackage[i].fields.fontFamily),
                    gamePackage[i].fields.fontSize,
                    goog.json.parse(gamePackage[i].fields.fontColour),
                    gamePackage[i].fields.parentLayer);
                break;
        }
    }

    /*Create all layers*/
    statLayer = new cu.StatLayer();

    /*Appends*/
    scene.appendChild(statLayer);
};


player.loadScene = function(level) {

};

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('player.start', player.start);
