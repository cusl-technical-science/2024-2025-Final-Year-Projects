from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from registration.form import CustomAuthForm

app_name = 'registration'

urlpatterns = [
    path('', views.index, name='profile'),
    
    path('login', views.login_view, name='login'),
    path('register', views.signup, name='signup'),
    path(r'getData/<slug:user_type>/', views.get_data, name='get_data'),

    # ❌ Remove the activation URL
    # path('activate/<uidb64>/<token>/', views.activate, name='activate'),

    path('password_change/', auth_views.PasswordChangeView.as_view(), name='password_change'),
    path('password_change/done/', auth_views.PasswordChangeDoneView.as_view(), name='password_change_done'),

    path('password_reset/', auth_views.PasswordResetView.as_view(template_name="registration/password_reset_form.html"), name='password_reset'),
    
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(template_name='registration/password_reset_complete.html'),
         name='password_reset_complete'),
    
    path('logout/', views.logout_view, name='logout'),
    #path('solution', views.solution, name='solution'),
    #path('result', views.result, name='r_result1'),
]
