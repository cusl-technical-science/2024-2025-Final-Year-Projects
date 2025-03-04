from django import forms
from django.forms.widgets import DateInput, TextInput

from .models import *


class FormSettings(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(FormSettings, self).__init__(*args, **kwargs)
        # Here make some changes such as:
        for field in self.visible_fields():
            field.field.widget.attrs['class'] = 'form-control'


class CustomUserForm(FormSettings):
    email = forms.EmailField(required=True)
    gender = forms.ChoiceField(choices=[('M', 'Male'), ('F', 'Female')])
    first_name = forms.CharField(required=True)
    last_name = forms.CharField(required=True)
    address = forms.CharField(widget=forms.Textarea)
    password = forms.CharField(widget=forms.PasswordInput)
    profile_pic = forms.ImageField()

    def __init__(self, *args, **kwargs):
        super(CustomUserForm, self).__init__(*args, **kwargs)

        if kwargs.get('instance'):
            instance = kwargs.get('instance')
            self.fields['password'].required = False
            for field in self.Meta.fields:
                self.fields[field].initial = getattr(instance, field, None)
            if self.instance.pk is not None:
                self.fields['password'].widget.attrs['placeholder'] = "Fill this only if you wish to update password"

    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        if self.instance.pk is None:  # Insert
            if CustomUser.objects.filter(email=email).exists():
                raise forms.ValidationError("The given email is already registered")
        else:  # Update
            db_email = self.instance.email.lower()
            if db_email != email:  # There has been changes
                if CustomUser.objects.filter(email=email).exists():
                    raise forms.ValidationError("The given email is already registered")
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        password = self.cleaned_data.get('password')
        if password:
            user.set_password(password)
        if commit:
            user.save()
        return user

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'gender', 'password', 'profile_pic', 'address']

class ManagerForm(CustomUserForm):
    department = forms.ModelChoiceField(
        queryset=Department.objects.all(),
        required=True,
        empty_label="Select Department",
        help_text="Select the department for this manager."
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Ensure the department field is required
        self.fields['department'].required = True

    def save(self, commit=True):
        # Save the CustomUser instance
        user = super().save(commit=False)
        user.user_type = "2"  # Set user_type to Supervisor

        if commit:
            user.save()  # Save the CustomUser instance

            # Update or create the Manager instance
            manager, created = Manager.objects.update_or_create(
                admin=user,  # Link the Manager to the CustomUser
                defaults={'department': self.cleaned_data['department']}
            )

        return user  # Return the CustomUser instance

    class Meta(CustomUserForm.Meta):
        model = CustomUser  # Use CustomUser as the model
        fields = CustomUserForm.Meta.fields + ['department']


class EmployeeForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = CustomUser  # Use CustomUser as the model
        fields = ['first_name', 'last_name', 'email', 'gender', 'password', 'profile_pic', 'address']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['department'] = forms.ModelChoiceField(queryset=Department.objects.all())

    def save(self, commit=True):
        # Save the CustomUser instance first
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])  # Set the password
        user.user_type = "3"  # Set user_type to Employee
        if commit:
            user.save()  # Save the CustomUser instance

            # Create the Employee instance
            department = self.cleaned_data['department']
            Employee.objects.create(admin=user, department=department)

        return user  # Return the CustomUser instance


class AdminForm(CustomUserForm):
    def __init__(self, *args, **kwargs):
        super(AdminForm, self).__init__(*args, **kwargs)

    class Meta(CustomUserForm.Meta):
        model = Admin
        fields = CustomUserForm.Meta.fields


class ManagerEditForm(CustomUserForm):
    department = forms.ModelChoiceField(
        queryset=Department.objects.all(), required=True, empty_label="Select Department"
    )

    def __init__(self, *args, **kwargs):
        super(ManagerEditForm, self).__init__(*args, **kwargs)

        # Initialize the department field if the user is a manager
        if self.instance.pk:  # Check if the user already exists
            try:
                manager = self.instance.manager  # Access the Manager instance
                self.fields['department'].initial = manager.department
            except Manager.DoesNotExist:
                pass  # If the user is not a manager, do nothing

    def save(self, commit=True):
        user = super().save(commit=False)  # Get the CustomUser instance
        user.user_type = "2"  # Set user_type to Supervisor

        if commit:
            user.save()  # Save the CustomUser instance

            # Update or create the Manager instance
            manager, created = Manager.objects.update_or_create(
                admin=user,  # Link the Manager to the CustomUser
                defaults={'department': self.cleaned_data['department']}
            )

        return user  # Return the CustomUser instance

    class Meta(CustomUserForm.Meta):
        model = CustomUser  # Use CustomUser as the model
        fields = CustomUserForm.Meta.fields + ['department']

    


# class ManagerForm(CustomUserForm):
#     department = forms.ModelChoiceField(
#         queryset=Department.objects.all(), required=True, empty_label="Select Department"
#     )

#     def __init__(self, *args, **kwargs):
#         super(ManagerForm, self).__init__(*args, **kwargs)
#         self.fields['department'].required = True

#     def save(self, commit=True):
#         user = super().save(commit=False)  # Create CustomUser instance
#         user.user_type = "2"  # Set user as Supervisor

#         if commit:
#             user.save()  # Save user first

#             # ✅ Ensure a Manager object is created with the user
#             manager, created = Manager.objects.get_or_create(admin=user, defaults={'department': self.cleaned_data['department']})
#             if not created:
#                 manager.department = self.cleaned_data['department']
#                 manager.save()
#         return user  # Return user instance instead of manager

class DepartmentForm(FormSettings):
    def __init__(self, *args, **kwargs):
        super(DepartmentForm, self).__init__(*args, **kwargs)

    class Meta:
        model = Department
        fields = ['name']  # Removed 'division'

class LeaveReportManagerForm(FormSettings):
    def __init__(self, *args, **kwargs):
        super(LeaveReportManagerForm, self).__init__(*args, **kwargs)

    class Meta:
        model = LeaveReportManager
        fields = ['start_date', 'end_date', 'message']
        widgets = {
            'start_date': DateInput(attrs={'type': 'date'}),
            'end_date': DateInput(attrs={'type': 'date'}),
        }


class FeedbackManagerForm(FormSettings):
    def __init__(self, *args, **kwargs):
        super(FeedbackManagerForm, self).__init__(*args, **kwargs)

    class Meta:
        model = FeedbackManager
        fields = ['feedback']


class LeaveReportEmployeeForm(FormSettings):
    def __init__(self, *args, **kwargs):
        super(LeaveReportEmployeeForm, self).__init__(*args, **kwargs)

    class Meta:
        model = LeaveReportEmployee
        fields = ['start_date', 'end_date', 'message']
        widgets = {
            'start_date': DateInput(attrs={'type': 'date'}),
            'end_date': DateInput(attrs={'type': 'date'}),
        }


class FeedbackEmployeeForm(FormSettings):
    def __init__(self, *args, **kwargs):
        super(FeedbackEmployeeForm, self).__init__(*args, **kwargs)

    class Meta:
        model = FeedbackEmployee
        fields = ['feedback']


class EmployeeEditForm(CustomUserForm):
    def __init__(self, *args, **kwargs):
        super(EmployeeEditForm, self).__init__(*args, **kwargs)

    class Meta(CustomUserForm.Meta):
        model = Employee
        fields = CustomUserForm.Meta.fields 


class ManagerEditForm(CustomUserForm):
    def __init__(self, *args, **kwargs):
        super(ManagerEditForm, self).__init__(*args, **kwargs)

    class Meta(CustomUserForm.Meta):
        model = Manager
        fields = CustomUserForm.Meta.fields


class EditSalaryForm(FormSettings):
    def __init__(self, *args, **kwargs):
        super(EditSalaryForm, self).__init__(*args, **kwargs)

    class Meta:
        model = EmployeeSalary
        fields = ['department', 'employee', 'base', 'ctc']

