from rest_framework import serializers
from api.models import CustomUser as User, Group, Post, Comment


class UserSerializer(serializers.ModelSerializer):
    # reputation = serializers.IntegerField(read_only=True)
    password = serializers.CharField(max_length=200, write_only=True)

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            is_superuser=validated_data['is_superuser'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()

        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'reputation',
                  'date_joined', 'is_superuser')
        # fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):
    # id = serializers.IntegerField(read_only=True)
    # name = serializers.CharField(required=True)
    # created_by = UserSerializer(read_only=True)
    # created_at = serializers.DateTimeField(read_only=True)
    class Meta:
        model = Group
        fields = ('id', 'name', 'created_by', 'created_at')


class PostSerializer(serializers.ModelSerializer):
    # title = serializers.CharField(required=True)
    # group = GroupSerializer()

    class Meta:
        model = Post
        fields = ('id', 'title', 'body', 'created_by', 'created_at', 'group')


class CommentSerializer(serializers.ModelSerializer):
    # body = serializers.CharField(max_length=1000, required=True)

    class Meta:
        model = Comment
        fields = ('id', 'body', 'created_by', 'created_at', 'post', 'directed_to')


class BasePostSerializer(serializers.ModelSerializer):
    # like_count = serializers.IntegerField(read_only=True)
    # created_by = UserSerializer(read_only=True)
    # created_at = serializers.DateTimeField(read_only=True)
    # id = serializers.IntegerField(read_only=True)

    def to_representation(self, instance):
        if isinstance(instance, Post):
            return PostSerializer(instance, context=self.context).to_representation(instance)
        elif isinstance(instance, Comment):
            return CommentSerializer(instance, context=self.context).to_representation(instance)
        return super(BasePostSerializer, self).to_representation(instance)