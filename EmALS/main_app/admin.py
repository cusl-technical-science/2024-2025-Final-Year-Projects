from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *
# Register your models here.


class UserModel(UserAdmin):
    ordering = ('email',)


admin.site.register(CustomUser, UserModel)
admin.site.register(Manager)
admin.site.register(Employee)
admin.site.register(Department)
admin.site.register(Attendance)
admin.site.register(AttendanceReport)
admin.site.register(LeaveReportEmployee)
admin.site.register(LeaveReportManager)
admin.site.register(FeedbackEmployee)
admin.site.register(FeedbackManager)
