from django.shortcuts import get_object_or_404, render, redirect
from django.views import View
from django.contrib import messages
from .models import Department, Manager, Employee, EmployeeSalary
from .forms import EditSalaryForm
from django.urls import reverse


class EditSalaryView(View):
    def get(self, request, *args, **kwargs):
        manager = get_object_or_404(Manager, admin=request.user)

        # Initialize form without any data
        salaryForm = EditSalaryForm()

        # Check if manager has a department
        if manager.department:
            salaryForm.fields['department'].queryset = Department.objects.filter(id=manager.department.id)  # ✅ Restrict to manager's department
            salaryForm.fields['employee'].queryset = Employee.objects.filter(department=manager.department)  # ✅ Only manager's employees
            employees = Employee.objects.filter(department=manager.department)
        else:
            # If manager has no department, restrict the querysets to empty
            salaryForm.fields['department'].queryset = Department.objects.none()
            salaryForm.fields['employee'].queryset = Employee.objects.none()
            employees = Employee.objects.none()
            messages.warning(request, "You are not assigned to any department.")

        context = {
            'form': salaryForm,
            'page_title': "Edit Employee's Salary",
            'department': manager.department,  # ✅ Pass department to template
            'employees': employees  # ✅ Pass employees to template
        }
        return render(request, "manager_template/edit_employee_salary.html", context)

    def post(self, request, *args, **kwargs):
        manager = get_object_or_404(Manager, admin=request.user)
        
        form = EditSalaryForm(request.POST)
        if form.is_valid():
            try:
                employee = form.cleaned_data.get('employee')

                # Ensure manager is updating an employee in their department
                if not manager.department or employee.department != manager.department:
                    messages.warning(request, "You cannot edit salaries for employees in other departments.")
                    return redirect(reverse('edit_employee_salary'))

                # Fetch or create salary details
                salary, created = EmployeeSalary.objects.get_or_create(employee=employee, department=manager.department)

                # Update salary values
                salary.base = form.cleaned_data.get('base')
                salary.ctc = form.cleaned_data.get('ctc')
                salary.save()

                messages.success(request, "Salary Updated Successfully")
                return redirect(reverse('edit_employee_salary'))
            
            except Exception as e:
                messages.warning(request, f"Error updating salary: {e}")

        context = {
            'form': form,
            'page_title': "Edit Employee's Salary",
            'department': manager.department,
            'employees': Employee.objects.filter(department=manager.department) if manager.department else Employee.objects.none()
        }
        return render(request, "manager_template/edit_employee_salary.html", context)


