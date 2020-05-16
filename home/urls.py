from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from . import views

admin.site.site_header = "PRERAD Admin"
admin.site.site_title = "PRERAD Admin Portal"
admin.site.index_title = "Welcome to PRERAD Portal"

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('back-office/', admin.site.urls),
    path('api/', include('core.api.urls')),
#    path('backoffice/', views.backoffice), 
    # path('api/', include(('core.api.urls','api'), namespace = 'core-api')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

if  not settings.DEBUG:
    urlpatterns += [re_path(r'^(?:.*)/?$', TemplateView.as_view(template_name='index.html')),]
