from django.contrib import admin
from django.urls import path,include,re_path
from api import views
from django.views.decorators.csrf import csrf_exempt
urlpatterns = [

    path('login/', views.login),
    path('logout/', views.logout),
    path('signup/', views.CreateUserView.as_view()),

    path('created_groups/', views.CreatedGroups.as_view()),
    path('subscribed_groups/', views.SubscribedGroups.as_view()),
    path('groups/', views.Groups.as_view()),
    path('groups/<int:pk>/', views.GroupDetail.as_view()),
    path('groups/<int:pk>/subscribe/', views.subscribe),
    path('groups/<int:pk>/posts/', views.GroupPostView.as_view()),

    re_path(r'groups/\d/posts/(\d{1,4})/comments/(\d{1,4})/replies/', views.comment_replies),
    re_path(r'groups/\d/posts/(\d{1,4})/comments/(\d{1,4})/like/', views.comment_like),
    re_path(r'groups/\d/posts/(\d{1,4})/comments/(\d{1,4})/', views.comment_detail.as_view()),
    re_path(r'groups/\d/posts/(\d{1,4})/comments/', views.post_comments.as_view()),
    re_path(r'groups/\d/posts/(\d{1,4})/like/', views.post_like),
    re_path(r'groups/\d/posts/(\d{1,4})/', views.post_detail),


    # path('categories/<int:pk>/products/', views.category_product)
]