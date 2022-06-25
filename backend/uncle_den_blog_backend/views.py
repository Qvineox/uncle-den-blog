from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.views import APIView

from uncle_den_blog_backend.models import Post


class Test(APIView):
    def get(self, req):
        return Response(True)


class Posts(APIView):
    def get(self, request):
        return Response(len(Post.objects.all()))
