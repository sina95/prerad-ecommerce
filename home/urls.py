from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls import url

from django.views.generic import TemplateView
from rest_framework_simplejwt import views as jwt_views
from . import views
from dj_rest_auth.registration.views import VerifyEmailView
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView
from allauth.account.views import confirm_email
from rest_framework_swagger.views import get_swagger_view


admin.site.site_header = "PRERAD Admin"
admin.site.site_title = "PRERAD Admin Portal"
admin.site.index_title = "Welcome to PRERAD Portal"

schema_view = get_swagger_view(title="Prerad API")


urlpatterns = [
    # path('api-auth/', include('rest_framework.urls')),
    url(r"^dj-rest-auth/registration/account-confirm-email/(?P<key>[\s\d\w().+-_',:&]+)/$", confirm_email,
        name="account_confirm_email"),  # name='account_email_verification_sent'),
    url(r"^dj-rest-auth/registration/account-confirm-email/", VerifyEmailView.as_view(),
        name="account_email_verification_sent"),  # name='account_email_verification_sent'),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    # path('dj-rest-auth/password/reset/',
    #      include('dj_rest_auth.registration.urls')),
    # url(r'^dj-rest-auth/password/reset/$', PasswordResetView.as_view(),
    #     name='rest_password_reset'),
    # path(r'password_reset/', PasswordResetView.as_view(), name='password_reset'),
    # path(r'password_reset_done/', PasswordResetDoneView.as_view(
    # ), name='password_reset_done'),
    path(r'password_reset_confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(
    ), name='password_reset_confirm'),
    # path(r'password_reset_complete/', PasswordResetCompleteView.as_view(
    # ), name='password_reset_complete'),



    path('back-office/', admin.site.urls),
    path('api/', include('core.api.urls')),
    path('send-email/', views.send_email),
    # path('token/', jwt_views.TokenObtainPairView.as_view(),
    #      name='token_obtain_pair'),
    # path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    #    path('backoffice/', views.backoffice),
    # path('api/', include(('core.api.urls','api'), namespace = 'core-api')),
]

if settings.DEBUG:
    urlpatterns += path('swagger/', schema_view),

    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)


if not settings.DEBUG:
    urlpatterns += [re_path(r'^(?:.*)/?$',
                            TemplateView.as_view(template_name='index.html')), ]
