from rest_framework import serializers

from uncle_den_blog_backend.models import Journey, Article, Country, BasicTextPost, ImageTextPost, PostImage


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

    offset_map = serializers.JSONField(required=True, allow_null=False)

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


class JourneySerializer(serializers.ModelSerializer):
    class Meta:
        model = Journey
        fields = ['id', 'title', 'description', 'distance', 'start_date', 'finish_date', 'image',
                  'article_set', 'countries']

        ordering = ['start_date', ]

    class JourneyArticleSerializer(serializers.ModelSerializer):
        id = serializers.IntegerField(read_only=True)
        title = serializers.CharField(read_only=True)

        class Meta:
            model = Article
            fields = ['id', 'title']

            ordering = ['id']

    id = serializers.IntegerField(read_only=True)

    title = serializers.CharField(required=True, allow_null=False, allow_blank=False, max_length=30)
    description = serializers.CharField(required=True, allow_null=False, allow_blank=True, max_length=100)
    distance = serializers.FloatField(required=False, allow_null=True)

    start_date = serializers.DateField(required=False, allow_null=True, format="%d-%m-%Y")
    finish_date = serializers.DateField(required=False, allow_null=True)

    countries = CountrySerializer(read_only=True, required=False, many=True)
    article_set = JourneyArticleSerializer(read_only=True, many=True)

    image = serializers.ImageField(read_only=True)


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'alt', 'description', 'path']

    id = serializers.IntegerField(read_only=True)
    alt = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)
    path = serializers.ImageField(read_only=True)


class SingleArticleSerializer(serializers.ModelSerializer):
    class TextPostSerializer(serializers.ModelSerializer):
        class Meta:
            model = BasicTextPost
            fields = ['id', 'text', 'order', 'map_latitude', 'map_longitude', 'map_zoom']

        id = serializers.IntegerField(read_only=True)
        text = serializers.CharField(read_only=True)
        order = serializers.IntegerField(read_only=True)

        map_latitude = serializers.DecimalField(max_digits=7, decimal_places=5, read_only=True)
        map_longitude = serializers.DecimalField(max_digits=8, decimal_places=5, read_only=True)
        map_zoom = serializers.IntegerField(read_only=True)

    class ImageTextPostSerializer(serializers.ModelSerializer):
        class Meta:
            model = ImageTextPost
            fields = ['id', 'text', 'image', 'order', 'alignment', 'map_latitude', 'map_longitude', 'map_zoom']

        id = serializers.IntegerField(read_only=True)
        text = serializers.CharField(read_only=True)
        image = PostImageSerializer(many=False)
        order = serializers.IntegerField(read_only=True)

        alignment = serializers.CharField(read_only=True)

        map_latitude = serializers.DecimalField(max_digits=7, decimal_places=5, read_only=True)
        map_longitude = serializers.DecimalField(max_digits=8, decimal_places=5, read_only=True)
        map_zoom = serializers.IntegerField(read_only=True)

    id = serializers.IntegerField(read_only=True)

    title = serializers.CharField(required=True, allow_null=False, allow_blank=False, max_length=30)
    description = serializers.CharField(required=True, allow_null=False, allow_blank=True, max_length=100)
    distance = serializers.FloatField(required=False, allow_null=True)

    start_date = serializers.DateField(required=False, allow_null=True)
    finish_date = serializers.DateField(required=False, allow_null=True)

    country = CountrySerializer(required=False, allow_null=True)

    map_latitude = serializers.DecimalField(max_digits=7, decimal_places=5, read_only=True)
    map_longitude = serializers.DecimalField(max_digits=8, decimal_places=5, read_only=True)
    map_zoom = serializers.IntegerField(read_only=True)

    basictextpost_set = TextPostSerializer(read_only=True, many=True)
    imagetextpost_set = ImageTextPostSerializer(read_only=True, many=True)

    class Meta:
        model = Article
        fields = ['id', 'title', 'description', 'distance', 'start_date', 'finish_date', 'country', 'basictextpost_set',
                  'imagetextpost_set', 'map_latitude', 'map_longitude', 'map_zoom']

        depth = 1
