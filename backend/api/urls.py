from django.contrib import admin
from django.urls import path,include,re_path
from api import views
from django.views.decorators.csrf import csrf_exempt
urlpatterns = [

    path('login/', views.login),
    path('logout/', views.logout),
    path('signup/', views.CreateUserView.as_view()),

    path('current_user/', views.current_user),
    path('users/<int:pk>/', views.UserDetail.as_view()),
    path('users/<int:pk>/set_password/', views.set_password),

    path('created_groups/', views.CreatedGroups.as_view()),
    path('subscribed_groups/', views.SubscribedGroups.as_view()),
    path('groups/', views.Groups.as_view()),
    path('groups/<int:pk>/', views.GroupDetail.as_view()),
    path('groups/<int:pk>/subscribe/', views.subscribe),
    path('groups/<int:pk>/posts/', views.GroupPostView.as_view()),

    re_path(r'groups/\d+/posts/(\d+)/comments/(\d+)/replies/', views.comment_replies),
    re_path(r'groups/\d+/posts/(\d+)/comments/(\d+)/like/', views.comment_like),
    re_path(r'groups/\d+/posts/(\d+)/comments/(\d+)/', views.comment_detail.as_view()),
    re_path(r'groups/\d+/posts/(\d+)/comments/', views.post_comments.as_view()),
    re_path(r'groups/\d+/posts/(\d+)/like/', views.post_like),
    re_path(r'groups/\d+/posts/(\d+)/', views.post_detail),


    # path('categories/<int:pk>/products/', views.category_product)
]