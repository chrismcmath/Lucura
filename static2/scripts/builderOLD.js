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


// entrypoint
builder.start = function() {

    builder.director = new lime.Director(document.getElementById('gamecontainer'), builder.WIDTH, builder.HEIGHT);
    //builder.director.setAnchorPoint(0,0).setPosition(0,0);
    //builder.director.makeMobileWebAppCapable();

    lime.Label.defaultFont = 'Times';

    builder.loadMenuScene();

};

builder.loadTestScene = function() {
    var scene = new lime.Scene();
    builder.director.replaceScene(scene);
    var background = new lime.Sprite().setAnchorPoint(0,0).setPosition(0,0).setSize(640,480);
    var backGrad = new lime.fill.LinearGradient().
        setDirection(0,0,1,1).
        addColorStop(0,100,0,0,1).
        addColorStop(1,0,0,100,0.5); //(P,R,G,B,A)
    background.setFill(backGrad);
    scene.appendChild(background);    
}


builder.loadMenuScene = function(opt_transition) {

    /*Declarations*/
    var scene = new lime.Scene();
    builder.director.replaceScene(scene, lime.transitions.MoveInDown);

    var layer = new lime.Layer().setPosition(builder.WIDTH * .5, 0);
    
    var background = new lime.Sprite().setAnchorPoint(0,0).setPosition(0,0).setSize(builder.WIDTH,builder.HEIGHT);
    var backGrad = new lime.fill.LinearGradient().
        setDirection(1,1,0,0).
        addColorStop(0,100,0,0,1).
        addColorStop(1,0,0,100,0.5); //(P,R,G,B,A)
    background.setFill(backGrad);

    //Header
    var header = new lime.Layer().setPosition(0,0);
    var titleText = 'Addition';
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


    function updateFieldContents() {
        goog.dom.getElement('fieldContents').value = myField.getCleanContents();
      }

    function addTextBox() {
        //goog.editor.Field takes the id of the dom element
        titleField = new goog.editor.Field('titleInput');
        titleField.setHtml(false, "What's the title?");
        titleField.makeEditable();

        descriptionField = new goog.editor.Field('descriptionInput');
        descriptionField.setHtml(false, "What's the description?");
        descriptionField.makeEditable();

        //updateFieldContents();
    }

    function makeTextBox(element) {
        textBox = new goog.editor.Field(element.getDeepestDomElement().getAttribute('id'));
        textBox.setHtml(false, "Enter Text...");
        textBox.makeEditable();
    }

    /// parentElement is the element to which the editable node will be added.
    // debugger;
    // var dom = goog.dom.getDomHelper(document);
    // /// Create a div that becomes the editable region.
    // var myDiv = dom.createDom(goog.dom.TagName.DIV, {id: 'myId'});
    // scene.appendChild(myDiv);
    // /// Create the goog.editor.Field from myDiv.

    // parentElement is the element to which the editable node will be added.
    // var dom = goog.dom.getDomHelper(scene);
    // // Create a div that becomes the editable region.
    // var myDiv = dom.createDom(goog.dom.TagName.DIV, {id: 'myId'});
    // scene.appendChild(myDiv);
    // // Create the goog.editor.Field from myDiv.
    // var my_field = new goog.editor.Field('myId');

    // var buttons = [
    //   goog.editor.Command.BOLD,
    //   goog.editor.Command.ITALIC,
    //   goog.editor.Command.UNDERLINE,
    //   goog.editor.Command.FONT_COLOR,
    //   goog.editor.Command.BACKGROUND_COLOR,
    //   goog.editor.Command.FONT_FACE,
    //   goog.editor.Command.FONT_SIZE,
    //   goog.editor.Command.LINK,
    //   goog.editor.Command.UNDO,
    //   goog.editor.Command.REDO,
    //   goog.editor.Command.UNORDERED_LIST,
    //   goog.editor.Command.ORDERED_LIST,
    //   goog.editor.Command.INDENT,
    //   goog.editor.Command.OUTDENT,
    //   goog.editor.Command.JUSTIFY_LEFT,
    //   goog.editor.Command.JUSTIFY_CENTER,
    //   goog.editor.Command.JUSTIFY_RIGHT,
    //   goog.editor.Command.SUBSCRIPT,
    //   goog.editor.Command.SUPERSCRIPT,
    //   goog.editor.Command.STRIKE_THROUGH,
    //   goog.editor.Command.REMOVE_FORMAT
    // ];
    // var myToolbar = goog.ui.editor.DefaultToolbar.makeToolbar(buttons, goog.dom.getElementById('toolbar'));
 
    // // Hook the toolbar into the field.
    // var myToolbarController = new goog.ui.editor.ToolbarController(my_field, myToolbar);
    // // goog.events.listen(this.field, goog.editor.Field.EventType.LOAD, example.editorApp.loadHandler);
    // debugger;
    // my_field.makeEditable();
    // my_field.setHtml(false, 'This is where <b>you</b> can type!');



    /*-----Difficulty-------*/

    var diffLayer = new lime.Layer().setPosition(-150, 150);
    var diffBox = new lime.RoundedRect().setAnchorPoint(0.5,0).setSize(200,200).setFill(headerBGF);
    var diffBox2 = new lime.RoundedRect().setAnchorPoint(0.5,0).setSize(202,202).setFill('#000').setPosition(-1,-1);
    var diffLabel = new lime.Label().setText(('Save File').toUpperCase()).setFontSize(30).setAnchorPoint(0.5,0).setPosition(0,0).setFontColor('#f00');
    var btnHard = new gameJS.Button('Send Title').setPosition(0, 150).setSize(100, 40);
    var btnEdit = new gameJS.Button('Edit Game').setPosition(0, 100).setSize(100, 40);
    
    
    diffLayer.appendChild(diffBox2);
    diffLayer.appendChild(diffBox);
    diffLayer.appendChild(diffLabel);
    diffLayer.appendChild(btnHard);
    diffLayer.appendChild(btnEdit);

    /*------Picture--------*/
    var picLayer = new lime.Layer().setPosition(150, 150);
    var picBox = new lime.RoundedRect().setAnchorPoint(0.5,0).setSize(200,200).setFill(headerBGF);
    var picBox2 = new lime.RoundedRect().setAnchorPoint(0.5,0).setSize(202,202).setFill('#000').setPosition(-1,-1);

    var inputFields = new Array();
    inputFields[0] = new lime.Label().setAnchorPoint(0.5,0).setPosition(0,0).setFill('#fff').setSize(200,50).setText('Click here to enter text');
    inputFields[0].getDeepestDomElement().setAttribute('id','titleInput');
    inputFields[1] = new lime.Label().setAnchorPoint(0.5,0).setPosition(0,100).setFill('#fff').setSize(200,50).setText('Click here to enter text');
    inputFields[1].getDeepestDomElement().setAttribute('id','descriptionInput');
    // var dF = new lime.Label().setAnchorPoint(0.5,0).setPosition(0,100).setFill('#fff').setSize(200,50).setText('Click here to enter text');
    // dF.getDeepestDomElement().setAttribute('id','descriptionInput');


    for (i = 0; i<inputFields.length; i++)
    {
        (function (i) {
            var eventObj = inputFields[i];
            goog.events.listen(eventObj, lime.Button.Event.CLICK, function() {
             // makeTextBox(inputFields[i].getDeepestDomElement().getAttribute('id'));
             // debugger;
             makeTextBox(eventObj);
            });
        }) (i);
    }

    picLayer.appendChild(picBox2);
    picLayer.appendChild(picBox);
    for (i = 0; i<inputFields.length; i++)
    {
        picLayer.appendChild(inputFields[i]);
    }
    // picLayer.appendChild(dF);

    /*---------Listeners-------*/
    // scene.listenOverOut(btnHard,
    //     function(e){
    //         picLayer.setHidden(true);
    //         exLayer.setHidden(false);
    //         exLabel.setText('Save game to DB');
    //         },
    //     function(e){
    //         picLayer.setHidden(false);
    //         exLayer.setHidden(true);
    //         }
    //     );

    //OLD XHRIO CODE
    var request = new goog.net.XhrIo(); 
    goog.events.listen(request, 'complete', function(){
      if(request.isSuccess()){
        var data = request.getResponseJson();
        console.log('Sent!' + data + ' also: ' + request.body);
      } else {
        //error
        alert('error');
      }
    });

    goog.events.listen(btnHard, lime.Button.Event.CLICK, function() {
        var data = {'title': titleField.getCleanContents(), 'description' : descriptionField.getCleanContents()};
        request.send('/save_game/', 'POST', goog.json.serialize(data), {'content-type':'application/json'});
    });



    
   

    goog.events.listen(btnEdit, lime.Button.Event.CLICK, function() {
     addTextBox();
    });

    /*----APPENDS-----*/
    scene.appendChild(background);
    layer.appendChild(header);
    layer.appendChild(diffLayer);
    layer.appendChild(picLayer);
    scene.appendChild(layer);

    /*test*/
    // var textData = {"bindings": [
    //     {"ircEvent": "PRIVMSG", "method": "newURI", "regex": "^http://.*"},
    //     {"ircEvent": "PRIVMSG", "method": "deleteURI", "regex": "^delete.*"},
    //     {"ircEvent": "PRIVMSG", "method": "randomURI", "regex": "^random.*"}
    // ]
    // };
    // console.log('td: ' + textData);
    // var json = goog.json.serialize(textData);
    // var myObject = goog.json.parse(json);
    // var jsonText = goog.json.serialize(myObject);
    // alert(jsonText);

    
};


builder.loadGame = function(level) {
   
   
};



//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('builder.start', builder.start);
