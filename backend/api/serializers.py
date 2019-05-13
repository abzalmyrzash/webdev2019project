from rest_framework import serializers
from django.contrib.auth.models import User
from api.models import Group,Post,AbstractPost,Comment




class UserSerializer(serializers.ModelSerializer):
    reputation=serializers.IntegerField(read_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'email','reputation',)


class GroupSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(required=True)
    created_by = UserSerializer(read_only=True)
    subscriber_count=serializers.IntegerField(read_only=True)
    online_count=serializers.IntegerField(read_only=True)
    created_at=serializers.DateTimeField(read_only=True)
    class Meta:
        model =Group
        fields = ('id', 'name', 'created_by','created_at','subscriber_count','online_count',)

class PostSerializer(serializers.ModelSerializer):
    body = serializers.CharField(max_length=1000)
    like_count = serializers.IntegerField(read_only=True)
    created_by = UserSerializer(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    group_id=serializers.IntegerField(read_only=True)
    id=serializers.IntegerField(read_only=True)
    title=serializers.CharField(required=True)
    class Meta:
        model = Post
        fields = ('id','title', 'body', 'created_by','created_at','group_id','like_count',)

class CommentSerializer(serializers.ModelSerializer):
    body = serializers.CharField(max_length=1000)
    like_count = serializers.IntegerField(read_only=True)
    created_by = UserSerializer(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    directed_to=PostSerializer(read_only=True)
    class Meta:
        model = Post
        fields = ('id', 'body', 'created_by','created_at','like_count','directed_to',)






