import json
import traceback

from django.contrib import messages
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse, JsonResponse
from django.shortcuts import (HttpResponseRedirect, get_object_or_404,redirect, render)
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction

from django.utils.decorators import decorator_from_middleware
from django.middleware.cache import CacheMiddleware

from .forms import *
from .models import *
from django.views import View  # ✅ Add this line



def no_cache(view):
    def wrapper(request, *args, **kwargs):
        response = view(request, *args, **kwargs)
        response["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response["Pragma"] = "no-cache"
        response["Expires"] = "0"
        return response
    return wrapper

@no_cache
def manager_home(request):
    try:
        manager = get_object_or_404(Manager, admin=request.user)
        department = manager.department  # Get the manager's department

        # Count total employees in the manager's department
        total_employees = Employee.objects.filter(department=department).count() if department else 0

        # Count total leave reports for the manager
        total_leave = LeaveReportManager.objects.filter(manager=manager).count()

        # Get attendance for the manager's department
        attendance_list = Attendance.objects.filter(department=department) if department else Attendance.objects.none()
        total_attendance = attendance_list.count()

        # Count attendance per department
        attendance_list_data = []
        department_list = [department.name] if department else ["No Department Assigned"]
        attendance_count = Attendance.objects.filter(department=department).count() if department else 0
        attendance_list_data.append(attendance_count)

        # Get the total number of all departments in the system
        total_departments = Department.objects.count()

        context = {
            'page_title': 'Supervisor Panel - ' + str(manager.admin.last_name),
            'total_employees': total_employees,
            'total_attendance': total_attendance,
            'total_leave': total_leave,
            'total_department': 1 if department else 0,
            'total_departments': total_departments,
            'department_list': department_list,
            'attendance_list': attendance_list_data
        }

        return render(request, 'manager_template/home_content.html', context)

    except Exception as e:
        print(f"Error in manager_home: {e}")
        print(traceback.format_exc())  # Log the full traceback
        messages.error(request, "An error occurred while loading the dashboard.")
        return redirect(reverse('login'))  # Redirect to the login page


from django.contrib.auth.decorators import login_required
from datetime import date

@no_cache
@login_required
def manager_take_attendance(request):
    try:
        manager = request.user.manager  # Ensure the user is a manager
    except Manager.DoesNotExist:
        return render(request, "error.html", {"message": "You are not authorized to view this page"})

    context = {
        "page_title": "Take Attendance",
        "today": date.today(),
        "department": manager.department
    }
    return render(request, "manager_template/manager_take_attendance.html", context)


@no_cache
@login_required
def fetch_employees(request):
    if request.method == "POST":
        user = request.user

        # Ensure the logged-in user is a manager
        try:
            manager = Manager.objects.get(admin=user)  # Check if user is a Manager
        except Manager.DoesNotExist:
            return JsonResponse({"error": "You are not authorized to fetch employees"}, status=403)

        # Fetch employees from the manager's department
        employees = Employee.objects.filter(department=manager.department).values(
            "id", "admin__first_name", "admin__last_name"
        )

        # Format employee names
        employee_list = [
            {"id": emp["id"], "name": f"{emp['admin__first_name']} {emp['admin__last_name']}"}
            for emp in employees
        ]

        return JsonResponse(employee_list, safe=False)

    return JsonResponse({"error": "Invalid request"}, status=400)


@no_cache
@csrf_exempt
def get_employees(request):
    manager = get_object_or_404(Manager, admin=request.user)

    try:
        employees = Employee.objects.filter(department=manager.department)

        employee_data = [
            {"id": emp.id, "name": f"{emp.admin.last_name} {emp.admin.first_name}"}
            for emp in employees
        ]

        print("Returning JSON response:", employee_data)  # Debugging

        return JsonResponse(employee_data, safe=False)  # ✅ Correct JSON Response

    except Exception as e:
        print(f"Error in get_employees: {e}")  # Debugging
        return JsonResponse({'error': str(e)}, status=400)




@no_cache
@csrf_exempt
def save_attendance(request):
    if request.method == "POST":
        try:
            employee_data = request.POST.get('employee_ids')
            date = request.POST.get('date')
            department_id = request.POST.get('department')

            if not (employee_data and date and department_id):
                return JsonResponse({"error": "Missing required fields"}, status=400)

            employees = json.loads(employee_data)
            department = get_object_or_404(Department, id=department_id)

            # Create or get attendance record for the selected date and department
            attendance, created = Attendance.objects.get_or_create(department=department, date=date)

            for employee_dict in employees:
                employee = get_object_or_404(Employee, id=employee_dict.get('id'))

                # Update or create attendance report for each employee
                attendance_report, report_created = AttendanceReport.objects.get_or_create(
                    employee=employee,
                    attendance=attendance,
                    defaults={'status': employee_dict.get('status')}
                )

                # If the report already exists, update the status
                if not report_created:
                    attendance_report.status = employee_dict.get('status')
                    attendance_report.save()

            return JsonResponse({"message": "Attendance saved successfully"}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"Something went wrong: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@no_cache
@login_required
def manager_update_attendance(request):
    """ View for department managers to track attendance """
    try:
        manager = get_object_or_404(Manager, admin=request.user)
        department = manager.department

        # Get attendance dates only for this department
        attendance_dates = Attendance.objects.filter(department=department).values('id', 'date')

        context = {
            "page_title": "Manage Attendance Records",
            "department_name": department.name,
            "attendance_dates": attendance_dates
        }

        return render(request, 'manager_template/manager_update_attendance.html', context)
    
    except Exception as e:
        print(f"Error: {e}")
        return render(request, 'manager_template/manager_update_attendance.html', {"error": "Unable to load attendance data"})

@no_cache
@csrf_exempt
def get_employee_attendance(request):
    """ Fetch employee attendance records for a given date """
    if request.method == "POST":
        try:
            attendance_date_id = request.POST.get('attendance_date_id')
            
            if not attendance_date_id:
                return JsonResponse({"error": "Missing attendance date ID"}, status=400)

            attendance = get_object_or_404(Attendance, id=attendance_date_id)

            # Fetch all employees for this attendance date
            attendance_data = AttendanceReport.objects.filter(attendance=attendance).select_related('employee')

            employee_data = [
                {
                    "id": record.employee.admin.id,
                    "name": f"{record.employee.admin.last_name} {record.employee.admin.first_name}",
                    "status": record.status
                }
                for record in attendance_data
            ]

            return JsonResponse(employee_data, safe=False)
        
        except Exception as e:
            print(f"Error fetching employee attendance: {e}")
            return JsonResponse({"error": "Error fetching employee attendance"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@no_cache
@csrf_exempt
def update_attendance(request):
    """ Update employee attendance records """
    if request.method == "POST":
        try:
            employee_data = request.POST.get('employee_ids')
            attendance_id = request.POST.get('date')

            # Debugging: Print received data
            print("🔹 RAW Employee Data:", employee_data)
            print("🔹 RAW Attendance ID:", attendance_id)

            if not employee_data or not attendance_id:
                print("❌ Missing data: employee_data or attendance_id is empty!")
                return JsonResponse({'error': 'Missing employee data or date'}, status=400)

            try:
                employees = json.loads(employee_data)  # Convert JSON string to Python dict
            except json.JSONDecodeError:
                print("❌ Invalid JSON format!")
                return JsonResponse({'error': 'Invalid JSON format for employee data'}, status=400)

            # Debugging: Print parsed JSON data
            print("✅ Parsed Employee Data:", employees)

            # Ensure attendance_id is valid
            attendance = get_object_or_404(Attendance, id=attendance_id)

            # Track updates
            update_count = 0

            with transaction.atomic():  # Ensure database transactions are committed
                for employee_dict in employees:
                    employee = get_object_or_404(Employee, admin_id=employee_dict.get('id'))

                    # Check if attendance report exists and update it
                    attendance_report, created = AttendanceReport.objects.get_or_create(
                        employee=employee,
                        attendance=attendance
                    )

                    # **Manually update the status**
                    new_status = bool(employee_dict.get('status', 0))

                    # **Check if there's an actual change before saving**
                    if attendance_report.status != new_status:
                        attendance_report.status = new_status
                        attendance_report.save(update_fields=["status"])  # Force saving update

                        # Extra force update to ensure it saves correctly
                        attendance_report.save(force_update=True)  

                        print(f"✅ Updated: {employee.admin.first_name} {employee.admin.last_name} → {attendance_report.status}")
                        update_count += 1
                    else:
                        print(f"⚠️ No change needed for {employee.admin.first_name} {employee.admin.last_name}")

            print(f"✅ Total Updates: {update_count}")

            return JsonResponse({'success': 'Attendance updated successfully', 'updates': update_count}, status=200)

        except Exception as e:
            print(f"❌ Error updating attendance: {e}")
            return JsonResponse({'error': 'Error saving attendance', 'details': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


from django.shortcuts import render, get_object_or_404
from datetime import datetime
from .models import Attendance, Manager, Employee

class PrintAttendanceView(View):
    def get(self, request):
        manager = get_object_or_404(Manager, admin=request.user)  # ✅ Get logged-in manager
        department = manager.department
        date_str = request.GET.get('date', datetime.today().strftime('%Y-%m-%d'))  # ✅ Get date from request or use today

        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            date = datetime.today().date()

        # ✅ Fetch attendance reports instead of Attendance
        attendance_records = AttendanceReport.objects.filter(attendance__department=department, attendance__date=date).select_related('employee', 'employee__admin')

        context = {
            'department': department,
            'manager': manager.admin.get_full_name(),
            'attendance_records': attendance_records,
            'date': date,
            'organization_name': "MIRO FORESTRY",
            'tagline': "Forestry & Timber Products",
            'logo_url': "/media/miro.png"
        }
        return render(request, "manager_template/print_attendance.html", context)


@no_cache
def manager_apply_leave(request):
    form = LeaveReportManagerForm(request.POST or None)
    manager = get_object_or_404(Manager, admin_id=request.user.id)
    context = {
        'form': form,
        'leave_history': LeaveReportManager.objects.filter(manager=manager),
        'page_title': 'Apply for Leave'
    }
    if request.method == 'POST':
        if form.is_valid():
            try:
                obj = form.save(commit=False)
                obj.manager = manager
                obj.save()
                messages.success(
                    request, "Application for leave has been submitted for review")
                return redirect(reverse('manager_apply_leave'))
            except Exception:
                messages.error(request, "Could not apply!")
        else:
            messages.error(request, "Form has errors!")
    return render(request, "manager_template/manager_apply_leave.html", context)


@no_cache
def manager_feedback(request):
    form = FeedbackManagerForm(request.POST or None)
    manager = get_object_or_404(Manager, admin_id=request.user.id)
    context = {
        'form': form,
        'feedbacks': FeedbackManager.objects.filter(manager=manager),
        'page_title': 'Add Feedback'
    }
    if request.method == 'POST':
        if form.is_valid():
            try:
                obj = form.save(commit=False)
                obj.manager = manager
                obj.save()
                messages.success(request, "Feedback submitted for review")
                return redirect(reverse('manager_feedback'))
            except Exception:
                messages.error(request, "Could not Submit!")
        else:
            messages.error(request, "Form has errors!")
    return render(request, "manager_template/manager_feedback.html", context)

@no_cache
def manager_view_profile(request):
    try:
        manager = get_object_or_404(Manager, admin=request.user)  # Get the Manager instance
        user = manager.admin  # Get the associated CustomUser instance

        # Pass the CustomUser instance to the form
        form = ManagerEditForm(request.POST or None, request.FILES or None, instance=user)

        if request.method == 'POST':
            if form.is_valid():
                try:
                    # Save the CustomUser instance
                    user = form.save(commit=False)
                    password = form.cleaned_data.get('password')
                    if password:
                        user.set_password(password)
                    user.save()

                    # Save the Manager instance (if needed)
                    manager.department = form.cleaned_data.get('department')
                    manager.save()

                    messages.success(request, "Profile Updated!")
                    return redirect(reverse('manager_view_profile'))
                except Exception as e:
                    messages.error(request, f"Error Occurred While Updating Profile: {str(e)}")
            else:
                messages.error(request, "Invalid Data Provided")

        context = {
            'form': form,
            'page_title': 'View/Update Profile'
        }
        return render(request, "manager_template/manager_view_profile.html", context)

    except Exception as e:
        messages.error(request, f"Error Occurred: {str(e)}")
        return redirect(reverse('manager_view_profile'))

@no_cache
@csrf_exempt
def manager_fcmtoken(request):
    token = request.POST.get('token')
    try:
        manager_user = get_object_or_404(CustomUser, id=request.user.id)
        manager_user.fcm_token = token
        manager_user.save()
        return HttpResponse("True")
    except Exception as e:
        return HttpResponse("False")


@no_cache
def manager_view_notification(request):
    manager = get_object_or_404(Manager, admin=request.user)
    notifications = NotificationManager.objects.filter(manager=manager)
    context = {
        'notifications': notifications,
        'page_title': "View Notifications"
    }
    return render(request, "manager_template/manager_view_notification.html", context)


@no_cache
def manager_add_salary(request):
    manager = get_object_or_404(Manager, admin=request.user)
    
    context = {
        'page_title': 'Salary Upload',
        'department': manager.department,  # Pass the manager's department
    }
    
    if request.method == 'POST':
        try:
            employee_id = request.POST.get('employee_list')
            base = request.POST.get('base')
            ctc = request.POST.get('ctc')

            if not employee_id or not base or not ctc:
                messages.warning(request, "Please fill all fields.")
                return render(request, "manager_template/manager_add_salary.html", context)

            employee = get_object_or_404(Employee, id=employee_id, department=manager.department)
            
            # Check if salary entry exists
            salary, created = EmployeeSalary.objects.get_or_create(employee=employee, department=manager.department)
            salary.ctc = ctc
            salary.base = base
            salary.save()

            messages.success(request, "Salary updated successfully." if not created else "Salary added successfully.")

        except Exception as e:
            messages.warning(request, f"Error Occurred: {str(e)}")
    
    return render(request, "manager_template/manager_add_salary.html", context)



@no_cache
@csrf_exempt
def fetch_employee_salary(request):
    try:
        manager = get_object_or_404(Manager, admin=request.user)
        employee_id = request.POST.get('employee')

        # Ensure the employee belongs to the manager's department
        employee = get_object_or_404(Employee, id=employee_id, department=manager.department)

        # Try to fetch salary details
        salary, created = EmployeeSalary.objects.get_or_create(employee=employee, department=manager.department)

        # Debugging: Log salary details
        print(f"Fetching salary for Employee {employee.admin.email}: Base={salary.base}, CTC={salary.ctc}")

        # Return salary details as JSON
        return JsonResponse({'base': salary.base, 'ctc': salary.ctc})

    except EmployeeSalary.DoesNotExist:
        return JsonResponse({'error': 'Salary record not found'}, status=404)

    except Exception as e:
        print(f"Error in fetch_employee_salary: {e}")  # Debugging
        return JsonResponse({'error': str(e)}, status=400)



