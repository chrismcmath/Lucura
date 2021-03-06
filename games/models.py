from django.db import models
from django.contrib.auth.models import User

class Game(models.Model):
	title = models.CharField(max_length=100)
	pubDate = models.DateTimeField('date published')
	lastEditDate = models.DateTimeField('date last updated')
	author = models.ForeignKey(User)
	# uniquePlayers = models.IntegerField() NOT NEEDED AS WE CAN JOIN WITH RELATIONSHIP
	description = models.CharField(max_length=200)
	description.blank = True;
	description.null = True;
	def __unicode__(self):
		return self.title

# class Question(models.Model):
# 	gameID = models.ForeignKey(Game)
# 	question = models.CharField(max_length=1000)
# 	QUESTION_TYPES = (
# 		('MC', 'Multiple Choice'),
# 		)
# 	qType = models.CharField(max_length=2, choices = QUESTION_TYPES)
# 	def __unicode__(self):
# 		return self.question

# class Answer(models.Model):
# 	questionID = models.ForeignKey(Question)
# 	answer = models.CharField(max_length = 100)
# 	correct = models.BooleanField()
# 	points = models.IntegerField()
# 	points.default = 0
# 	def __unicode__(self):
# 		return self.answer

class Message(models.Model):
	message = models.TextField('Message')
	timestamp = models.DateTimeField('Timestamp',auto_now_add=True)
	posted_by = models.ForeignKey(User)
	def __unicode__(self):
		return self.message

class GameUserRelationship(models.Model):
	gameID = models.ForeignKey(Game)
	user = models.ForeignKey(User)
	rating = models.IntegerField(null = True, blank = True)
	score = models.IntegerField(null = True, blank = True)
	time = models.DecimalField(max_digits = 10, decimal_places = 3, null = True, blank = True)
	review = models.CharField(max_length=500)
	attempts = models.IntegerField()
	lastPlayedDate = models.DateTimeField('date last played')
	def __unicode__(self):
		return self.user


class Layer(models.Model):
	gameID = models.ForeignKey(Game)
	layerID = models.IntegerField()
	goal = models.IntegerField()
	target = models.IntegerField()
	xGrav = models.IntegerField()
	yGrav = models.IntegerField()
	timeLimit = models.IntegerField()
	instruction = models.CharField(max_length=144)
	background = models.CharField(max_length=200)
	def __unicode__(self):
		return self.layerID

class Block(models.Model):
	layerID = models.ForeignKey(Layer)
	parentLayer = models.IntegerField()
	blockID = models.IntegerField()
	position = models.CharField(max_length=50)
	size = models.CharField(max_length=50)
	scale = models.CharField(max_length=50)
	rotation = models.IntegerField()
	fill = models.CharField(max_length=200)
	blockType = models.CharField(max_length=10)
	points = models.IntegerField()
	movement = models.CharField(max_length=10)
	nodeData = models.CharField(max_length=50)
	isTarget = models.BooleanField()
	text = models.CharField(max_length=1000)
	fontFamily = models.CharField(max_length=30)
	fontSize = models.IntegerField()
	fontColour = models.CharField(max_length=30)
	





