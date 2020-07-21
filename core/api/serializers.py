from django_countries.serializer_fields import CountryField
from rest_framework import serializers
from core.models import (
    Address, Item, Order, OrderItem, Coupon, Variation, ItemVariation,
    Payment, Make, Model, ModelYear, PartType, PartCategory, Part, Image
)
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.module_loading import import_string


# Get the UserModel
UserModel = get_user_model()


class StringSerializer(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = (
            'id',
            'code',
            'amount'
        )


class ItemSerializer(serializers.ModelSerializer):

    # def __init__(self, *args, **kwargs):
    #     super(ItemSerializer, self).__init__(*args, **kwargs)
    #     self.fields['category'].queryset = .objects.all()

    # category = serializers.SerializerMethodField()
    label = serializers.SerializerMethodField()
    # category = serializers.StringRelatedField(many=True)
    test = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = (
            'id',
            # 'title',
            'price',
            'discount_price',
            # 'category',
            'label',
            'slug',
            'description',
            'test'
        )
        # depth = 1

    # def get_category(self, obj):
    #     return obj.get_category_display()

    def get_label(self, obj):
        return obj.get_label_display()

    def get_test(self, obj):
        return obj.get_testt()


class VariationDetailSerializer(serializers.ModelSerializer):
    item = serializers.SerializerMethodField()

    class Meta:
        model = Variation
        fields = (
            'id',
            'name',
            'item'
        )

    def get_item(self, obj):
        return ItemSerializer(obj.item).data


class ItemVariationDetailSerializer(serializers.ModelSerializer):
    variation = serializers.SerializerMethodField()

    class Meta:
        model = ItemVariation
        fields = (
            'id',
            'value',
            'attachment',
            'variation'
        )

    def get_variation(self, obj):
        return VariationDetailSerializer(obj.variation).data


class OrderItemSerializer(serializers.ModelSerializer):
    item_variations = serializers.SerializerMethodField()
    item = serializers.SerializerMethodField()
    final_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = (
            'id',
            'item',
            'item_variations',
            'quantity',
            'final_price'
        )

    def get_item(self, obj):
        return ItemSerializer(obj.item).data

    def get_item_variations(self, obj):
        return ItemVariationDetailSerializer(obj.item_variations.all(), many=True).data

    def get_final_price(self, obj):
        return obj.get_final_price()


class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    coupon = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            'id',
            'order_items',
            'total',
            'coupon'
        )

    def get_order_items(self, obj):
        return OrderItemSerializer(obj.items.all(), many=True).data

    def get_total(self, obj):
        return obj.get_total()

    def get_coupon(self, obj):
        if obj.coupon is not None:
            return CouponSerializer(obj.coupon).data
        return None


class ItemVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemVariation
        fields = (
            'id',
            'value',
            'attachment'
        )


class VariationSerializer(serializers.ModelSerializer):
    item_variations = serializers.SerializerMethodField()

    class Meta:
        model = Variation
        fields = (
            'id',
            'name',
            'item_variations',
        )

    def get_item_variations(self, obj):
        return ItemVariationSerializer(obj.itemvariation_set.all(), many=True).data


class ModelYearSerializer(serializers.ModelSerializer):
    # item = serializers.SerializerMethodField()

    class Meta:
        model = ModelYear
        fields = (
            'id',
            'brand',
            'model',
            'year_from',
            'year_to',
            # 'item'

        )

    # def get_item(self, obj):
    #     return ItemSerializer(obj.item).data


class ItemDetailSerializer(serializers.ModelSerializer):
    # category = serializers.SerializerMethodField()
    label = serializers.SerializerMethodField()
    variations = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    # suitable_years = serializers.SerializerMethodField()
    # year_from = ModelYearSerializer(many=True, read_only=True)
    # tracks = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Item
        fields = (
            'id',
            'name',
            'price',
            'discount_price',
            # 'category',
            'model_year',
            'label',
            'slug',
            'description',
            'info',
            'state',
            'part_rating',
            'variations',
            'image'
            # 'year_from'
        )
        depth = 5

    # def get_category(self, obj):
    #     return obj.get_category_display()

    def get_label(self, obj):
        return obj.get_label_display()

    def get_variations(self, obj):
        return VariationSerializer(obj.variation_set.all(), many=True).data

    def get_image(self, obj):
        return ItemImageSerializer(obj.item_images.all(), many=True).data

    # def get_suitable_years(self, obj):
    #     return ModelYearSerializer(obj.ModelYear_set.all(), many=True).data

    # def get_suitable_years(self, obj):
    #     return ModelYearSerializer(obj.id.).data


class PartSerializer(serializers.ModelSerializer):
    # part_category = serializers.SerializerMethodField()

    class Meta:
        model = Part
        fields = (
            # 'id',
            'name',
        )

    # def get_part_category(self, obj):
    #     return PartCategorySerializer(obj.part_category).data


class PartCategorySerializer(serializers.ModelSerializer):

    parts = serializers.SerializerMethodField()

    class Meta:
        model = PartCategory
        fields = (
            'id',
            # 'title',
            # 'price',
            # 'discount_price',
            'category',
            # 'part_type',
            'parts'
            # 'label',
            # 'slug',
            # 'description',
            # 'variations',
            # 'year_from'
        )

    def get_parts(self, obj):
        return PartSerializer(obj.part_set.all(), many=True).data


class PartTypeSerializer(serializers.ModelSerializer):
    part_category = serializers.SerializerMethodField()

    class Meta:
        model = PartType
        fields = (
            'id',
            'part_type',
            'part_category'
        )

    def get_part_category(self, obj):
        return PartCategorySerializer(obj.partcategory_set.all(), many=True).data


class AddressSerializer(serializers.ModelSerializer):
    country = CountryField()

    class Meta:
        model = Address
        fields = (
            'id',
            'user',
            'street_address',
            'apartment_address',
            'country',
            'zip',
            'address_type',
            'default'
        )


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = (
            'id',
            'amount',
            'timestamp'
        )


class MakeFilterSerializer(serializers.ModelSerializer):
    # part_category = serializers.SerializerMethodField()
    text = serializers.CharField(source='make')
    parent = serializers.SerializerMethodField()

    class Meta:
        model = Make
        fields = (
            'id',
            'text',
            'parent'
        )

    def get_parent(self, obj):
        return 1


class ModelFilterSerializer(serializers.ModelSerializer):
    # part_category = serializers.SerializerMethodField()
    text = serializers.CharField(source='model')
    parent = serializers.IntegerField(source='make_id')

    class Meta:
        model = Model
        fields = (
            'id',
            'text',
            'parent'
        )


class ModelYearFilterSerializer(serializers.ModelSerializer):
    # part_category = serializers.SerializerMethodField()
    text = serializers.CharField(source='year')
    parent = serializers.IntegerField(source='model_id')

    class Meta:
        model = ModelYear
        fields = (
            'id',
            'text',
            'parent'
        )


class PartTypeFilterSerializer(serializers.ModelSerializer):
    # part_category = serializers.SerializerMethodField()
    text = serializers.CharField(source='part_type')
    parent = serializers.SerializerMethodField()

    class Meta:
        model = PartType
        fields = (
            'id',
            'text',
            'parent'
        )

    def get_parent(self, obj):
        return 1

    # def get_part_category(self, obj):
    #     return PartCategorySerializer(obj.partcategory_set.all(),many=True).data


class PartCategoryFilterSerializer(serializers.ModelSerializer):

    # parent_id = serializers.SerializerMethodField()
    text = serializers.CharField(source='category')
    parent = serializers.IntegerField(source='part_type_id')

    class Meta:
        model = PartCategory
        fields = (
            'id',
            # 'title',
            # 'price',
            # 'discount_price',
            'text',
            'parent',
            # 'parent_id'
            # 'label',
            # 'slug',
            # 'description',
            # 'variations',
            # 'year_from'
        )

    # def get_parent_id(self, obj):
    #     return PartTypeFilterSerializer(obj.id).data


class PartFilterSerializer(serializers.ModelSerializer):
    # part_category = serializers.SerializerMethodField()
    text = serializers.CharField(source='name')
    parent = serializers.IntegerField(source='part_category_id')

    class Meta:
        model = Part
        fields = (
            'id',
            'text',
            'parent'
        )


class ItemImageSerializer(serializers.ModelSerializer):
    # image = serializers.ImageField()
    # url = serializers.CharField(source='image')
    # photo_url = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)
    # photo_url = serializers.SerializerMethodField()
    # photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = (
            'id',
            'image',
            'item',
            'priority',
            # 'photo_url'
        )

    # def get_photo_url(self, image):
    #     request = self.context.get('request')
    #     photo_url = image.image.url
    #     return request.build_absolute_uri(photo_url)
    # def get_photo_url(self, obj):
    #     return '%s%s' % (settings.MEDIA_URL, obj.image)
    # def get_photo_url(self, obj):
    #     request = self.context['request']
    #     photo_url = obj.image.url
    #     return request.build_absolute_uri(photo_url)

    # def get_image(self, obj): # obj is Model instance, in this case, obj is 'Class'
    #     return obj.fig.url # not return self.url


class ItemLastFourSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='name.name')
    image = serializers.SerializerMethodField()
    # year = serializers.SerializerMethodField()
    # url = serializers.HyperlinkedIdentityField(
    #     view_name='api:product-detail',
    #     lookup_field = 'id'
    # )
    # image = serializers.HyperlinkedRelatedField(
#     many=True,
#     read_only=True,
#     view_name='image'
# )

    class Meta:
        model = Item
        fields = (
            'id',
            'name',
            'price',
            'discount_price',
            'current_quantity',

            'label',
            'slug',
            'image',
            'description',
            'info',
            'state',
            'part_rating'
        )

    def get_image(self, obj):
        return ItemImageSerializer(obj.item_images.all(), many=True).data

    # def get_year(self, obj):
    #     return ModelYearSerializer(obj.modelyear_set.all(), many=True).data


class ItemFilterSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    label = serializers.SerializerMethodField()
    part_title = serializers.CharField(source='name.name')

    class Meta:
        model = Item
        fields = (
            'id',
            'name',
            'part_title',
            'price',
            'discount_price',
            'current_quantity',
            'model_year',
            'label',
            'slug',
            'description',
            'info',
            'state',
            'part_rating',
            'image'
        )
        # depth = 1

    # def get_category(self, obj):
    #     return obj.get_category_display()
    def get_image(self, obj):
        return ItemImageSerializer(obj.item_images.all(), many=True).data

    def get_label(self, obj):
        return obj.get_label_display()


class UserDetailsSerializer(serializers.ModelSerializer):
    """
    User model w/o password
    """
    class Meta:
        model = UserModel
        fields = ('pk', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('email', )


class JWTSerializer(serializers.Serializer):
    """
    Serializer for JWT authentication.
    """
    access_token = serializers.CharField()
    refresh_token = serializers.CharField()
    # user = serializers.SerializerMethodField()

    def get_user(self, obj):
        """
        Required to allow using custom USER_DETAILS_SERIALIZER in
        JWTSerializer. Defining it here to avoid circular imports
        """
        rest_auth_serializers = getattr(settings, 'REST_AUTH_SERIALIZERS', {})

        JWTUserDetailsSerializer = import_string(
            rest_auth_serializers.get(
                'USER_DETAILS_SERIALIZER',
                'core.api.serializers.UserDetailsSerializer',
            )
        )

        user_data = JWTUserDetailsSerializer(
            obj['user'], context=self.context).data
        return user_data
