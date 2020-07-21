from django.http import HttpResponse
from django.core.mail import send_mail
from dj_rest_auth.views import LoginView, sensitive_post_parameters_m
from rest_framework.permissions import AllowAny, IsAuthenticated
from core.api.serializers import JWTSerializer
from dj_rest_auth.models import TokenModel
from django.views.decorators.debug import sensitive_post_parameters
from django.conf import settings


def backoffice(request):
    response = HttpResponse()
    response['X-Accel-Redirect'] = '/backoffice/'
    response['redirect_uri'] = 'https://www.prerad.tk/back-office'
    return response


def send_email(request):
    print(request.session.__contains__)
    # print(dir(request.session))
    request.session['my_car'] = 'mini'
    # request.session.set_test_cookie()
    # num_visits = request.session.get('num_visits', 0)
    # send_mail('Subject here', 'Here is the message.', 'noreply@prerad.tk', [
    #           'sinisa.madzar95@gmail.com'], fail_silently=False)
    return HttpResponse("hello")


class LoginCustomView(LoginView):
    def get_response_serializer(self):
        if getattr(settings, 'REST_USE_JWT', False):
            response_serializer = JWTSerializer
        else:
            response_serializer = TokenSerializer
        return response_serializer
