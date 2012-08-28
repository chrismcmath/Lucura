$(document).ready(function() {
	//Which dimension is the smaller?
	relativeWidth = jQuery('#game_text').width()*0.75;
	if(jQuery('#game_text').height() > relativeWidth)
	{
		//If the height is greater, crop it to the width
		jQuery('#game_text').height(jQuery('#game_text').width()*0.75);
	}
	else
	{
		//Otherwise crop the width to the height
		jQuery('#game_text').width(jQuery('#game_text').height()*1.333);
	}

	jQuery('#gameContainer').width(jQuery('#game_text').width());
	jQuery('#gameContainer').height(jQuery('#game_text').height());
	jQuery('#feedback').width(jQuery('#game_text').width());

	// debugger;
	// $('#gameID').
	// player.start($('#gameID').attr('value'));

});


$(window).resize(function() {
	//Give div maximum height, get relative width
	jQuery('#game_text').width((jQuery('#game_text').parent().width()));
	jQuery('#game_text').height(jQuery('#game_text').width()*0.75);

	jQuery('#feedback').width(jQuery('#game_text').width());

	// if(jQuery('#game_text').height() > jQuery('#game_text').parent().height())
	// {
	// 	jQuery('#game_text').height(jQuery('#game_text').parent().height()*0.6);
	// 	jQuery('#game_text').width(jQuery('#game_text').height()*1.333);
	// }



	// relativeWidth = jQuery('#game_text').width()*0.75;
	// if(jQuery('#game_text').height() > relativeWidth)
	// {
	// 	//If the height is greater, crop it to the width
	// 	jQuery('#game_text').height(jQuery('#game_text').width()*0.75);
	// }
	// else
	// {
	// 	//Otherwise crop the width to the height
	// 	jQuery('#game_text').width(jQuery('#game_text').height()*1.333);
	// }
});

