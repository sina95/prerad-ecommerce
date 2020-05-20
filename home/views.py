from django.http import HttpResponse
from django.core.mail import send_mail


def backoffice(request):
    response = HttpResponse()
    response['X-Accel-Redirect'] = '/backoffice/'
    response['redirect_uri'] = 'https://www.prerad.tk/back-office'
    return response


def send_email(request):
    send_mail('Subject here', 'Here is the message.', 'noreply@prerad.tk', [
              'sinisa.madzar95@gmail.com'], fail_silently=False)
    return
