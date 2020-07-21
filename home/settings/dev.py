'''Use this for development'''

from .base import *
SECRET_KEY = '-05sgp6!deq=q1n+tm@^^2cc+v29i(tyybv3p2t77qi66czazj'

ALLOWED_HOSTS += ['127.0.0.1']
DEBUG = True

INSTALLED_APPS.insert(INSTALLED_APPS.index(
    'rest_framework'), 'rest_framework_swagger')


WSGI_APPLICATION = 'home.wsgi.dev.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

# CORS_ORIGIN_WHITELIST = (
#     'http://localhost:3000',
# )

CORS_ALLOW_HEADERS = (
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'cache-control',
    'content-length',
    'Host',
    'Connection',
)

# Stripe

STRIPE_PUBLIC_KEY = config('STRIPE_TEST_PUBLIC_KEY')
STRIPE_SECRET_KEY = config('STRIPE_TEST_SECRET_KEY')
