from django.shortcuts import render, redirect
from homepage.models import Orphanage, Type, UserDetails, Transport, donatevaluables
from registration.form import RegisterForm, CustomAuthForm
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from django.http import HttpResponse

# Create your views here.
def index(request):
    return render(request, 'registration/../../templates/userdashboard/userdashboard.html')

# Just initializing it, as per the login.html page
register_user_type = 'user'

def get_data(request, user_type):
    global register_user_type
    register_user_type = user_type
    return None

def signup(request):
    signup_type = register_user_type
    if request.method == "POST":
        new_user_form = RegisterForm(request.POST)
        if new_user_form.is_valid():
            # Create new user
            new_user = User.objects.create_user(
                username=new_user_form.cleaned_data["username"],
                password=new_user_form.cleaned_data["password"],
                email=new_user_form.cleaned_data["email"]
            )
            new_user.first_name = new_user_form.cleaned_data["first_name"]
            new_user.last_name = new_user_form.cleaned_data["last_name"]
            new_user.save()  # User is immediately active

            if signup_type == 'user':
                UserDetails.objects.create(
                    user_id=new_user,
                    date_of_birth=request.POST["DOB"],
                    gender=request.POST["gender"],
                    phone_no=request.POST["phone_number"]
                )
                Type.objects.create(user=new_user, ref_no=1)
            elif signup_type == 'orphanage':
                Orphanage.objects.create(
                    orphanage_id=new_user,
                    orphanage_name=request.POST["orphanage_name"],
                    year_of_establishment=request.POST["year_of_establishment"],
                    address=request.POST["address"],
                    phone_no=request.POST["phone_number"],
                    description=request.POST["description"],
                    image=request.FILES.get("orphanage_image"),
                    lat=float(request.POST["current_latitude"]),
                    lon=float(request.POST["current_longitude"]),
                )
                Type.objects.create(user=new_user, ref_no=2)

            # Log in the user automatically after signup
            login(request, new_user)

            return redirect("userdashboard:u_Profile") if signup_type == 'user' else redirect("orphanageadmin:o_profile")

        else:
            return render(request, 'registration/signup_page.html', {"signup_form": new_user_form, 'signup_type': signup_type})
    
    else:
        new_form = RegisterForm()
        return render(request, 'registration/signup_page.html', {"signup_form": new_form})

def login_view(request):
    if request.method == "POST":
        form = CustomAuthForm(request.POST)
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            # Get the type associated with the user
            user_type = Type.objects.get(user=user)
            
            # Check if the user is a regular user (ref_no == 1)
            if user_type.ref_no == 1:
                return redirect('userdashboard:u_Profile')
            # Check if the user is an orphanage (ref_no == 2)
            elif user_type.ref_no == 2:
                # Redirect to orphanage admin profile regardless of verification status
                return redirect('orphanageadmin:o_profile')
            # Check if the user is an orphanage admin (ref_no == 3)
            elif user_type.ref_no == 3:
                return redirect('orphanageadmin:o_profile')
            else:
                return HttpResponse("Not a regular user")
        else:
            error_message = "Invalid username or password."
            return render(request, 'registration/login.html', {'form': form, 'error': error_message})
    
    else:
        new_form = CustomAuthForm()
        return render(request, 'registration/login.html', {'form': new_form})

def logout_view(request):
    logout(request)
    return redirect('h_index')
