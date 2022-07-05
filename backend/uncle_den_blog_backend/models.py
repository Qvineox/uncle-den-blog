from django.core.exceptions import ValidationError
from django.db import models


class Country(models.Model):
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

    name = models.CharField(max_length=50, null=False, verbose_name='Название')
    code = models.CharField(max_length=10, null=True, default='xx', verbose_name='Код')

    region = models.CharField(max_length=20, choices=REGIONS, null=False, default='etc', verbose_name='Регион')

    class Meta:
        verbose_name = 'страна'
        verbose_name_plural = 'страны'

    def __str__(self):
        return f'{self.name} ({self.code.upper()})'


class Journey(models.Model):
    title = models.CharField(max_length=50, unique=True, null=False, blank=False, verbose_name='Название')
    description = models.CharField(max_length=300, null=True, verbose_name='Описание')
    distance = models.FloatField(null=True, verbose_name='Дистанция')

    start_date = models.DateField(null=True, verbose_name='Дата старта')
    finish_date = models.DateField(null=True, verbose_name='Дата финиша')

    countries = models.ManyToManyField(Country, verbose_name='Посещенные страны')

    image = models.ImageField(upload_to='journey_images', null=True, verbose_name='Картинка пути')

    class Meta:
        verbose_name = 'поездка'
        verbose_name_plural = 'поездки'

    def __str__(self):
        if self.start_date is not None:
            return f'{self.title} ({self.start_date})'
        else:
            return f'{self.title}'


class Article(models.Model):
    title = models.CharField(max_length=30, unique=True, null=False, blank=False, verbose_name='Заголовок')
    description = models.CharField(max_length=100, null=False, verbose_name='Описание')

    start_date = models.DateField(null=True, verbose_name='Дата старта')
    finish_date = models.DateField(null=True, verbose_name='Дата финиша')

    distance = models.FloatField(null=True, verbose_name='Дистанция')

    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, null=False, verbose_name='Поездка')
    country = models.ForeignKey(Country, on_delete=models.CASCADE, null=True, verbose_name='Страна')

    map_latitude = models.DecimalField(null=False, default=0, max_digits=7, decimal_places=5,
                                       verbose_name='Долгота на карте')
    map_longitude = models.DecimalField(null=False, default=0, max_digits=8, decimal_places=5,
                                        verbose_name='Широта на карте')
    map_zoom = models.PositiveSmallIntegerField(null=False, default=5, verbose_name='Приближение на карте')

    class Meta:
        verbose_name = 'статья'
        verbose_name_plural = 'статьи'

    def __str__(self):
        if self.start_date is not None:
            return f'{self.title} ({self.start_date})'
        else:
            return f'{self.title}'


class PostImage(models.Model):
    class Meta:
        verbose_name = 'фотография'
        verbose_name_plural = 'фотографии'
        ordering = ['-created_at']

    alt = models.CharField(max_length=20, null=False, default='missing image', verbose_name='Название')
    description = models.CharField(max_length=100, null=True, verbose_name='Описание')

    path = models.ImageField(upload_to='post_images', verbose_name='Файл')

    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата редактирования')

    def __str__(self):
        return f'{self.path} ({self.created_at.date()})'


# defines post base fields and methods
class PostBase(models.Model):
    class Meta:
        abstract = True
        ordering = ['-article_id', 'order', 'id']

    article = models.ForeignKey(Article, on_delete=models.CASCADE, null=False, verbose_name='Статья')
    order = models.SmallIntegerField(null=False, blank=False, verbose_name='Порядок')

    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата редактирования')

    map_latitude = models.DecimalField(null=True, blank=True, max_digits=7, decimal_places=5,
                                       verbose_name='Долгота на карте')
    map_longitude = models.DecimalField(null=True, blank=True, max_digits=8, decimal_places=5,
                                        verbose_name='Широта на карте')
    map_zoom = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name='Приближение на карте')

    def __str__(self):
        return f'{self._meta.verbose_name} (#{self.id}-{self.article.id}) от {self.created_at.date()}'

    def clean(self):
        if self.map_latitude is not None and self.map_longitude is not None:
            if not -90 <= self.map_latitude <= 90:
                raise ValidationError(f'Ошибка диапазона широты!')
            if not -180 <= self.map_longitude <= 180:
                raise ValidationError(f'Ошибка диапазона долготы!')
            if not 2 <= self.map_zoom <= 9:
                raise ValidationError(f'Ошибка диапазона приближения (от 2 до 9)!')


class BasicTextPost(PostBase):
    class Meta:
        verbose_name = 'пост с текстом'
        verbose_name_plural = 'посты с текстом'
        ordering = ['-article_id', 'order']

    text = models.CharField(max_length=1000, null=False, blank=False, verbose_name='Текст')


class ImageTextPost(PostBase):
    IMAGES_ALIGNMENT = (
        ('left', 'слева от текста'),
        ('right', 'справа от текста'),
        ('top', 'над текстом'),
    )

    class Meta:
        verbose_name = 'пост с фотографией'
        verbose_name_plural = 'посты с фотографией'

    image = models.ForeignKey(PostImage, on_delete=models.CASCADE, null=False, verbose_name='Фотография')
    text = models.CharField(max_length=500, null=False, blank=False, verbose_name='Текст')

    alignment = models.CharField(max_length=20, choices=IMAGES_ALIGNMENT, default='right', null=False,
                                 verbose_name='Расположение фотографии')


class ImagesTextPost(PostBase):
    class Meta:
        verbose_name = 'пост с фотографиями'
        verbose_name_plural = 'посты с фотографиями'

    images = models.ManyToManyField(PostImage, verbose_name='Фотографии')
    text = models.CharField(max_length=500, null=False, blank=False, verbose_name='Текст')


class CarouselPost(PostBase):
    class Meta:
        verbose_name = 'пост с каруселью'
        verbose_name_plural = 'посты с каруселью'

    images = models.ManyToManyField(PostImage, verbose_name='Фотографии')


class MapMarker(models.Model):
    class Meta:
        verbose_name = 'маркер на карте'
        verbose_name_plural = 'маркеры на карте'

    title = models.CharField(max_length=20, null=False, blank=False, verbose_name='Заголовок')
    description = models.CharField(max_length=500, null=False, blank=False, verbose_name='Описание')

    image = models.ForeignKey(PostImage, on_delete=models.CASCADE, null=True, verbose_name='Фотография')

    map_latitude = models.DecimalField(null=False, max_digits=7, decimal_places=5, default=55.76034,
                                       verbose_name='Долгота на карте')
    map_longitude = models.DecimalField(null=False, max_digits=8, decimal_places=5, default=37.62760,
                                        verbose_name='Широта на карте')
    map_zoom = models.PositiveSmallIntegerField(null=False, default=4, verbose_name='Приближение на карте')

    updated_at = models.DateTimeField(auto_now=True, verbose_name='Дата редактирования')


class MapPost(PostBase):
    class Meta:
        verbose_name = 'пост с картой'
        verbose_name_plural = 'посты с картой'

    center_latitude = models.DecimalField(null=True, max_digits=7, decimal_places=5, default=55.76034,
                                          verbose_name='Долгота центра карты')
    center_longitude = models.DecimalField(null=True, max_digits=8, decimal_places=5, default=37.62760,
                                           verbose_name='Широта центра карты')

    markers = models.ManyToManyField(MapMarker, verbose_name='Отметки')
    hints_visible = models.BooleanField(default=False, verbose_name='Показ подсказки')


class LinkPost(PostBase):
    class Meta:
        verbose_name = 'пост со ссылкой'
        verbose_name_plural = 'посты со ссылкой'

    url = models.URLField(null=False, verbose_name='Ссылка')
    description = models.CharField(max_length=200, null=True, verbose_name='Описание')

    image = models.ForeignKey(PostImage, on_delete=models.CASCADE, null=True, verbose_name='Фотография')
