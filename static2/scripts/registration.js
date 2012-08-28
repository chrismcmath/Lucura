$(document).ready(function() {



	// Registration Submit
	$('#registrationForm').submit(function(e) {
	  var submit = true;

	  var firstName = $('input[type=text][name=firstName]').val();
	  var lastName = $('input[type=text][name=lastName]').val();
	  var username = $('input[type=text][name=regUsername]').val();
	  // var p1 = $('input[type=text][name=regPassword]').val();
	  var email = $('input[type=text][name=email]').val();

	  if(username==""){
	  	alert("Please enter a username.")
	  	submit = false;
	  }
	  if(firstName==""){
	  	alert("Please enter a first name.")
	  	submit = false;
	  }
	  if(lastName==""){
	  	alert("Please enter a last name.")
	  	submit = false;
	  }
	  if(email==""){
	  	alert("Please enter an email.")
	  	submit = false;
	  }

	  if(!submit)
	  	return false;

	  return true;
	});

});