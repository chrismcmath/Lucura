# Create your views here.

from django.template import RequestContext
from django.shortcuts import render_to_response, get_object_or_404
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
import datetime
from django.utils import timezone
import pdb

def login_user(request): #looks like we're gonna get some info from a form
    state = "Please log in just below..."
    lastDateDec = ""
    timeLapse = ""
    username = password = '' #if there's no request, we use these defaults
    
	
    return render_to_response('auth.html',{'state':state, 'lastDateDec': lastDateDec, 'timeLapse': timeLapse, 'username': username},
        context_instance=RequestContext(request))
	#Returning string and username to redisplay in case of error etc.

# def logout(request):
# 	try:
# 		del request.session['member_id']
# 	except KeyError:
# 		pass
# 	return HttpResponse("You're logged out.")

def display_hub(request): #need to split this into two functions, check user, and games page
	#user = get_object_or_404(User, pk=)
	state =''
	if request.POST:
		username = request.POST.get('username') #capture the username 
		password = request.POST.get('password')
		user = User.objects.get(username=username)
		welcome_msg = "Welcome back " + user.username + "!<br/>"
		lastDateDec = "You last entered the site on " + user.last_login.strftime("%d/%m/%y")
		timeLapse = "You last entered " + str(timezone.now() - user.last_login) + " days ago."

		user = authenticate(username=username, password=password)

		if user is not None:
			if user.is_active:
				login(request, user)
				
			else:
				state = "Your account is not active, please contact us"
		else: #i.e it didn't match
			state = "Your username and/or password were incorrect."
			return render_to_response('auth.html',{'state':state, 'lastDateDec': lastDateDec, 'timeLapse': timeLapse, 'username': username},
	        context_instance=RequestContext(request))
	return render_to_response('hub.html',{'welcome_msg':welcome_msg, 'lastDateDec': lastDateDec, 'timeLapse': timeLapse, 'username': username},
        context_instance=RequestContext(request))