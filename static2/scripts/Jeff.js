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
goog.require('lime.animation.ColorTo');

// entrypoint
Jeff.start = function(){
 var director = new lime.Director(document.getElementById("stage"),800,600);
 director.setDisplayFPS(false);
 var title_scene = new lime.Scene();

 lime.Label.installFont('Living_By_Numbers', 'LIVINGBY.TTF');

 var target = new lime.Layer().setPosition(0,0);
 var lbl = new lime.Label().setPosition(400,200).setFontSize(200).setFontColor('#60d9ef').setFontFamily('LOT').setText('Play');
lbl.setSize(lbl.measureText().width * 1.5, lbl.measureText().height);
var lbl2 = new lime.Label().setPosition(250,350).setFontSize(170).setFontColor('#ae81ff').setFontFamily('LOT').setText('Time');
lbl2.setSize(lbl2.measureText().width * 1.5, lbl2.measureText().height);

var circle2 = new lime.Circle().setPosition(50,20).setSize(30,30).setFill(100,170,230);

 target.appendChild(lbl);
 target.appendChild(lbl2);

 title_scene.appendChild(target);
 title_scene.appendChild(circle2);

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
       new lime.animation.MoveTo(400,200)
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
   if(lbl2.getPosition().x != 250) return;
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
       new lime.animation.MoveTo(250,300)
      )
     );
    }
   );
  }
 );

goog.events.listen(circle2,['mousedown','touchstart'],function(e){

  //animate
  circle2.runAction(new lime.animation.Spawn(
      new lime.animation.FadeTo(.5).setDuration(.2),
      new lime.animation.ScaleTo(1.5).setDuration(.8)
  ));

  lbl2.runAction(new lime.animation.FadeTo(0));

  //let circle follow the mouse/finger
  e.startDrag();

  //listen for end event
  e.swallow(['mouseup','touchend'],function(){
      circle2.runAction(new lime.animation.Spawn(
          new lime.animation.FadeTo(1),
          new lime.animation.ScaleTo(1),
          new lime.animation.ColorTo(Math.random()*255,Math.random()*255,Math.random()*255)
      ));

      lbl2.runAction(new lime.animation.FadeTo(1));
  });


});

 // set current scene active
 director.replaceScene(title_scene);
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('Jeff.start', Jeff.start);