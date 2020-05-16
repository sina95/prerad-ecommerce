'''Use this for production'''

from .base import *
import json

with open('/etc/prerad_config.json') as config_file:
    prerad_config = json.load(config_file)

SECRET_KEY = prerad_config['SECRET_KEY']

DEBUG = False
ALLOWED_HOSTS += ['35.204.4.111', '127.0.0.1', 'www.prerad.tk', 'prerad.tk']

INSTALLED_APPS.insert(INSTALLED_APPS.index(
    'django.contrib.staticfiles'), 'whitenoise.runserver_nostatic')

MIDDLEWARE.insert(MIDDLEWARE.index(
    'django.contrib.sessions.middleware.SessionMiddleware'), 'whitenoise.middleware.WhiteNoiseMiddleware')

STATICFILES_DIRS = [os.path.join(BASE_DIR, 'build/static')]
STATICFILES_STORAGE = (
    'whitenoise.storage.CompressedManifestStaticFilesStorage')
WHITENOISE_ROOT = os.path.join(BASE_DIR, 'build', 'root')

WSGI_APPLICATION = 'home.wsgi.prod.application'

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True


CORS_ORIGIN_ALLOW_ALL = True
#CORS_ORIGIN_WHITELIST=["http://35.204.4.111", 'http://127.0.0.1:8000', 'https://prerad.tk']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# MIDDLEWARE.append('whitenoise.middleware.WhiteNoiseMiddleware')

#STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

STRIPE_PUBLIC_KEY = config('STRIPE_TEST_PUBLIC_KEY')
STRIPE_SECRET_KEY = config('STRIPE_TEST_SECRET_KEY')
