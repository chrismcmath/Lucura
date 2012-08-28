//set main namespace
goog.provide('Jeff');

//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');

// entrypoint
Jeff.start = function(){

 var director = new lime.Director(document.getElementById("stage"),800,600);
 director.setDisplayFPS(true);
 var title_scene = new lime.Scene();

 lime.Label.installFont('Living_By_Numbers', 'LIVINGBY.TTF');

 var target = new lime.Layer().setPosition(0,0);
 var lbl = new lime.Label().setPosition(350,150).setFontSize(200).setFontColor('#f92772').setFontFamily('LOT').setText('Build');
lbl.setSize(lbl.measureText().width * 1, lbl.measureText().height);
var lbl2 = new lime.Label().setPosition(450,350).setFontSize(200).setFontColor('#a6e22d').setFontFamily('LOT').setText('Game');
lbl2.setSize(lbl2.measureText().width * 1, lbl2.measureText().height);

 target.appendChild(lbl);
 target.appendChild(lbl2);

 title_scene.appendChild(target);

 goog.events.listen(
  lbl,
  ['mousedown','touchstart'],
  function(e){
   //animate
   if(lbl.getPosition().x != 400) return;
   lbl.runAction(
    new lime.animation.Spawn(
     new lime.animation.FadeTo(.5).setDuration(.2),
     new lime.animation.ScaleTo(0.5).setDuration(.8)
    )
   );
   lbl.runAction(new lime.animation.FadeTo(1));
   //let target follow the mouse/finger
   e.startDrag();
   //listen for end event
   e.swallow(
    ['mouseup','touchend'],
    function(){
     lbl.runAction(
      new lime.animation.Spawn(
       new lime.animation.FadeTo(1),
       new lime.animation.ScaleTo(1),
       new lime.animation.MoveTo(400,300)
      )
     );
    }
   );
  }
 );

 goog.events.listen(
  lbl2,
  ['mousedown','touchstart'],
  function(e){
   //animate
   if(lbl2.getPosition().x != 400) return;
   lbl2.runAction(
    new lime.animation.Spawn(
     new lime.animation.FadeTo(.5).setDuration(.2),
     new lime.animation.ScaleTo(0.5).setDuration(.8)
    )
   );
   lbl2.runAction(new lime.animation.FadeTo(1));
   //let target follow the mouse/finger
   e.startDrag();
   //listen for end event
   e.swallow(
    ['mouseup','touchend'],
    function(){
     lbl2.runAction(
      new lime.animation.Spawn(
       new lime.animation.FadeTo(1),
       new lime.animation.ScaleTo(1),
       new lime.animation.MoveTo(400,300)
      )
     );
    }
   );
  }
 );

 // set current scene active
 director.replaceScene(title_scene);
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('Jeff.start', Jeff.start);