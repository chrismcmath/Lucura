$(document).ready(function() {

	//Load number of stars from previous review
	initRating = $('#gameID').attr('rating');
	$('.current-rating').width((initRating/5)*125);

	//Load review if the user has already submitted one
	review = $('#gameID').attr('review');
	if(review != "")
		$('#review textarea').val(review);

	$(".one-star").click(function() {
		vote(1);
	});
	$(".two-stars").click(function() {
		vote(2);
	});
	$(".three-stars").click(function() {
		vote(3);
	});
	$(".four-stars").click(function() {
		vote(4);
	});
	$(".five-stars").click(function() {
		vote(5);
	});

	function vote(score)
	{
		$.ajax({
			type: "POST",
			url: "/vote/",
			data: "item_id=12345&vote=" + score + "&game=" + $('#gameID').attr('value'),
			success: function(res){
				$('.current-rating').width((res/5)*125);
				// $('.current-rating-result').html(res.status);
			}
		});
	}


	//Setup seconds
	time = jQuery('#inputTime')[0].textContent;
	totalSeconds = time/1000;
	minutes = Math.floor(totalSeconds /60);
	remainderSeconds = Math.round(totalSeconds % 60);


	if(minutes < 1)
	{
		text = remainderSeconds + " seconds";
	}
	else
	{
		text = minutes + " minutes " + remainderSeconds + " seconds";
	}
	
	jQuery('#inputTime')[0].textContent = text;


	$('#review').keypress(function(e){
		if(e.which == 13){
			e.preventDefault();
			data = $(':input').val();
			$.ajax({
				type: "POST",
				url: "/submitReview/",
				data: "review=" + data + "&game=" + $('#gameID').attr('value'),
				success: function(res){
					alert('Review submitted');
				}
			})
		}
	});

 });


