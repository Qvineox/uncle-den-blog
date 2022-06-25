from django.urls import include, path

from uncle_den_blog_backend import views

urlpatterns = [
    path('', views.Test.as_view()),
    path('posts', views.Posts.as_view()),
]