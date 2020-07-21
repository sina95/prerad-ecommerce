from django_countries import countries
from django.db.models import Q
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from rest_framework.generics import (
    ListAPIView, RetrieveAPIView, CreateAPIView,
    UpdateAPIView, DestroyAPIView
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from core.models import (
    Item, OrderItem, Order, Address, Payment, Coupon, Refund, UserProfile,
    Variation, ItemVariation, Make, Model, ModelYear, PartType, PartCategory, Part, Image)
from .serializers import (
    ItemSerializer, OrderSerializer, ItemDetailSerializer, AddressSerializer,
    PaymentSerializer, PartSerializer, PartTypeSerializer, MakeFilterSerializer,
    ModelFilterSerializer, ModelYearFilterSerializer, PartCategoryFilterSerializer,
    PartTypeFilterSerializer, PartFilterSerializer, ItemLastFourSerializer, ItemImageSerializer,
    ItemFilterSerializer

)
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.filters import SearchFilter, OrderingFilter
import stripe
from drf_multiple_model.views import ObjectMultipleModelAPIView

stripe.api_key = settings.STRIPE_SECRET_KEY


class UserIDView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({'userID': request.user.id}, status=HTTP_200_OK)


class ItemListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemSerializer
    queryset = Item.objects.all()
    filter_backends = (SearchFilter, OrderingFilter)
    # filterset_fields = ['title']
    search_fields = ['title']


class ItemDetailView(RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemDetailSerializer
    queryset = Item.objects.all()


class OrderQuantityUpdateView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        if slug is None:
            return Response({"message": "Invalid data"}, status=HTTP_400_BAD_REQUEST)
        item = get_object_or_404(Item, slug=slug)
        order_qs = Order.objects.filter(
            user=request.user,
            ordered=False
        )
        if order_qs.exists():
            order = order_qs[0]
            # check if the order item is in the order
            if order.items.filter(item__slug=item.slug).exists():
                order_item = OrderItem.objects.filter(
                    item=item,
                    user=request.user,
                    ordered=False
                )[0]
                if order_item.quantity > 1:
                    order_item.quantity -= 1
                    order_item.save()
                else:
                    order.items.remove(order_item)
                return Response(status=HTTP_200_OK)
            else:
                return Response({"message": "This item was not in your cart"}, status=HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "You do not have an active order"}, status=HTTP_400_BAD_REQUEST)


class OrderItemDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = OrderItem.objects.all()


class AddToCartView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        variations = request.data.get('variations', [])
        if slug is None:
            return Response({"message": "Invalid request"}, status=HTTP_400_BAD_REQUEST)

        item = get_object_or_404(Item, slug=slug)

        minimum_variation_count = Variation.objects.filter(item=item).count()
        if len(variations) < minimum_variation_count:
            return Response({"message": "Please specify the required variation types"}, status=HTTP_400_BAD_REQUEST)

        order_item_qs = OrderItem.objects.filter(
            item=item,
            user=request.user,
            ordered=False
        )
        for v in variations:
            order_item_qs = order_item_qs.filter(
                Q(item_variations__exact=v)
            )

        if order_item_qs.exists():
            order_item = order_item_qs.first()
            order_item.quantity += 1
            order_item.save()
        else:
            order_item = OrderItem.objects.create(
                item=item,
                user=request.user,
                ordered=False
            )
            order_item.item_variations.add(*variations)
            order_item.save()

        order_qs = Order.objects.filter(user=request.user, ordered=False)
        if order_qs.exists():
            order = order_qs[0]
            if not order.items.filter(item__id=order_item.id).exists():
                order.items.add(order_item)
                return Response(status=HTTP_200_OK)

        else:
            ordered_date = timezone.now()
            order = Order.objects.create(
                user=request.user, ordered_date=ordered_date)
            order.items.add(order_item)
            return Response(status=HTTP_200_OK)


class OrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            return order
        except ObjectDoesNotExist:
            raise Http404("You do not have an active order")
            # return Response({"message": "You do not have an active order"}, status=HTTP_400_BAD_REQUEST)


class PaymentView(APIView):

    def post(self, request, *args, **kwargs):
        order = Order.objects.get(user=self.request.user, ordered=False)
        userprofile = UserProfile.objects.get(user=self.request.user)
        token = request.data.get('stripeToken')
        billing_address_id = request.data.get('selectedBillingAddress')
        shipping_address_id = request.data.get('selectedShippingAddress')

        billing_address = Address.objects.get(id=billing_address_id)
        shipping_address = Address.objects.get(id=shipping_address_id)

        if userprofile.stripe_customer_id != '' and userprofile.stripe_customer_id is not None:
            customer = stripe.Customer.retrieve(
                userprofile.stripe_customer_id)
            customer.sources.create(source=token)

        else:
            customer = stripe.Customer.create(
                email=self.request.user.email,
            )
            customer.sources.create(source=token)
            userprofile.stripe_customer_id = customer['id']
            userprofile.one_click_purchasing = True
            userprofile.save()

        amount = int(order.get_total() * 100)

        try:

                # charge the customer because we cannot charge the token more than once
            charge = stripe.Charge.create(
                amount=amount,  # cents
                currency="usd",
                customer=userprofile.stripe_customer_id
            )
            # charge once off on the token
            # charge = stripe.Charge.create(
            #     amount=amount,  # cents
            #     currency="usd",
            #     source=token
            # )

            # create the payment
            payment = Payment()
            payment.stripe_charge_id = charge['id']
            payment.user = self.request.user
            payment.amount = order.get_total()
            payment.save()

            # assign the payment to the order

            order_items = order.items.all()
            order_items.update(ordered=True)
            for item in order_items:
                item.save()

            order.ordered = True
            order.payment = payment
            order.billing_address = billing_address
            order.shipping_address = shipping_address
            # order.ref_code = create_ref_code()
            order.save()

            return Response(status=HTTP_200_OK)

        except stripe.error.CardError as e:
            body = e.json_body
            err = body.get('error', {})
            return Response({"message": f"{err.get('message')}"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.RateLimitError as e:
            # Too many requests made to the API too quickly
            messages.warning(self.request, "Rate limit error")
            return Response({"message": "Rate limit error"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.InvalidRequestError as e:
            print(e)
            # Invalid parameters were supplied to Stripe's API
            return Response({"message": "Invalid parameters"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.AuthenticationError as e:
            # Authentication with Stripe's API failed
            # (maybe you changed API keys recently)
            return Response({"message": "Not authenticated"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.APIConnectionError as e:
            # Network communication with Stripe failed
            return Response({"message": "Network error"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.StripeError as e:
            # Display a very generic error to the user, and maybe send
            # yourself an email
            return Response({"message": "Something went wrong. You were not charged. Please try again."}, status=HTTP_400_BAD_REQUEST)

        except Exception as e:
            # send an email to ourselves
            return Response({"message": "A serious error occurred. We have been notifed."}, status=HTTP_400_BAD_REQUEST)

        return Response({"message": "Invalid data received"}, status=HTTP_400_BAD_REQUEST)


class AddCouponView(APIView):
    def post(self, request, *args, **kwargs):
        code = request.data.get('code', None)
        if code is None:
            return Response({"message": "Invalid data received"}, status=HTTP_400_BAD_REQUEST)
        order = Order.objects.get(
            user=self.request.user, ordered=False)
        coupon = get_object_or_404(Coupon, code=code)
        order.coupon = coupon
        order.save()
        return Response(status=HTTP_200_OK)


class CountryListView(APIView):
    def get(self, request, *args, **kwargs):
        return Response(countries, status=HTTP_200_OK)


class AddressListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = AddressSerializer

    def get_queryset(self):
        address_type = self.request.query_params.get('address_type', None)
        qs = Address.objects.all()
        if address_type is None:
            return qs
        return qs.filter(user=self.request.user, address_type=address_type)


class AddressCreateView(CreateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = AddressSerializer
    queryset = Address.objects.all()


class AddressUpdateView(UpdateAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = AddressSerializer
    queryset = Address.objects.all()


class AddressDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = Address.objects.all()


class PaymentListView(ListAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = PaymentSerializer

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)


class PartView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PartTypeSerializer
    # items = Item.objects.all()
    # queryset = Category.objects.filter(category__in=items).distinct()
    # print(items)
    # item_ids = Item.objects.all()
    # queryset = Category.objects.filter(id__in=item_ids)
    # print(item_ids)
    # queryset = PartCategory.objects.filter(
    #     items__in=list(Item.objects.all())).distinct().order_by('category')
    queryset = PartType.objects.all()
    # items = Item.objects.all()
    # queryset = Item.objects.filter(category__id=1)

    # queryset = Category.objects.all()
    # print(queryset)

    # queryset = Item.objects.order_by('category').values_list(
    #     'category').distinct('category')


class PartCategoryFilterView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PartCategoryFilterSerializer
    queryset = PartCategory.objects.all()


class PartTypeFilterView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PartTypeFilterSerializer
    queryset = PartType.objects.all()


class PartFilterView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = PartFilterSerializer
    queryset = Part.objects.all()


class ItemImageView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemImageSerializer
    queryset = Image.objects.all()

    def get_serializer_context(self):
        context = super(ItemImageView, self).get_serializer_context()
        context.update({"request": self.request})
        return context


# PartsFilters = namedtuple('PartsFilters', ('part_type', 'part_category'))
class PartsFiltersView(ObjectMultipleModelAPIView):
    permission_classes = (AllowAny,)
    querylist = [
        {'queryset': Make.objects.all(), 'serializer_class': MakeFilterSerializer,
         'label': 'make'},
        {'queryset': Model.objects.all(), 'serializer_class': ModelFilterSerializer,
         'label': 'model'},
        {'queryset': ModelYear.objects.all(
        ), 'serializer_class': ModelYearFilterSerializer, 'label': 'model_year'},
        {'queryset': PartType.objects.all(
        ), 'serializer_class': PartTypeFilterSerializer, 'label': 'part_type'},
        {'queryset': PartCategory.objects.all(
        ), 'serializer_class': PartCategoryFilterSerializer, 'label': 'part_category'},
        {'queryset': Part.objects.all(), 'serializer_class': PartFilterSerializer,
         'label': 'name'},
        {'queryset': Item.objects.filter(label='U', published=True).order_by(
            '-id')[:5], 'serializer_class':ItemLastFourSerializer, 'label':'last_four_used'},
        {'queryset': Item.objects.filter(label='N', published=True).order_by(
            '-id')[:5], 'serializer_class':ItemLastFourSerializer, 'label':'last_four_new'},
    ]

    # def get_serializer_context(self):
    #     context = super(PartsFiltersView, self).get_serializer_context()
    #     context.update({"request": self.request})
    #     return context


class ItemFilterView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ItemFilterSerializer
    queryset = Item.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name', 'model_year']


class AddToCartSessionView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        variations = request.data.get('variations', [])
        if slug is None:
            return Response({"message": "Invalid request"}, status=HTTP_400_BAD_REQUEST)

        item = get_object_or_404(Item, slug=slug)

        minimum_variation_count = Variation.objects.filter(item=item).count()
        if len(variations) < minimum_variation_count:
            return Response({"message": "Please specify the required variation types"}, status=HTTP_400_BAD_REQUEST)

        order_item_qs = OrderItem.objects.filter(
            item=item,
            user=request.user,
            ordered=False
        )
        for v in variations:
            order_item_qs = order_item_qs.filter(
                Q(item_variations__exact=v)
            )

        if order_item_qs.exists():
            order_item = order_item_qs.first()
            order_item.quantity += 1
            order_item.save()
        else:
            order_item = OrderItem.objects.create(
                item=item,
                user=request.user,
                ordered=False
            )
            order_item.item_variations.add(*variations)
            order_item.save()

        order_qs = Order.objects.filter(user=request.user, ordered=False)
        if order_qs.exists():
            order = order_qs[0]
            if not order.items.filter(item__id=order_item.id).exists():
                order.items.add(order_item)
                return Response(status=HTTP_200_OK)

        else:
            ordered_date = timezone.now()
            order = Order.objects.create(
                user=request.user, ordered_date=ordered_date)
            order.items.add(order_item)
            return Response(status=HTTP_200_OK)


class CheckIfQuantityExistView(APIView):
    def post(self, request, *args, **kwargs):
        response = []
        for cart_item in request.data:
            id = cart_item.get("id", None)
            quantity = cart_item.get("quantity", None)
            if id is None:
                response.append({"id": id, "message": "Invalid ID"})
                # return Response([{"message": "Invalid request"}], status=HTTP_400_BAD_REQUEST)
            else:
                try:
                    item = Item.objects.get(
                        id=id)
                    current_quantity = item.current_quantity
                    if quantity > current_quantity:
                        status = "Check quantity"
                    else:
                        status = "Available"
                    response.append(
                        {"id": id, "current_quantity": current_quantity, "status": status})
                except Item.DoesNotExist:
                    response.append({"id": id, "message": "Invalid ID"})
        return Response(response, status=HTTP_200_OK)


class PayForOrderView(APIView):
    def post(self, request, *args, **kwargs):
        response = []
        for cart_item in request.data:
            id = cart_item.get("id", None)
            quantity = cart_item.get("quantity", None)
            if id is None:
                response.append({"id": id, "message": "Invalid ID"})
                # return Response([{"message": "Invalid request"}], status=HTTP_400_BAD_REQUEST)
            else:
                try:
                    item = Item.objects.get(
                        id=id)
                    current_quantity = item.current_quantity
                    if quantity > current_quantity:
                        status = "Check quantity"
                    else:
                        status = "Available"

                    response.append(
                        {"id": id, "current_quantity": current_quantity, "status": status})
                except Item.DoesNotExist:
                    response.append({"id": id, "message": "Invalid ID"})
        return Response(response, status=HTTP_200_OK)
