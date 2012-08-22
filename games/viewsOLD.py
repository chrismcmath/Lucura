# Create your views here.

from django.http import HttpResponse, Http404
from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required


from games.models import Game, Question, Message
from django.core import serializers
import json
import datetime
# from django.utils import simplejson 
from django.contrib.auth.models import User
import pdb
import json

@csrf_exempt
def save_game(request):
	if request.method == 'POST':
		info = json.loads(request.body);
		newGame = Game(title=info.get('title'), description=info.get('description'))
		newGame.pubDate = datetime.datetime.now()
		newGame.author = User.objects.get(username='chrismcmath')
		newGame.numberQuestions = 0
		newGame.save()
		pdb.set_trace()
	return HttpResponse(request.body, mimetype="application/json")

#Function to pass game data to gameJS.js
@csrf_exempt
def get_game(request, game_id):
	print('in get_game')
	# pdb.set_trace()
	if request.method == 'GET': 
		print('is get')
		print 'Raw Data: "%s"' % request.body
		print 'Get Data: "%s"' % request.GET
		gameID = game_id
	if request.method == 'POST':
		# print('is get')
		# print 'Raw Data: "%s"' % request.body
		# print 'POST Data: "%s"' % request.POST
		gameID = simplejson.loads(request.body).get('id')

# Parse the JSON
	# objs = json.loads(request.POST)

# Iterate through the stuff in the list
	# for o in objs:
# Do something Djangoey with o's name and message, like
		# record = SomeDjangoModel(name = o.name, message = o.message)
		# record.save()
		# print('obj: ' + o)
	data = serializers.serialize("json", Game.objects.filter(pk=gameID))
	return HttpResponse(json.dumps(data), mimetype="application/json")

#Is there any way of getting this data directly to javascript?
@login_required
def game(request, game_id): #error because passed JSON instead of object
	# pdb.set_trace()
	if request.user.is_authenticated():
		game = get_object_or_404(Game, pk=game_id)
		print('game: ' + game.title)
		return render_to_response('game.html',{'game':game,}, context_instance=RequestContext(request))
	else:
		return redirect('/login/')

@login_required
def build_game(request, game_id):
	if request.user.is_authenticated():
		game = get_object_or_404(Game, pk=game_id)
		return render_to_response('build.html',{},context_instance=RequestContext(request))
	else:
		return redirect('/login/')

@login_required
def build_new_game(request, game_id):
	if request.user.is_authenticated():
		return render_to_response('build.html',{},context_instance=RequestContext(request))
	else:
		return redirect('/login/')

@csrf_exempt
@login_required
def message_view(request):
	# pdb.set_trace()
	if request.method == 'POST':
		newMessage = Message(message = request.POST['message'],
			posted_by = User.objects.get(username=request.user.username),
			questionID = Question.objects.get(pk=1))
		newMessage.save()
	messages = Message.objects.all()
	return render_to_response('messages.html',{'messages':messages})
