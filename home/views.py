from django.http import HttpResponse

def backoffice(request):
    response = HttpResponse()
    response['X-Accel-Redirect'] = '/backoffice/'
    response['redirect_uri'] = 'https://www.prerad.tk/back-office'
    return response
