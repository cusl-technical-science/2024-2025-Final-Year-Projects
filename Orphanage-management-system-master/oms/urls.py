from django.contrib import admin
from django.urls import path, include, re_path
from homepage.views import index  # Ensure this is the correct view for your homepage
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^paypal/', include('paypal.standard.ipn.urls')),  # Changed from url to re_path
    path('', index, name='home'),  # Added this line for the root URL
    path('homepage/', include('homepage.urls')),
    path('registration/', include('registration.urls')),
    path('orphanage_dashboard/', include('orphanageadmin.urls')),
    path('superuser/', include('superuser.urls')),
    path('userdashboard/', include('userdashboard.urls')),
    path('donation/', include('donation.urls')),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/done/',
         auth_views.PasswordResetCompleteView.as_view(template_name='registration/password_reset_complete.html'),
         name='password_reset_complete'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
