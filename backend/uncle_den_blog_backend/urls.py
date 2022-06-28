from django.urls import include, path, re_path

from uncle_den_blog_backend import views

urlpatterns = [
    re_path(r'^journeys/(?:(?P<journey_id>\d+)/)?$', views.Journeys.as_view()),
    re_path(r'^articles/(?:(?P<article_id>\d+)/)?$', views.Articles.as_view()),
    re_path(r'^posts/(?:(?P<post_id>\d+)/)?$', views.Posts.as_view()),
    re_path(r'^countries/(?:(?P<country_id>\d+)/)?$', views.Countries.as_view()),
]
