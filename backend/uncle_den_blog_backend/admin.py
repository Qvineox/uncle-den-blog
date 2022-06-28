from django.contrib import admin

# Register your models here.
from uncle_den_blog_backend.models import Journey, Article, Post, Country


@admin.register(Journey)
class JourneyAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'distance', 'start_date', 'finish_date')
    fields = ('title', 'description', 'distance', 'countries', 'path')


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'journey', 'country', 'start_date', 'finish_date')
    fields = ('title', 'description', 'country', 'distance', 'start_date', 'finish_date', 'journey')

    ordering = ('-finish_date',)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    fields = ('type', 'order', 'content', 'article')
    list_display = ('type', 'article', 'order',)

    ordering = ('article', 'order')


@admin.register(Country)
class PostAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'region')
    fields = ('name', 'code', 'region')

