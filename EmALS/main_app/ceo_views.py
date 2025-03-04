import json
import requests
import logging
from django.contrib import messages
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse, JsonResponse
from django.shortcuts import (HttpResponse, HttpResponseRedirect, get_object_or_404, redirect, render)
from django.templatetags.static import static
from django.urls import reverse
from django.views.decorators.csrf import csrf_protect
from django.views.generic import UpdateView
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie

from django.utils.decorators import decorator_from_middleware
from django.middleware.cache import CacheMiddleware

from .forms import *
from .models import *

def no_cache(view):
    def wrapper(request, *args, **kwargs):
        response = view(request, *args, **kwargs)
        response["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response["Pragma"] = "no-cache"
        response["Expires"] = "0"
        return response
    return wrapper

@login_required
@no_cache
def admin_home(request):
    total_manager = Manager.objects.all().count()
    total_employees = Employee.objects.all().count()
    departments = Department.objects.all()
    total_department = departments.count()
    attendance_list = Attendance.objects.filter(department__in=departments)
    attendance_list = []
    department_list = []
    for department in departments:
        attendance_count = Attendance.objects.filter(department=department).count()
        department_list.append(department.name[:7])
        attendance_list.append(attendance_count)
    context = {
        'page_title': "Employee Attendance and Leave System - Admin Dashboard",
        'total_employees': total_employees,
        'total_manager': total_manager,
        'total_department': total_department,
        'department_list': department_list,
        'attendance_list': attendance_list
    }
    return render(request, 'ceo_template/home_content.html', context)


from django.db import transaction
from django.core.files.storage import FileSystemStorage


@no_cache
@login_required
def add_manager(request):
    form = ManagerForm(request.POST or None, request.FILES or None)
    context = {'form': form, 'page_title': 'Add Supervisor'}

    if request.method == 'POST':
        if form.is_valid():
            try:
                with transaction.atomic():  # Ensures rollback if any error occurs
                    form.save()  # Save the CustomUser and Manager instances
                messages.success(request, "Supervisor added successfully.")
                return redirect(reverse('manage_manager'))
            except Exception as e:
                messages.error(request, f"Could not add supervisor: {str(e)}")
        else:
            messages.error(request, "Please correct the errors below.")

    return render(request, 'ceo_template/add_manager_template.html', context)


@no_cache
@login_required
def add_employee(request):
    employee_form = EmployeeForm(request.POST or None, request.FILES or None)
    context = {'form': employee_form, 'page_title': 'Add Employee'}

    if request.method == 'POST':
        if employee_form.is_valid():
            try:
                with transaction.atomic():
                    employee_form.save()  # Save the CustomUser and Employee instances
                messages.success(request, "Employee added successfully.")
                return redirect(reverse('manage_employee'))
            except Exception as e:
                messages.error(request, f"Could not add employee: {str(e)}")
        else:
            messages.error(request, "Please correct the errors below.")

    return render(request, 'ceo_template/add_employee_template.html', context)



@no_cache
@login_required
def add_department(request):
    form = DepartmentForm(request.POST or None)
    context = {
        'form': form,
        'page_title': 'Add Department'
    }
    if request.method == 'POST':
        if form.is_valid():
            name = form.cleaned_data.get('name')
            try:
                department = Department()
                department.name = name
                department.save()
                messages.success(request, "Successfully Added")
                return redirect(reverse('manage_department'))
            except Exception as e:
                messages.error(request, "Could Not Add " + str(e))
        else:
            messages.error(request, "Fill Form Properly")

    return render(request, 'ceo_template/add_department_template.html', context)

@no_cache
@login_required
def manage_manager(request):
    allManager = CustomUser.objects.filter(
        user_type=2
    ).select_related('manager', 'manager__department')
    
    context = {
        'allManager': allManager,
        'page_title': 'Manage Supervisor'
    }
    return render(request, "ceo_template/manage_manager.html", context)


def manage_employee(request):
    employees = CustomUser.objects.filter(user_type=3, employee__isnull=False).select_related('employee', 'employee__department')
    context = {
        'employees': employees,
        'page_title': 'Manage Employees'
    }
    return render(request, "ceo_template/manage_employee.html", context)


@no_cache
@login_required
def manage_department(request):
    departments = Department.objects.all()
    context = {
        'departments': departments,
        'page_title': 'Manage Departments'
    }
    return render(request, "ceo_template/manage_department.html", context)


from .forms import ManagerEditForm  # Import the correct form class

@no_cache
def edit_manager(request, manager_id):
    manager = get_object_or_404(Manager, id=manager_id)
    user = manager.admin  # Get the associated CustomUser instance

    form = ManagerForm(request.POST or None, request.FILES or None, instance=user)
    context = {'form': form, 'manager_id': manager_id, 'page_title': 'Edit Supervisor'}

    if request.method == 'POST':
        if form.is_valid():
            try:
                with transaction.atomic():
                    form.save()  # Save the CustomUser and Manager instances
                messages.success(request, "Supervisor updated successfully.")
                return redirect(reverse('edit_manager', args=[manager_id]))
            except Exception as e:
                messages.error(request, f"Could not update supervisor: {str(e)}")
        else:
            messages.error(request, "Please correct the errors below.")

    return render(request, 'ceo_template/edit_manager_template.html', context)

@no_cache
def edit_employee(request, employee_id):
    employee = get_object_or_404(Employee, id=employee_id)
    form = EmployeeForm(request.POST or None, instance=employee)
    context = {
        'form': form,
        'employee_id': employee_id,
        'page_title': 'Edit Employee'
    }
    if request.method == 'POST':
        if form.is_valid():
            first_name = form.cleaned_data.get('first_name')
            last_name = form.cleaned_data.get('last_name')
            address = form.cleaned_data.get('address')
            username = form.cleaned_data.get('username')
            email = form.cleaned_data.get('email')
            gender = form.cleaned_data.get('gender')
            password = form.cleaned_data.get('password') or None
            department = form.cleaned_data.get('department')
            passport = request.FILES.get('profile_pic') or None
            try:
                user = CustomUser.objects.get(id=employee.admin.id)
                if passport:
                    fs = FileSystemStorage()
                    filename = fs.save(passport.name, passport)
                    passport_url = fs.url(filename)
                    user.profile_pic = passport_url
                user.username = username
                user.email = email
                if password:
                    user.set_password(password)
                user.first_name = first_name
                user.last_name = last_name
                user.gender = gender
                user.address = address
                employee.department = department
                user.save()
                employee.save()
                messages.success(request, "Successfully Updated")
                return redirect(reverse('edit_employee', args=[employee_id]))
            except Exception as e:
                messages.error(request, "Could Not Update " + str(e))
        else:
            messages.error(request, "Please Fill Form Properly!")
    else:
        return render(request, "ceo_template/edit_employee_template.html", context)

@no_cache
def edit_department(request, department_id):
    instance = get_object_or_404(Department, id=department_id)
    form = DepartmentForm(request.POST or None, instance=instance)
    context = {
        'form': form,
        'department_id': department_id,
        'page_title': 'Edit Department'
    }
    if request.method == 'POST':
        if form.is_valid():
            name = form.cleaned_data.get('name')
            try:
                department = Department.objects.get(id=department_id)
                department.name = name
                department.save()
                messages.success(request, "Successfully Updated")
                return redirect(reverse('edit_department', args=[department_id]))
            except Exception as e:
                messages.error(request, "Could Not Update " + str(e))
        else:
            messages.error(request, "Fill Form Properly")
    return render(request, 'ceo_template/edit_department_template.html', context)


@no_cache
@csrf_protect
def check_email_availability(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        exists = CustomUser.objects.filter(email=email).exists()
        return JsonResponse({"available": not exists})
    return JsonResponse({"error": "Invalid request method"}, status=400)


@no_cache
@csrf_protect
def employee_feedback_message(request):
    if request.method != 'POST':
        feedbacks = FeedbackEmployee.objects.all()
        context = {
            'feedbacks': feedbacks,
            'page_title': 'Employee Feedback Messages'
        }
        return render(request, 'ceo_template/employee_feedback_template.html', context)
    else:
        feedback_id = request.POST.get('id')
        try:
            feedback = get_object_or_404(FeedbackEmployee, id=feedback_id)
            reply = request.POST.get('reply')
            feedback.reply = reply
            feedback.save()
            return HttpResponse(True)
        except Exception:
            return HttpResponse(False)

@no_cache
@csrf_protect
def manager_feedback_message(request):
    if request.method != 'POST':
        feedbacks = FeedbackManager.objects.all()
        context = {
            'feedbacks': feedbacks,
            'page_title': 'Supervisor Feedback Messages'
        }
        return render(request, 'ceo_template/manager_feedback_template.html', context)
    else:
        feedback_id = request.POST.get('id')
        try:
            feedback = get_object_or_404(FeedbackManager, id=feedback_id)
            reply = request.POST.get('reply')
            feedback.reply = reply
            feedback.save()
            return HttpResponse(True)
        except Exception:
            return HttpResponse(False)

@no_cache
@csrf_protect
def view_manager_leave(request):
    if request.method != 'POST':
        allLeave = LeaveReportManager.objects.all()
        context = {
            'allLeave': allLeave,
            'page_title': 'Leave Applications From Supervisor'
        }
        return render(request, "ceo_template/manager_leave_view.html", context)
    else:
        id = request.POST.get('id')
        status = 1 if request.POST.get('status') == '1' else -1
        try:
            leave = get_object_or_404(LeaveReportManager, id=id)
            leave.status = status
            leave.save()
            return HttpResponse(True)
        except Exception:
            return HttpResponse(False)


@no_cache
@csrf_protect
def view_employee_leave(request):
    if request.method != 'POST':
        allLeave = LeaveReportEmployee.objects.all()
        context = {
            'allLeave': allLeave,
            'page_title': 'Leave Applications From Employees'
        }
        return render(request, "ceo_template/employee_leave_view.html", context)
    else:
        id = request.POST.get('id')
        status = 1 if request.POST.get('status') == '1' else -1
        try:
            leave = get_object_or_404(LeaveReportEmployee, id=id)
            leave.status = status
            leave.save()
            return HttpResponse(True)
        except Exception:
            return HttpResponse(False)
        
@no_cache
def admin_view_attendance(request):
    departments = Department.objects.all()
    context = {
        'departments': departments,
        'page_title': 'View Attendance'
    }
    return render(request, "ceo_template/admin_view_attendance.html", context)

@ensure_csrf_cookie
def get_admin_attendance(request):
    if request.method == 'POST':
        department_id = request.POST.get('department')
        attendance_date_id = request.POST.get('attendance_date_id')
        try:
            department = get_object_or_404(Department, id=department_id)
            attendance = get_object_or_404(Attendance, id=attendance_date_id)
            
            # Use select_related for better performance
            attendance_reports = AttendanceReport.objects.filter(
                attendance=attendance,
                employee__department=department
            ).select_related('employee', 'employee__admin')

            json_data = [
                {
                    "id": report.employee.id,
                    "name": f"{report.employee.admin.last_name}, {report.employee.admin.first_name}",
                    "status": report.status  # Use the actual status from the report
                }
                for report in attendance_reports
            ]

            return JsonResponse(json_data, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=400)


from django.shortcuts import render, get_object_or_404
from django.core.files.storage import FileSystemStorage
from django.contrib import messages

@no_cache
def admin_view_profile(request):
    admin = get_object_or_404(Admin, admin=request.user)
    form = AdminForm(request.POST or None, request.FILES or None, instance=admin.admin)
    context = {'form': form, 'page_title': 'View/Edit Profile'}

    if request.method == 'POST':
        if form.is_valid():
            try:
                form.save()
                messages.success(request, 'Profile updated successfully.')
            except Exception as e:
                messages.error(request, 'Could Not Update: ' + str(e))
        else:
            messages.error(request, 'Please fill the form properly.')

    return render(request, 'ceo_template/admin_view_profile.html', context)


@no_cache
def admin_notify_manager(request):
    manager = CustomUser.objects.filter(user_type=2)
    context = {
        'page_title': "Send Notifications To Supervisor",
        'allManager': manager
    }
    return render(request, "ceo_template/manager_notification.html", context)


@no_cache
def admin_notify_employee(request):
    employee = CustomUser.objects.filter(user_type=3)
    context = {
        'page_title': "Send Notifications To Employees",
        'employees': employee
    }
    return render(request, "ceo_template/employee_notification.html", context)


@no_cache
@csrf_protect
def send_employee_notification(request):
    id = request.POST.get('id')
    message = request.POST.get('message')
    employee = get_object_or_404(Employee, admin_id=id)
    try:
        url = "https://fcm.googleapis.com/fcm/send"
        body = {
            'notification': {
                'title': "EmpALS",
                'body': message,
                'click_action': reverse('employee_view_notification'),
                'icon': static('dist/img/AdminLTELogo.png')
            },
            'to': employee.admin.fcm_token
        }
        headers = {
            'Authorization': 'key=AAAA3Bm8j_M:APA91bElZlOLetwV696SoEtgzpJr2qbxBfxVBfDWFiopBWzfCfzQp2nRyC7_A2mlukZEHV4g1AmyC6P_HonvSkY2YyliKt5tT3fe_1lrKod2Daigzhb2xnYQMxUWjCAIQcUexAMPZePB',
            'Content-Type': 'application/json'
        }
        requests.post(url, data=json.dumps(body), headers=headers)
        notification = NotificationEmployee(employee=employee, message=message)
        notification.save()
        return HttpResponse("True")
    except Exception:
        return HttpResponse("False")

@no_cache
@csrf_protect
def send_manager_notification(request):
    id = request.POST.get('id')
    message = request.POST.get('message')
    manager = get_object_or_404(Manager, admin_id=id)
    try:
        url = "https://fcm.googleapis.com/fcm/send"
        body = {
            'notification': {
                'title': "EmpALS",
                'body': message,
                'click_action': reverse('manager_view_notification'),
                'icon': static('dist/img/AdminLTELogo.png')
            },
            'to': manager.admin.fcm_token
        }
        headers = {
            'Authorization': 'key=AAAA3Bm8j_M:APA91bElZlOLetwV696SoEtgzpJr2qbxBfxVBfDWFiopBWzfCfzQp2nRyC7_A2mlukZEHV4g1AmyC6P_HonvSkY2YyliKt5tT3fe_1lrKod2Daigzhb2xnYQMxUWjCAIQcUexAMPZePB',
            'Content-Type': 'application/json'
        }
        requests.post(url, data=json.dumps(body), headers=headers)
        notification = NotificationManager(manager=manager, message=message)
        notification.save()
        return HttpResponse("True")
    except Exception:
        return HttpResponse("False")


@no_cache
def delete_manager(request, manager_id):
    try:
        manager = get_object_or_404(Manager, id=manager_id)
        manager.admin.delete()  # Delete the associated CustomUser
        messages.success(request, "Supervisor deleted successfully!")
    except Exception as e:
        messages.error(request, "Could Not Delete: " + str(e))
    return redirect(reverse('manage_manager'))


@no_cache
def delete_employee(request, employee_id):
    employee = get_object_or_404(CustomUser, employee__id=employee_id)
    employee.delete()
    messages.success(request, "Employee deleted successfully!")
    return redirect(reverse('manage_employee'))

@no_cache
def delete_department(request, department_id):
    department = get_object_or_404(Department, id=department_id)
    department.delete()
    messages.success(request, "Department deleted successfully!")
    return redirect(reverse('manage_department'))
