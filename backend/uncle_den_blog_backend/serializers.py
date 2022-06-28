from rest_framework import serializers

from uncle_den_blog_backend.models import Journey, Article, Post, Country


class CountrySerializer(serializers.Serializer):
    REGIONS = (
        ('russia', 'Россия'),
        ('europe', 'Европа'),
        ('middle-east', 'Ближний Восток'),
        ('central-asia', 'Центральная Азия'),
        ('far-east', 'Дальний Восток'),
        ('africa', 'Африка'),
        ('australia', 'Австралия'),
        ('north-america', 'Северная Америка'),
        ('south-america', 'Южная Америка'),
        ('etc', 'Другое'),
    )

    id = serializers.IntegerField(read_only=True)

    name = serializers.CharField(required=True, max_length=50, allow_null=False)
    code = serializers.CharField(required=True, max_length=10, allow_null=False)

    region = serializers.ChoiceField(required=True, allow_null=False, allow_blank=False, choices=REGIONS)

    def create(self, validated_data):
        return Country.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.code = validated_data.get('code', instance.code)
        instance.region = validated_data.get('region', instance.region)
        instance.save()

        return instance


class ArticleSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)

    title = serializers.CharField(required=True, allow_null=False, allow_blank=False, max_length=30)
    description = serializers.CharField(required=True, allow_null=False, allow_blank=True, max_length=100)
    distance = serializers.FloatField(required=False, allow_null=True)

    start_date = serializers.DateField(required=False, allow_null=True)
    finish_date = serializers.DateField(required=False, allow_null=True)

    map = serializers.JSONField(required=True, allow_null=False)

    journey_id = serializers.IntegerField(required=True, allow_null=False, source='journey.id')
    country = CountrySerializer(required=False, allow_null=True)

    def create(self, validated_data):
        return Article.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.distance = validated_data.get('distance', instance.distance)
        instance.map = validated_data.get('map', instance.map)
        instance.journey = validated_data.get('journey', instance.journey)
        instance.save()

        return instance


class PostSerializer(serializers.Serializer):
    POST_TYPES = (
        ('text', 'Текстовый блок'),
        ('map', 'Блок с картой'),
        ('map-helper', 'Карта с подсказками'),
        ('carousel', 'Блок-карусель'),
        ('image', 'Блок с картинкой'),
        ('images', 'Несколько картинок'),
        ('link', 'Блок со ссылкой'),
        ('accordion', 'Блок-аккордион'),
    )

    id = serializers.IntegerField(read_only=True)
    type = serializers.ChoiceField(required=True, allow_null=False, allow_blank=False, choices=POST_TYPES)
    content = serializers.JSONField(required=True, allow_null=False)

    article_id = serializers.IntegerField(required=True, allow_null=False, source="article.id")

    def create(self, validated_data):
        return Post.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.type = validated_data.get('type', instance.type)
        instance.content = validated_data.get('content', instance.content)
        instance.article = validated_data.get('article', instance.article)
        instance.save()

        return instance

    def check_type_content(self):
        if self.type == 'text':  # todo: check JSON content accordion to post type
            print('obama')


class JourneySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    title = serializers.CharField(required=True, allow_null=False, allow_blank=False, max_length=30)
    description = serializers.CharField(required=True, allow_null=False, allow_blank=True, max_length=100)
    distance = serializers.FloatField(required=False, allow_null=True)

    start_date = serializers.DateField(required=False, allow_null=True)
    finish_date = serializers.DateField(required=False, allow_null=True)

    path = serializers.JSONField(required=True, allow_null=False)
    map = serializers.JSONField(required=True, allow_null=False)

    countries = CountrySerializer(read_only=True, required=False, many=True)
    article_set = serializers.PrimaryKeyRelatedField(read_only=True, required=False, many=True)

    def create(self, validated_data):
        return Journey.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.distance = validated_data.get('distance', instance.distance)
        instance.path = validated_data.get('path', instance.path)
        instance.map = validated_data.get('map', instance.map)
        instance.save()

        return instance

    class Meta:
        model = Journey
        fields = ['id', 'title', 'description', 'distance', 'start_date', 'finish_date', 'path', 'map',
                  'article_set', 'countries']


class SingleArticleSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)

    title = serializers.CharField(required=True, allow_null=False, allow_blank=False, max_length=30)
    description = serializers.CharField(required=True, allow_null=False, allow_blank=True, max_length=100)
    distance = serializers.FloatField(required=False, allow_null=True)

    start_date = serializers.DateField(required=False, allow_null=True)
    finish_date = serializers.DateField(required=False, allow_null=True)

    map = serializers.JSONField(required=True, allow_null=False)

    journey = JourneySerializer(read_only=True, many=False)
    country = CountrySerializer(required=False, allow_null=True)
