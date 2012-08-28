$(document).ready(function()
{
	var currentDivID = "home_stack";

	$('#home').click(function()
	{
		$(currentDivID).fadeOut(1000);
		currentDivID = $(this).attr("id");
		$(this).fadeIn(1000);
		$(this).slideToggle("slow");
	});

	$('ul.main li').hover(function(){
		if($(this).attr('id') == 'menuTitle')
			return;
		$(this).animate({top:'-5px', backgroundColor:'#000000'},{queue:false,duration:50});
		$(this).removeClass("gradient");
		$(this).addClass("gradient2");
	}, function(){
		$(this).animate({top:'0px'},{queue:false,duration:100});
		$(this).removeClass("gradient2");
		$(this).addClass("gradient");
	});

	$('ul.main li').click(function(){
		$(this).animate({top:'-5px', backgroundColor:'#000000'},{queue:false,duration:5});
		$(this).removeClass("gradient2");
		$(this).addClass("gradient3");
	}, function(){
		$(this).animate({top:'0px'},{queue:false,duration:5});
		$(this).removeClass("gradient3");
		$(this).addClass("gradient2");
	});
})