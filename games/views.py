# Create your views here.

from django.http import HttpResponse, Http404
from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.conf import settings
import urllib2
from itertools import chain

from games.models import Game, Message, Layer, Block, GameUserRelationship
from django.core import serializers
# import django.utils.simplejson as json
import json
import datetime
# from django.utils import simplejson 
from django.contrib.auth.models import User
import pdb
import json

def registerUser(request):
	# pdb.set_trace();
	username = request.POST.get('regUsername')
	fName = request.POST.get('firstName')
	lName = request.POST.get('lastName')
	pass1 = request.POST.get('regPassword')
	pass2 = request.POST.get('passwordConfirmation')
	accType = request.POST.get('accountType')
	email = request.POST.get('accountType')

	if(pass1 != pass2):
		return HttpResponse('<h1>Passwords did not match!</h1>')

	#Check nobody already has this username
	if(User.objects.filter(username=username).count()):
		return HttpResponse('<h1>Sorry, somebody already has that username!</h1>')

	user = User.objects.create_user(
		username=username,
		email=email,
		password=pass1)
	user.first_name = fName
	user.last_name = lName
	if(accType == 'student'):
		user.is_staff = 0;
	elif(accType == 'teacher'):
		user.is_staff = 1;
	user.save()

	#JQuery has already done the checks so we can store straight away
	return HttpResponse("<h1>You're registered!</h1>")

@login_required
@csrf_exempt
def new_game(request):
	game = Game(
		title = 'New Game',
		description = 'Write a description here',
		author = request.user,
		pubDate = datetime.datetime.now(),
		lastEditDate = datetime.datetime.now())
	game.save()
	# pdb.set_trace()
	layer = Layer(
		gameID = game,
		layerID = 0,
		goal = 0,
		target = 1,
		timeLimit = 5,
		instruction = '"edit this instruction"',
		background = '"#a4c4c3"',
		xGrav = 0,
		yGrav = 10)
	layer.save()

	return redirect('/build/' + str(game.id))
	# return render_to_response('build.html',{'game_id':game.id}, context_instance=RequestContext(request))

@login_required
@csrf_exempt
def save_game(request):
	if request.method == 'POST':
		info = json.loads(request.body);

		game = Game.objects.get(pk=info.get('ID'))
		game.title = info.get('title')
		game.description= info.get('description')
		game.lastEditDate = datetime.datetime.now()
		game.author = User.objects.get(username='chrismcmath')
		game.save()
		
		layers = info.get('layers')
		for lr in layers:
			if(Layer.objects.filter(layerID = lr.get('ID'), gameID = game).count()):
				#if already exists, update
				layer = Layer.objects.get(layerID = lr.get('ID'), gameID = game)
				layer.goal = lr.get('Goal')
				layer.target = lr.get('Target')
				layer.timeLimit = lr.get('TimeLimit')
				layer.instruction = lr.get('Instruction')
				layer.background = lr.get('Background')
				layer.xGrav = lr.get('gravX')
				layer.yGrav = lr.get('gravY')
			else:
				#create new layer
				layer = Layer(gameID = game,
				layerID = lr.get('ID'),
				goal = lr.get('Goal'),
				target = lr.get('Target'),
				timeLimit = lr.get('TimeLimit'),
				instruction = lr.get('Instruction'),
				background = lr.get('Background'),
				xGrav = lr.get('gravX'),
				yGrav = lr.get('gravY'))
		 	layer.save()
		 	
		 	blocks = lr.get('Blocks')
		 	for tempBlock in blocks:
		 		# pdb.set_trace()
		 		if(Block.objects.filter(layerID = layer, blockID = tempBlock.get('ID')).count()):
		 			#BLOCK already exists, update
		 			block = Block.objects.get(layerID = layer, blockID = tempBlock.get('ID'))
		 			block.position = tempBlock.get('Position')
		 			block.size = tempBlock.get('Size')
			 		block.scale = tempBlock.get('Scale')
			 		block.rotation = int(round(float(tempBlock.get('Rotation'))))
			 		block.blockType = tempBlock.get('Type')
			 		block.parentLayer = tempBlock.get('ParentLayer')
			 		block.fill = tempBlock.get('Fill')
			 		block.points = tempBlock.get('Points')
			 		block.movement = tempBlock.get('Movement')
			 		block.nodeData = tempBlock.get('NodeData')
			 		block.isTarget = tempBlock.get('IsTarget')
			 		block.text = tempBlock.get('Text')
			 		block.fontFamily = tempBlock.get('FontFamily')
			 		block.fontSize = tempBlock.get('FontSize')
			 		block.fontColour = tempBlock.get('FontColour')
		 		else:
			 		block = Block(layerID = layer,
			 		blockID = tempBlock.get('ID'),
			 		position = tempBlock.get('Position'),
			 		size = tempBlock.get('Size'),
			 		scale = tempBlock.get('Scale'),
			 		rotation = int(round(float(tempBlock.get('Rotation')))),
			 		blockType = tempBlock.get('Type'),
			 		parentLayer = tempBlock.get('ParentLayer'),
			 		fill = tempBlock.get('Fill'),
			 		points = tempBlock.get('Points'),
			 		movement = tempBlock.get('Movement'),
			 		nodeData = tempBlock.get('NodeData'),
			 		isTarget = tempBlock.get('IsTarget'),
			 		text = tempBlock.get('Text'),
			 		fontFamily = tempBlock.get('FontFamily'),
			 		fontSize = tempBlock.get('FontSize'),
			 		fontColour = tempBlock.get('FontColour'))
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
	# pdb.set_trace()
	blocks = {}
	for (counter,lr) in enumerate(layers):
		print('count: ' + str(counter))
		blocks[counter] = lr.block_set.all()

	allData = list(chain(Game.objects.filter(pk=gameID),layers))
	for (i, block) in enumerate(blocks):
			allData = list(chain(allData,blocks[i]))
	gameData = serializers.serialize("json", allData)

	return HttpResponse(json.dumps(gameData), mimetype="application/json")

#Is there any way of getting this data directly to javascript?
@login_required
def game(request, game_id):
	# pdb.set_trace();
	if request.user.is_authenticated():
		if(Game.objects.filter(pk = game_id).count()):
			gameInstance = Game.objects.get(pk=game_id)
			if(GameUserRelationship.objects.filter(gameID = gameInstance, user = request.user).count()):
				userInfo = GameUserRelationship.objects.get(gameID = gameInstance, user = request.user);
			else:
				userInfo = GameUserRelationship(
					gameID = gameInstance,
					user = request.user,
					review = "")
				userInfo.save()
			return render_to_response('lucura/game.html',{'game_id':game_id, 'userInfo':userInfo}, context_instance=RequestContext(request))
		else:
			return render_to_response('missing.html',{'game_id':game_id}, context_instance=RequestContext(request))
	else:
		return redirect('/login/')

@login_required
def build_game(request, game_id):
	if request.user.is_authenticated():
		if(Game.objects.filter(pk = game_id).count()):
			game = Game.objects.get(pk = game_id)
			if(request.user.id != game.author_id):
				return HttpResponse("<h1>This isn't your game.</h1>")
			else:
				return render_to_response('lucura/build.html',{'game_id':game_id,},context_instance=RequestContext(request))
		else:
			return HttpResponse("<h1>Game missing</h1>")
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

@csrf_exempt
@login_required
def receiveVote(request):
    # pdb.set_trace()
    score = request.POST.get('vote')
    gameID = request.POST.get('game')
    game = Game.objects.get(pk=gameID)
    userInfo = GameUserRelationship.objects.get(gameID = game, user = request.user)
    userInfo.rating = score
    userInfo.save()
    return HttpResponse(json.dumps(score), mimetype="application/json")

@csrf_exempt
@login_required
def receiveScore(request):
    info = json.loads(request.body)
    userScore = info.get('percentage')
    time = info.get('time')
    game = Game.objects.get(pk=info.get('gameID'))
    userInfo = GameUserRelationship.objects.get(gameID = game, user = request.user)
    if(userScore >= userInfo.score):
	    userInfo.score = userScore
	    userInfo.time = time
	    userInfo.save()
    return HttpResponse(status=200)

@csrf_exempt
@login_required
def receiveReview(request):
	review = request.POST.get('review')
	game = Game.objects.get(pk=request.POST.get('game'))
	userInfo = GameUserRelationship.objects.get(gameID = game, user = request.user)
	userInfo.review = review
	userInfo.save()
   	return HttpResponse(status=200)


# @csrf_exempt
# @login_required
# def sendUserGameData(request):
#     pdb.set_trace()
#     userInstance = request.user
#     if(GameUserRelationship.objects.filter(gameID = 1).count()):
#     	print('something')

#     return HttpResponse(json.dumps(score), mimetype="application/json")
