$(document).ready(function() {

	//Wait for number click
	$(".insertLibrary").click(function() {
		value = this.textContent;
		builder.mouseMenu.insertCharacter(value);
	});

	$("#fontButton").click(function() {
		colour = $('.colorpicker_new_color')[1].style.backgroundColor;
		builder.mouseMenu.changeFontColour(colour);
	});

	$("#blockButton").click(function() {
		colour = $('.colorpicker_new_color')[1].style.backgroundColor;
		builder.mouseMenu.changeBlockColour(colour);
	});

	$("#clearButton").click(function() {
		builder.mouseMenu.changeBlockColour("");
	});

	$("#submitButton").click(function() {
		builder.mouseMenu.makeSubmit();
	});

	$("#backButton").click(function() {
		colour = $('.colorpicker_new_color')[1].style.backgroundColor;
		builder.changeBackgroundColour(colour);
	});

 });


