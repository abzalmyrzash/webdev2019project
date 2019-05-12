from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField

class Group(models.Model):
    name=models.CharField(max_length=30)
    subscriber_count=models.IntegerField(default=0)
    online_count=models.IntegerField(default=0)
    created_by=models.ForeignKey(User,on_delete=models.CASCADE,default=0)
    created_at = models.DateTimeField(auto_now_add=True)






class AbstractPost(models.Model):
    body=models.CharField(max_length=1000)
    like_count=models.IntegerField(default=0)
    created_by=models.ForeignKey(User,on_delete=models.CASCADE,default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        abstract = True

class Post(AbstractPost):
    group_id = models.IntegerField(default=1)

class Comment(AbstractPost):
    group_id = models.IntegerField()
    directed_to=models.ForeignKey(Post,on_delete=models.CASCADE,default=1)

