from django.db.models.signals import post_save
from django.conf import settings
from django.db import models
from django.db.models import Sum
from django.shortcuts import reverse
from django_countries.fields import CountryField
import datetime
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils.safestring import mark_safe
from django.utils.timezone import now


CATEGORY_CHOICES = (
    ('M', 'Motorrad'),
    ('P', 'Part')
)

LABEL_CHOICES = (
    ('N', 'New'),
    ('U', 'Used'),
)

ADDRESS_CHOICES = (
    ('B', 'Billing'),
    ('S', 'Shipping'),
)

STATE_CHOICES = (
    ('LD', 'Litlle damage check the pictures / description'),
    ('UP', 'Used part. normal use'),
    ('NP', 'New part'),
)

PART_RATING_CHOICES = (
    (4, 'Normal used part, can be installed without problems'),
    (5, 'New'),
)


def current_year():
    return datetime.date.today().year


def max_value_current_year(value):
    return MaxValueValidator(current_year())(value)


# def increment_image_priority():
#   last_booking = Booking.objects.all().order_by('id').last()
#   if not last_booking:
#     return 'RNH' + str(datetime.date.today().year) + str(datetime.date.today().month).zfill(2) + '0000'
#   booking_id = last_booking.booking_id
#   booking_int = int(booking_id[9:13])
#   new_booking_int = booking_int + 1
#   new_booking_id = 'RNH' + str(str(datetime.date.today().year)) + str(datetime.date.today().month).zfill(2) + str(new_booking_int).zfill(4)
#   return new_booking_id


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    stripe_customer_id = models.CharField(max_length=50, blank=True, null=True)
    one_click_purchasing = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username


class Make(models.Model):
    make = models.CharField(max_length=100, unique=True)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True)

    def __str__(self):
        return self.make


class Model(models.Model):
    model = models.CharField(max_length=100, unique=True)
    make = models.ForeignKey(Make, on_delete=models.PROTECT)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True)

    def __str__(self):
        return f'{self.make.make} - {self.model}'


class ModelYear(models.Model):
#     # make = models.ForeignKey(
#     #     Make, on_delete=models.CASCADE)
    model = models.ForeignKey(
        Model, on_delete=models.PROTECT)
    year = models.PositiveIntegerField(validators=[
        MinValueValidator(1984), max_value_current_year], default=current_year())
#     # image = models.ForeignKey(ModelImage, on_delete=models.PROTECT)
#     # image = models.ImageField(upload_to='model_image', blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True)
#     # year_from = models.PositiveIntegerField(default=current_year(), validators=[
#     #     MinValueValidator(1984), max_value_current_year])
#     # year_to = models.PositiveIntegerField(default=current_year(), validators=[
#     #     MinValueValidator(1984), max_value_current_year])
#     # item = models.ForeignKey(Item, on_delete=models.CASCADE)

    class Meta:
        unique_together = (
            ('model', 'year')
        )

    def __str__(self):
        return f'{self.model.make.make} {self.model.model} {self.year}'

    # self.admin_order_field = 'author__first_name'


class ModelImage(models.Model):

    image = models.ImageField(upload_to='model_images')
    model_year = models.ManyToManyField(ModelYear)
    # year = models.ForeignKey(ModelYear, on_delete=models.PROTECT)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True)

    def __str__(self):
        return f'{self.model_year.model.make.make} {self.model_year.model.model} {self.model_year.year}'

# class MainCategory(models.Model):
#     category = models.CharField(choices=CATEGORY_CHOICES,
#                              max_length=1, verbose_name='Motorbike or part')

#     def __str__(self):
#         return self.category


class PartType(models.Model):
    part_type = models.CharField(max_length=100, unique=True)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True)

    def __str__(self):
        return self.part_type


class PartCategory(models.Model):
    category = models.CharField(max_length=100, unique=True)
    part_type = models.ForeignKey(PartType, on_delete=models.PROTECT)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True)

    class Meta:
        verbose_name_plural = 'Category'
        # verbose_name = 'pizza'

    def __str__(self):
        return self.category


class Part(models.Model):
    part = models.CharField(max_length=100, unique=True)
    part_category = models.ForeignKey(PartCategory, on_delete=models.PROTECT)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True)

    def __str__(self):
        return self.part


class Item(models.Model):
    # main_category = models.CharField(choices=CATEGORY_CHOICES,
    #                          max_length=1, verbose_name='Motorbike or part', default='P')

    part = models.ForeignKey(Part, on_delete=models.PROTECT)
    price = models.FloatField()
    discount_price = models.FloatField(blank=True, null=True)
    # category = models.ManyToManyField(
    #     Category, related_name='items')
    # model = models.ManyToManyField(Model)
    # brand = models.ManyToManyField(Brand)
    model_year = models.ManyToManyField(ModelYear, related_name = 'items')
    label = models.CharField(choices=LABEL_CHOICES,
                             max_length=1, verbose_name='New or other tag')
    slug = models.SlugField()
    description = models.TextField()
    info = models.TextField()
    state = models.CharField(choices=STATE_CHOICES, max_length=2)
    part_rating = models.PositiveSmallIntegerField(
        choices=PART_RATING_CHOICES)
    published = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True)

    def __str__(self):
        return self.state

    def get_absolute_url(self):
        return reverse("core:product", kwargs={
            'slug': self.slug
        })
    # def get_absolute_url(self):
    #     return reverse("api:product-detail", kwargs={
    #         'pk': self.id
    #     })

    def get_add_to_cart_url(self):
        return reverse("core:add-to-cart", kwargs={
            'slug': self.slug
        })

    def get_remove_from_cart_url(self):
        return reverse("core:remove-from-cart", kwargs={
            'slug': self.slug
        })

    def get_testt(self):
        return self.label + '2020'

    def get_model(self):
        return self.model_year

    # class Meta:
    #     ordering = ["-timestamp"]




class Image(models.Model):
    image = models.ImageField(upload_to='item_images')
    item = models.ForeignKey(Item, on_delete=models.PROTECT, related_name='item_images')
    priority = models.PositiveSmallIntegerField(
        default=1)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True)

    def admin_photo(self):
        return mark_safe('<img src="{}" width="100" />'.format(self.image.url))
    admin_photo.short_description = 'image'
    admin_photo.allow_tags = True

    # def save(self, *args, **kwargs):
    #     if not self.priority:
    #         self.priority = Image.objects.latest('priority').priority
    #     super().save(*args, **kwargs)

    def __str__(self):
        return self.item.part.part


class Variation(models.Model):
    item = models.ForeignKey(Item, on_delete=models.PROTECT)
    name = models.CharField(max_length=50)  # size
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True)

    class Meta:
        unique_together = (
            ('item', 'name')
        )

    def __str__(self):
        return self.name


class ItemVariation(models.Model):
    variation = models.ForeignKey(Variation, on_delete=models.PROTECT)
    value = models.CharField(max_length=50)  # S, M, L
    attachment = models.ImageField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True)

    class Meta:
        unique_together = (
            ('variation', 'value')
        )

    def __str__(self):
        return self.value

class VehicleForSale(models.Model):
    model_year = models.ForeignKey(ModelYear, on_delete=models.PROTECT) 
    price = models.FloatField()
    discount_price = models.FloatField(blank=True, null=True)
    # category = models.ManyToManyField(
    #     Category, related_name='items')
    # model = models.ManyToManyField(Model)
    # brand = models.ManyToManyField(Brand)
    label = models.CharField(choices=LABEL_CHOICES,
                             max_length=1, verbose_name='New or other tag')
    slug = models.SlugField()
    description = models.TextField()
    info = models.TextField()
    published = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True)


    def __str__(self):
        return self.model_year.model.model

class OrderItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    item_variations = models.ManyToManyField(ItemVariation)
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.item.title}"

    def get_total_item_price(self):
        return self.quantity * self.item.price

    def get_total_discount_item_price(self):
        return self.quantity * self.item.discount_price

    def get_amount_saved(self):
        return self.get_total_item_price() - self.get_total_discount_item_price()

    def get_final_price(self):
        if self.item.discount_price:
            return self.get_total_discount_item_price()
        return self.get_total_item_price()


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    ref_code = models.CharField(max_length=20, blank=True, null=True)
    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()
    ordered = models.BooleanField(default=False)
    shipping_address = models.ForeignKey(
        'Address', related_name='shipping_address', on_delete=models.SET_NULL, blank=True, null=True)
    billing_address = models.ForeignKey(
        'Address', related_name='billing_address', on_delete=models.SET_NULL, blank=True, null=True)
    payment = models.ForeignKey(
        'Payment', on_delete=models.SET_NULL, blank=True, null=True)
    coupon = models.ForeignKey(
        'Coupon', on_delete=models.SET_NULL, blank=True, null=True)
    being_delivered = models.BooleanField(default=False)
    received = models.BooleanField(default=False)
    refund_requested = models.BooleanField(default=False)
    refund_granted = models.BooleanField(default=False)

    '''
    1. Item added to cart
    2. Adding a billing address
    (Failed checkout)
    3. Payment
    (Preprocessing, processing, packaging etc.)
    4. Being delivered
    5. Received
    6. Refunds
    '''

    def __str__(self):
        return self.user.username

    def get_total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_final_price()
        if self.coupon:
            total -= self.coupon.amount
        return total


class Address(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    street_address = models.CharField(max_length=100)
    apartment_address = models.CharField(max_length=100)
    country = CountryField(multiple=False)
    zip = models.CharField(max_length=100)
    address_type = models.CharField(max_length=1, choices=ADDRESS_CHOICES)
    default = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name_plural = 'Addresses'


class Payment(models.Model):
    stripe_charge_id = models.CharField(max_length=50)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.SET_NULL, blank=True, null=True)
    amount = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username


class Coupon(models.Model):
    code = models.CharField(max_length=15)
    amount = models.FloatField()

    def __str__(self):
        return self.code


class Refund(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    reason = models.TextField()
    accepted = models.BooleanField(default=False)
    email = models.EmailField()

    def __str__(self):
        return f"{self.pk}"


def userprofile_receiver(sender, instance, created, *args, **kwargs):
    if created:
        userprofile = UserProfile.objects.create(user=instance)


post_save.connect(userprofile_receiver, sender=settings.AUTH_USER_MODEL)
