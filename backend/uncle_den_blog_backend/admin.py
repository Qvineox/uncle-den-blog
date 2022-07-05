from django.contrib import admin

# Register your models here.
from uncle_den_blog_backend.models import Journey, Article, Country, BasicTextPost, ImageTextPost, PostImage, \
    ImagesTextPost, CarouselPost, MapMarker, MapPost, LinkPost


@admin.register(Journey)
class JourneyAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'distance', 'start_date', 'finish_date')
    fields = ('title', 'description', 'distance', 'countries', 'image', 'start_date', 'finish_date')


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'journey', 'country', 'start_date', 'finish_date')
    fields = ('title', 'description', 'country', 'distance', 'map_latitude', 'map_longitude', 'map_zoom', 'start_date', 'finish_date', 'journey')

    ordering = ('-finish_date',)


@admin.register(PostImage)
class BasicTextPostAdmin(admin.ModelAdmin):
    fields = ('alt', 'description', 'path', 'created_at', 'updated_at', 'alignment')
    readonly_fields = ('created_at', 'updated_at')

    list_display = ('id', 'alt', 'path', 'created_at')

    ordering = ('-updated_at',)


# defines basic inherited field for all types of posts
basic_fields = ('article', 'order', 'map_latitude', 'map_longitude', 'map_zoom', 'created_at', 'updated_at')
basic_readonly_fields = ('created_at', 'updated_at')

basic_list_display = ('id', 'article', 'order', 'created_at')

basic_ordering = ('-article', 'order', 'id')


@admin.register(BasicTextPost)
class BasicTextPostAdmin(admin.ModelAdmin):
    fields = ('text',) + basic_fields
    list_display = basic_list_display + ('text',)

    readonly_fields = basic_readonly_fields
    ordering = basic_ordering


@admin.register(ImageTextPost)
class ImageTextPostAdmin(admin.ModelAdmin):
    fields = ('image', 'text', 'alignment') + basic_fields
    list_display = basic_list_display + ('image', 'text')

    readonly_fields = basic_readonly_fields
    ordering = basic_ordering


@admin.register(ImagesTextPost)
class ImageTextPostAdmin(admin.ModelAdmin):
    fields = ('images', 'text') + basic_fields
    list_display = basic_list_display + ('text',)

    readonly_fields = basic_readonly_fields
    ordering = basic_ordering


@admin.register(CarouselPost)
class CarouselPostAdmin(admin.ModelAdmin):
    fields = ('images',) + basic_fields
    list_display = basic_list_display

    readonly_fields = basic_readonly_fields
    ordering = basic_ordering


@admin.register(MapMarker)
class MapMarkerAdmin(admin.ModelAdmin):
    fields = ('title', 'description', 'image', 'map_latitude', 'map_longitude', 'map_zoom')
    list_display = ('title', 'map_latitude', 'map_longitude', 'map_zoom')

    ordering = ('-updated_at',)


@admin.register(MapPost)
class MapPostAdmin(admin.ModelAdmin):
    fields = ('center_latitude', 'center_longitude', 'markers', 'hints_visible') + basic_fields
    list_display = basic_list_display + ('center_latitude', 'center_longitude')

    readonly_fields = basic_readonly_fields
    ordering = basic_ordering


@admin.register(LinkPost)
class LinkPostAdmin(admin.ModelAdmin):
    fields = ('url', 'description', 'image') + basic_fields
    list_display = basic_list_display + ('url',)

    readonly_fields = basic_readonly_fields
    ordering = basic_ordering


@admin.register(Country)
class PostAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'region')
    fields = ('name', 'code', 'region')
