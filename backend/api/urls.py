from django.contrib import admin
from django.urls import path,include,re_path
from api import views
urlpatterns = [

    path('login', views.login),
    path('logout', views.logout),
    re_path(r'group/\d/posts/(\d{1,4})',views.post_detail),
    path('group/<int:pk>/posts', views.GroupPostView.as_view()),
    path('group', views.GroupView.as_view()),

    # path('categories/<int:pk>/products/', views.category_product)
]