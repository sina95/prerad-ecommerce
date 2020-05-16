from django.contrib import admin

from .models import (
    Item, OrderItem, Order, Payment, Coupon, Refund,
    Address, UserProfile, Variation, ItemVariation, PartCategory, Make, Model,
    Image, PartType, Part, ModelYear, VehicleForSale
)
from django import forms
from django.contrib.admin.widgets import FilteredSelectMultiple

def make_refund_accepted(modeladmin, request, queryset):
    queryset.update(refund_requested=False, refund_granted=True)


def make_item_published(modeladmin, request, queryset):
    queryset.update(published=True)


make_refund_accepted.short_description = 'Update orders to refund granted'
make_item_published.short_description = 'Publish items'


class OrderAdmin(admin.ModelAdmin):
    list_display = ['user',
                    'ordered',
                    'being_delivered',
                    'received',
                    'refund_requested',
                    'refund_granted',
                    'shipping_address',
                    'billing_address',
                    'payment',
                    'coupon'
                    ]
    list_display_links = [
        'user',
        'shipping_address',
        'billing_address',
        'payment',
        'coupon'
    ]
    list_filter = ['ordered',
                   'being_delivered',
                   'received',
                   'refund_requested',
                   'refund_granted']
    search_fields = [
        'user__username',
        'ref_code'
    ]
    actions = [make_refund_accepted]


class AddressAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'street_address',
        'apartment_address',
        'country',
        'zip',
        'address_type',
        'default'
    ]
    list_filter = ['default', 'address_type', 'country']
    search_fields = ['user', 'street_address', 'apartment_address', 'zip']


class ItemVariationAdmin(admin.ModelAdmin):
    list_display = ['variation',
                    'value',
                    'attachment']
    list_filter = ['variation', 'variation__item']
    search_fields = ['value']


class ItemVariationInLineAdmin(admin.TabularInline):
    model = ItemVariation
    extra = 1


class VariationAdmin(admin.ModelAdmin):
    list_display = ['item',
                    'name']
    list_filter = ['item']
    search_fields = ['name']
    inlines = [ItemVariationInLineAdmin]


# class SuitableYearsAdmin(admin.ModelAdmin):
#     list_display = ['brand',
#                     'model',
#                     'year']
#     list_filter = ['model', 'model__item']
#     search_fields = ['model']

class ModelYearInLineAdmin(admin.TabularInline):
    model = Item.model_year.through
#     extra = 1


class ImageAdmin(admin.ModelAdmin):
    list_display = [
        'admin_photo',
        'item',
        'priority'
    ]
    readonly_fields = ('admin_photo',)


class ImageInLineAdmin(admin.TabularInline):
    model = Image
    extra = 1
    readonly_fields = ('admin_photo',)


class ItemAdmin(admin.ModelAdmin):
    inlines = [ImageInLineAdmin]
    search_fields = ['part']
    list_display = [
        'part',
        'price',
        'discount_price',
        # 'category',
        'label',
        'published'

    ]
    actions = [make_item_published]
    filter_horizonal=('model_year',)
    # pass

class ItemInLineAdmin(admin.TabularInline):
    model = Item
    # readonly_fields = []
    extra = 1

# class ModelYearAdmin(admin.ModelAdmin):
#     ordering=['year', 'model']
#     # inlines = [ItemInLineAdmin]



class ModelYearAdminForm(forms.ModelForm):
    items = forms.ModelMultipleChoiceField(
        queryset=Item.objects.all(),
        required = False,
        widget = FilteredSelectMultiple(
            verbose_name=('Items'),
            is_stacked=False
        )
    )
    class Meta:
        model=ModelYear
        fields = '__all__'

    def __init__(self,*args,**kwargs):
        super(ModelYearAdminForm, self).__init__(*args,**kwargs)
        if self.instance and self.instance.pk:
            self.fields['items'].initial=self.instance.items.all()

    def save(self, commit=True):
        model_year = super(ModelYearAdminForm, self).save(commit=False)

        # if commit:
        #     model_year.save()
        # if model_years.pk:
        #     model_years.items_set = self.cleaned_data['items']
        #     self.save_m2m()
        model_year.save()
        model_year.items_set = self.cleaned_data['items']
        self.save_m2m()
        # if model_year.pk:
        #     # Get the existing relatonships
        #     current_model_year_selections = Item.objects.filter(model_year=model_year)
        #     current_selections = [o.item for o in current_model_year_selections]
            
        #     # Get the submitted relationships
        #     submitted_selections = self.cleaned_data['items']
            
            
        #     # Create new relation in another table if they do not exists
        #     for item in submitted_selections:
        #         if item not in current_selections:
        #             Item(model_year=model_year, item=item).save()
        #     for project_item in current_model_year_selections:
        #         if project_item.item not in submitted_selections:
        #             project_item.delete()

        return model_year

class ModelYearAdmin(admin.ModelAdmin):
    form = ModelYearAdminForm
    ordering=['model', 'year']

    # filter_horizonal=['']


admin.site.register(ItemVariation, ItemVariationAdmin)
admin.site.register(Variation, VariationAdmin)
admin.site.register(Item, ItemAdmin)
admin.site.register(OrderItem)
admin.site.register(Order, OrderAdmin)
admin.site.register(Payment)
admin.site.register(Coupon)
admin.site.register(Refund)
admin.site.register(Address, AddressAdmin)
admin.site.register(UserProfile)
admin.site.register(PartCategory)
admin.site.register(Make)
admin.site.register(Model)
admin.site.register(ModelYear, ModelYearAdmin)
admin.site.register(Image, ImageAdmin)
admin.site.register(PartType)
admin.site.register(Part)
admin.site.register(VehicleForSale)
