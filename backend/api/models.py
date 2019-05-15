from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.postgres.fields import ArrayField


class CustomUserManager(BaseUserManager):
    def _create_user(self, username, email, password, **extra_fields):
        """
        Create and save a user with the given username, email, and password.
        """
        if not username:
            raise ValueError('The given username must be set')
        email = self.normalize_email(email)
        username = self.model.normalize_username(username)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(username, email, password, **extra_fields)


class CustomUser(AbstractUser):
    reputation = models.IntegerField(default=0)
    objects = CustomUserManager()


class Group(models.Model):
    name = models.CharField(max_length=30)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=0, related_name="created_groups")
    created_at = models.DateTimeField(auto_now_add=True)
    subscribers = models.ManyToManyField(CustomUser, related_name="subscribed_groups")


class Post(models.Model):
    title = models.CharField(max_length=100)
    body = models.CharField(max_length=1000, default='')
    likes = models.ManyToManyField(CustomUser, related_name="liked_posts")
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE,
                              blank=True, null=True)


class Comment(models.Model):
    body = models.CharField(max_length=1000, default='')
    likes = models.ManyToManyField(CustomUser, related_name="liked_comments")
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments",
                             blank=True, null=True)
    directed_to = models.ForeignKey("Comment", on_delete=models.CASCADE, related_name="replies",
                                    blank=True, null=True)
