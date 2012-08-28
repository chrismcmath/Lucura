$(document).ready(function(){
	$(document).keyup(function(e){
		 var gameDivElement = document.getElementById('center');
    	console.log(e.keyCode);
    	if(e.keyCode == 27){
    		if (gameDivElement.requestFullScreen) {
		        gameDivElement.requestFullScreen();
		    } else if (gameDivElement.webkitRequestFullScreen) {
		        gameDivElement.webkitRequestFullScreen();
		    } else if (gameDivElement.mozRequestFullScreen) {
		        gameDivElement.mozRequestFullScreen();
		    } else if (gameDivElement.msRequestFullScreen) {
		        gameDivElement.msRequestFullScreen();
		    } else {
		        requestLegacyFullScreen();
		    }
    	};//????
    });
});