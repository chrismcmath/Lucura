$(document).ready(function() {

	//Hightlighting for the top list
	$("#topGameList .field").hover(
	  function () {
	    index= $(this).index();

	    $('#topGameList .listColumn').each(function() {
	    	$(this).children().eq(index).css("background-color", "white");
		});
	  }, 
	  function () {
	    console.log('out');
	    $('.listColumn').each(function() {
	    	$(this).children().eq(index).css("background-color", "");
		});
	  }
	);

	//Hightlighting for the user's list
	$("#userGameList .field").hover(
	  function () {
	    index= $(this).index();

	    $('#userGameList .listColumn').each(function() {
	    	// debugger;
	    	$(this).children().eq(index).css("background-color", "white");
		});
	  }, 
	  function () {
	    console.log('out');
	    $('.listColumn').each(function() {
	    	$(this).children().eq(index).css("background-color", "");
		});
	  }
	);

	//Hightlighting for the user's full list
	$("#userGameListFull .field").hover(
	  function () {
	    index= $(this).index();

	    $('#userGameListFull .listColumn').each(function() {
	    	// debugger;
	    	$(this).children().eq(index).css("background-color", "white");
		});
	  }, 
	  function () {
	    console.log('out');
	    $('.listColumn').each(function() {
	    	$(this).children().eq(index).css("background-color", "");
		});
	  }
	);

	//Hightlighting for the recently played list
	$("#recentAdditionsList .field").hover(
	  function () {
	    index= $(this).index();

	    $('#recentAdditionsList .listColumn').each(function() {
	    	// debugger;
	    	$(this).children().eq(index).css("background-color", "white");
		});
	  }, 
	  function () {
	    console.log('out');
	    $('.listColumn').each(function() {
	    	$(this).children().eq(index).css("background-color", "");
		});
	  }
	);

	//Hightlighting for the recent games list
	$("#recentList .field").hover(
	  function () {
	    index= $(this).index();

	    $('#recentList .listColumn').each(function() {
	    	// debugger;
	    	$(this).children().eq(index).css("background-color", "white");
		});
	  }, 
	  function () {
	    console.log('out');
	    $('.listColumn').each(function() {
	    	$(this).children().eq(index).css("background-color", "");
		});
	  }
	);


	$("#topGameList .field").click(
	  function () {
	  	gameID = $(this).attr('gameid');
	  	console.log(gameID);
	  	redirect = '/games/' + gameID + '/';
	    document.location.href= redirect;
	  });
	$("#userGameList .field").click(
	  function () {
	  	gameID = $(this).attr('gameid');
	  	console.log(gameID);
	  	redirect = '/build/' + gameID + '/';
	    document.location.href= redirect;
	  });
	$("#userGameListFull .field").click(
	  function () {
	  	gameID = $(this).attr('gameid');
	  	console.log(gameID);
	  	redirect = '/build/' + gameID + '/';
	    document.location.href= redirect;
	  });
	$("#recentAdditionsList .field").click(
	  function () {
	  	gameID = $(this).attr('gameid');
	  	console.log(gameID);
	  	redirect = '/games/' + gameID + '/';
	    document.location.href= redirect;
	  });
	$("#recentList .field").click(
	  function () {
	  	gameID = $(this).attr('gameid');
	  	console.log(gameID);
	  	redirect = '/games/' + gameID + '/';
	    document.location.href= redirect;
	  });
});

