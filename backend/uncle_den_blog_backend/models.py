from django.db import models


class Journey(models.Model):
    title = models.CharField(max_length=30, unique=True, null=False, blank=False, verbose_name='Название')
    description = models.CharField(max_length=100, null=True, verbose_name='Описание')
    distance = models.FloatField(null=True, verbose_name='Дистанция')

    start_date = models.DateField(null=True, verbose_name='Дата старта')
    finish_date = models.DateField(null=True, verbose_name='Дата финиша')

    path = models.JSONField(null=False, default=dict)  # todo: add path encoder
    map = models.JSONField(null=False, default=dict)  # todo: add map encoder

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

    map = models.JSONField(null=True, default=dict, verbose_name='Карта')  # todo: add map encoder

    journey = models.ForeignKey(Journey, on_delete=models.CASCADE, null=False, verbose_name='Поездка')

    class Meta:
        verbose_name = 'статья'
        verbose_name_plural = 'статьи'

    def __str__(self):
        if self.start_date is not None:
            return f'{self.title} ({self.start_date})'
        else:
            return f'{self.title}'


class Post(models.Model):
    order = models.SmallIntegerField(null=False, blank=False, verbose_name='Порядок')

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
    type = models.CharField(max_length=10, choices=POST_TYPES, null=False, verbose_name='Тип записи')

    content = models.JSONField(default=dict, null=False, verbose_name='Содержание')  # todo: add map encoder

    article = models.ForeignKey(Article, on_delete=models.CASCADE, null=False, verbose_name='Статья')

    class Meta:
        verbose_name = 'запись'
        verbose_name_plural = 'записи'

    def __str__(self):
        return f'{self.type}: {self.id}'


class Country(models.Model):
    name = models.CharField(max_length=50, null=False, verbose_name='Название')
    code = models.CharField(max_length=10, null=True, default='xx', verbose_name='Код')

    class Meta:
        verbose_name = 'страна'
        verbose_name_plural = 'страны'

    def __str__(self):
        return f'{self.name} ({self.code.upper()})'


class CountryVisit(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, verbose_name='Статья')
    country = models.ForeignKey(Country, on_delete=models.CASCADE, verbose_name='Страна')

    latest_visit = models.DateField(verbose_name='Последнее посещение')

    class Meta:
        verbose_name = 'посещение страны'
        verbose_name_plural = 'посещения стран'
