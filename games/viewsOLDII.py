# Create your views here.

from django.http import HttpResponse, Http404
from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.conf import settings
import urllib2
from itertools import chain

from games.models import Game, Message, Layer, Block
from django.core import serializers
# import django.utils.simplejson as json
import json
import datetime
# from django.utils import simplejson 
from django.contrib.auth.models import User
import pdb
import json

@csrf_exempt
def new_game(request):
	game = Game(
		title = 'New Game',
		description = 'Write a description here',
		author = request.user,
		pubDate = datetime.datetime.now(),
		lastEditDate = datetime.datetime.now())
	game.save()

	return render_to_response('build.html',{'game_id':game.id}, context_instance=RequestContext(request))

@csrf_exempt
def save_game(request):
	if request.method == 'POST':
		info = json.loads(request.body);

		game = Game.objects.get(pk=info.get('ID'))
		game.title = info.get('title')
		game.description= info.get('description')
		# game.lastEditDate = datetime.datetime.now()
		game.author = User.objects.get(username='chrismcmath')
		game.save()
		
		layers = info.get('layers')
		for lr in layers:
		 	layer = Layer(gameID = game, layerID = lr.get('ID'))
		 	layer.save()
 			# pdb.set_trace()
		 	blocks = lr.get('Blocks')
		 	for b in blocks:
		 		block = Block(layerID = layer, blockID = b.get('ID'),
		 			position = b.get('Position'), scale = b.get('Scale'),
		 			rotation = b.get('Rotation'), blockType = b.get('Type'))
		 		block.save()
		
	return HttpResponse(request.body, mimetype="application/json")

#Function to pass game data to gameJS.js
@csrf_exempt
def get_game(request, game_id):
	if request.method == 'GET': 
		gameID = game_id
	if request.method == 'POST':
		gameID = simplejson.loads(request.body).get('id')

	game = Game.objects.get(pk=gameID)
	layers = game.layer_set.all()


	# Get all blocks
	blocks = {}
	for (counter,lr) in enumerate(layers):
		print('count: ' + str(counter))
		blocks[counter] = lr.block_set.all()
	pdb.set_trace()
	# gameSerial = Game.objects.select_related().get(pk=pk)
	# gameData = serializers.serialize("json", [gameSerial], indent = 4,
	# 	relations = ('layer','block',))
	allData = list(chain(Game.objects.filter(pk=gameID),layers))
	for (i, block) in enumerate(blocks):
		allData = list(chain(allData,blocks[i]))
	gameData = serializers.serialize("json", allData)
	# layerData = serializers.serialize("json", Layer.objects.filter(gameID = Game.objects.filter(pk=gameID)))
	# blockData = serializers.serialize("json", Block.objects.filter(layerID = Layer.objects.filter(gameID = Game.objects.filter(pk=gameID))))
	
	# layerList = list(Layer.objects.filter(gameID = Game.objects.filter(pk=gameID)))
	# layerObjects = Layer.objects.filter(gameID = Game.objects.filter(pk=gameID))
	
		#layerList += list(Block.objects.filter(layerID = lr))
	return HttpResponse(json.dumps(gameData), mimetype="application/json")

#Is there any way of getting this data directly to javascript?
@login_required
def game(request, game_id): #error because passed JSON instead of object 
	if request.user.is_authenticated():
		return render_to_response('game.html',{'game_id':game_id}, context_instance=RequestContext(request))
	else:
		return redirect('/login/')

@login_required
def build_game(request, game_id):
	if request.user.is_authenticated():
		return render_to_response('build.html',{'game_id':game_id,},context_instance=RequestContext(request))
	else:
		return redirect('/login/')

@login_required
def build_new_game(request, game_id):
	if request.user.is_authenticated():
		return render_to_response('build.html',{},context_instance=RequestContext(request))
	else:
		return redirect('/login/')


#Test stuff

# @csrf_exempt
# @login_required
# def message_view(request):
# 	# pdb.set_trace()
# 	if request.method == 'POST':
# 		newMessage = Message(message = request.POST['message'],
# 			posted_by = User.objects.get(username=request.user.username),
# 			questionID = Question.objects.get(pk=1))
# 		newMessage.save()
# 	messages = Message.objects.all()
# 	return render_to_response('messages.html',{'messages':messages},context_instance=RequestContext(request))

@csrf_exempt
@login_required
def message_view(request):
    # pdb.set_trace()
    messages = Message.objects.all()
    return render_to_response('messages.html', {'messages': messages},context_instance=RequestContext(request))

@csrf_exempt
# @login_required
def ajaxsubmit(request):
    pdb.set_trace()
    new_msg = Message(message = request.POST['message'],
                      posted_by = User.objects.get(username=request.user.username),
                      gameID = Game.objects.get(pk=1))
    new_msg.save()
    cmd = [{'cmd': 'inlinepush',
            'params': {
                'password': settings.APE_PASSWORD,
                'raw': 'postmsg',
                'channel': 'messages',
                'data': {
                    'msg': new_msg.message,
                    'posted_by': 'RANDOM_USER',
                    'timestamp': 'THIS TIME'
                }
            }
    }]
    url = settings.APE_SERVER + urllib2.quote(json.dumps(cmd))
    response = urllib2.urlopen(url)
    pdb.set_trace()
    # Updating the message is handled by APE, so just return an empty 200
    return HttpResponse()



