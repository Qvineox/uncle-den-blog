from rest_framework.response import Response
from rest_framework.views import APIView

from uncle_den_blog_backend.models import Journey, Article, Country

from uncle_den_blog_backend.serializers import *

#
# class Posts(APIView):
#     def get(self, request, post_id=None):
#         if post_id:
#             payload = PostSerializer(Post.objects.get(pk=post_id), many=False).data
#         else:
#             article_id_query = request.GET.get('article_id', False)
#
#             posts_queryset = Post.objects.all()
#
#             if article_id_query:
#                 posts_queryset = posts_queryset.filter(article_id=article_id_query)
#
#             payload = PostSerializer(posts_queryset, many=True).data
#
#         return Response(payload)


class Journeys(APIView):
    def get(self, request, journey_id=None):
        if journey_id:
            payload = JourneySerializer(Journey.objects.get(pk=journey_id), many=False).data
        else:
            payload = JourneySerializer(Journey.objects.all(), many=True).data

        return Response(payload)


class Articles(APIView):
    def get(self, request, article_id=None):
        if article_id:
            payload = SingleArticleSerializer(Article.objects.get(pk=article_id), many=False).data
        else:
            journey_id_query = request.GET.get('journey_id', False)
            count_query = request.GET.get('count', 10)

            articles_queryset = Article.objects.all()

            if journey_id_query:
                articles_queryset = articles_queryset.filter(journey_id=journey_id_query)

            payload = ArticleSerializer(articles_queryset.order_by("-finish_date", "-id")[:int(count_query)],
                                        many=True).data

        return Response(payload)


class Countries(APIView):
    def get(self, request, country_id=None):
        if country_id:
            payload = CountrySerializer(Country.objects.get(pk=country_id), many=False).data
        else:
            payload = CountrySerializer(Country.objects.all(), many=True).data

        return Response(payload)
