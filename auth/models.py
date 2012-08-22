from django.db import models
from django.contrib.auth.models import User, Group, Permission

# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User)

    last_login = models.DateField #our own attribute
    def __unicode__(self):
		return self.name