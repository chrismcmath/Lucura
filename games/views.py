# Create your views here.

from django.http import HttpResponse, Http404
from django.shortcuts import render_to_response, get_object_or_404, redirect
from django.template import RequestContext
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.conf import settings
import urllib2
from itertools import chain
from collections import namedtuple
from operator    import itemgetter

from games.models import Game, Message, Layer, Block, GameUserRelationship
from django.core import serializers
# import django.utils.simplejson as json
import json
import datetime
# from django.utils import simplejson 
from django.contrib.auth.models import User
import pdb

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
		error = "Sorry, passwords didn't match. Please "
		errorLink = "go back"
		return render_to_response('lucura/error.html',{'error_msg':error,'link':errorLink}, context_instance=RequestContext(request))

	#Check nobody already has this username
	if(User.objects.filter(username=username).count()):
		error = "Sorry, this username is taken. Please "
		errorLink = "go back"
		return render_to_response('lucura/error.html',{'error_msg':error,'link':errorLink}, context_instance=RequestContext(request))

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
	error = "You've registered! To log in please "
	errorLink = "go back"
	return render_to_response('lucura/error.html',{'error_msg':error,'link':errorLink}, context_instance=RequestContext(request))

@login_required
@csrf_exempt
def new_game(request):
	# pdb.set_trace()
	game = Game(
		title = 'New Game',
		description = 'Write a description here',
		author = request.user,
		pubDate = datetime.datetime.now(),
		lastEditDate = datetime.datetime.now())
	game.save()
	
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
		game.author = request.user
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

@csrf_exempt
@login_required
def list_all_games(request):
	game_list = []
	#Get Top Game info

	#Define a namedtuple to store the inf
	GameInfo = namedtuple('GameInfo', ['ID','Title', 'Author', 'Plays', 'StudentRating', 'TeacherRating', 'AverageRating', 'Type'])
	allGames = Game.objects.order_by('lastEditDate').reverse().select_related('gameuserrelationship')
	for game in allGames:
		relatedReviews = game.gameuserrelationship_set.all()
		teacherScore = 0
		studentScore = 0
		teacherCount = 0
		studentCount = 0
		uniquePlays = 0
		for review in relatedReviews:
			#Update game stats
			uniquePlays += review.attempts
			if(review.rating):
				print(review.rating)
				if(review.user.is_staff):
					teacherScore += review.rating
					teacherCount += 1
				else:
					studentScore += review.rating
					studentCount += 1
			else:
				print('no score :(')
		#Check for divide by zero

		if(teacherCount == 0):
			avgTeacherScore = 0
		else:
			avgTeacherScore = teacherScore/teacherCount
		if(studentCount == 0):
			avgStudentScore = 0
		else:
			avgStudentScore = studentScore/studentCount
		avgScore = float(avgTeacherScore+avgStudentScore)/2
		#Convert star scores into percentanges (for div)
		studentPercentage = (float(avgStudentScore)/5)*100
		teacherPercentage = (float(avgTeacherScore)/5)*100
		avgPercentage = (avgScore/5)*100

		#Get author's username
		username = game.author.username
		#Find out if the author is a teacher of student
		if(game.author.is_staff):
			typeColour = "teacherColour"
		else:
			typeColour = "studentColour"

		#Store details in an named tuple
		tempGame = GameInfo(
			ID=game.id,
			Title = game.title,
			Author = username,
			Plays = uniquePlays,
			StudentRating = studentPercentage,
			TeacherRating = teacherPercentage,
			AverageRating = avgPercentage,
			Type = typeColour)
		game_list.append(tempGame)
	#Sort the list, secondary key is number of plays
	# tempList = game_list.sort(key=itemgetter(3), reverse=True)
	# game_list.sort(tempList, key=itemgetter(6), reverse=True)
	all_games_list = game_list

	return render_to_response('lucura/games_list.html', {'all_games_list' : all_games_list},context_instance=RequestContext(request))

@csrf_exempt
@login_required
def list_games(request):
	game_list = []
	#Get Top Game info

	#Define a namedtuple to store the info
	GameInfo = namedtuple('GameInfo', ['ID','Title', 'Author', 'Plays', 'StudentRating', 'TeacherRating', 'AverageRating', 'Type'])
	allGames = Game.objects.select_related('gameuserrelationship')
	for game in allGames:
		relatedReviews = game.gameuserrelationship_set.all()
		teacherScore = 0
		studentScore = 0
		teacherCount = 0
		studentCount = 0
		uniquePlays = 0
		for review in relatedReviews:
			#Update game stats
			uniquePlays += review.attempts
			if(review.rating):
				print(review.rating)
				if(review.user.is_staff):
					teacherScore += review.rating
					teacherCount += 1
				else:
					studentScore += review.rating
					studentCount += 1
			else:
				print('no score :(')
		#Check for divide by zero

		if(teacherCount == 0):
			avgTeacherScore = 0
		else:
			avgTeacherScore = teacherScore/teacherCount
		if(studentCount == 0):
			avgStudentScore = 0
		else:
			avgStudentScore = studentScore/studentCount
		avgScore = float(avgTeacherScore+avgStudentScore)/2
		#Convert star scores into percentanges (for div)
		studentPercentage = (float(avgStudentScore)/5)*100
		teacherPercentage = (float(avgTeacherScore)/5)*100
		avgPercentage = (avgScore/5)*100

		#Get author's username
		username = game.author.username
		#Find out if the author is a teacher of student
		if(game.author.is_staff):
			typeColour = "teacherColour"
		else:
			typeColour = "studentColour"

		#Store details in an named tuple
		tempGame = GameInfo(
			ID=game.id,
			Title = game.title,
			Author = username,
			Plays = uniquePlays,
			StudentRating = studentPercentage,
			TeacherRating = teacherPercentage,
			AverageRating = avgPercentage,
			Type = typeColour)
		game_list.append(tempGame)
	#Sort the list, secondary key is number of plays
	tempList = game_list.sort(key=itemgetter(3), reverse=True)
	game_list.sort(tempList, key=itemgetter(6), reverse=True)
	top_games_list = game_list[0:10]
	all_games_list = game_list

	game_list = []

	#Get user games info
	UserGameInfo = namedtuple('UserGameInfo', ['ID', 'Title', 'Plays', 'AverageRating'])
	userGames = Game.objects.filter(author_id = request.user).order_by('pubDate').reverse().select_related('gameuserrelationship')
	for game in userGames:
		relatedReviews = game.gameuserrelationship_set.all()
		teacherScore = 0
		studentScore = 0
		teacherCount = 0
		studentCount = 0
		uniquePlays = 0
		for review in relatedReviews:
			#Update game stats
			uniquePlays += review.attempts
			if(review.rating):
				print(review.rating)
				if(review.user.is_staff):
					teacherScore += review.rating
					teacherCount += 1
				else:
					studentScore += review.rating
					studentCount += 1

		#Check for divide by zero
		if(teacherCount == 0):
			avgTeacherScore = 0
		else:
			avgTeacherScore = teacherScore/teacherCount
		if(studentCount == 0):
			avgStudentScore = 0
		else:
			avgStudentScore = studentScore/studentCount
		avgScore = float(avgTeacherScore+avgStudentScore)/2
		#Convert star scores into percentanges (for div)
		avgPercentage = (avgScore/5)*100

		#Store details in an named tuple
		tempGame = UserGameInfo(
			ID=game.id,
			Title = game.title,
			Plays = uniquePlays,
			AverageRating = avgPercentage)
		game_list.append(tempGame)
	#Sort the list, secondary key is number of plays
	user_games_list = game_list[0:10]

	game_list = []

	#Get Recently Played list
	RecentlyPlayedInfo = namedtuple('RecentlyPlayedInfo', ['ID','Title', 'Attempts', 'Score'])
	allRelationships = GameUserRelationship.objects.filter(user=request.user).order_by('lastPlayedDate').reverse().select_related('game')
	for relationship in allRelationships:
		if(relationship.score):
			score =	relationship.score
		else:
			score = 0
		tempGame = RecentlyPlayedInfo(
			ID= relationship.gameID.id,
			Title = relationship.gameID.title,
			Attempts = relationship.attempts,
			Score = score)
		game_list.append(tempGame)
	recently_played_list = game_list[0:10]

	player_list = []

	#Create list of top players
	sorted_games_list = all_games_list
	sorted_games_list.sort(key=itemgetter(0), reverse=False)
	TopPlayerInfo = namedtuple('TopPlayerInfo', ['Username', 'Played', 'Score', 'Type'])
	allUsers = User.objects.all().select_related('gameuserrelationship')
	for user in allUsers:
		#Assign colour
		if(user.is_staff):
			typeColour = "teacherColour"
		else:
			typeColour = "studentColour"
		user_relationship = user.gameuserrelationship_set.all()
		totalPercentage = 0;
		for relationship in user_relationship:
			if(relationship.score):
				score =	relationship.score
			else:
				score = 0
			gameID = relationship.gameID.id
			teacherRatio = sorted_games_list[gameID-1].TeacherRating
			adjustedPercentage = float(score) * (float(teacherRatio)/100)
			totalPercentage += adjustedPercentage
		tempUser = TopPlayerInfo(
			Username = user.username,
			Played = user_relationship.count(),
			Score = totalPercentage,
			Type = typeColour)
		player_list.append(tempUser)
	tempList = player_list.sort(key=itemgetter(1), reverse=True)
	player_list.sort(tempList, key=itemgetter(2), reverse=True)
	top_players_list = player_list[0:10]

	return render_to_response('lucura/games.html', {
		'top_games_list' : top_games_list,
		'user_games_list': user_games_list,
		'recently_played_list': recently_played_list,
		'top_players_list' : top_players_list},
		context_instance=RequestContext(request))

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
				userInfo = GameUserRelationship.objects.get(gameID = gameInstance, user = request.user)
				userInfo.attempts = userInfo.attempts + 1
				userInfo.lastPlayedDate = datetime.datetime.now()
				userInfo.save()
			else:
				userInfo = GameUserRelationship(
					gameID = gameInstance,
					user = request.user,
					score = 0,
					time = 0,
					rating = 3,
					attempts = 1,
					lastPlayedDate = datetime.datetime.now())
				userInfo.save()
			return render_to_response('lucura/game.html',{'game_id':game_id, 'userInfo':userInfo}, context_instance=RequestContext(request))
		else:
			return render_to_response('lucura/missing.html', context_instance=RequestContext(request))
	else:
		return redirect('/login/')

@login_required
def build_game(request, game_id):
	if request.user.is_authenticated():
		if(Game.objects.filter(pk = game_id).count()):
			game = Game.objects.get(pk = game_id)
			if(request.user.id != game.author_id):
				error = "Sorry, you are only allowed to edit "
				errorLink = "your own games!"
				return render_to_response('lucura/forbidden.html',{'error_msg':error,'link':errorLink}, context_instance=RequestContext(request))
			else:
				return render_to_response('lucura/build.html',{'game_id':game_id,},context_instance=RequestContext(request))
		else:
			return render_to_response('lucura/missing.html', context_instance=RequestContext(request))
	else:
		return redirect('/login/')

@login_required
def build_new_game(request, game_id):
	if request.user.is_authenticated():
		return render_to_response('build.html',{},context_instance=RequestContext(request))
	else:
		return redirect('/login/')

@login_required
def build_list(request):
	game_list = []
	UserGameInfo = namedtuple('UserGameInfo', ['ID', 'Title', 'Plays', 'StudentRating', 'TeacherRating', 'AverageRating'])
	userGames = Game.objects.filter(author_id = request.user).order_by('pubDate').reverse().select_related('gameuserrelationship')
	for game in userGames:
		relatedReviews = game.gameuserrelationship_set.all()
		teacherScore = 0
		studentScore = 0
		teacherCount = 0
		studentCount = 0
		uniquePlays = 0
		for review in relatedReviews:
			#Update game stats
			uniquePlays += review.attempts
			if(review.rating):
				print(review.rating)
				if(review.user.is_staff):
					teacherScore += review.rating
					teacherCount += 1
				else:
					studentScore += review.rating
					studentCount += 1

		#Check for divide by zero
		if(teacherCount == 0):
			avgTeacherScore = 0
		else:
			avgTeacherScore = teacherScore/teacherCount
		if(studentCount == 0):
			avgStudentScore = 0
		else:
			avgStudentScore = studentScore/studentCount
		avgScore = float(avgTeacherScore+avgStudentScore)/2
		#Convert star scores into percentanges (for div)
		studentPercentage = (float(avgStudentScore)/5)*100
		teacherPercentage = (float(avgTeacherScore)/5)*100
		avgPercentage = (avgScore/5)*100

		#Store details in an named tuple
		tempGame = UserGameInfo(
			ID=game.id,
			Title = game.title,
			Plays = uniquePlays,
			StudentRating = studentPercentage,
			TeacherRating = teacherPercentage,
			AverageRating = avgPercentage)
		game_list.append(tempGame)
	#Sort the list, secondary key is number of plays
	user_games_list = game_list[0:20]

	return render_to_response('lucura/build_list.html', {'user_games_list' : user_games_list},	context_instance=RequestContext(request))


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
def receiveMessage(request):
	message = Message(message = request.POST['message'],
    	posted_by = request.user,
    	timestamp = datetime.datetime.now())
	message.save()
	return HttpResponse()

@csrf_exempt
@login_required
def sendMessages(request):
	messages = Message.objects.order_by().order_by('timestamp').reverse()[0:5]
	# pdb.set_trace()
	MessageInfo = namedtuple('MessageInfo', ['Message', 'Author', 'Type'])
	messageTuples = []
	for msg in messages:
		if(msg.posted_by.is_staff):
			typeColour = "teacherColour"
		else:
			typeColour = "studentColour"
		tempMsg = MessageInfo(
			Message = msg.message,
			Author = msg.posted_by.username,
			Type = typeColour)
		messageTuples.append(tempMsg)

	# msgJSON = serializers.serialize("json", messages)
	return HttpResponse(json.dumps(messageTuples), mimetype="application/json")

@csrf_exempt
@login_required
def receiveVote(request):
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
	if(userScore > userInfo.score):
		userInfo.score = userScore
		userInfo.time = time
		userInfo.save()
	elif(userScore == userInfo.score):
		if(time < userInfo.time):
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
