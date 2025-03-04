from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    # Custom app URLs
    path("", include('main_app.urls')),

    # Django built-in authentication URLs
    path("accounts/", include("django.contrib.auth.urls")),

    # Admin URLs
    path('admin/', admin.site.urls),
]

# Serve static and media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)